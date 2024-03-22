"use client";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Unstable_Grid2 as Grid,
  Stack,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";

import { graphql } from "@/gql/app";
import { EventType } from "@/gql/app/graphql";

import { Markdown } from "@/app/_components/Markdown";
import { useAlerts } from "@/app/components/Alerts";
import dayjs from "@/lib/date";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { BasicEventForm, BasicEventFormType, basicEventValidationSchema } from "../_components/BasicEventForm";
import { SignUpForm, SignUpFormType, signUpEventValidationSchema } from "../_components/SignUpForm";
import { TicketEventForm, TicketEventFormType, ticketEventFormSchema } from "../_components/TicketEventForm";

export default function Page() {
  const router = useRouter();
  const { notify } = useAlerts();
  const [basicFormData, setBasicFormData] = useState<BasicEventFormType | null>(null);
  const [signUpFormData, setSignUpFormData] = useState<SignUpFormType | null>(null);

  const [createTicketEvent, { loading }] = useMutation(
    graphql(`
      mutation CreateTicketEventPage_CreateEvent($data: CreateEventInput!) {
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
      query CreateTicketEventPage_Query {
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

        merchants {
          merchants {
            ...TicketEventForm_Merchant
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

  const ticketForm = useForm<TicketEventFormType>({
    resolver: zodResolver(ticketEventFormSchema),
    defaultValues: {
      merchantId: data.merchants.merchants[0]?.id,
      price: 100,
    },
  });

  const organizations = data.user.user?.organizations ?? [];
  if (!organizations.length) return notFound();
  const categories = data.categories.categories;

  const name = basicEventForm.watch("name");
  const description = basicEventForm.watch("description");
  const organization = organizations.find((organization) => organization.id === basicEventForm.watch("organizationId"));

  function onSubmit(data: TicketEventFormType) {
    if (!basicFormData || !signUpFormData) return setStep(0);
    const { categories, contactEmail, description, endAt, location, name, organizationId, shortDescription, startAt } =
      basicFormData;
    const {
      advancedSlotDistribution,
      capacity,
      signUpsEndAt,
      signUpsRequireUserProvidedInformation,
      signUpsRetractable,
      signUpsStartAt,
      slots,
    } = signUpFormData;

    createTicketEvent({
      variables: {
        data: {
          event: {
            type: EventType.Tickets,
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
            signUpsRetractable: signUpsRetractable,
            signUpsRequireUserProvidedInformation: signUpsRequireUserProvidedInformation,
            signUpDetails: {
              tickets: {
                merchantId: data.merchantId,
                price: data.price * 100, // Convert to øre,
              },
              capacity: capacity,
              signUpsEndAt: new Date(signUpsEndAt).toISOString(),
              slots: advancedSlotDistribution
                ? slots.map((slot) => ({
                    capacity: slot.capacity,
                    gradeYears: slot.gradeYears ?? null,
                  }))
                : [{ capacity: capacity, gradeYears: null }],
              signUpsStartAt: new Date(signUpsStartAt).toISOString(),
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
                <Step>
                  <StepLabel>Billetter</StepLabel>
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
                <form
                  id="sign-up-event-form"
                  onSubmit={signUpForm.handleSubmit((data) => {
                    setSignUpFormData(data);
                    setStep(2);
                  })}
                >
                  <SignUpForm />
                </form>
              </FormProvider>
            )}
            {step === 2 && (
              <FormProvider {...ticketForm}>
                <form id="ticket-event-form" onSubmit={ticketForm.handleSubmit(onSubmit)}>
                  <TicketEventForm merchants={data.merchants.merchants} />
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
                  <Button type="submit" variant="contained" form="sign-up-event-form">
                    Neste
                  </Button>
                </>
              )}
              {step === 2 && (
                <>
                  <Button variant="text" onClick={() => setStep(1)}>
                    Tilbake
                  </Button>
                  <LoadingButton type="submit" loading={loading} variant="contained" form="ticket-event-form">
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
