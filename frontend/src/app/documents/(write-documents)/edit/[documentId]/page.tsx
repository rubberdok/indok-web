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
import { notFound, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useAlerts } from "@/app/components/Alerts";
import { NextLinkComposed } from "@/app/components/Link";
import { graphql, makeFragmentData } from "@/gql/app";
import { Document } from "@/app/documents/Document";
import { DocumentFragmentFragmentDoc } from "@/gql/app/graphql";
import { getFragmentData } from "@/gql/pages";
import { orderBy } from "lodash";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  categories: z.array(z.string()).optional(),
});

type NewDocumentForm = z.infer<typeof schema>;

export default function Page({ params }: { params: { documentId: string } }) {
  const { data } = useSuspenseQuery(
    graphql(`
      query EditDocumentsPage_Document($data: DocumentInput!) {
        document(data: $data) {
          document {
            id
            name
            description
            ...DocumentFragment
            categories {
              id
              name
            }
          }
        }
        documentCategories {
          categories {
            id
            name
          }
        }
      }
    `),
    {
      variables: {
        data: {
          id: params.documentId,
        },
      },
    }
  );

  const [updateDocument, { loading }] = useMutation(
    graphql(`
      mutation EditDocumentsPage_UpdateDocument($data: UpdateDocumentInput!) {
        updateDocument(data: $data) {
          document {
            id
            name
          }
        }
      }
    `)
  );

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<NewDocumentForm>({
    defaultValues: {
      categories: data.document.document?.categories.map((category) => category.name) ?? [],
      name: data.document.document?.name ?? "",
      description: data.document.document?.description ?? "",
    },
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const { notify } = useAlerts();

  if (!data.document.document) return notFound();
  const { name, description, categories: newCategories } = watch();

  async function onSubmit(formData: NewDocumentForm) {
    const { name } = formData;
    updateDocument({
      variables: {
        data: {
          name,
          description: formData.description,
          id: params.documentId,
          categories: formData.categories?.map((category) => ({ name: category })),
        },
      },
      onCompleted() {
        notify({ message: "Dokumentet ble oppdatert", type: "success" });
        router.push("/documents/admin");
      },
      onError(error) {
        notify({ title: "Noe gikk galt", message: error.message, type: "error" });
      },
    });
  }

  const { categories } = data.documentCategories;
  const document = getFragmentData(DocumentFragmentFragmentDoc, data.document.document);

  return (
    <>
      <Grid direction="row" spacing={2} container>
        <Grid md={6}>
          <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent>
                <Stack direction="column" spacing={2}>
                  <TextField
                    fullWidth
                    {...register("name")}
                    required
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
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <LoadingButton component={NextLinkComposed} to="/documents/admin" loading={loading} color="secondary">
                  Avbryt
                </LoadingButton>
                <LoadingButton type="submit" loading={loading}>
                  Lagre
                </LoadingButton>
              </CardActions>
            </form>
          </Card>
        </Grid>
        <Grid md={6}>
          <Document
            document={makeFragmentData(
              {
                ...document,
                name,
                description: description ?? document.description,
                categories: newCategories?.map((category) => ({ name: category, id: category })) ?? document.categories,
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
