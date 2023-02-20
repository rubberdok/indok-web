import { useMutation } from "@apollo/client";
import { Check, Close, DeleteForeverRounded } from "@mui/icons-material";
import {
  Alert,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { AdminEventDocument, AdminEventSignOffDocument, SignUpWithTicketFragment } from "@/generated/graphql";

type Props = {
  attendees: SignUpWithTicketFragment[];
  tickets?: boolean;
  eventId: string;
};

export const AttendeeTable: React.FC<Props> = ({ attendees, tickets, eventId }) => {
  const [alert, setAlert] = useState<"success" | "error" | false>(false);

  const [signOffUser] = useMutation(AdminEventSignOffDocument, {
    onCompleted() {
      setAlert("success");
    },
    onError() {
      setAlert("error");
    },
    refetchQueries: [{ query: AdminEventDocument }],
    awaitRefetchQueries: true,
  });

  return (
    <>
      {alert && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={Boolean(alert)}
          autoHideDuration={6000}
          onClose={() => setAlert(false)}
        >
          <Alert elevation={6} variant="filled" severity={alert}>
            {alert === "success" ? "Brukeren ble fjernet fra arrangementet" : "Noe gikk galt"}
          </Alert>
        </Snackbar>
      )}
      <Table>
        <TableHead>
          <TableRow>
            {tickets && <TableCell>Betalt</TableCell>}
            <TableCell>Navn</TableCell>
            <TableCell>Klassetrinn</TableCell>
            <TableCell>Matpreferanser</TableCell>
            <TableCell>Mobilnummer</TableCell>
            <TableCell>
              <Typography variant="inherit" noWrap>
                E-mail
              </Typography>
            </TableCell>
            <TableCell>Ekstra informasjon</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {attendees.map((attendee) => (
            <TableRow key={attendee.user.id}>
              {tickets && (
                <TableCell>{attendee.hasBoughtTicket ? <Check color="success" /> : <Close color="error" />}</TableCell>
              )}
              <TableCell>
                <Typography variant="inherit" noWrap>
                  {attendee.user.firstName} {attendee.user.lastName}
                </Typography>
              </TableCell>
              <TableCell>{attendee.userGradeYear}</TableCell>
              <TableCell>{attendee.userAllergies}</TableCell>
              <TableCell>{attendee.userPhoneNumber}</TableCell>
              <TableCell>{attendee.userEmail}</TableCell>
              <TableCell>
                <Typography maxWidth="20rem" noWrap textOverflow="ellipsis" variant="inherit">
                  {attendee.extraInformation}
                </Typography>
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() =>
                    signOffUser({
                      variables: {
                        userId: attendee.user.id,
                        eventId: eventId,
                      },
                    })
                  }
                >
                  <DeleteForeverRounded color="warning" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
