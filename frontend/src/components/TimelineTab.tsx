import { useEffect, useState } from 'react';
import { fetchTimelineEvents, TimelineEvent } from '../api/timeline';

export default function TimelineTab() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const s = start ? new Date(start) : undefined;
        const e = end ? new Date(end) : undefined;
        const data = await fetchTimelineEvents(s, e);
        setEvents(data);
        const providers = Array.from(new Set(data.map((ev) => ev.source)));
        setSelectedProviders(providers);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    }
    load();
  }, [start, end]);

  const toggleProvider = (p: string) => {
    setSelectedProviders((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const filtered = events.filter((ev) => {
    const time = new Date(ev.timestamp).getTime();
    const s = start ? new Date(start).getTime() : -Infinity;
    const e = end ? new Date(end).getTime() : Infinity;
    return (
      selectedProviders.includes(ev.source) &&
      time >= s &&
      time <= e
    );
  });

  const minTime = Math.min(...filtered.map((e) => new Date(e.timestamp).getTime()));
  const maxTime = Math.max(...filtered.map((e) => new Date(e.timestamp).getTime()));
  const height = 300;
  const getY = (time: number) => {
    if (!isFinite(minTime) || !isFinite(maxTime) || minTime === maxTime) {
      return height / 2;
    }
    return ((time - minTime) / (maxTime - minTime)) * height;
  };

  const providers = Array.from(new Set(events.map((e) => e.source)));

  return (
    <div className="space-y-4">
      {error && (
        <div role="alert" className="p-2 bg-red-100 text-red-600 rounded">
          {error}
        </div>
      )}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm">Start</label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">End</label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
        <div className="flex gap-2">
          {providers.map((p) => (
            <label key={p} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedProviders.includes(p)}
                onChange={() => toggleProvider(p)}
              />
              {p}
            </label>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-4">
        <svg height={height} className="w-full">
          <line x1={50} y1={0} x2={50} y2={height} stroke="currentColor" />
          {filtered.map((ev, idx) => {
            const y = getY(new Date(ev.timestamp).getTime());
            return (
              <g key={idx} transform={`translate(50, ${y})`}>
                <circle r={5} fill="currentColor" />
                <text x={10} y={5} className="text-sm">
                  {`${new Date(ev.timestamp).toLocaleString()} - ${ev.source}: ${ev.description}`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
