import { useQuery } from '@tanstack/react-query';
import type { Incident, Postmortem } from '../types';
import { fetchIncidents } from './incidents';
import { searchPostmortems } from './postmortems';

export function useIncidents() {
  return useQuery<Incident[]>({
    queryKey: ['incidents'],
    queryFn: fetchIncidents,
  });
}

export function usePostmortems(
  query: string,
  options?: { enabled?: boolean }
) {
  return useQuery<Postmortem[]>({
    queryKey: ['postmortems', query],
    queryFn: () => searchPostmortems(query),
    ...options,
  });
}
