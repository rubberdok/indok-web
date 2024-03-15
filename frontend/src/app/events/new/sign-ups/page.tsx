"use client";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { LoadingButton } from "@mui/lab";
import { Button, Card, CardActions, CardContent, Stack, Step, StepLabel, Stepper } from "@mui/material";
import { notFound } from "next/navigation";
import { useState } from "react";

import { graphql } from "@/gql/app";
import { EventType } from "@/gql/app/graphql";

import { BasicEventForm, BasicEventFormType } from "../_components/BasicEventForm";
import { SignUpForm, SignUpFormType } from "../_components/SignUpForm";

export default function Page() {
  const [basicEventData, setBasicEventData] = useState<BasicEventFormType | null>(null);
  const [createSignUpEvent] = useMutation(
    graphql(`
      mutation CreateSignUpEventPage_CreateEvent($data: CreateEventInput!) {
        createEvent(data: $data) {
          event {
            id
            name
          }
        }
      }
    `)
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

  const organizations = data.user.user?.organizations ?? [];
  if (!organizations.length) return notFound();
  const categories = data.categories.categories;

  function onSubmit(data: SignUpFormType) {
    if (basicEventData === null) return setStep(0);
    createSignUpEvent({
      variables: {
        data: {
          event: {
            type: EventType.SignUps,
            signUpsEnabled: true,
            categories: basicEventData.categories?.map((id) => ({ id: id })) ?? null,
            contactEmail: basicEventData.contactEmail ?? null,
            description: basicEventData.description ?? null,
            endAt: basicEventData.endAt,
            location: basicEventData.location ?? null,
            name: basicEventData.name,
            organizationId: basicEventData.organizationId,
            shortDescription: basicEventData.shortDescription ?? null,
            startAt: basicEventData.startAt,
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
          {step === 0 && (
            <BasicEventForm
              id="basic-event-form"
              defaultValues={
                basicEventData
                  ? basicEventData
                  : {
                      organizationId: organizations[0].id,
                    }
              }
              organizations={organizations}
              categories={categories}
              onSubmit={(values) => {
                setBasicEventData(values);
                setStep(1);
              }}
            />
          )}

          {step === 1 && (
            <SignUpForm
              id="sign-up-event-form"
              defaultValues={{
                signUpsEndAt: new Date().toISOString(),
                signUpsStartAt: new Date().toISOString(),
              }}
              onSubmit={onSubmit}
            />
          )}
        </Stack>
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
              <LoadingButton type="submit" variant="contained" form="sign-up-event-form">
                Opprett arrangement
              </LoadingButton>
            </>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
}
