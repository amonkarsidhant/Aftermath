import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, Column } from 'react-table';

type Postmortem = {
  title: string;
  incidentId: string;
  severity: string;
  status: string;
  createdAt: string;
};

const mockData: Postmortem[] = [
  {
    title: 'Database outage',
    incidentId: 'INC-001',
    severity: 'High',
    status: 'Open',
    createdAt: '2024-05-01',
  },
  {
    title: 'API latency spike',
    incidentId: 'INC-002',
    severity: 'Medium',
    status: 'Resolved',
    createdAt: '2024-05-10',
  },
  {
    title: 'Authentication bug',
    incidentId: 'INC-003',
    severity: 'Low',
    status: 'Open',
    createdAt: '2024-05-20',
  },
  {
    title: 'Network interruption',
    incidentId: 'INC-004',
    severity: 'High',
    status: 'Resolved',
    createdAt: '2024-06-01',
  },
];

export default function PostmortemTable() {
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const filteredData = useMemo(() => {
    return mockData.filter((pm) => {
      const matchesSeverity =
        severityFilter === 'All' || pm.severity === severityFilter;
      const matchesStart = !startDate || new Date(pm.createdAt) >= new Date(startDate);
      const matchesEnd = !endDate || new Date(pm.createdAt) <= new Date(endDate);
      return matchesSeverity && matchesStart && matchesEnd;
    });
  }, [severityFilter, startDate, endDate]);

  const columns = useMemo<Column<Postmortem>[]>(
    () => [
      { Header: 'Title', accessor: 'title' },
      { Header: 'Incident ID', accessor: 'incidentId' },
      { Header: 'Severity', accessor: 'severity' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Created Date', accessor: 'createdAt' },
    ],
    []
  );

  const tableInstance = useTable<Postmortem>({ columns, data: filteredData }, useSortBy);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className={`border border-neutral-300 dark:border-neutral-600 rounded p-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100`}
        >
          <option value="All">All Severities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={`border border-neutral-300 dark:border-neutral-600 rounded p-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100`}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={`border border-neutral-300 dark:border-neutral-600 rounded p-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100`}
        />
      </div>
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="min-w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded"
        >
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="border-b border-neutral-300 dark:border-neutral-700 p-2 text-left cursor-pointer select-none bg-neutral-100 dark:bg-neutral-700"
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' \u25BC'
                        : ' \u25B2'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row: any) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                {row.cells.map((cell: any) => (
                  <td
                    {...cell.getCellProps()}
                    className="p-2 border-b border-neutral-200 dark:border-neutral-700"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}

