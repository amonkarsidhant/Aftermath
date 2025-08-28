import { FormEvent, useEffect, useState } from 'react';
import { createAction, loadActions, Remediation } from '../services/remediations';

export default function RemediationActions() {
  const [description, setDescription] = useState('');
  const [provider, setProvider] = useState<'jira' | 'servicenow'>('jira');
  const [actions, setActions] = useState<Remediation[]>([]);

  useEffect(() => {
    setActions(loadActions());
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!description) return;
    try {
      const action = await createAction(description, provider);
      setActions((prev) => [...prev, action]);
      setDescription('');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Remediation Actions</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe follow-up action"
          className="w-full border p-2 rounded"
        />
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as 'jira' | 'servicenow')}
          className="border p-2 rounded"
        >
          <option value="jira">JIRA</option>
          <option value="servicenow">ServiceNow</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Create Action
        </button>
      </form>
      {actions.length > 0 && (
        <ul className="space-y-1">
          {actions.map((a) => (
            <li key={a.id}>
              {a.description} -{' '}
              <a
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                {a.id}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
