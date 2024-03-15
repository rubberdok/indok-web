"use client";

import { useMutation, useSuspenseQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { Card, CardActions, CardContent, CardHeader, Unstable_Grid2 as Grid, Stack } from "@mui/material";
import { notFound, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useAlerts } from "@/app/components/Alerts";
import { Markdown } from "@/components";
import { graphql } from "@/gql/app";
import { EventType } from "@/gql/app/graphql";

import { BasicEventForm, BasicEventFormType, basicEventValidationSchema } from "../_components/BasicEventForm";

export default function Page() {
  const { data } = useSuspenseQuery(
    graphql(`
      query CreateBasicEventPage_Query {
        user {
          user {
            id
            organizations {
              id
              name
            }
          }
        }
        categories {
          categories {
            id
            name
          }
        }
      }
    `)
  );
  const { categories } = data.categories;
  const organizations = data.user.user?.organizations ?? [];

  const methods = useForm<BasicEventFormType>({
    resolver: zodResolver(basicEventValidationSchema),
    defaultValues: {
      organizationId: data.user.user?.organizations[0]?.id,
      startAt: new Date().toISOString(),
      endAt: new Date().toISOString(),
    },
  });

  const { watch } = methods;

  const { notify } = useAlerts();
  const router = useRouter();
  const [createEvent, { loading }] = useMutation(
    graphql(`
      mutation CreateBasicEventPage_CreateEvent($data: CreateEventInput!) {
        createEvent(data: $data) {
          event {
            id
            organization {
              id
            }
          }
        }
      }
    `),
    {
      onCompleted(data) {
        const { event } = data.createEvent;
        notify({
          type: "success",
          message: "Arrangementet ble opprettet",
        });
        router.push(`/organizations/${event.organization?.id}/admin/events/${event.id}`);
      },
      onError(error) {
        notify({
          type: "error",
          title: "Noe gikk galt, prøv igjen senere",
          message: error.message,
        });
      },
    }
  );

  const description = watch("description");
  const name = watch("name");

  if (organizations.length === 0) {
    return notFound();
  }

  function onSubmit(data: BasicEventFormType) {
    createEvent({
      variables: {
        data: {
          event: {
            name: data.name,
            description: data.description ?? null,
            shortDescription: data.shortDescription ?? null,
            location: data.location ?? null,
            startAt: data.startAt,
            endAt: data.endAt ?? null,
            contactEmail: data.contactEmail ?? null,
            type: EventType.Basic,
            categories: data.categories?.map((id) => ({ id })) ?? null,
            organizationId: data.organizationId,
            signUpDetails: null,
            signUpsEnabled: false,
            signUpsRequireUserProvidedInformation: false,
            signUpsRetractable: true,
          },
        },
      },
    });
  }

  return (
    <Grid container direction="row" spacing={2}>
      <Grid md={6} xs={12}>
        <Card>
          <CardContent>
            <BasicEventForm
              id="basic-event-form"
              onSubmit={onSubmit}
              defaultValues={{ organizationId: organizations[0]?.id }}
              categories={categories}
              organizations={organizations}
            />
          </CardContent>
          <CardActions>
            <Stack direction="row" justifyContent="flex-end" width="1">
              <LoadingButton loading={loading} type="submit" form="basic-event-form" variant="contained">
                Opprett arrangement
              </LoadingButton>
            </Stack>
          </CardActions>
        </Card>
      </Grid>
      <Grid display={{ xs: "none", md: "block" }} md={6}>
        <Card sx={{ height: 1, maxHeight: 1, overflow: "hidden" }}>
          <CardHeader title={name} />
          <CardContent>
            <Markdown>{description ?? ""}</Markdown>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
