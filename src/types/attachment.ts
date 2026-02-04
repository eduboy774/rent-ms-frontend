import { ResponseObject } from "./base";

export interface Attachment {
   attachmentPath:string;
}


export interface AttachmentInputObject {
     base64String:string;
}

export interface AttachmentVars {
  input: AttachmentInputObject;
}


export interface UploadSingleFileMutation {
  uploadSingleFile: {
    response: ResponseObject;
    attachmentPath:string;
  };
}

