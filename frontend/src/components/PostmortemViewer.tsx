import React, { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Postmortem } from '../types';
import { fetchTimelineEvents, TimelineEvent } from '../services/timeline';
import { loadActions, Remediation } from '../services/remediations';
import { getPostmortemShareUrl } from '../services/share';

interface Props {
  postmortem: Postmortem;
}

export default function PostmortemViewer({ postmortem }: Props) {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [actions, setActions] = useState<Remediation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const events = await fetchTimelineEvents();
        setTimeline(events);
        setActions(loadActions());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    }
    load();
  }, []);

  const exportPdf = async () => {
    if (!viewerRef.current) return;
    const canvas = await html2canvas(viewerRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${postmortem.incidentId}.pdf`);
  };

  const copyShareLink = async () => {
    const url = await getPostmortemShareUrl(postmortem.id);
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div role="alert" className="p-2 bg-red-100 text-red-600 rounded">
          {error}
        </div>
      )}
      <div
        ref={viewerRef}
        className="p-4 border border-neutral-200 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 space-y-4"
      >
        <h2 className="text-xl font-semibold">{postmortem.title}</h2>
        <section>
          <h3 className="font-medium">Summary</h3>
          <p>{postmortem.summary}</p>
        </section>
        <section>
          <h3 className="font-medium">Impact</h3>
          <p>{postmortem.impact || ''}</p>
        </section>
        <section>
          <h3 className="font-medium">Root Cause</h3>
          <p>{postmortem.rootCause || ''}</p>
        </section>
        <section>
          <h3 className="font-medium">Resolution</h3>
          <p>{postmortem.resolution || ''}</p>
        </section>
        <section>
          <h3 className="font-medium">Timeline</h3>
          {timeline.length ? (
            <ul className="list-disc pl-6">
              {timeline.map((e, idx) => (
                <li key={idx}>
                  <span className="font-semibold">{e.timestamp}</span> - {e.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>No timeline events.</p>
          )}
        </section>
        <section>
          <h3 className="font-medium">Actions</h3>
          {actions.length ? (
            <ul className="list-disc pl-6">
              {actions.map((a) => (
                <li key={a.id}>{a.description}</li>
              ))}
            </ul>
          ) : (
            <p>No actions.</p>
          )}
        </section>
        <section>
          <h3 className="font-medium">Lessons</h3>
          <p>{postmortem.lessons || ''}</p>
        </section>
      </div>
      <div className="flex gap-2">
        <button
          onClick={copyShareLink}
          className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded"
        >
          Share
        </button>
        <button
          onClick={exportPdf}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
        >
          Export to PDF
        </button>
      </div>
    </div>
  );
}

