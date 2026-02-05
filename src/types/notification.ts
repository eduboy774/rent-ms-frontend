
export interface Notifications {
  id: string;
  uuid: string;
  medium: string;
  payload: string;
  status: string;
  attempts: string;
  isActive: boolean;
  errorMessage:string;
  __typename: string;
}

 
export interface NotificationFilteringInputObject {
  payload?: string | null;
  medium?: string | null;
}






