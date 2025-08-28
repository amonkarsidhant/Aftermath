import { fetchSummary } from '../../services/summary';

describe('fetchSummary', () => {
  it('calls the summary endpoint', async () => {
    const mockResponse = {
      sev1Count: 1,
      avgMttrHours: 2,
      slaPercent: 90,
    };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    }) as unknown as typeof fetch;

    const data = await fetchSummary();
    expect(global.fetch).toHaveBeenCalledWith('/summary');
    expect(data).toEqual(mockResponse);
  });
});
