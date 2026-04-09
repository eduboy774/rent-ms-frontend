import { useState, useEffect } from "react";
import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import Input from "../../../components/form/input/InputField";
import Textarea from "../../../components/form/input/TextArea";
import { RentalPayment, RentalPaymentInputObject, PaymentMethod, PaymentType, PaymentStatus } from "../../../types/payments";
import { HouseRental } from "../../../types/house-rentals";

type SelectOption = {
  label: string;
  value: string;
};

const paymentMethodOptions: SelectOption[] = [
  { label: "Cash", value: "Cash" },
  { label: "Card", value: "Card" },
  { label: "Mobile Money", value: "MobileMoney" },
  { label: "Bank Transfer", value: "BankTransfer" },
];

const paymentTypeOptions: SelectOption[] = [
  { label: "Full Payment", value: "Full" },
  { label: "Partial Payment", value: "Partial" },
];

const statusOptions: SelectOption[] = [
  { label: "Pending", value: "Pending" },
  { label: "Completed", value: "Completed" },
  { label: "Failed", value: "Failed" },
  { label: "Refunded", value: "Refunded" },
];

type PaymentSummaryData = {
  totalAmount: number;
  totalPaid: number;
  balance: number;
};

type PaymentsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  rentals: HouseRental[];
  onSave: (input: RentalPaymentInputObject) => void;
  isEditing?: boolean;
  editingPayment?: RentalPayment | null;
  paymentSummary?: PaymentSummaryData | null;
};

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function PaymentsModal({
  isOpen,
  onClose,
  rentals,
  onSave,
  isEditing = false,
  editingPayment,
  paymentSummary,
}: PaymentsModalProps) {
  const [rentalUuid, setRentalUuid] = useState<string>("");
  const [amount, setAmount] = useState<number | null>(null);
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [paymentType, setPaymentType] = useState<PaymentType | "">("");
  const [status, setStatus] = useState<PaymentStatus>("Completed");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (isEditing && editingPayment) {
      setRentalUuid(editingPayment.rental?.uuid || "");
      setAmount(editingPayment.amount);
      setPaymentDate(editingPayment.paymentDate || "");
      setPaymentMethod(editingPayment.paymentMethod || "");
      setPaymentType(editingPayment.paymentType || "");
      setStatus(editingPayment.status || "Completed");
      setNotes(editingPayment.notes || "");
    } else {
      resetForm();
    }
  }, [isEditing, editingPayment, isOpen]);

  const resetForm = () => {
    setRentalUuid("");
    setAmount(null);
    setPaymentDate("");
    setPaymentMethod("");
    setPaymentType("");
    setStatus("Completed");
    setNotes("");
  };

  const handleSave = () => {
    const input: RentalPaymentInputObject = {
      uuid: isEditing ? editingPayment?.uuid : null,
      rentalUuid,
      amount: amount || 0,
      paymentDate: paymentDate || null,
      paymentMethod: paymentMethod as PaymentMethod || undefined,
      paymentType: paymentType as PaymentType || undefined,
      notes: notes || null,
    };
    onSave(input);
  };

  const rentalOptions: SelectOption[] = rentals.map((r) => ({
    label: `${r.referenceNo || r.uuid?.slice(0, 8)} - ${r.renter?.fullName || 'Unknown'} - ${r.house?.name || 'Unknown House'}`,
    value: r.uuid || "",
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] m-4">
      <div className="no-scrollbar relative w-full max-w-[800px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
            {isEditing ? "Edit Payment" : "Record Payment"}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isEditing ? "Update payment details" : "Record a new rental payment"}
          </p>
        </div>
        <form className="flex flex-col">
          <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-2">
                <Label>Select Rental *</Label>
                <Select
                  options={rentalOptions}
                  placeholder="Search rental by reference or renter name..."
                  value={rentalUuid}
                  onChange={setRentalUuid}
                />
              </div>

              {rentalUuid && paymentSummary && (
                <div className="col-span-2 rounded-lg bg-blue-50 p-4 dark:bg-blue-500/10">
                  <p className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                    Rental Summary
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatAmount(paymentSummary.totalAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Paid</p>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {formatAmount(paymentSummary.totalPaid)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
                      <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                        {formatAmount(paymentSummary.balance)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="col-span-2 lg:col-span-1">
                <Label>Amount *</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount ?? ""}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : null)}
                />
              </div>

              <div className="col-span-2 lg:col-span-1">
                <Label>Payment Date</Label>
                <Input
                  type="date"
                  placeholder="Select date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>

              <div className="col-span-2 lg:col-span-1">
                <Label>Payment Method *</Label>
                <Select
                  options={paymentMethodOptions}
                  placeholder="Select payment method"
                  value={paymentMethod}
                  onChange={(val) => setPaymentMethod(val as PaymentMethod)}
                />
              </div>

              <div className="col-span-2 lg:col-span-1">
                <Label>Payment Type *</Label>
                <Select
                  options={paymentTypeOptions}
                  placeholder="Select payment type"
                  value={paymentType}
                  onChange={(val) => setPaymentType(val as PaymentType)}
                />
              </div>

              {isEditing && (
                <div className="col-span-2 lg:col-span-1">
                  <Label>Status</Label>
                  <Select
                    options={statusOptions}
                    placeholder="Select status"
                    value={status}
                    onChange={(val) => setStatus(val as PaymentStatus)}
                  />
                </div>
              )}

              <div className="col-span-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Additional notes about this payment..."
                  value={notes}
                  onChange={setNotes}
                  rows={3}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-500"
              onClick={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              {isEditing ? "Update Payment" : "Record Payment"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
