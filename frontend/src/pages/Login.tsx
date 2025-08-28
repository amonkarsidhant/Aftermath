import { useState } from 'react';
import { useUser } from '../hooks/useUser';

export default function Login() {
  const { setToken } = useUser();
  const [value, setValue] = useState('');

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-bold">Login</h1>
      <input
        className="border p-2"
        placeholder="JWT token"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-accent text-white"
        onClick={() => setToken(value)}
      >
        Set Token
      </button>
    </div>
  );
}
