import { ResponseObject } from "./base";
import { User } from "./users";

export interface House {
  id: string;
  uuid: string;
  name: string;
  ownerInfo: User;
  address: string;
  description: string;
  isActive: boolean;
  ownerUuid:string | null;
  __typename: string;
}

export interface HouseFilteringInputObject {
  uuid?: string | null;
  name?: string | null;
}
 
export interface UserFilteringInputObject {
  profileType?: string | null;
  profileIsActive?: boolean | true;
  pageNumber?: number | 1;
}
export interface HouseInputObject {
  uuid?: string | null;
  ownerUuid?: string | null;
  name?: string | null;
  address?: string | null;
  description?: string | null;
}

export interface CreateHouseVars {
  input: HouseInputObject;
}

export interface HouseResponse {
  data: House[];
  response: ResponseObject;
  __typename: string;
}



export interface CreateHouseMutation {
  createHouseMutation: {
    response: ResponseObject;
    data: House;
    __typename: string;
  };
}
