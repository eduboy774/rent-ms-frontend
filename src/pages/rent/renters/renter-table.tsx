import Badge from "../../../components/ui/badge/Badge";
import Button from "../../../components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import { Renters } from "../../../types/renters";

interface RenterTableProps {
  renters: Renters[];
  onDelete: (uuid: string) => void;
}

export default function RenterTable({ renters, onDelete }: RenterTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mt-4">
      <div className="max-w-full overflow-x-auto">
    <Table>
      <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
        <TableRow>
          <TableCell 
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
          isHeader>Renter Name</TableCell>
          <TableCell 
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
          isHeader>Phone Number</TableCell>
          <TableCell
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
          isHeader>Nida No</TableCell>
          
          <TableCell 
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
          isHeader>Actions</TableCell>
        </TableRow>
      </TableHeader>

      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]" >
        {renters.map((renter) => (
          <TableRow key={renter.uuid}>
            <TableCell className="px-5 py-4 sm:px-6 text-start">
              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
              {renter.fullName}
              </span>
              </TableCell>
            <TableCell
            className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
            >{renter.phoneNumber}
            </TableCell>
            <TableCell
            className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
            >{renter.nidaNumber}</TableCell>
          
            <TableCell
            className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
            >
              <Badge color={renter.isActive ? "success" : "error"}>
                {renter.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell 
            className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
            >
              <Button
                size="sm"
                variant="outline"
                className="text-red-500"
                onClick={() => onDelete(renter.uuid)}
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
