import { useEffect, useState } from 'react';
import { fetchSummary } from '../services/summary';
import type { Summary } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

export default function SummaryBanner() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await fetchSummary();
      setSummary(data);
      setError(null);
    } catch (err) {
      setError('Failed to load summary');
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (error) {
    return <ErrorMessage message={error} onRetry={load} />;
  }

  if (!summary) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mb-4 p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded flex flex-wrap justify-around text-center">
      <div>
        <div className="text-sm text-neutral-500">Sev1 Incidents</div>
        <div className="text-2xl font-semibold" data-testid="sev1-count">{summary.sev1Count}</div>
      </div>
      <div>
        <div className="text-sm text-neutral-500">Avg MTTR (h)</div>
        <div className="text-2xl font-semibold" data-testid="avg-mttr">{summary.avgMttrHours.toFixed(1)}</div>
      </div>
      <div>
        <div className="text-sm text-neutral-500">SLA %</div>
        <div className="text-2xl font-semibold" data-testid="sla-percent">{summary.slaPercent.toFixed(0)}%</div>
      </div>
    </div>
  );
}
