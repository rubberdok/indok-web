import { ResultOf } from "@graphql-typed-document-node/core";
import { Edit, MailRounded } from "@mui/icons-material";
import { Alert, Button, Card, CardContent, CardHeader, Snackbar, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";

import { AttendeeExport } from "@/components/pages/events/AttendeeExport";
import { EditEvent } from "@/components/pages/events/EditEvent";
import { AdminEventDocument } from "@/generated/graphql";

import { EmailDialog } from "./EmailDialog";

type Props = {
  event: NonNullable<ResultOf<typeof AdminEventDocument>["event"]>;
};

type DescriptionProps = {
  name: string;
  value?: string | number | boolean | null;
};

const Description: React.FC<DescriptionProps> = ({ name, value }) => {
  if (!value) return null;

  return (
    <Stack spacing={6} direction="row" justifyContent="space-between">
      <Typography variant="subtitle1">{name}</Typography>
      <Typography variant="body1">{value}</Typography>
    </Stack>
  );
};

export const EventInformation: React.FC<Props> = ({ event }) => {
  const [openModal, setOpenModal] = useState<"edit" | "email" | false>(false);
  const [alert, setAlert] = useState<"success" | "error" | false>(false);

  return (
    <>
      {openModal === "edit" && (
        <EditEvent event={event} onClose={() => setOpenModal(false)} open={openModal === "edit"} />
      )}
      {openModal === "email" && (
        <EmailDialog
          eventId={event.id}
          open={openModal === "email"}
          onClose={() => setOpenModal(false)}
          onComplete={(state) => {
            setAlert(state);
            setOpenModal(false);
          }}
        />
      )}
      {alert && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={Boolean(alert)}
          autoHideDuration={6000}
          onClose={() => setAlert(false)}
        >
          <Alert elevation={6} variant="filled" severity={alert}>
            {alert === "success" ? "E-posten ble sendt" : "Noe gikk galt"}
          </Alert>
        </Snackbar>
      )}
      <Card sx={{ width: "100%" }}>
        <CardHeader
          title={
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="inherit">Informasjon</Typography>
              <Button onClick={() => setOpenModal("edit")} startIcon={<Edit />}>
                Rediger
              </Button>
            </Stack>
          }
        />
        <CardContent>
          <Stack direction="column" spacing={1}>
            <Description name="Navn" value={event.title} />
            <Description name="Kort beskrivelse" value={event.shortDescription} />
            <Description name="Lokasjon" value={event.location} />
            <Description name="Tilgjengelige Plasser" value={event.availableSlots} />
            <Description name="Krever ekstrainformasjon" value={event.hasExtraInformation ? "Ja" : "Nei"} />
            <Description name="Bindende påmelding" value={event.bindingSignup ? "Ja" : "Nei"} />
            <Description name="Starttid" value={dayjs(event.startTime).format("LLL")} />
            <Description name="Slutttid" value={dayjs(event.endTime).format("LLL")} />
            <Description name="Påmeldingsdato" value={dayjs(event.signupOpenDate).format("LLL")} />
            <Description name="Påmeldingsfrist" value={dayjs(event.deadline).format("LLL")} />
            {event.isAttendable && (
              <>
                <Button variant="contained" endIcon={<MailRounded />} onClick={() => setOpenModal("email")}>
                  Send e-post til alle påmeldte
                </Button>
                <AttendeeExport eventId={event.id} />
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};
