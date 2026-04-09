import { ResponseObject } from "./base";
import { HouseRental } from "./house-rentals";
import { User } from "./users";

export type PaymentMethod = 'Cash' | 'Card' | 'MobileMoney' | 'BankTransfer';
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded';
export type PaymentType = 'Full' | 'Partial';

export interface RentalPayment {
  id: string;
  uuid: string;
  rental: HouseRental;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  status: PaymentStatus;
  notes?: string;
  recordedBy?: User;
  createdAt: string;
  isActive: boolean;
  __typename?: string;
}

export interface RentalPaymentFilteringInputObject {
  uuid?: string | null;
  rentalUuid?: string | null;
  status?: PaymentStatus | null;
  paymentMethod?: PaymentMethod | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}

export interface RentalPaymentInputObject {
  uuid?: string | null;
  rentalUuid: string;
  amount: number;
  paymentDate?: string | null;
  paymentMethod?: PaymentMethod | null;
  paymentType?: PaymentType | null;
  notes?: string | null;
}

export interface RentalPaymentSummary {
  rentalUuid: string;
  totalAmount: number;
  totalPaid: number;
  balance: number;
  paymentCount: number;
  lastPaymentDate?: string | null;
  paymentHistory: RentalPayment[];
  __typename?: string;
}

export interface RentalPaymentResponse {
  data: RentalPayment[];
  response: ResponseObject;
  __typename?: string;
}

export interface RentalPaymentSummaryResponse {
  data: RentalPaymentSummary | null;
  response: ResponseObject;
  __typename?: string;
}

export interface CreateRentalPaymentMutation {
  createRentalPaymentMutation: {
    response: ResponseObject;
    data: RentalPayment;
    __typename?: string;
  };
}

export interface UpdateRentalPaymentMutation {
  updateRentalPaymentMutation: {
    response: ResponseObject;
    data: RentalPayment;
    __typename?: string;
  };
}

export interface DeleteRentalPaymentMutation {
  deleteRentalPaymentMutation: {
    response: ResponseObject;
    __typename?: string;
  };
}

export interface RefundRentalPaymentMutation {
  refundRentalPaymentMutation: {
    response: ResponseObject;
    data: RentalPayment;
    __typename?: string;
  };
}

export interface CreateRentalPaymentVars {
  input: RentalPaymentInputObject;
}

export interface UpdateRentalPaymentVars {
  input: RentalPaymentInputObject;
}

export interface DeleteRentalPaymentVars {
  uuid: string;
}

export interface RefundRentalPaymentVars {
  uuid: string;
}

export interface GetRentalPaymentSummaryVars {
  rentalUuid: string;
}
