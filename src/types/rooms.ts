import { ResponseObject } from "./base";
import { House } from "./house";

/** Room entity */
export interface Rooms {
  id: string;
  uuid: string;
  houseInfo: House;
  name: string;
  number: string;
  capacity: number;
  pricePerNight: number;
  isActive: boolean;
  __typename: string;
}

export interface RoomFilteringInputObject {
  uuid?: string | null;
  houseUuid?: string | null;
  isActive?: boolean | null;
  pageNumber?: number | 1;
}


export interface RoomInputObject {
  uuid?: string | null;
  houseUuid?: string | null;
  name?: string | null;
  number?: number | null;
  capacity?: number | null;
  pricePerNight?: number | null;
  isActive?: boolean | null;
}


export interface CreateRoomVars {
  input: RoomInputObject;
}


export interface RoomResponse {
  data: Rooms[];
  response: ResponseObject;
  __typename: string;
}



export interface CreateRoomMutation {
  createRoomMutation: {
    response: ResponseObject;
    data: Rooms;
    __typename: string;
  };
}


