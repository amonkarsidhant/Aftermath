import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PostmortemViewer from '../PostmortemViewer';
import { fetchTimelineEvents } from '../../services/timeline';
import { loadActions } from '../../services/remediations';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Postmortem } from '../../types';
import { getPostmortemShareUrl } from '../../services/share';

jest.mock('../../services/timeline');
jest.mock('../../services/remediations');
jest.mock('../../services/share', () => ({ getPostmortemShareUrl: jest.fn() }));

jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    getImageProperties: () => ({ width: 100, height: 100 }),
    internal: { pageSize: { getWidth: () => 100 } },
    save: jest.fn(),
  }));
});

jest.mock('html2canvas');

describe('PostmortemViewer', () => {
  beforeEach(() => {
    (fetchTimelineEvents as jest.Mock).mockResolvedValue([
      { source: 's', timestamp: 't', description: 'event' },
    ]);
    (loadActions as jest.Mock).mockReturnValue([
      { id: '1', provider: 'jira', description: 'action', url: 'u' },
    ]);
    (html2canvas as jest.Mock).mockResolvedValue({
      toDataURL: () => 'data:image/png;base64,',
      width: 100,
      height: 100,
    });
  });

  it('renders all sections', async () => {
    const pm: Postmortem = {
      id: 1,
      incidentId: '1',
      title: 'Title',
      summary: 'Summary',
      impact: 'Impact',
      rootCause: 'Root',
      resolution: 'Resolution',
      lessons: 'Lessons',
      tags: [],
    };
    render(<PostmortemViewer postmortem={pm} />);

    expect(await screen.findByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Impact')).toBeInTheDocument();
    expect(screen.getByText('Root Cause')).toBeInTheDocument();
    expect(screen.getByText('Resolution')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Lessons')).toBeInTheDocument();
  });

  it('exports to PDF on button click', async () => {
    const pm: Postmortem = {
      id: 1,
      incidentId: '1',
      title: 'Title',
      summary: 'Summary',
      tags: [],
    };
    const saveMock = jest.fn();
    (jsPDF as unknown as jest.Mock).mockImplementation(() => ({
      addImage: jest.fn(),
      getImageProperties: () => ({ width: 100, height: 100 }),
      internal: { pageSize: { getWidth: () => 100 } },
      save: saveMock,
    }));
    render(<PostmortemViewer postmortem={pm} />);

    const btn = await screen.findByText('Export to PDF');
    fireEvent.click(btn);

    await waitFor(() => {
      expect(html2canvas).toHaveBeenCalled();
      expect(saveMock).toHaveBeenCalled();
    });
  });

  it('copies share link', async () => {
    const pm: Postmortem = {
      id: 1,
      incidentId: '1',
      title: 'Title',
      summary: 'Summary',
      tags: [],
    };
    (getPostmortemShareUrl as jest.Mock).mockResolvedValue('link');
    Object.assign(navigator, { clipboard: { writeText: jest.fn() } });
    render(<PostmortemViewer postmortem={pm} />);
    const btn = await screen.findByRole('button', { name: /share/i });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(getPostmortemShareUrl).toHaveBeenCalledWith(1);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('link');
    });
  });
});

