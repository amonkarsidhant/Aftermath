import { useEffect, useState } from 'react';
import { AgendaNotes, loadAgenda, saveAgenda } from '../api/remediations';

export default function ReviewAgenda() {
  const [notes, setNotes] = useState<AgendaNotes>({
    well: '',
    wrong: '',
    lucky: '',
  });

  useEffect(() => {
    setNotes(loadAgenda());
  }, []);

  const handleChange = (field: keyof AgendaNotes, value: string) => {
    const next = { ...notes, [field]: value };
    setNotes(next);
    saveAgenda(next);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Review Agenda</h2>
      <div className="space-y-2">
        <label className="block font-medium">What went well?</label>
        <textarea
          value={notes.well}
          onChange={(e) => handleChange('well', e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="space-y-2">
        <label className="block font-medium">What went wrong?</label>
        <textarea
          value={notes.wrong}
          onChange={(e) => handleChange('wrong', e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="space-y-2">
        <label className="block font-medium">Where did we get lucky?</label>
        <textarea
          value={notes.lucky}
          onChange={(e) => handleChange('lucky', e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
    </div>
  );
}
