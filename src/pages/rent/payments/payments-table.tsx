import Badge from "../../../components/ui/badge/Badge";
import DataTable, { Column } from "../../../components/ui/table/DataTable";
import ActionDropdown from "../../../components/ui/dropdown/ActionDropdown";
import { getInitials } from "../../../utils/getInitials";
import { RentalPayment, PaymentStatus, PaymentMethod } from "../../../types/payments";

interface TableProps {
  payments: RentalPayment[];
  onDelete: (uuid: string) => void;
  onEdit: (payment: RentalPayment) => void;
  onRefund: (uuid: string) => void;
  onViewSummary: (rentalUuid: string) => void;
}

const emptyIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="mb-3 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>
);

const getStatusBadge = (status: PaymentStatus) => {
  switch (status) {
    case 'Completed':
      return <Badge size="sm" color="success">{status}</Badge>;
    case 'Pending':
      return <Badge size="sm" color="warning">{status}</Badge>;
    case 'Failed':
      return <Badge size="sm" color="error">{status}</Badge>;
    case 'Refunded':
      return <Badge size="sm" color="default">{status}</Badge>;
    default:
      return <Badge size="sm" color="default">{status}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-TZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
  }).format(amount);
};

const getMethodLabel = (method: PaymentMethod) => {
  switch (method) {
    case 'Cash':
      return 'Cash';
    case 'Card':
      return 'Card';
    case 'MobileMoney':
      return 'Mobile Money';
    case 'BankTransfer':
      return 'Bank Transfer';
    default:
      return method;
  }
};

export default function PaymentsTable({ payments, onDelete, onEdit, onRefund, onViewSummary }: TableProps) {
  const columns: Column<RentalPayment>[] = [
    {
      header: "Date",
      render: (p) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {formatDate(p.paymentDate)}
        </span>
      ),
    },
    {
      header: "Rental Ref",
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
            {getInitials(p.rental?.referenceNo || 'R')}
          </div>
          <div>
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {p.rental?.referenceNo || '—'}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {p.rental?.house?.name || '—'}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Renter",
      render: (p) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {p.rental?.renter?.fullName || '—'}
        </span>
      ),
    },
    {
      header: "Amount",
      render: (p) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {formatAmount(p.amount)}
        </span>
      ),
    },
    {
      header: "Method",
      render: (p) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {getMethodLabel(p.paymentMethod)}
        </span>
      ),
    },
    {
      header: "Type",
      render: (p) => (
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-300">
          {p.paymentType}
        </span>
      ),
    },
    {
      header: "Status",
      render: (p) => getStatusBadge(p.status),
    },
    {
      header: "Actions",
      align: "end",
      render: (p) => (
        <ActionDropdown
          onEdit={() => onEdit(p)}
          onDelete={() => onDelete(p.uuid)}
          extraActions={[
            {
              label: 'View Summary',
              onClick: () => onViewSummary(p.rental?.uuid),
            },
            ...(p.status === 'Completed' ? [{
              label: 'Refund',
              onClick: () => onRefund(p.uuid),
            }] : []),
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={payments}
      columns={columns}
      keyExtractor={(p) => p.uuid}
      emptyIcon={emptyIcon}
      emptyMessage="No payments found"
    />
  );
}
