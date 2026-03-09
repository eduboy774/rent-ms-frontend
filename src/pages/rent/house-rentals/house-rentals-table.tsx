import Badge from "../../../components/ui/badge/Badge";
import DataTable, { Column } from "../../../components/ui/table/DataTable";
import ActionDropdown from "../../../components/ui/dropdown/ActionDropdown";
import { getInitials } from "../../../utils/getInitials";
import { HouseRental } from "../../../types/house-rentals";

interface TableProps {
  houseRentals: HouseRental[];
  onDelete: (uuid: string) => void;
  onEdit: (rental: HouseRental) => void;
}

const emptyIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="mb-3 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5M10.5 21H3m1.5 0h1.5m-1.5 0v-3.675c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H4.5m-.75 4.5h11.25" />
  </svg>
);

export default function HouseRentalsTable({ houseRentals, onDelete, onEdit }: TableProps) {
  const columns: Column<HouseRental>[] = [
    {
      header: "House",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
            {getInitials(r.house.name)}
          </div>
          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
            {r.house.name}
          </p>
        </div>
      ),
    },
    {
      header: "Owner",
      render: (r) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {r.owner.userFirstName} {r.owner.userLastName}
        </span>
      ),
    },
    {
      header: "Renter",
      render: (r) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">{r.renter.fullName}</span>
      ),
    },
    {
      header: "Status",
      render: (r) => (
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-300">
          {r.status}
        </span>
      ),
    },
    {
      header: "Duration",
      render: (r) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">{r.duration || "—"}</span>
      ),
    },
    {
      header: "Active",
      render: (r) => (
        <Badge size="sm" color={r.isActive ? "success" : "error"}>
          {r.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      align: "end",
      render: (r) => (
        <ActionDropdown
          onEdit={() => onEdit(r)}
          onDelete={() => onDelete(r.uuid)}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={houseRentals}
      columns={columns}
      keyExtractor={(r) => r.uuid}
      emptyIcon={emptyIcon}
      emptyMessage="No house rentals found"
    />
  );
}
