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
import { useToast } from "../../../components/notifications/useToast";

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
  const { success, error, info } = useToast();
  
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
            const responseData: any = data?.deleteRentalPaymentMutation;

            if (responseData?.response?.code === 9000) {
              setPayments(prev => prev.filter(p => p.uuid !== uuid));
              success("Payment deleted successfully.");
            } else {
              error(responseData?.response?.message || "Failed to delete payment.");
            }
          } catch (err) {
            error("An error occurred while deleting.");
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
            const responseData: any = data?.refundRentalPaymentMutation;
            const refundedPayment = responseData?.data;

            if (responseData?.response?.code === 9000 && refundedPayment) {
              success("Payment refunded successfully.");
              setPayments(prev => prev.map(p => p.uuid === uuid ? refundedPayment : p));
            } else {
              error(responseData?.response?.message || "Failed to refund payment.");
            }
          } catch (err) {
            error("An error occurred while refunding.");
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
    if (!input.rentalUuid) {
      info("Please select a rental property");
      return;
    }
    if (!input.amount || input.amount <= 0) {
      info("Please enter a valid amount");
      return;
    }
    if (!input.paymentMethod) {
      info("Please select a payment method");
      return;
    }

    try {
      if (isEditing) {
        const { data } = await updatePayment({ variables: { input } });
        const responseData: any = data?.updateRentalPaymentMutation;
        const updatedPayment = responseData?.data;

        if (responseData?.response?.code === 9000 && updatedPayment) {
          success(responseData.response.message);
          setPayments(prev => prev.map(p => p.uuid === editingPayment?.uuid ? updatedPayment : p));
          closeModal();
          resetForm();
        } else {
          error(responseData?.response?.message);
        }
      } else {
        const { data } = await createPayment({ variables: { input } });
        const responseData: any = data?.createRentalPaymentMutation;
        const newPayment = responseData?.data;

        if (responseData?.response?.code === 9000 && newPayment) {
          success(responseData.response.message);
          setPayments(prev => [newPayment, ...prev]);
          closeModal();
          resetForm();
        } else {
          error(responseData?.response?.message);
        }
      }
    } catch (err) {
      console.error("Mutation error:", err);
      error("An error occurred while saving payment.");
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
      </PageCard>
    </PageLayout>
  );
}
