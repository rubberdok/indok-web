import { useMutation, useQuery } from "@apollo/client";
import { SEND_EVENT_EMAILS } from "@graphql/events/mutations";
import { QUERY_SIGNED_UP_USERS } from "@graphql/events/queries";
import { Event } from "@interfaces/events";
import {
  Box,
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";

interface EmailFormProps {
  eventId: string | string[] | undefined;
}

interface SendEmailProps {
  receiverEmails: string[];
  content: string;
  subject: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    form: {
      border: "0px solid black",
    },
  })
);

const defaultMailProps: SendEmailProps = {
  receiverEmails: [],
  content: "",
  subject: "",
};

const defaultValidations: { subject: boolean; content: boolean } = {
  subject: false,
  content: false,
};

const EmailForm = ({ eventId }: EmailFormProps) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [emailProps, setEmailProps] = useState<SendEmailProps>(defaultMailProps);
  const [validations, setValidations] = useState(defaultValidations);

  const { data } = useQuery<{ event: Event }>(QUERY_SIGNED_UP_USERS, {
    variables: { id: eventId },
  });

  const [sendEventMail] = useMutation(SEND_EVENT_EMAILS);

  useEffect(() => {
    const users = data?.event.signedUpUsers;

    console.log(users);

    if (data?.event && users) {
      const availableSlots = data.event.availableSlots;
      const signedUpUsers = availableSlots && users.length >= availableSlots ? users.slice(0, availableSlots) : users;
      console.log("signed up users", signedUpUsers);
      setEmailProps({ ...emailProps, receiverEmails: signedUpUsers.map((user) => user.email) });
    }
  }, [data]);

  const sendEmail = () => {
    sendEventMail({ variables: emailProps });
    setShowConfirmation(true);
    setShowEmailForm(false);
  };

  const handleConfirmationClose = () => {
    setEmailProps({ ...emailProps, content: "", subject: "" });
    setShowConfirmation(false);
  };

  useEffect(() => {
    setValidations({ content: emailProps.content.length > 0, subject: emailProps.subject.length > 0 });
  }, [emailProps]);

  const classes = useStyles();

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={showConfirmation}
        onClose={(_e) => setShowConfirmation(false)}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Mail sendt</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <b>
              Mail sendt til følgende {emailProps.receiverEmails.length > 1 ? emailProps.receiverEmails.length : ""}{" "}
              adresse{emailProps.receiverEmails.length > 1 ? "r" : ""}:
            </b>{" "}
            <br />
            {emailProps.receiverEmails.map((email, index) => (
              <Typography key={index} component="span">
                {email}
                <br />
              </Typography>
            ))}
          </DialogContentText>
          <DialogContentText variant="body2">
            Kontakt <Link href="mailto:hswebkom@gmail.com">web@indokhs.no</Link> dersom det skulle oppstå spørsmål.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(_e) => handleConfirmationClose()} color="primary">
            <ClearIcon />
            Lukk
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="md"
        open={showEmailForm}
        onClose={(_e) => setShowEmailForm(false)}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogContent>
          <Grid
            container
            item
            sm={12}
            md={6}
            direction="column"
            spacing={3}
            className={classes.form}
            alignContent="center"
            style={{ margin: "auto" }}
          >
            <Grid item>
              <Typography variant="h5">Send en e-post til alle påmeldte</Typography>
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                required
                onChange={(e) => setEmailProps({ ...emailProps, subject: e.currentTarget.value })}
                label="Emne"
              />
            </Grid>
            <Grid item>
              <TextField
                multiline
                fullWidth
                required
                onChange={(e) => setEmailProps({ ...emailProps, content: e.currentTarget.value })}
                label="E-post-innhold"
                rows={4}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={(_e) => setShowEmailForm(false)} color="primary">
            <ClearIcon />
            Lukk
          </Button>

          <Tooltip
            disableHoverListener={Object.values(validations).every(Boolean)}
            title="Du må fylle inn alle feltene."
          >
            <Box>
              <Button
                disabled={!Object.values(validations).every(Boolean)}
                onClick={(_e) => sendEmail()}
                color="primary"
              >
                <SendIcon style={{ margin: "5px" }} />
                Send e-post
              </Button>
            </Box>
          </Tooltip>
        </DialogActions>
      </Dialog>

      <Button onClick={(_e) => setShowEmailForm(true)} variant="contained">
        Send e-post til alle påmeldte
      </Button>
    </>
  );
};

export default EmailForm;
