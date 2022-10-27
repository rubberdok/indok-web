import { useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

import { EventSignUpsDocument } from "@/generated/graphql";

import { ConfirmationDialog } from "./ConfirmationDialog";

export type SendEmailProps = {
  receiverEmails: string[];
  content: string;
  subject: string;
};

const schema = yup
  .object({
    subject: yup.string().required("Feltet må fylles ut").min(2),
    content: yup.string().required("Feltet må fylles ut").max(10000, "Maks 10 000 tegn"),
  })
  .required();

export type EmailForm = yup.InferType<typeof schema>;

type Props = {
  eventId: string;
  onClose: () => void;
  open: boolean;
  onComplete: (state: "success" | "error") => void;
};

export const EmailDialog: React.FC<React.PropsWithChildren<Props>> = ({ eventId, onClose, open, onComplete }) => {
  const [confirmation, setConfirmation] = useState(false);

  const { data, loading } = useQuery(EventSignUpsDocument, { variables: { id: eventId } });
  const receivers = data?.event?.usersAttending?.map((signUp) => signUp.userEmail) ?? [];

  const methods = useForm<EmailForm>({
    resolver: yupResolver(schema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  return (
    <>
      <FormProvider {...methods}>
        <Dialog open={open} fullWidth>
          <form onSubmit={handleSubmit(() => setConfirmation(true), console.log)}>
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">Send e-post til alle påmeldte</Typography>
                <IconButton onClick={() => onClose()}>
                  <Close />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack direction="column" spacing={2}>
                <TextField
                  {...register("subject")}
                  label="Emne"
                  required
                  error={Boolean(errors.subject)}
                  helperText={errors.subject?.message}
                />
                <TextField
                  {...register("content")}
                  label="Innhold"
                  required
                  multiline
                  rows={3}
                  error={Boolean(errors.content)}
                  helperText={errors.content?.message}
                />
                <Typography variant="caption">
                  Denne tjenesten er kun ment for informasjon om arrangementet. Promotering, nyhetsbrev, og lignende er
                  ikke tillatt. Misbruk vil føre til utestengelse fra denne funksjonen.
                </Typography>
              </Stack>
            </DialogContent>

            <DialogActions>
              <Button variant="text" onClick={() => onClose()}>
                Avbryt
              </Button>
              {loading && (
                <Skeleton>
                  <Button variant="contained">Send</Button>
                </Skeleton>
              )}
              {!loading && (
                <Button variant="contained" type="submit">
                  Send
                </Button>
              )}
            </DialogActions>
          </form>

          {confirmation && (
            <ConfirmationDialog
              eventId={eventId}
              open={confirmation}
              onClose={() => setConfirmation(false)}
              onComplete={onComplete}
              receiverEmails={receivers}
            />
          )}
        </Dialog>
      </FormProvider>
    </>
  );
};
