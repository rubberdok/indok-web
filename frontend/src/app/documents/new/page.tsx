"use client";

import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertDriveFile } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Card, CardActions, CardContent, CircularProgress, Stack, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useAlerts } from "@/app/components/Alerts";
import { useFileUpload } from "@/app/components/FileUpload";
import { graphql } from "@/gql/app";
import { Dropzone } from "@/app/components/FileUpload/Dropzone";

const schema = z.object({
  name: z.string().min(1),
  file: z.instanceof(File),
  description: z.string().optional(),
  categories: z.array(z.object({ id: z.string() })).optional(),
});

type NewDocumentForm = z.infer<typeof schema>;

export default function Page() {
  const [createDocument] = useMutation(
    graphql(`
      mutation NewDocumentPage_CreateDocument($data: CreateDocumentInput!) {
        createDocument(data: $data) {
          document {
            id
            name
          }
          uploadUrl
        }
      }
    `)
  );

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<NewDocumentForm>({
    defaultValues: {
      name: "",
      file: undefined,
    },
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const { notify } = useAlerts();
  const { uploadFile, loading, error, completed } = useFileUpload({
    fileTypeAllowList: ["pdf"],
    onComplete() {
      notify({ message: "Dokumentet er lastet opp", type: "success" });
      router.push("/documents");
    },
  });

  async function onSubmit(formData: NewDocumentForm) {
    const { file, name } = formData;
    if (!file) return;
    const fileExtension = file.name.split(".").pop();
    if (!fileExtension) return;
    createDocument({
      variables: {
        data: {
          name,
          fileExtension,
        },
      },
      onCompleted(data) {
        const uploadUrl = data.createDocument.uploadUrl;
        uploadFile(file, uploadUrl);
      },
    });
  }
  const handleAddDocument = (files: File[]) => {
    const uploadedFile = files?.[0];
    if (uploadedFile) setValue("file", uploadedFile, { shouldValidate: true, shouldTouch: true, shouldDirty: true });
  };

  return (
    <>
      {loading && <CircularProgress />}
      {error && <Box>{error.message}</Box>}
      {completed && <Box>Document uploaded</Box>}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <Stack direction="column" spacing={2}>
              <TextField
                fullWidth
                {...register("name")}
                label="Navn"
                error={Boolean(errors.name)}
                helperText={errors.name?.message ?? " "}
              />
              <Controller
                control={control}
                name="file"
                render={({ field, fieldState: { error } }) => (
                  <Dropzone
                    {...field}
                    fullWidth
                    color="secondary"
                    value={undefined}
                    onFilesChange={(files) => handleAddDocument(files)}
                    error={Boolean(error)}
                    helperText={error?.message ?? " "}
                  />
                )}
              />
            </Stack>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <LoadingButton type="submit" loading={loading}>
              Opprett
            </LoadingButton>
          </CardActions>
        </form>
      </Card>
    </>
  );
}
