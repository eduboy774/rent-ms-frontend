import { ResponseObject } from "./base";

export interface User {
  id: string;
  uuid: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  profileType: string;
  profileTitle: string;
  profilePhone: string;
  profileLevel: string;
  profileGender: string;
  profilePhoto?: string | null;
  profileIsActive: boolean;
  isActive: boolean;
  __typename: string;
}

export interface UserDetails {
  userProfile: User;
  userRoles: any[];
  __typename: string;
}

export interface UserFilteringInputObject {
  profileType?: string | null;
  profileIsActive?: boolean | true;
  pageNumber?: number | 1;
}

 

export interface UserInputObject {
  uuid?: string | null;
  userFirstName?: string | null;
  userLastName?: string | null;
  userEmail?: string | null;
  roleUniqueId?: string | null;
  profileUniqueId?: string | null;
  profileType?: string | null;
  profileTitle?: string | null;
  profilePhoto?: string | null;
  profilePhone?: string | null;
  profileLevel?: string | null;
  profileGender?: string | null;
  password?: string | null;
}


export interface CreateUserVars {
  input: UserInputObject;
}


export interface UserResponse {
  data: User[];
  response: ResponseObject;
  __typename: string;
}




export interface CreateUserMutation {
  createUserMutation: {
    response: ResponseObject;
    data: UserDetails;
    __typename: string;
  };
}

