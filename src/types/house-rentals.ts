import { ResponseObject } from "./base";
import { House } from "./house";
import { Renters } from "./renters";
import { User } from "./users";

/* =================================================
   HouseRental Entity
================================================= */
export interface HouseRental {
  id: string;
  uuid: string;

  house: House;
  owner: User;
  renter: Renters;

  duration: string;            // e.g. "3_MONTHS"
  amount: string;              // DecimalField → string
  autoRenew: boolean;
  noticePeriodDays: number;

  status: string;              // e.g. "PENDING", "ACTIVE"
  expiredAt?: string | null;
  terminatedAt?: string | null;

  createdAt: string;
  isActive: boolean;

  __typename: string;
}

/* =================================================
   Filtering Input
================================================= */
export interface HouseRentalFilteringInputObject {
  uuid?: string | null;
  houseUuid?: string | null;
  ownerUuid?: string | null;
  renterUuid?: string | null;
  status?: string | null;
  isActive?: boolean | null;
}

/* =================================================
   Input Object (Create / Update)
================================================= */
export interface HouseRentalInputObject {
  uuid?: string | null;
  houseUuid?: string | null;
  ownerUuid?: string | null;
  renterUuid?: string | null;

  duration?: string | null;         // DURATION choices
  amount?: number | null;           // Decimal → string
  autoRenew?: boolean | null;
  noticePeriodDays?: number | null;

  status?: string | null;
  expiredAt?: string | null;        // ISO datetime
  terminatedAt?: string | null;     // ISO datetime
}

/* =================================================
   Mutation Variables
================================================= */
export interface CreateHouseRentalVars {
  input: HouseRentalInputObject;
}

/* =================================================
   Query Response
================================================= */
export interface HouseRentalResponse {
  data: HouseRental[];
  response: ResponseObject;
  __typename: string;
}

/* =================================================
   Mutation Response
================================================= */
export interface CreateHouseRentalMutation {
  createHouseRentalMutation: {
    response: ResponseObject;
    data: HouseRental;
    __typename: string;
  };
}
