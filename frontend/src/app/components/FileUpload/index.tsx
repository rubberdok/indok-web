import { useMutation } from "@apollo/client";
import { BlockBlobClient } from "@azure/storage-blob";
import { CircularProgress, FormHelperText } from "@mui/material";
import { useState } from "react";

import { graphql } from "@/gql/app";

import { convertFileToArrayBuffer } from "./convert-file-to-array-buffer";

const MAX_FILE_SIZE_B = 16 * 1024 * 1024; // 16 MB

type Props = {
  onComplete?: (file: { id: string; file: File }) => void;
  fileTypeAllowList?: string[];
  currentObjectUrl?: string | null;
  imagePreview?: boolean;
};

function FileUpload({ onComplete, fileTypeAllowList, currentObjectUrl, imagePreview }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [completed, setCompleted] = useState(false);

  const [getFileUploadUrl] = useMutation(
    graphql(`
      mutation FileUpload_GetFileUploadUrl($data: UploadFileInput!) {
        uploadFile(data: $data) {
          sasUrl
          file {
            id
          }
        }
      }
    `)
  );

  async function uploadFile(file: File | undefined) {
    try {
      setLoading(true);
      setError(undefined);
      setCompleted(false);
      if (!file) throw new Error("No file selected");
      const fileArrayBuffer = await convertFileToArrayBuffer(file);

      if (!fileArrayBuffer) throw new Error("Failed to convert file to array buffer");
      const fileExtension = file.name.split(".").pop();
      if (!fileExtension) throw new Error("Failed to get file extension");
      if (fileTypeAllowList && !fileTypeAllowList.includes(fileExtension)) throw new Error("File type not allowed");

      const { data, errors } = await getFileUploadUrl({
        variables: {
          data: {
            extension: fileExtension,
          },
        },
      });
      if (errors) throw new Error(errors[0].message);
      if (!data) throw new Error("Failed to get file upload url");
      const { sasUrl } = data.uploadFile;

      if (fileArrayBuffer === null || fileArrayBuffer.byteLength < 1 || fileArrayBuffer.byteLength > MAX_FILE_SIZE_B)
        throw new Error("File size too large");

      const blockBlobClient = new BlockBlobClient(sasUrl);

      await blockBlobClient.uploadData(fileArrayBuffer, {
        blobHTTPHeaders: {
          blobContentType: file.type,
        },
      });
      setCompleted(true);
      onComplete?.({ id: data.uploadFile.file.id, file });
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <input
        type="file"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          await uploadFile(file);
        }}
      />
      {currentObjectUrl && imagePreview && <img src={currentObjectUrl} alt="" width={150} height={150} />}
      {completed && "✅"}
      {loading && <CircularProgress />}
      <FormHelperText error={Boolean(error)}>{error?.message ?? " "}</FormHelperText>
    </>
  );
}

export { useFileUpload } from "./useFileUpload";
export { FileUpload };
