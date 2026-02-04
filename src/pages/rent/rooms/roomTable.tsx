import Badge from "../../../components/ui/badge/Badge";
import Button from "../../../components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import { Rooms } from "../../../types/rooms";

interface RoomTableProps {
  rooms: Rooms[];
  onDelete: (uuid: string) => void;
}

export default function RoomTable({ rooms, onDelete }: RoomTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mt-4">
      <div className="max-w-full overflow-x-auto">
    <Table>
      <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
        <TableRow>
          <TableCell 
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
          isHeader>Name</TableCell>
          <TableCell 
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
          isHeader>Number</TableCell>
          <TableCell
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
          isHeader>House</TableCell>
          <TableCell 
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
          isHeader>Price</TableCell>
          <TableCell 
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
          isHeader>Status</TableCell>
          <TableCell 
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
          isHeader>Actions</TableCell>
        </TableRow>
      </TableHeader>

      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]" >
        {rooms.map((room) => (
          <TableRow key={room.uuid}>
            <TableCell className="px-5 py-4 sm:px-6 text-start">
              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
              {room.name}
              </span>
              </TableCell>
            <TableCell
            className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
            >{room.number}</TableCell>
            <TableCell
            className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
            >{room.houseInfo?.name}</TableCell>
            <TableCell
            className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
            >{room.pricePerNight ?? "-"}</TableCell>
            <TableCell
            className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
            >
              <Badge color={room.isActive ? "success" : "error"}>
                {room.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell 
            className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
            >
              <Button
                size="sm"
                variant="outline"
                className="text-red-500"
                onClick={() => onDelete(room.uuid)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
    </div>
  );
}
