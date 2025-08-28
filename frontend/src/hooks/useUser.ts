import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

interface UserContextValue {
  token: string | null;
  role: string | null;
  setToken: (token: string | null) => void;
}

const UserContext = createContext<UserContextValue>({
  token: null,
  role: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setToken: () => {}
});

function decodeRole(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(base64));
    return json.role ?? null;
  } catch {
    return null;
  }
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  );

  const setToken = useCallback((t: string | null) => {
    setTokenState(t);
    if (typeof window !== 'undefined') {
      if (t) {
        localStorage.setItem('token', t);
      } else {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const role = useMemo(() => decodeRole(token), [token]);

  const value = useMemo(() => ({ token, role, setToken }), [token, role, setToken]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export function useUser() {
  return useContext(UserContext);
}
