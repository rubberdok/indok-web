"use client";

import { useAlerts } from "@/app/components/Alerts";
import { graphql } from "@/gql/app";
import * as yup from "@/lib/validation";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormControl, FormHelperText, InputLabel, Select, TextField } from "@mui/material";
import { notFound, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

type NewListingForm = {
  organizationId: string;
  name: string;
  description: string;
  closesAt: Date;
  applicationUrl: string;
};

const schema = yup.object<NewListingForm>({
  organizationId: yup.string().required().label("Forening"),
  name: yup.string().min(2).max(100).required().label("Navn"),
  description: yup.string().required().label("Beskrivelse"),
  closesAt: yup.date().min(new Date()).required().label("Søknadsfrist"),
  applicationUrl: yup.string().url().required().label("Søknadslenke"),
});

function NewListing() {
  const router = useRouter();
  const { notify } = useAlerts();
  const { data } = useSuspenseQuery(
    graphql(`
      query NewListing_Query {
        user {
          user {
            id
            organizations {
              id
              name
            }
          }
        }
      }
    `)
  );

  if (!data.user.user) return notFound();
  const { organizations } = data.user.user;
  if (organizations.length <= 0) return notFound();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NewListingForm>({
    defaultValues: {
      organizationId: data.user.user.organizations[0].id,
    },
    resolver: yupResolver(schema),
  });

  const [createListing] = useMutation(
    graphql(`
      mutation NewListing_CreateListingMutation($data: CreateListingInput!) {
        createListing(data: $data) {
          listing {
            id
            name
            description
            closesAt
            organization {
              id
              name
            }
            applicationUrl
          }
        }
      }
    `),
    {
      onCompleted(data) {
        notify({
          message: "Vervutlysning opprettet",
          type: "success",
        });
        router.push(`/listings/${data.createListing.listing.id}`);
      },
      onError(error) {
        notify({
          title: "Kunne ikke opprette vervutlysning",
          message: error.message,
          type: "error",
        });
      },
    }
  );

  async function onSubmit(data: NewListingForm) {
    const { organizationId, name, description, closesAt, applicationUrl } = data;
    await createListing({
      variables: {
        data: {
          applicationUrl,
          name,
          description,
          closesAt: closesAt.toISOString(),
          organizationId,
        },
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register("name")}
        required
        label="Navn"
        error={Boolean(errors.name)}
        helperText={errors.name?.message ?? " "}
      />
      <TextField
        {...register("applicationUrl")}
        required
        label="Søknadslenke"
        error={Boolean(errors.applicationUrl)}
        helperText={errors.applicationUrl?.message ?? " "}
        type="url"
      />
      <TextField
        {...register("closesAt")}
        required
        label="Søknadsfrist"
        error={Boolean(errors.closesAt)}
        helperText={errors.closesAt?.message ?? " "}
        type="datetime-local"
        InputLabelProps={{ shrink: true }}
      />
      <Controller
        control={control}
        name="organizationId"
        render={({ field }) => (
          <FormControl variant="filled" required fullWidth error={Boolean(errors.organizationId)}>
            <InputLabel>Forening</InputLabel>
            <Select {...field} native>
              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
            </Select>
            <FormHelperText error={Boolean(errors.organizationId)}>
              {errors.organizationId?.message ?? " "}
            </FormHelperText>
          </FormControl>
        )}
      />
      <TextField
        {...register("description")}
        required
        label="Beskrivelse"
        error={Boolean(errors.description)}
        helperText={errors.description?.message ?? " "}
        multiline
        fullWidth
        minRows={4}
        maxRows={10}
      />
      <Button type="submit">Lag ny vervutlysning</Button>
    </form>
  );
}

export { NewListing };
