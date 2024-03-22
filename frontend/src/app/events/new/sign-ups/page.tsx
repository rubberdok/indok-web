"use client";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Unstable_Grid2 as Grid,
  CardHeader,
} from "@mui/material";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";

import { graphql } from "@/gql/app";
import { EventType } from "@/gql/app/graphql";

import { useAlerts } from "@/app/components/Alerts";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { BasicEventForm, BasicEventFormType, basicEventValidationSchema } from "../_components/BasicEventForm";
import { SignUpForm, SignUpFormType, signUpEventValidationSchema } from "../_components/SignUpForm";
import { Markdown } from "@/app/_components/Markdown";
import dayjs from "@/lib/date";

export default function Page() {
  const [basicFormData, setBasicFormData] = useState<BasicEventFormType | null>(null);
  const router = useRouter();
  const { notify } = useAlerts();
  const [createSignUpEvent, { loading }] = useMutation(
    graphql(`
      mutation CreateSignUpEventPage_CreateEvent($data: CreateEventInput!) {
        createEvent(data: $data) {
          event {
            id
            name
            organization {
              id
            }
          }
        }
      }
    `),
    {
      onCompleted(data) {
        const organizationId = data.createEvent.event.organization?.id;
        notify({ message: "Arrangementet ble opprettet", type: "success" });
        router.push(`/organizations/${organizationId}/admin/events/${data.createEvent.event.id}`);
      },
      onError(error) {
        notify({ message: error.message, title: "Noe gikk galt", type: "error" });
      },
    }
  );

  const { data } = useSuspenseQuery(
    graphql(`
      query CreateSignUpEventPage_Query {
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
  const [step, setStep] = useState(0);
  const basicEventForm = useForm<BasicEventFormType>({
    resolver: zodResolver(basicEventValidationSchema),
    defaultValues: {
      organizationId: data.user.user?.organizations[0]?.id,
      startAt: dayjs().add(1, "day").set("hour", 18).set("minute", 0).format("YYYY-MM-DDTHH:mm"),
      endAt: dayjs().add(1, "day").set("hour", 20).set("minute", 0).format("YYYY-MM-DDTHH:mm"),
    },
  });
  const signUpForm = useForm<SignUpFormType>({
    resolver: zodResolver(signUpEventValidationSchema),
    defaultValues: {
      signUpsEndAt: dayjs().add(1, "day").set("hour", 18).set("minute", 0).format("YYYY-MM-DDTHH:mm"),
      signUpsStartAt: dayjs().format("YYYY-MM-DDTHH:mm"),
      slots: [{ capacity: 0 }],
    },
  });

  const organizations = data.user.user?.organizations ?? [];
  if (!organizations.length) return notFound();
  const categories = data.categories.categories;

  const name = basicEventForm.watch("name");
  const description = basicEventForm.watch("description");
  const organization = organizations.find((organization) => organization.id === basicEventForm.watch("organizationId"));

  function onSubmit(data: SignUpFormType) {
    if (!basicFormData) return setStep(0);
    const { categories, contactEmail, description, endAt, location, name, organizationId, shortDescription, startAt } =
      basicFormData;
    createSignUpEvent({
      variables: {
        data: {
          event: {
            type: EventType.SignUps,
            signUpsEnabled: true,
            categories: categories?.map((category) => ({ id: category })) ?? null,
            contactEmail: contactEmail ?? null,
            description: description ?? null,
            endAt: new Date(endAt).toISOString(),
            location: location ?? null,
            name: name,
            organizationId: organizationId,
            shortDescription: shortDescription ?? null,
            startAt: new Date(startAt).toISOString(),
            signUpsRetractable: data.signUpsRetractable,
            signUpsRequireUserProvidedInformation: data.signUpsRequireUserProvidedInformation,
            signUpDetails: {
              tickets: null,
              capacity: data.capacity,
              signUpsEndAt: data.signUpsEndAt,
              slots: data.advancedSlotDistribution
                ? data.slots.map((slot) => ({
                    capacity: slot.capacity,
                    gradeYears: slot.gradeYears ?? null,
                  }))
                : [{ capacity: data.capacity, gradeYears: null }],
              signUpsStartAt: data.signUpsStartAt,
            },
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
            <Stack direction="column" spacing={4}>
              <Stepper activeStep={step} alternativeLabel>
                <Step>
                  <StepLabel>Om arrangementet</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Påmelding og plassfordeling</StepLabel>
                </Step>
              </Stepper>
            </Stack>
          </CardContent>
          <CardContent>
            {step === 0 && (
              <FormProvider {...basicEventForm}>
                <form
                  id="basic-event-form"
                  onSubmit={basicEventForm.handleSubmit((data) => {
                    setBasicFormData(data);
                    setStep(1);
                  })}
                >
                  <BasicEventForm organizations={organizations} categories={categories} />
                </form>
              </FormProvider>
            )}
            {step === 1 && (
              <FormProvider {...signUpForm}>
                <form id="sign-up-event-form" onSubmit={signUpForm.handleSubmit(onSubmit)}>
                  <SignUpForm />
                </form>
              </FormProvider>
            )}
          </CardContent>
          <CardActions>
            <Stack direction="row" width="1" justifyContent="flex-end" spacing={2}>
              {step === 0 && (
                <Button variant="contained" type="submit" form="basic-event-form">
                  Neste
                </Button>
              )}
              {step === 1 && (
                <>
                  <Button variant="text" onClick={() => setStep(0)}>
                    Tilbake
                  </Button>
                  <LoadingButton type="submit" loading={loading} variant="contained" form="sign-up-event-form">
                    Opprett arrangement
                  </LoadingButton>
                </>
              )}
            </Stack>
          </CardActions>
        </Card>
      </Grid>
      <Grid display={{ xs: "none", md: "block" }} md={6}>
        <Card sx={{ height: 1, maxHeight: 1, overflow: "hidden" }}>
          <CardHeader title={name} subheader={`Arrangeres av ${organization?.name}`} />
          <CardContent>
            <Markdown>{description ?? ""}</Markdown>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
