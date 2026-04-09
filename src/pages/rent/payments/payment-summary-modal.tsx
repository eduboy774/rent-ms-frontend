import { useEffect, useState } from "react";
import { Modal } from "../../../components/ui/modal";
import Badge from "../../../components/ui/badge/Badge";
import { RentalPaymentSummary, RentalPayment } from "../../../types/payments";
import { useQuery } from "@apollo/client";
import { GET_RENTAL_PAYMENT_SUMMARY } from "../../../graphql/queries";

type PaymentSummaryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  rentalUuid: string | null;
  rentalRef?: string;
  houseName?: string;
  renterName?: string;
};

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-TZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusBadge = (status: string) => {
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

const getMethodLabel = (method: string) => {
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

export default function PaymentSummaryModal({
  isOpen,
  onClose,
  rentalUuid,
  rentalRef,
  houseName,
  renterName,
}: PaymentSummaryModalProps) {
  const [summary, setSummary] = useState<RentalPaymentSummary | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const { data, loading, error } = useQuery(GET_RENTAL_PAYMENT_SUMMARY, {
    variables: { rentalUuid },
    skip: !rentalUuid || !isOpen,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data?.getRentalPaymentSummary?.data) {
      setSummary(data.getRentalPaymentSummary.data);
    }
  }, [data]);

  const getProgressPercentage = () => {
    if (!summary) return 0;
    return Math.min((summary.totalPaid / summary.totalAmount) * 100, 100);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[900px] m-4">
      <div className="no-scrollbar relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
        <div className="px-2 pr-14">
          <h4 className="mb-1 text-xl font-semibold text-gray-800 dark:text-white/90">
            Payment Summary
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {rentalRef && `Rental: ${rentalRef}`}
            {houseName && ` - ${houseName}`}
            {renterName && ` (${renterName})`}
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="py-8 text-center text-red-500">
            Failed to load payment summary
          </div>
        )}

        {!loading && !error && summary && (
          <>
            <div className="custom-scrollbar overflow-y-auto px-2 pb-4">
              <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Contract Amount
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                    {formatAmount(summary.totalAmount)}
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-500/10">
                  <p className="text-xs font-medium text-green-600 dark:text-green-400">
                    Total Paid
                  </p>
                  <p className="mt-1 text-xl font-bold text-green-600 dark:text-green-400">
                    {formatAmount(summary.totalPaid)}
                  </p>
                </div>
                <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-500/10">
                  <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
                    Balance
                  </p>
                  <p className="mt-1 text-xl font-bold text-orange-600 dark:text-orange-400">
                    {formatAmount(summary.balance)}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-500/10">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Payments Made
                  </p>
                  <p className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-400">
                    {summary.paymentCount}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Payment Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getProgressPercentage().toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-green-500 transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                    Payment History
                  </h5>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-sm text-orange-500 hover:text-orange-600"
                  >
                    {showHistory ? 'Hide' : 'Show'} Details
                  </button>
                </div>

                {showHistory && (
                  <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                            Method
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                            Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                            Reference
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                        {summary.paymentHistory && summary.paymentHistory.length > 0 ? (
                          summary.paymentHistory.map((payment: RentalPayment) => (
                            <tr key={payment.uuid}>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                {formatDate(payment.paymentDate)}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                {formatAmount(payment.amount)}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                {getMethodLabel(payment.paymentMethod)}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                {payment.paymentType}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3">
                                {getStatusBadge(payment.status)}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                {payment.referenceNo || '—'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                            >
                              No payment history found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-2 pt-4 dark:border-gray-700">
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
