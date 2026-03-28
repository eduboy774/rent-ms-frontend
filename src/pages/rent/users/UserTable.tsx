import Badge from "../../../components/ui/badge/Badge";
import DataTable, { Column } from "../../../components/ui/table/DataTable";
import ActionDropdown from "../../../components/ui/dropdown/ActionDropdown";
import { getInitials } from "../../../utils/getInitials";
import { User } from "../../../types/users";

interface UserTableProps {
  users: User[];
  onDelete: (uuid: string) => void;
  onEdit: (user: User) => void;
}

const emptyIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="mb-3 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128H9m6 0a5.972 5.972 0 00-.786-3.07M9 19.128A9.38 9.38 0 016.375 19.5a9.337 9.337 0 01-4.121-.952 4.125 4.125 0 017.533-2.493M9 19.128v-.003c0-1.113.285-2.16.786-3.07m0 0A5.972 5.972 0 0112 15c1.151 0 2.234.321 3.152.886M12 12a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);

export default function UserTable({ users, onDelete, onEdit }: UserTableProps) {
  const columns: Column<User>[] = [
    {
      header: "House Owner",
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
            {getInitials(user.userFirstName, user.userLastName)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {user.userFirstName} {user.userLastName}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {user.userEmail}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Contact",
      render: (user) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">{user.profilePhone || "—"}</span>
      ),
    },
    {
      header: "Role",
      render: (user) => (
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-300">
          {user.profileType?.replace("_", " ") ?? "—"}
        </span>
      ),
    },
    {
      header: "Status",
      render: (user) => (
        <Badge size="sm" color={user.profileIsActive ? "success" : "error"}>
          {user.profileIsActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      align: "end",
      render: (user) => (
        <ActionDropdown
          onEdit={() => onEdit(user)}
          onDelete={() => onDelete(user.profileUniqueId)}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      keyExtractor={(u) => u.profileUniqueId}
      emptyIcon={emptyIcon}
      emptyMessage="No users found"
    />
  );
}
