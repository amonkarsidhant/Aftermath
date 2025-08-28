declare module '@tanstack/react-query' {
  import type { ReactNode, FC } from 'react';
  export class QueryClient {
    constructor();
  }
  export interface QueryClientProviderProps {
    client: QueryClient;
    children?: ReactNode;
  }
  export const QueryClientProvider: FC<QueryClientProviderProps>;

  export interface UseQueryOptions<TData> {
    queryKey: readonly unknown[];
    queryFn: () => Promise<TData> | TData;
    enabled?: boolean;
  }
  export interface UseQueryResult<TData> {
    data: TData | undefined;
    refetch: () => Promise<{ data: TData }>;
  }
  export function useQuery<TData>(options: UseQueryOptions<TData>): UseQueryResult<TData>;
}
