import { render, screen } from '@testing-library/react';
import App from '../../App';
import { UserProvider } from '../../hooks/useUser';
import React from 'react';

// Mock heavy dashboard components
jest.mock('../../components/SummaryBanner', () => () => <div>SummaryBanner</div>);
jest.mock('../../components/MetricsTab', () => () => <div>MetricsTab</div>);
jest.mock('../../components/TimelineTab', () => () => <div>TimelineTab</div>);
jest.mock('../../components/SeverityBarChart', () => () => <div>SeverityBarChart</div>);
jest.mock('../../components/ActionStatusPieChart', () => () => <div>ActionStatusPieChart</div>);

function renderWithToken(token: string) {
  localStorage.setItem('token', token);
  return render(
    <UserProvider>
      <App />
    </UserProvider>
  );
}

function createToken(role: string) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({ role })).toString('base64');
  return `${header}.${payload}.signature`;
}

describe('role based dashboards', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('renders SRE dashboard for admin role', () => {
    const token = createToken('admin');
    renderWithToken(token);
    expect(screen.getByText('SRE Dashboard')).toBeInTheDocument();
  });

  it('renders Executive dashboard for user role', () => {
    const token = createToken('user');
    renderWithToken(token);
    expect(screen.getByText('Executive Dashboard')).toBeInTheDocument();
  });
});
