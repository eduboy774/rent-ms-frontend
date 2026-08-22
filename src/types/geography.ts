import { ResponseObject } from "./base";

export interface Region {
  id: string;
  regionalUniqueId: string;
  reginalName: string;
  reginalPostcode: string;
  reginalNapaId: string;
  reginalCode: string;
  __typename?: string;
}

export interface District {
  id: string;
  districtUniqueId: string;
  districtName: string;
  districtPostcode: string;
  districtNapaId: string;
  districtParentRegion: Region | null;
  __typename?: string;
}

export interface Council {
  id: string;
  councilUniqueId: string;
  councilName: string;
  councilPostcode: string;
  councilNapaId: string;
  councilParentDistrict: District | null;
  __typename?: string;
}

export interface Ward {
  id: string;
  wardUniqueId: string;
  wardName: string;
  wardPostcode: string;
  wardNapaId: string;
  wardParentCouncil: Council | null;
  __typename?: string;
}

export interface RegionFilteringInputObject {
  uuid?: string | null;
  name?: string | null;
}

export interface DistrictFilteringInputObject {
  uuid?: string | null;
  name?: string | null;
  regionUuid?: string | null;
}

export interface CouncilFilteringInputObject {
  uuid?: string | null;
  name?: string | null;
  districtUuid?: string | null;
}

export interface WardFilteringInputObject {
  uuid?: string | null;
  name?: string | null;
  councilUuid?: string | null;
}

export interface RegionResponse {
  data: Region[];
  response: ResponseObject;
}

export interface DistrictResponse {
  data: District[];
  response: ResponseObject;
}

export interface CouncilResponse {
  data: Council[];
  response: ResponseObject;
}

export interface WardResponse {
  data: Ward[];
  response: ResponseObject;
}
