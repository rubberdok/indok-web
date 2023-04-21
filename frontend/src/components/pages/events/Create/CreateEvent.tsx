import { useMutation } from "@apollo/client";
import { Alert, Snackbar } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

import { AllEventsDocument, CreateEventDocument } from "@/generated/graphql";

import { EventForm, IEventForm, Organization } from "../EventForm";

type Props = {
  organizations: Organization[];
};

export const CreateEvent: React.FC<Props> = ({ organizations }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [createEvent] = useMutation(CreateEventDocument, {
    update(cache, { data }) {
      const event = data?.createEvent?.event;
      if (event) {
        cache.updateQuery({ query: AllEventsDocument }, (prev) => {
          return {
            ...prev,
            allEvents: [...(prev?.allEvents ?? []), event],
          };
        });
      }
    },
    onCompleted(data) {
      if (data?.createEvent?.event) {
        router.push(`/events/${data.createEvent.event.id}`);
      }
    },
    onError() {
      setOpen(true);
    },
  });

  function handleCreateEvent(data: IEventForm) {
    createEvent({
      variables: {
        eventData: {
          title: data.info.title,
          description: data.info.description,
          contactEmail: data.info.contactEmail,
          location: data.timeAndPlace.location,
          startTime: data.timeAndPlace.start.toISOString(),
          endTime: data.timeAndPlace.end.toISOString(),
          shortDescription: data.info.shortDescription,
          categoryId: data.info.category || null,
          isAttendable: data.registration.variant !== "closed",
          organizationId: data.info.organizer,
          allowedGradeYears: data.info.gradeYears?.length ? data.info.gradeYears : undefined,
          ...(data.registration.variant !== "closed"
            ? {
                bindingSignup: data.registration.variant === "binding",
                signupOpenDate: data.registration.details.signUpOpen?.toISOString(),
                deadline: data.registration.details.deadline?.toISOString(),
                availableSlots: data.registration.details.availableSeats,
                hasExtraInformation: data.registration.details.requiresExtraInformation,
              }
            : {}),
        },
      },
    });
  }

  return (
    <>
      {open && (
        <Snackbar
          open={open}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          onClose={() => setOpen(false)}
          autoHideDuration={6000}
        >
          <Alert severity="error">Noe gikk galt</Alert>
        </Snackbar>
      )}
      <EventForm
        title="Nytt arrangement"
        submitText="Lag arrangement"
        onSubmit={handleCreateEvent}
        organizations={organizations}
      />
    </>
  );
};
