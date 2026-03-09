import { ReactNode } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./index";

export interface Column<T> {
  header: string;
  render: (item: T) => ReactNode;
  align?: "start" | "end";
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  emptyIcon: ReactNode;
  emptyMessage: string;
}

export default function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyIcon,
  emptyMessage,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
        {emptyIcon}
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-x-auto">
      <Table>
        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.header}
                isHeader
                className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 ${
                  col.align === "end" ? "text-end" : "text-start"
                }`}
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {data.map((item) => (
            <TableRow
              key={keyExtractor(item)}
              className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
            >
              {columns.map((col) => (
                <TableCell
                  key={col.header}
                  className={`px-5 py-4 ${col.align === "end" ? "text-end" : ""}`}
                >
                  {col.render(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
