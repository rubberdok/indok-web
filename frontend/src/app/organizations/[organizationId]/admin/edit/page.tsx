"use client";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { sortBy } from "lodash";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useAlerts } from "@/app/components/Alerts";
import { useFileUpload } from "@/app/components/FileUpload";
import { Dropzone } from "@/app/components/FileUpload/Dropzone";
import { FilePreview } from "@/app/components/FileUpload/FilePreview";
import { Link, NextLinkComposed } from "@/app/components/Link";
import { getFragmentData, graphql } from "@/gql/app";
import { FeaturePermission } from "@/gql/app/graphql";

type UpdateOrganizationFormType = {
  name: string;
  description: string;
  featurePermissions: FeaturePermission[];
  logoFileId: string | null;
  colorScheme: string | null;
};

const OrganizationFragment = graphql(`
  fragment OrganizationsAdminEditPage_OrganizationFragment on Organization {
    id
    colorScheme
    logo {
      url
      id
    }
    name
    description
    featurePermissions
  }
`);

export default function Page({ params }: { params: { organizationId: string } }) {
  const { organizationId } = params;
  const { data } = useSuspenseQuery(
    graphql(`
      query OrganizationsAdminEditPage_IsSuperUser($data: OrganizationInput!) {
        user {
          user {
            id
            isSuperUser
          }
        }
        organization(data: $data) {
          organization {
            ...OrganizationsAdminEditPage_OrganizationFragment
          }
        }
      }
    `),
    {
      variables: {
        data: {
          id: params.organizationId,
        },
      },
    }
  );

  const [filePreviewUrl, setFilePreviewUrl] = useState<string | undefined>();
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  const { notify } = useAlerts();
  const [updateOrganization] = useMutation(
    graphql(`
      mutation OrganizationsAdminEditPage($data: UpdateOrganizationInput!) {
        updateOrganization(data: $data) {
          organization {
            ...OrganizationsAdminEditPage_OrganizationFragment
          }
        }
      }
    `),
    {
      onCompleted() {
        notify({ message: "Organisasjonen ble oppdatert", type: "success" });
      },
      onError(error) {
        notify({ title: "Noe gikk galt", message: error.message, type: "error" });
      },
    }
  );

  const organization = getFragmentData(OrganizationFragment, data.organization.organization);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<UpdateOrganizationFormType>({
    defaultValues: {
      logoFileId: organization.logo?.id,
      name: organization.name,
      description: organization.description,
      featurePermissions: organization.featurePermissions,
      colorScheme: organization.colorScheme ?? null,
    },
  });

  const [createFileUploadUrl] = useMutation(
    graphql(`
      mutation OrganizationsAdminEditPageUploadFile($data: UploadFileInput!) {
        uploadFile(data: $data) {
          sasUrl
          file {
            id
          }
        }
      }
    `)
  );
  const { uploadFile, progress, loading } = useFileUpload();

  if (!data.user.user) return notFound();
  const { isSuperUser } = data.user.user;

  function onSubmit(values: UpdateOrganizationFormType) {
    updateOrganization({
      variables: {
        data: {
          logoFileId: dirtyFields.logoFileId ? values.logoFileId : null,
          id: organizationId,
          name: dirtyFields.name ? values.name : null,
          description: dirtyFields.description ? values.description : null,
          featurePermissions: dirtyFields.featurePermissions ? values.featurePermissions : null,
          colorScheme: dirtyFields.colorScheme ? values.colorScheme : null,
        },
      },
    });
  }

  return (
    <>
      <Typography variant="subtitle1">Rediger</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <Stack direction="column" spacing={2}>
              <Grid container direction="row" spacing={2}>
                <Grid xs={10}>
                  <TextField
                    {...register("name")}
                    label="Navn"
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message ?? " "}
                    fullWidth
                  />
                </Grid>
                <Grid xs={2}>
                  <TextField
                    {...register("colorScheme")}
                    label="Farge"
                    type="color"
                    error={Boolean(errors.colorScheme)}
                    helperText={errors.colorScheme?.message ?? " "}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container direction="row" spacing={2}>
                <Grid xs={10}>
                  <Dropzone
                    fullWidth
                    sx={{ height: "100%" }}
                    color="secondary"
                    progress={progress}
                    loading={loading}
                    onFilesChange={async (files) => {
                      const file = files[0];
                      if (file) {
                        setFilePreviewUrl(URL.createObjectURL(file));

                        const extension = file.name.split(".").pop();
                        if (!extension) {
                          return notify({ message: "Filtypen støttes ikke", type: "error" });
                        }
                        const { data: fileUploadData } = await createFileUploadUrl({
                          variables: {
                            data: {
                              extension,
                            },
                          },
                        });
                        const uploadUrl = fileUploadData?.uploadFile.sasUrl;
                        if (!uploadUrl) {
                          return notify({ message: "Kunne ikke laste opp filen", type: "error" });
                        }
                        await uploadFile(file, uploadUrl);
                        setValue("logoFileId", fileUploadData?.uploadFile.file.id, {
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                      }
                    }}
                  />
                </Grid>
                <Grid xs={2}>
                  <FilePreview url={filePreviewUrl ?? organization.logo?.url} />
                </Grid>
              </Grid>

              <TextField
                {...register("description")}
                label="Beskrivelse"
                multiline
                fullWidth
                minRows={5}
                maxRows={20}
                error={Boolean(errors.description)}
                helperText={
                  errors.description?.message ?? (
                    <Typography component="span" variant="inherit">
                      Beskrivelsen kan bruke markdown for formattering,{" "}
                      <Link target="_blank" href="https://www.markdownguide.org/cheat-sheet/">
                        trykk her for en guide
                      </Link>
                    </Typography>
                  )
                }
              />
              {isSuperUser && (
                <Controller
                  control={control}
                  name="featurePermissions"
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={Boolean(error)}>
                      <InputLabel id="select-feature-permissions-label" shrink>
                        Velg tillatelser
                      </InputLabel>
                      <Select
                        {...field}
                        value={field.value ?? []}
                        labelId="select-feature-permissions-label"
                        id="select-feature-permissions"
                        label="Velg tillatelser"
                        displayEmpty
                        notched
                        multiple
                        renderValue={(selected) => {
                          return (
                            <Stack direction="row" spacing={1}>
                              {sortBy(selected)
                                .map((val) => val)
                                .map((val) => (
                                  <Chip label={val} key={val} />
                                ))}
                            </Stack>
                          );
                        }}
                      >
                        {Object.values(FeaturePermission).map((permission) => (
                          <MenuItem key={permission} value={permission}>
                            {permission}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error={Boolean(error)}>
                        {error?.message ?? "Kan kun endres av super-brukere"}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              )}
            </Stack>
          </CardContent>
          <CardActions>
            <Stack direction="row" spacing={2} justifyContent="flex-end" width={1}>
              <Button component={NextLinkComposed} to={`/organizations/${organizationId}/admin`}>
                Avbryt
              </Button>
              <Button type="submit" variant="contained">
                Lagre
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </form>
    </>
  );
}
