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
} from "@mui/material";
import { sortBy } from "lodash";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useAlerts } from "@/app/components/Alerts";
import { FileUpload } from "@/app/components/FileUpload";
import { Link, NextLinkComposed } from "@/app/components/Link";
import { graphql } from "@/gql/app";
import { FeaturePermission } from "@/gql/app/graphql";

type UpdateOrganizationFormType = {
  name: string;
  description: string;
  featurePermissions: FeaturePermission[];
  logoFileId: string | null;
};

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
            id
            logo {
              url
              id
            }
            name
            description
            featurePermissions
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

  const [uploadPreview, setUploadPreview] = useState<string | undefined>();

  useEffect(() => {
    return () => {
      if (uploadPreview) {
        URL.revokeObjectURL(uploadPreview);
      }
    };
  });

  const { notify } = useAlerts();
  const [updateOrganization] = useMutation(
    graphql(`
      mutation OrganizationsAdminEditPage($data: UpdateOrganizationInput!) {
        updateOrganization(data: $data) {
          organization {
            id
            name
            logo {
              id
              url
            }
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

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<UpdateOrganizationFormType>({
    defaultValues: {
      logoFileId: data.organization.organization.logo?.id,
      name: data.organization.organization.name,
      description: data.organization.organization.description,
      featurePermissions: data.organization.organization.featurePermissions,
    },
  });

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
              <TextField
                {...register("name")}
                label="Navn"
                error={Boolean(errors.name)}
                helperText={errors.name?.message ?? " "}
                fullWidth
              />
              <FileUpload
                currentObjectUrl={uploadPreview ?? data.organization.organization.logo?.url}
                imagePreview
                onComplete={({ id, file }) => {
                  setUploadPreview(URL.createObjectURL(file));
                  setValue("logoFileId", id, {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }}
              />
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
