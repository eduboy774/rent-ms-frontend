import Badge from "../../../components/ui/badge/Badge";
import { House } from "../../../types/house";
import DataTable, { Column } from "../../../components/ui/table/DataTable";
import ActionDropdown from "../../../components/ui/dropdown/ActionDropdown";
import { getInitials } from "../../../utils/getInitials";

interface HouseTableProps {
  houses: House[];
  onDelete: (uuid: string) => void;
  onEdit: (house: House) => void;
}

const emptyIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="mb-3 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

export default function HouseTable({ houses, onDelete, onEdit }: HouseTableProps) {
  const columns: Column<House>[] = [
    {
      header: "House",
      render: (house) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
            {getInitials(house.name)}
          </div>
          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
            {house.name}
          </p>
        </div>
      ),
    },
    {
      header: "Description",
      render: (house) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">{house.description || "—"}</span>
      ),
    },
    {
      header: "Location",
      render: (house) => {
        const ward = house.ward;
        const council = ward?.wardParentCouncil ?? null;
        const district = council?.councilParentDistrict ?? null;
        const region = district?.districtParentRegion ?? null;

        if (!ward) {
          return <span className="text-sm text-gray-600 dark:text-gray-300">—</span>;
        }

        return (
          <div className="flex flex-col">
            <span className="text-sm text-gray-900 dark:text-white">{ward.wardName}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {[council?.councilName, district?.districtName, region?.reginalName]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        );
      },
    },
    {
      header: "Owner",
      render: (house) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {house.ownerInfo
            ? `${house.ownerInfo.userFirstName} ${house.ownerInfo.userLastName}`
            : "—"}
        </span>
      ),
    },
    {
      header: "Status",
      render: (house) => (
        <Badge size="sm" color={house.isActive ? "success" : "error"}>
          {house.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      align: "end",
      render: (house) => (
        <ActionDropdown
          onEdit={() => onEdit(house)}
          onDelete={() => onDelete(house.uuid)}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={houses}
      columns={columns}
      keyExtractor={(h) => h.uuid}
      emptyIcon={emptyIcon}
      emptyMessage="No houses found"
    />
  );
}
