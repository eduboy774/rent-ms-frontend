import { useState, useEffect } from "react";
import { Modal } from "../../../components/ui/modal";
import { useModal } from "../../../hooks/useModal";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import {
  GET_RENTAL_PAYMENTS,
  GET_HOUSE_RENTALS,
  GET_RENTAL_PAYMENT_SUMMARY,
} from "../../../graphql/queries";
import {
  CREATE_RENTAL_PAYMENT,
  UPDATE_RENTAL_PAYMENT,
  DELETE_RENTAL_PAYMENT,
  REFUND_RENTAL_PAYMENT,
} from "../../../graphql/mutation";
import {
  RentalPayment,
  RentalPaymentInputObject,
  RentalPaymentFilteringInputObject,
  PaymentMethod,
  PaymentType,
  PaymentStatus,
  RentalPaymentSummary,
} from "../../../types/payments";
import { HouseRental, HouseRentalFilteringInputObject } from "../../../types/house-rentals";
import PaymentsTable from "./payments-table";
import PaymentsModal from "./payments-modal";
import PaymentSummaryModal from "./payment-summary-modal";
import ConfirmToast from "../../../components/notifications/confirmation";
import PageCard from "../../../components/common/PageCard";
import PageLayout from "../../../components/common/PageLayout";
import Select from "../../../components/form/Select";

const paymentStatusOptions = [
  { label: "All Status", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Completed", value: "Completed" },
  { label: "Failed", value: "Failed" },
  { label: "Refunded", value: "Refunded" },
];

const paymentMethodOptions = [
  { label: "All Methods", value: "" },
  { label: "Cash", value: "Cash" },
  { label: "Card", value: "Card" },
  { label: "Mobile Money", value: "MobileMoney" },
  { label: "Bank Transfer", value: "BankTransfer" },
];

export default function Payments() {
  const { isOpen, openModal, closeModal } = useModal();
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  
  const [payments, setPayments] = useState<RentalPayment[]>([]);
  const [rentals, setRentals] = useState<HouseRental[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPayment, setEditingPayment] = useState<RentalPayment | null>(null);
  const [selectedSummaryRental, setSelectedSummaryRental] = useState<{
    uuid: string;
    ref?: string;
    houseName?: string;
    renterName?: string;
  } | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<{
    totalAmount: number;
    totalPaid: number;
    balance: number;
  } | null>(null);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [lastSavedPayment, setLastSavedPayment] = useState<RentalPayment | null>(null);

  const defaultPaymentFilter: RentalPaymentFilteringInputObject = {
    uuid: null,
    rentalUuid: null,
    status: null,
    paymentMethod: null,
    dateFrom: null,
    dateTo: null,
  };

  const defaultRentalFilter: HouseRentalFilteringInputObject = {
    uuid: null,
    status: 'ACTIVE',
  };

  const [createPayment] = useMutation(CREATE_RENTAL_PAYMENT);
  const [updatePayment] = useMutation(UPDATE_RENTAL_PAYMENT);
  const [deletePayment] = useMutation(DELETE_RENTAL_PAYMENT);
  const [refundPayment] = useMutation(REFUND_RENTAL_PAYMENT);

  const { loading: loadingPayments, refetch: refetchPayments } = useQuery(
    GET_RENTAL_PAYMENTS,
    {
      variables: { filtering: defaultPaymentFilter },
      fetchPolicy: "network-only",
      onCompleted: (data) => {
        setPayments(data?.getRentalPayments?.data || []);
      },
    }
  );

  const { data: rentalsData } = useQuery(GET_HOUSE_RENTALS, {
    variables: { filtering: defaultRentalFilter },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setRentals(data?.getHouseRentals?.data || []);
    },
  });

  const { data: summaryData, refetch: refetchSummary } = useQuery(
    GET_RENTAL_PAYMENT_SUMMARY,
    {
      variables: { rentalUuid: selectedSummaryRental?.uuid },
      skip: !selectedSummaryRental?.uuid,
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (summaryData?.getRentalPaymentSummary?.data) {
      const data = summaryData.getRentalPaymentSummary.data;
      setPaymentSummary({
        totalAmount: data.totalAmount,
        totalPaid: data.totalPaid,
        balance: data.balance,
      });
    }
  }, [summaryData]);

  const handleDelete = (uuid: string) => {
    const toastId = toast(
      <ConfirmToast
        onConfirm={async () => {
          toast.dismiss(toastId);
          try {
            const { data } = await deletePayment({ variables: { uuid } });
            const response = data?.deleteRentalPaymentMutation?.response;

            if (response?.code === "9000") {
              setPayments((prev) => prev.filter((p) => p.uuid !== uuid));
              toast.success("Payment deleted successfully.");
            } else {
              toast.error(response?.message || "Failed to delete payment.");
            }
          } catch (err) {
            toast.error("An error occurred while deleting.");
          }
        }}
        onCancel={() => toast.dismiss(toastId)}
      />
    );
  };

  const handleRefund = (uuid: string) => {
    const toastId = toast(
      <ConfirmToast
        onConfirm={async () => {
          toast.dismiss(toastId);
          try {
            const { data } = await refundPayment({ variables: { uuid } });
            const response = data?.refundRentalPaymentMutation?.response;

            if (response?.code === "9000") {
              toast.success("Payment refunded successfully.");
              refetchPayments();
            } else {
              toast.error(response?.message || "Failed to refund payment.");
            }
          } catch (err) {
            toast.error("An error occurred while refunding.");
          }
        }}
        onCancel={() => toast.dismiss(toastId)}
      />
    );
  };

  const handleEdit = (payment: RentalPayment) => {
    setEditingPayment(payment);
    setIsEditing(true);
    openModal();
  };

  const handleViewSummary = (rentalUuid: string) => {
    const rental = rentals.find((r) => r.uuid === rentalUuid);
    setSelectedSummaryRental({
      uuid: rentalUuid,
      ref: rental?.referenceNo,
      houseName: rental?.house?.name,
      renterName: rental?.renter?.fullName,
    });
    setSummaryModalOpen(true);
  };

  const handleSave = async (input: RentalPaymentInputObject) => {
    try {
      if (isEditing && editingPayment) {
        const { data } = await updatePayment({ variables: { input } });
        const response = data?.updateRentalPaymentMutation?.response;

        if (response?.code === "9000") {
          toast.success("Payment updated successfully.");
          refetchPayments();
          setLastSavedPayment(data?.updateRentalPaymentMutation?.data);
          setShowSuccessDialog(true);
          closeModal();
          resetForm();
        } else {
          toast.error(response?.message || "Failed to update payment.");
        }
      } else {
        const { data } = await createPayment({ variables: { input } });
        const response = data?.createRentalPaymentMutation?.response;

        if (response?.code === "9000") {
          toast.success("Payment recorded successfully.");
          refetchPayments();
          refetchSummary();
          setLastSavedPayment(data?.createRentalPaymentMutation?.data);
          setShowSuccessDialog(true);
          closeModal();
          resetForm();
        } else {
          toast.error(response?.message || "Failed to record payment.");
        }
      }
    } catch (err) {
      console.error("Mutation error:", err);
      toast.error("An error occurred while saving payment.");
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingPayment(null);
    setPaymentSummary(null);
  };

  const handleAdd = () => {
    resetForm();
    openModal();
  };

  if (loadingPayments) return null;

  const rentalOptions = rentals.map((r) => ({
    label: `${r.referenceNo || r.uuid?.slice(0, 8)} - ${r.renter?.fullName || 'Unknown'}`,
    value: r.uuid || "",
  }));

  return (
    <PageLayout
      title="Payments"
      description="Manage rental payments"
    >
      <PageCard
        title="Rental Payments"
        count={payments.length}
        countLabel="payment"
        onAdd={handleAdd}
        addLabel="Record Payment"
      >
        <PaymentsTable
          payments={payments}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onRefund={handleRefund}
          onViewSummary={handleViewSummary}
        />

        <PaymentsModal
          isOpen={isOpen}
          onClose={() => {
            closeModal();
            resetForm();
          }}
          rentals={rentals}
          onSave={handleSave}
          isEditing={isEditing}
          editingPayment={editingPayment}
          paymentSummary={paymentSummary}
        />

        <PaymentSummaryModal
          isOpen={summaryModalOpen}
          onClose={() => {
            setSummaryModalOpen(false);
            setSelectedSummaryRental(null);
          }}
          rentalUuid={selectedSummaryRental?.uuid || null}
          rentalRef={selectedSummaryRental?.ref}
          houseName={selectedSummaryRental?.houseName}
          renterName={selectedSummaryRental?.renterName}
        />

        <Modal isOpen={showSuccessDialog} onClose={() => setShowSuccessDialog(false)} className="max-w-md m-4">
          <div className="p-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
              {isEditing ? "Payment Updated" : "Payment Recorded"}
            </h3>
            {lastSavedPayment && (
              <div className="mb-4 rounded-lg bg-gray-50 p-4 text-left dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Amount:</span> {new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS' }).format(lastSavedPayment.amount)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Date:</span> {lastSavedPayment.paymentDate ? new Date(lastSavedPayment.paymentDate).toLocaleDateString('en-TZ') : '-'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Method:</span> {lastSavedPayment.paymentMethod || '-'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Status:</span> {lastSavedPayment.status}
                </p>
                {lastSavedPayment.rental?.renter?.fullName && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Renter:</span> {lastSavedPayment.rental.renter.fullName}
                  </p>
                )}
              </div>
            )}
            <button
              onClick={() => setShowSuccessDialog(false)}
              className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </Modal>
      </PageCard>
    </PageLayout>
  );
}
