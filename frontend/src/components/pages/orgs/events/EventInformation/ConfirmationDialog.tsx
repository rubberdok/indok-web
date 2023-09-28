import { useMutation } from "@apollo/client";
import { EmailRounded } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";

import { SendEventMailsDocument } from "@/generated/graphql";

import { EmailForm } from "./EmailDialog";

export type SendEmailProps = {
  receiverEmails: string[];
  content: string;
  subject: string;
};

type Props = {
  eventId: string;
  onClose: () => void;
  onComplete: (state: "success" | "error") => void;
  open: boolean;
  receiverEmails: string[];
};

export const ConfirmationDialog: React.FC<Props> = ({ eventId, onClose, onComplete, open, receiverEmails }) => {
  const [sendEmail] = useMutation(SendEventMailsDocument, {
    onCompleted() {
      onComplete("success");
    },
    onError() {
      onComplete("error");
    },
  });
  const { getValues } = useFormContext<EmailForm>();

  const handleConfirm = () => {
    sendEmail({
      variables: {
        eventId,
        receiverEmails,
        subject: getValues("subject"),
        content: getValues("content"),
      },
    });
    onClose();
  };

  if (open) {
    return (
      <Dialog open={open}>
        <DialogTitle>Bekreftelse</DialogTitle>
        <DialogContent>
          <Typography>Er du sikker på at du vil sende e-post til {receiverEmails.length} mottakere?</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => onClose()}>
            Avbryt
          </Button>
          <Button variant="contained" endIcon={<EmailRounded />} onClick={() => handleConfirm()}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return null;
};
