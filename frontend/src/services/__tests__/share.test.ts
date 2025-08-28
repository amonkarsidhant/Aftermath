import { getIncidentShareUrl } from '../share';

describe('share service', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: 'abc' }),
    }) as unknown as typeof fetch;
  });

  it('requests token and constructs incident url', async () => {
    const url = await getIncidentShareUrl(1);
    expect(global.fetch).toHaveBeenCalledWith('/share/incident/1', { method: 'POST' });
    expect(url).toBe('http://localhost/incidents/1?token=abc');
  });
});
