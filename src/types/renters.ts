import { ResponseObject } from "./base";

/** Room entity */
export interface Renters {
  id: string;
  uuid: string;
  fullName: string;
  phoneNumber: string;
  nidaNumber: string;
  profileTitle: string | null;
  isActive: boolean;
  __typename: string;
}

export interface RenterFilteringInputObject {
  uuid?: string | null;
  fullName?: string | null;
  phoneNumber?: number | null;
  nidaNumber?: string | null;
  isActive?: boolean | null;
  pageNumber?: number | 1;
}


export interface RenterInputObject {
  uuid?: string | null;
  houseUuid?: string | null;
  fullName?: string | null;
  phoneNumber?: string | null;
  nidaNumber?: string | null;
  renterTitle?: string | null;
}


export interface CreateRenterVars {
  input: RenterInputObject;
}


export interface RenterResponse {
  data: Renters[];
  response: ResponseObject;
  __typename: string;
}



export interface CreateRenterMutation {
  createRenterMutation: {
    response: ResponseObject;
    data: Renters;
    __typename: string;
  };
}


