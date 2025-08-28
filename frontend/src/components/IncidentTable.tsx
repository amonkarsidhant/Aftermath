import React, { useMemo, useState, useRef } from 'react';
import { useTable, useGlobalFilter, Column } from 'react-table';
import type { Incident } from '../types';
import { useIncidents } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { exportElementToPDF, exportToCSV } from '../utils/export';

interface Props {
  severityFilter?: string;
}

export default function IncidentTable({ severityFilter }: Props) {
  const {
    data: incidents = [],
    isLoading,
    isError,
    refetch,
  } = useIncidents();
  const [severity, setSeverity] = useState('');
  const [service, setService] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const tableRef = useRef<HTMLTableElement>(null);

  const severityOptions = useMemo(
    () => Array.from(new Set(incidents.map((i) => i.severity))),
    [incidents]
  );
  const serviceOptions = useMemo(
    () => Array.from(new Set(incidents.map((i) => i.service))),
    [incidents]
  );

  const currentSeverity = severityFilter ?? severity;

  const data = useMemo(() => {
    return incidents.filter((i) => {
      if (currentSeverity && i.severity !== currentSeverity) return false;
      if (service && i.service !== service) return false;
      if (startDate && new Date(i.date) < new Date(startDate)) return false;
      if (endDate && new Date(i.date) > new Date(endDate)) return false;
      return true;
    });
  }, [incidents, currentSeverity, service, startDate, endDate]);

  const columns = useMemo<Column<Incident>[]>(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Service', accessor: 'service' },
      { Header: 'Severity', accessor: 'severity' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Date', accessor: 'date' },
    ],
    []
  );

  const tableInstance = useTable<Incident>({ columns, data }, useGlobalFilter);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = tableInstance;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message="Failed to load incidents"
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input
          value={state.globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search incidents"
          aria-label="Search"
          className="border border-neutral-300 dark:border-neutral-600 rounded p-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
        />
        <select
          value={currentSeverity}
          onChange={(e) =>
            severityFilter === undefined ? setSeverity(e.target.value) : undefined
          }
          aria-label="Severity"
          className="border border-neutral-300 dark:border-neutral-600 rounded p-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
        >
          <option value="">All Severities</option>
          {severityOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          aria-label="Service"
          className="border border-neutral-300 dark:border-neutral-600 rounded p-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
        >
          <option value="">All Services</option>
          {serviceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          aria-label="Start date"
          className="border border-neutral-300 dark:border-neutral-600 rounded p-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          aria-label="End date"
          className="border border-neutral-300 dark:border-neutral-600 rounded p-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() =>
            tableRef.current && exportElementToPDF(tableRef.current, 'incidents.pdf')
          }
          className="px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded"
        >
          Export PDF
        </button>
        <button
          onClick={() => exportToCSV(data, 'incidents.csv')}
          className="px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded"
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table
          ref={tableRef}
          {...getTableProps()}
          className="min-w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded text-xs sm:text-sm"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="border-b border-neutral-300 dark:border-neutral-700 p-2 text-left bg-neutral-100 dark:bg-neutral-700"
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  {row.cells.map((cell) => (
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
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="p-2 text-center">
                  No incidents
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

