import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import FileInput from "../input/FileInput";
import Label from "../Label";
import { UPLOAD_SINGLE_FILE } from "../../../graphql/mutation";
import { AttachmentVars, UploadSingleFileMutation } from "../../../types/attachment";
import { toast } from "react-toastify";

interface FileInputExampleProps {
  onFileUpload?: (attachment: any) => void; // Define a more specific type if possible
}

export default function FileInputExample({ onFileUpload }: FileInputExampleProps) {
  const [createAttachment] = useMutation<UploadSingleFileMutation, AttachmentVars>(UPLOAD_SINGLE_FILE);
  const [attachment, setAttachment] = useState<any>(null); 
   
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const base64String = e.target?.result as string;
        const base64FileData = base64String.split(',')[1];

        const input = {
          base64String: base64FileData,
        };

        try {
          const result = await createAttachment({ variables: { input } });
          const newAttachment = result.data?.uploadSingleFile?.attachmentPath;
          setAttachment(newAttachment);
          if (onFileUpload) {
            onFileUpload(newAttachment);
          }
          toast.success(result?.data?.uploadSingleFile?.response?.message);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Label>Upload file</Label>
      <FileInput onChange={handleFileChange} className="custom-class" />
    </div>
  );
}
