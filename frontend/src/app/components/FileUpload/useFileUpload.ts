import { BlockBlobClient } from "@azure/storage-blob";
import { convertFileToArrayBuffer } from "./convert-file-to-array-buffer";
import { useState } from "react";

const MB_16 = 16 * 1024 * 1024;
const MB_32 = 32 * 1024 * 1024;

function useFileUpload(data?: {
  onComplete?: (file: { file: File }) => void;
  onError?: (error: Error) => void;
  fileTypeAllowList?: string[];
  fileMaxSizeBytes?: number;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState<{ [fileName: string]: number }>({});
  const { onComplete, fileTypeAllowList, onError, fileMaxSizeBytes = MB_16 } = data ?? {};

  async function uploadFile(file: File | undefined, url: string) {
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

      if (fileArrayBuffer === null || fileArrayBuffer.byteLength < 1 || fileArrayBuffer.byteLength > fileMaxSizeBytes)
        throw new Error("File size too large");

      const blockBlobClient = new BlockBlobClient(url);

      await blockBlobClient.uploadData(fileArrayBuffer, {
        blobHTTPHeaders: {
          blobContentType: file.type,
        },
        onProgress(progress) {
          const fileSize = fileArrayBuffer.byteLength;
          const percent = (progress.loadedBytes / fileSize) * 100;
          setProgress({ [file.name]: percent });
        },
      });
      setCompleted(true);
      onComplete?.({ file });
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
        onError?.(err);
      }
    } finally {
      setLoading(false);
    }
  }

  return { uploadFile, loading, error, completed, progress };
}

export { useFileUpload, MB_16, MB_32 };
