import { useMutation, useQuery } from "@apollo/client";
import { Close, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { EventSignUpsDocument, SendEventMailsDocument } from "@/generated/graphql";

import { ConfirmationDialog } from "./ConfirmationsDialog";
import { EmailFormDialog } from "./EmailFormDialog";

export type SendEmailProps = {
  receiverEmails: string[];
  content: string;
  subject: string;
};

const defaultMailProps: SendEmailProps = {
  receiverEmails: [],
  content: "",
  subject: "",
};

const defaultValidations: { subject: boolean; content: boolean } = {
  subject: false,
  content: false,
};

type Props = {
  eventId: string;
  onClose: () => void;
  open: boolean;
};

export const EmailDialog: React.FC<React.PropsWithChildren<Props>> = ({ eventId, onClose, open }) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [emailProps, setEmailProps] = useState<SendEmailProps>(defaultMailProps);
  const [validations, setValidations] = useState(defaultValidations);

  const { data, loading, error } = useQuery(EventSignUpsDocument, { variables: { id: eventId } });
  const receivers = data?.event?.usersAttending?.map((signUp) => signUp.userEmail) ?? [];

  const [sendEmail] = useMutation(SendEventMailsDocument);

  useEffect(() => {
    const signUps = data?.event?.usersAttending;

    if (signUps) {
      setEmailProps({ ...emailProps, receiverEmails: signUps.map((signUp) => signUp.userEmail) });
    }
  }, [data]);

  const handleConfirmationClose = () => {
    setEmailProps({ ...emailProps, content: "", subject: "" });
    setShowConfirmation(false);
  };

  useEffect(() => {
    setValidations({ content: emailProps.content.length > 0, subject: emailProps.subject.length > 0 });
  }, [emailProps]);

  return (
    <>
      <Dialog open={open} fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">Send e-mail til alle påmeldte</Typography>
            <IconButton onClick={() => onClose()}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <TextField label="Emne" required />
            <TextField label="Innhold" required multiline rows={3} />
            <Typography variant="caption">
              Denne tjenesten er kun ment for informasjon om arrangementet. Promotering, nyhetsbrev, og lignende er ikke
              tillatt. Misbruk vil føre til utestengelse fra denne funksjonen.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => onClose()}>
            Avbryt
          </Button>
          <Button variant="contained">Send</Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        emailProps={emailProps}
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowEmailForm}
        handleConfirmationClose={handleConfirmationClose}
      />

      <EmailFormDialog
        emailProps={emailProps}
        setEmailProps={setEmailProps}
        showEmailForm={showEmailForm}
        setShowEmailForm={setShowEmailForm}
        sendEmail={sendEmail}
        validations={validations}
      />

      <Tooltip
        disableHoverListener={data?.event?.isAttendable}
        title="Du kan kun sende mail hvis det er mulig å melde seg på eventet."
        placement="bottom-start"
      >
        <Box>
          <Button disabled={!data?.event?.isAttendable} onClick={() => setShowEmailForm(true)} color="primary">
            <Send style={{ margin: "5px" }} />
            Send e-post til alle påmeldte
          </Button>
        </Box>
      </Tooltip>
    </>
  );
};
