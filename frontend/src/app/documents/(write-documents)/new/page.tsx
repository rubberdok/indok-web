"use client";

import { useMutation, useSuspenseQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useAlerts } from "@/app/components/Alerts";
import { useFileUpload } from "@/app/components/FileUpload";
import { Dropzone } from "@/app/components/FileUpload/Dropzone";
import { graphql, makeFragmentData } from "@/gql/app";
import { orderBy } from "lodash";
import { NextLinkComposed } from "@/components/Link";
import { Document } from "../../Document";
import { DocumentFragmentFragmentDoc } from "@/gql/app/graphql";
import { useEffect, useState } from "react";
import { getFragmentData } from "@/gql/app";
import { MB_16 } from "@/app/components/FileUpload/useFileUpload";

const schema = z.object({
  name: z.string().min(1).max(100),
  file: z
    .instanceof(File, { message: "Du må laste opp en fil" })
    .refine(
      (file) => {
        return file.size < MB_16;
      },
      {
        message: "Filen er for stor, maks 16MB",
      }
    )
    .refine(
      (file) => {
        return file.type === "application/pdf";
      },
      {
        message: "Filen må være en PDF",
      }
    ),
  description: z.string().nullish(),
  categories: z.array(z.string()).optional(),
});

type NewDocumentForm = z.infer<typeof schema>;

export default function Page() {
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>();
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  });

  const { data } = useSuspenseQuery(
    graphql(`
      query NewDocumentsPage_DocumentCategories {
        documentCategories {
          categories {
            id
            name
          }
        }
      }
    `)
  );
  const [createDocument] = useMutation(
    graphql(`
      mutation NewDocumentPage_CreateDocument($data: CreateDocumentInput!) {
        createDocument(data: $data) {
          document {
            ...DocumentFragment
          }
          uploadUrl
        }
      }
    `)
  );

  const { categories } = data.documentCategories;

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<NewDocumentForm>({
    defaultValues: {
      name: "",
      file: undefined,
      categories: [],
      description: null,
    },
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const { notify } = useAlerts();
  const { uploadFile, loading, progress } = useFileUpload({
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
          categories: formData.categories?.map((category) => ({ name: category })),
          description: formData.description,
        },
      },
      onCompleted(data) {
        const uploadUrl = data.createDocument.uploadUrl;
        uploadFile(file, uploadUrl);
      },
      update(cache, { data }) {
        if (data) {
          cache.modify({
            fields: {
              documents(existingDocuments = []) {
                const newDocumentRef = cache.writeFragment({
                  data: getFragmentData(DocumentFragmentFragmentDoc, data.createDocument.document),
                  fragment: DocumentFragmentFragmentDoc,
                });
                if (!newDocumentRef) return existingDocuments;
                return [...existingDocuments, newDocumentRef];
              },
            },
          });
        }
      },
    });
  }
  const handleAddDocument = (files: File[]) => {
    const uploadedFile = files?.[0];
    if (uploadedFile) {
      setValue("file", uploadedFile, { shouldValidate: true, shouldTouch: true, shouldDirty: true });
      setFilePreviewUrl((prev) => {
        if (prev) {
          URL.revokeObjectURL(prev);
        }
        return URL.createObjectURL(uploadedFile);
      });
    }
  };
  const { name, description, categories: newCategories } = watch();

  return (
    <>
      <Grid container direction="row" spacing={2}>
        <Grid xs={6}>
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
                  <TextField
                    fullWidth
                    {...register("description")}
                    label="Beskrivelse"
                    error={Boolean(errors.description)}
                    helperText={errors.description?.message ?? " "}
                    multiline
                    rows={3}
                  />
                  <Controller
                    control={control}
                    name="file"
                    render={({ field, fieldState: { error } }) => (
                      <Dropzone
                        {...field}
                        loading={loading}
                        progress={progress}
                        fullWidth
                        color="secondary"
                        value={undefined}
                        onFilesChange={(files) => handleAddDocument(files)}
                        error={Boolean(error)}
                        helperText={error?.message ?? " "}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="categories"
                    render={({ field: { onChange, ...field }, fieldState: { error } }) => (
                      <>
                        <Autocomplete
                          {...field}
                          onChange={(_, value) => onChange(value)}
                          multiple
                          id="select-categories"
                          options={orderBy(categories.map((category) => category.name))}
                          groupBy={(option) => (Number.isNaN(Number.parseInt(option)) ? "Annet" : "År")}
                          freeSolo
                          disableCloseOnSelect
                          limitTags={3}
                          renderTags={(value: readonly string[], getTagProps) =>
                            value.map((option: string, index: number) => {
                              const { key, ...tagProps } = getTagProps({ index });
                              return <Chip variant="outlined" label={option} key={key} {...tagProps} />;
                            })
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Kategorier"
                              helperText={error?.message ?? "Trykk Enter for å legge til nye kategorier"}
                              error={Boolean(error)}
                            />
                          )}
                        />
                      </>
                    )}
                  />
                </Stack>
              </CardContent>
              <CardActions>
                <Stack direction="row" justifyContent="flex-end" spacing={2} width="100%">
                  <LoadingButton component={NextLinkComposed} to="/documents/admin" loading={loading} color="secondary">
                    Avbryt
                  </LoadingButton>
                  <LoadingButton type="submit" loading={loading}>
                    Opprett
                  </LoadingButton>
                </Stack>
              </CardActions>
            </form>
          </Card>
        </Grid>
        <Grid xs={6}>
          <Document
            document={makeFragmentData(
              {
                ...document,
                name,
                file: {
                  id: "new",
                  url: filePreviewUrl,
                },
                description: description ?? "",
                categories: newCategories?.map((category) => ({ name: category, id: category })) ?? [],
              },
              DocumentFragmentFragmentDoc
            )}
            disabled
          />
        </Grid>
      </Grid>
    </>
  );
}
