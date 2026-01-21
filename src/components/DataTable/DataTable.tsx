import { ReactNode, useState, useMemo } from "react";
import styles from "./DataTable.module.css";

export interface Column<T> {
  id: string;
  label: string;
  minWidth?: number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  getValue?: (row: T) => string | number;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => ReactNode;
  className?: string;
  stickyHeader?: boolean;
  maxHeight?: number | string;
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  isLoading = false,
  emptyMessage = "No se encontraron datos",
  emptyIcon,
  searchable = false,
  searchPlaceholder = "Buscar...",
  onRowClick,
  actions,
  className,
  stickyHeader = true,
  maxHeight = "600px",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter rows based on search term
  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;

    return rows.filter((row) =>
      columns.some((col) => {
        const value = col.getValue
          ? col.getValue(row)
          : (row as Record<string, unknown>)[col.id];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      }),
    );
  }, [rows, searchTerm, columns]);

  // Sort rows
  const sortedRows = useMemo(() => {
    if (!sortConfig) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const column = columns.find((col) => col.id === sortConfig.key);
      const aValue = column?.getValue
        ? column.getValue(a)
        : (a as Record<string, unknown>)[sortConfig.key];
      const bValue = column?.getValue
        ? column.getValue(b)
        : (b as Record<string, unknown>)[sortConfig.key];

      if (aValue === bValue) return 0;

      // Type-safe comparison
      const aComparable = aValue as
        | string
        | number
        | boolean
        | null
        | undefined;
      const bComparable = bValue as
        | string
        | number
        | boolean
        | null
        | undefined;
      const comparison = (aComparable ?? "") < (bComparable ?? "") ? -1 : 1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredRows, sortConfig, columns]);

  // Paginate rows
  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  const handleSort = (columnId: string) => {
    setSortConfig((current) => {
      if (current?.key === columnId) {
        return {
          key: columnId,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key: columnId, direction: "asc" };
    });
  };

  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {/* Search Bar */}
      {searchable && (
        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button
                className={styles.clearSearch}
                onClick={() => setSearchTerm("")}
              >
                ×
              </button>
            )}
          </div>
          <span className={styles.resultsCount}>
            {sortedRows.length} resultado{sortedRows.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Table */}
      <div
        className={styles.tableWrapper}
        style={{ maxHeight: stickyHeader ? maxHeight : "none" }}
      >
        <table className={styles.table}>
          <thead className={stickyHeader ? styles.stickyHeader : ""}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  style={{
                    minWidth: column.minWidth,
                    textAlign: column.align || "left",
                  }}
                  className={column.sortable ? styles.sortable : ""}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className={styles.headerContent}>
                    {column.label}
                    {column.sortable && (
                      <span className={styles.sortIndicator}>
                        {sortConfig?.key === column.id ? (
                          sortConfig.direction === "asc" ? (
                            "↑"
                          ) : (
                            "↓"
                          )
                        ) : (
                          <span className={styles.sortInactive}>↕</span>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className={styles.actionsHeader}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)}>
                  <div className={styles.emptyState}>
                    {emptyIcon}
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => (
                <tr
                  key={getRowId(row)}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? styles.clickableRow : ""}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      style={{ textAlign: column.align || "left" }}
                    >
                      {column.render
                        ? column.render(row)
                        : String(
                            (row as Record<string, unknown>)[column.id] ?? "",
                          )}
                    </td>
                  ))}
                  {actions && (
                    <td className={styles.actionsCell}>{actions(row)}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sortedRows.length > 0 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              className={styles.rowsSelect}
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
            </select>
            <span>
              Mostrando {page * rowsPerPage + 1}-
              {Math.min((page + 1) * rowsPerPage, sortedRows.length)} de{" "}
              {sortedRows.length}
            </span>
          </div>
          <div className={styles.paginationControls}>
            <button
              className={styles.paginationBtn}
              onClick={() => setPage(0)}
              disabled={page === 0}
            >
              ««
            </button>
            <button
              className={styles.paginationBtn}
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              «
            </button>
            <span className={styles.pageIndicator}>
              {page + 1} / {totalPages || 1}
            </span>
            <button
              className={styles.paginationBtn}
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1}
            >
              »
            </button>
            <button
              className={styles.paginationBtn}
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
            >
              »»
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
