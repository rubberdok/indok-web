"use client";
import { graphql } from "@/gql/app";
import { useMutation } from "@apollo/client";
import { Container } from "@mui/material";
import { useAlerts } from "../components/Alerts";
import { useFileUpload } from "../components/FileUpload";
import { Dropzone } from "../components/FileUpload/Dropzone";
import { MB_16 } from "../components/FileUpload/useFileUpload";

export default function Page() {
  const [getFileUploadUrl] = useMutation(
    graphql(`
      mutation DropzoneUploadFile($data: UploadFileInput!) {
        uploadFile(data: $data) {
          sasUrl
        }
      }
    `)
  );
  const { notify } = useAlerts();

  const { uploadFile, progress, loading } = useFileUpload({
    onComplete({ file }) {
      notify({ message: `Uploaded file: ${file.name}`, type: "success" });
    },
    fileMaxSizeBytes: MB_16,
  });

  async function onFilesChange(files: File[]) {
    for (const file of files) {
      const { data } = await getFileUploadUrl({
        variables: { data: { extension: file.name.split(".").pop() ?? "pdf" } },
      });
      const uploadUrl = data?.uploadFile.sasUrl;
      if (uploadUrl) {
        await uploadFile(file, uploadUrl);
      }
    }
  }

  return (
    <Container>
      <Dropzone
        color="info"
        loading={loading}
        progress={progress}
        maxSize={MB_16}
        onFilesChange={onFilesChange}
        onFilesRejected={(fileRejections) => {
          notify({ message: `Failed to upload ${fileRejections.length} files`, type: "error" });
        }}
        multiple
      />
    </Container>
  );
}
