import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { fetchTimelineEvents, TimelineEvent } from '../services/timeline';
import {
  generateBlamelessNarrative,
  Narrative,
} from '../services/ai/narrative';
import type { Postmortem } from '../types';

interface Props {
  postmortem: Postmortem;
}

export default function PostmortemDetail({ postmortem }: Props) {
  const [narrative, setNarrative] = useState<Narrative | null>(null);
  const [original, setOriginal] = useState<Narrative | null>(null);
  const [blameless, setBlameless] = useState<Narrative | null>(null);
  const [showOriginal, setShowOriginal] = useState<
    Record<keyof Narrative, boolean>
  >({
    detection: false,
    escalation: false,
    mitigation: false,
    resolution: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const events: TimelineEvent[] = await fetchTimelineEvents();
        const { original, blameless } = await generateBlamelessNarrative(events);
        setOriginal(original);
        setBlameless(blameless);
        setNarrative(blameless);
        setShowOriginal({
          detection: false,
          escalation: false,
          mitigation: false,
          resolution: false,
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    }
    load();
  }, []);

  const handleChange = (field: keyof Narrative, value: string) => {
    setNarrative((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleToggle = (field: keyof Narrative) => {
    if (!original || !blameless) return;
    setShowOriginal((prev) => {
      const next = !prev[field];
      setNarrative((curr) =>
        curr ? { ...curr, [field]: next ? original[field] : blameless[field] } : curr,
      );
      return { ...prev, [field]: next };
    });
  };

  const exportPdf = async () => {
    const doc = new jsPDF();
    doc.text(postmortem.title, 10, 10);
    doc.text(`Incident ID: ${postmortem.incidentId}`, 10, 20);
    doc.text(postmortem.summary, 10, 30);

    const element = document.getElementById('postmortem-content');
    if (element) {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, 'PNG', 10, 40, pdfWidth - 20, pdfHeight);
    }

    doc.save(`${postmortem.incidentId}.pdf`);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div
          role="alert"
          className="p-2 bg-red-100 text-red-600 rounded"
        >
          {error}
        </div>
      )}
      <div
        id="postmortem-content"
        className="p-4 border border-neutral-200 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800"
      >
        <h2 className="text-xl font-semibold">{postmortem.title}</h2>
        <p>Incident ID: {postmortem.incidentId}</p>
        <p>{postmortem.summary}</p>
        {narrative && (
          <div className="mt-4 space-y-4">
            {(Object.keys(narrative) as (keyof Narrative)[]).map((phase) => (
              <div key={phase} className="space-y-1">
                <label className="block font-medium capitalize">{phase}</label>
                <textarea
                  value={narrative[phase]}
                  onChange={(e) => handleChange(phase, e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <button
                  type="button"
                  onClick={() => handleToggle(phase)}
                  className="text-sm text-primary underline"
                >
                  {showOriginal[phase] ? 'Use blameless' : 'Use original'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={exportPdf}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
      >
        Export to PDF
      </button>
    </div>
  );
}
