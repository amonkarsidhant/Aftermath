const env = (import.meta as any).env ?? {};

export const config = {
  useMockData: env.VITE_USE_MOCK_DATA === 'true',
};
