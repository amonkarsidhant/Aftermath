declare module 'react-table' {
  export interface Column<D extends object = any> {
    Header: string;
    accessor: keyof D;
  }

  export function useTable<D extends object = any>(
    config: { columns: Column<D>[]; data: D[] },
    ...plugins: any[]
  ): any;

  export function useSortBy<D extends object = any>(...args: any[]): any;
}

