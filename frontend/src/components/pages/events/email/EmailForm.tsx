import { useMutation, useQuery } from "@apollo/client";
import { SEND_EVENT_EMAILS } from "@graphql/events/mutations";
import { QUERY_SIGNED_UP_USERS } from "@graphql/events/queries";
import { AttendableEvent } from "@interfaces/events";
import { Box, Button, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import EmailFormDialog from "./EmailFormDialog";
import ConfirmationDialog from "./ConfirmationsDialog";

export interface EmailFormProps {
  eventId: string | string[] | undefined;
}

export interface SendEmailProps {
  receiverEmails: string[];
  content: string;
  subject: string;
}

const defaultMailProps: SendEmailProps = {
  receiverEmails: [],
  content: "",
  subject: "",
};

const defaultValidations: { subject: boolean; content: boolean } = {
  subject: false,
  content: false,
};

const EmailForm: React.FC<EmailFormProps> = ({ eventId }) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [emailProps, setEmailProps] = useState<SendEmailProps>(defaultMailProps);
  const [validations, setValidations] = useState(defaultValidations);

  const { data } = useQuery<{ event: AttendableEvent }>(QUERY_SIGNED_UP_USERS, {
    variables: { id: eventId },
  });

  const [sendEventMail] = useMutation(SEND_EVENT_EMAILS);

  useEffect(() => {
    const signUps = data?.event.usersAttending;

    if (data?.event && signUps) {
      setEmailProps({ ...emailProps, receiverEmails: signUps.map((signUp) => signUp.userEmail) });
    }
  }, [data]);

  const sendEmail = () => {
    sendEventMail({ variables: { eventId, ...emailProps } });
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

  return (
    <>
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
        disableHoverListener={data?.event.isAttendable}
        title="Du kan kun sende mail hvis det er mulig å melde seg på eventet."
        placement="bottom-start"
      >
        <Box>
          <Button disabled={!data?.event.isAttendable} onClick={() => setShowEmailForm(true)} color="primary">
            <SendIcon style={{ margin: "5px" }} />
            Send e-post til alle påmeldte
          </Button>
        </Box>
      </Tooltip>
    </>
  );
};

export default EmailForm;
