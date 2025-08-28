import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, Column } from 'react-table';
import type { Postmortem } from '../types';

type TablePostmortem = Postmortem & {
  severity: string;
  status: string;
  createdAt: string;
};

const mockData: TablePostmortem[] = [
  {
    id: 1,
    title: 'Database outage',
    incidentId: 'INC-001',
    summary: 'Root cause and remediation details for the outage.',
    tags: ['database'],
    severity: 'High',
    status: 'Open',
    createdAt: '2024-05-01',
  },
  {
    id: 2,
    title: 'API latency spike',
    incidentId: 'INC-002',
    summary: 'Investigation into elevated API response times.',
    tags: ['api'],
    severity: 'Medium',
    status: 'Resolved',
    createdAt: '2024-05-10',
  },
  {
    id: 3,
    title: 'Authentication bug',
    incidentId: 'INC-003',
    summary: 'Issue with user authentication flow causing failures.',
    tags: ['auth'],
    severity: 'Low',
    status: 'Open',
    createdAt: '2024-05-20',
  },
  {
    id: 4,
    title: 'Network interruption',
    incidentId: 'INC-004',
     summary: 'Brief network outage impacting services.',
    tags: ['network'],
    severity: 'High',
    status: 'Resolved',
    createdAt: '2024-06-01',
  },
];

interface Props {
  onSelect: (postmortem: Postmortem) => void;
}

export default function PostmortemTable({ onSelect }: Props) {
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

  const columns = useMemo<Column<TablePostmortem>[]>(
    () => [
      { Header: 'Title', accessor: 'title' },
      { Header: 'Incident ID', accessor: 'incidentId' },
      { Header: 'Severity', accessor: 'severity' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Created Date', accessor: 'createdAt' },
    ],
    []
  );

  const tableInstance = useTable<TablePostmortem>({ columns, data: filteredData }, useSortBy);

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
          className="border border-neutral-300 dark:border-neutral-600 rounded p-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
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
          className="border border-neutral-300 dark:border-neutral-600 rounded p-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-neutral-300 dark:border-neutral-600 rounded p-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
        />
      </div>
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="min-w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded text-xs sm:text-sm"
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
                onClick={() => onSelect(row.original)}
                className="hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
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

