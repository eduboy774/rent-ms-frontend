import Badge from "../../../components/ui/badge/Badge";
import DataTable, { Column } from "../../../components/ui/table/DataTable";
import { Notifications } from "../../../types/notification";

interface NotificationTableProps {
  notifications: Notifications[];
}

const emptyIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="mb-3 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

const columns: Column<Notifications>[] = [
  {
    header: "Payload",
    render: (n) => (
      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
        {n.payload}
      </p>
    ),
  },
  {
    header: "Medium",
    render: (n) => (
      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-300">
        {n.medium}
      </span>
    ),
  },
  {
    header: "Status",
    render: (n) => (
      <Badge size="sm" color={n.isActive ? "success" : "error"}>
        {n.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
];

export default function NotificationTable({ notifications }: NotificationTableProps) {
  return (
    <DataTable
      data={notifications}
      columns={columns}
      keyExtractor={(n) => n.uuid}
      emptyIcon={emptyIcon}
      emptyMessage="No notifications found"
    />
  );
}
