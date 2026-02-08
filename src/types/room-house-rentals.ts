import { ResponseObject } from "./base";
import { Rooms } from "./renters";
import { User } from "./users";

/* =====================
   RoomRental Entity
===================== */
export interface RoomRental {
  id: string;
  uuid: string;
  room: Rooms;
  renter: User;
  period: string; // ISO daterange string from backend
  status: string;
  isActive: boolean;
  __typename: string;
}

/* =====================
   Filtering Input
===================== */
export interface RoomRentalFilteringInputObject {
  uuid?: string | null;
  roomUuid?: string | null;
  renterUuid?: string | null;
  status?: string | null;
}

/* =====================
   Input Object
===================== */
export interface RoomRentalInputObject {
  uuid?: string | null;
  roomUuid?: string | null;
  renterUuid?: string | null;
  period?: string | null; // e.g. "[2026-02-01,2026-02-10)"
  status?: string | null;
}

/* =====================
   Create Variables
===================== */
export interface CreateRoomRentalVars {
  input: RoomRentalInputObject;
}

/* =====================
   Query Response
===================== */
export interface RoomRentalResponse {
  data: RoomRental[];
  response: ResponseObject;
  __typename: string;
}

/* =====================
   Mutation Response
===================== */
export interface CreateRoomRentalMutation {
  createRoomRentalMutation: {
    response: ResponseObject;
    data: RoomRental;
    __typename: string;
  };
}
