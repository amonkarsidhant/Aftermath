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
      <div className="flex space-x-4">
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="border rounded p-1"
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
          className="border rounded p-1"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded p-1"
        />
      </div>
      <table {...getTableProps()} className="min-w-full border">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="border-b p-2 text-left cursor-pointer select-none"
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
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="hover:bg-gray-50">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="p-2 border-b">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

