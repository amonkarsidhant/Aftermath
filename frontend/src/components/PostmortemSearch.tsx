import React, { useState, useEffect } from 'react';
import { searchPostmortems } from '../api/postmortems';
import type { Postmortem } from '../types';

interface Props {
  onSelect: (pm: Postmortem) => void;
}

export default function PostmortemSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Postmortem[]>([]);

  useEffect(() => {
    searchPostmortems('').then(setResults).catch(() => setResults([]));
  }, []);

  const handleSearch = async () => {
    try {
      const res = await searchPostmortems(query);
      setResults(res);
    } catch {
      setResults([]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-neutral-300 dark:border-neutral-600 rounded p-1 flex-grow"
          placeholder="Search postmortems..."
        />
        <button
          type="button"
          onClick={handleSearch}
          className="px-2 py-1 bg-primary text-white rounded"
        >
          Search
        </button>
      </div>
      <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
        {results.map((pm) => (
          <li
            key={pm.id}
            className="p-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
            onClick={() => onSelect(pm)}
          >
            <div className="font-medium">{pm.title}</div>
            <div className="text-sm text-neutral-500">{pm.tags.join(', ')}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
