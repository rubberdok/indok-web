import { useMutation, useQuery } from "@apollo/client";
import OrganizationEventHero from "@components/organization/OrganizationEventHero";
import AttendeeExport from "@components/pages/events/AttendeeExport";
import EmailForm from "@components/pages/events/email/EmailForm";
import EditEvent from "@components/pages/events/EventEditor";
import { ADMIN_EVENT_SIGN_OFF } from "@graphql/events/mutations";
import { ADMIN_GET_EVENT } from "@graphql/events/queries";
import { Event, SignUp } from "@interfaces/events";
import { HeaderValuePair } from "@interfaces/utils";
import { Check, Close, Edit } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Layout from "src/layouts";
import { NextPageWithLayout } from "src/pages/_app";

const signUpFields: HeaderValuePair<SignUp>[] = [
  { header: "Navn", field: "user" },
  { header: "Mobilnummer", field: "userPhoneNumber" },
  { header: "Klassetrinn", field: "userGradeYear" },
  { header: "Matpreferanser", field: "userAllergies" },
  { header: "E-post", field: "userEmail" },
];

const stringEventFields: HeaderValuePair<Event>[] = [
  { header: "Tittel", field: "title" },
  { header: "Kort beskrivelse", field: "shortDescription" },
  // { header: "Beskrivelse", field: "description" },
  { header: "Lokasjon", field: "location" },
  { header: "Tilgjengelige plasser", field: "availableSlots" },
  { header: "Krever ekstrainformasjon", field: "hasExtraInformation" },
  { header: "Bindende påmelding", field: "bindingSignup" },
];

const dateEventFields: HeaderValuePair<Event>[] = [
  { header: "Starttid", field: "startTime" },
  { header: "Slutttid", field: "endTime" },
  { header: "Påmeldingsfrist", field: "deadline" },
  { header: "Påmeldingsdato", field: "signupOpenDate" },
];

/**
 * Component for an admin panel for an event, used for viewing and editing an event as well as
 * viewing and editing users signed up (or on the waiting list) for an event
 */

const RootStyle = styled("div")(({ theme }) => ({
  margin: theme.spacing(6, 0),
}));

const EventAdminPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const eventNumberID = parseInt(eventId as string);

  const { loading, data, refetch } = useQuery<{ event: Event }, { id: number }>(ADMIN_GET_EVENT, {
    variables: { id: eventNumberID },
    skip: Number.isNaN(eventNumberID),
  });

  const [adminEventSignOff, { loading: signOffLoading, error: signOffError }] = useMutation(ADMIN_EVENT_SIGN_OFF);

  const [openEditEvent, setOpenEditEvent] = useState(false);
  const [openSignOffErrorSnackbar, setOpenSignOffErrorSnackbar] = useState(false);
  const [openSignOffSuccessSnackbar, setOpenSignOffSuccessSnackbar] = useState(false);

  if (loading) {
    return <CircularProgress />;
  }

  const renderInfo = (label: string, value: string | boolean) => {
    if (value === "") {
      return;
    }
    const val = typeof value === "boolean" ? (value ? "ja" : "nei") : value;
    return (
      <Typography key={`${label}-${val}`}>
        <Box fontWeight="bold" display="inline">
          {`${label}: `}
        </Box>
        {val}
      </Typography>
    );
  };

  const handleDeleteSignUp = (userId: string) => {
    adminEventSignOff({ variables: { eventId: eventNumberID, userId: userId } })
      .then(() => {
        refetch({ id: eventNumberID });
        setOpenSignOffSuccessSnackbar(true);
      })
      .catch(() => {
        setOpenSignOffErrorSnackbar(true);
      });
  };

  const CellContent = ({ signUp, field }: { signUp: SignUp; field: HeaderValuePair<SignUp> }) => {
    if (field.header === "Navn") {
      return (
        <Typography variant="body2">
          {signUp.user.firstName} {signUp.user.lastName}
        </Typography>
      );
    }
    if (field.header === "Mobilnummer") {
      return <Typography variant="body2">{signUp.userPhoneNumber.slice(3)}</Typography>;
    }
    if (typeof signUp[field.field] == "boolean") {
      return signUp[field.field] ? <Check color="primary" /> : <Close color="error" />;
    }
    return <Typography variant="body2">{signUp[field.field] || "━"}</Typography>;
  };

  return (
    <>
      {data?.event ? (
        <>
          <OrganizationEventHero event={data.event} />
          <RootStyle>
            <Container>
              {openEditEvent && (
                <EditEvent open={openEditEvent} onClose={() => setOpenEditEvent(false)} event={data.event} />
              )}
              <Grid container direction="column" spacing={4}>
                <Grid item container spacing={5}>
                  <Grid item xs={4}>
                    <Card>
                      <CardHeader title="Generell informasjon" />
                      <CardContent>
                        <Stack spacing={2}>
                          {stringEventFields.map((headerPair: HeaderValuePair<Event>) =>
                            renderInfo(headerPair.header, data.event[headerPair.field] as string)
                          )}
                          {dateEventFields.map((headerPair: HeaderValuePair<Event>) =>
                            renderInfo(
                              headerPair.header,
                              data.event[headerPair.field]
                                ? dayjs(data.event[headerPair.field] as string).format("HH:mm DD-MM-YYYY")
                                : ""
                            )
                          )}
                          <Button variant="contained" startIcon={<Edit />} onClick={() => setOpenEditEvent(true)}>
                            Rediger
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={8}>
                    <Card>
                      <CardHeader title="Påmeldte" />
                      <CardActions>
                        {eventId ? <EmailForm eventId={eventId} /> : <CircularProgress color="primary" />}
                        <AttendeeExport eventId={eventNumberID} />
                      </CardActions>
                      <CardContent>
                        {data.event?.usersAttending?.length !== 0 ? (
                          <TableContainer style={{ maxHeight: 600 }}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  {signUpFields.map((field) => (
                                    <TableCell key={`user-header-${field.header}`}>{field.header}</TableCell>
                                  ))}
                                  {data.event.product && <TableCell>Betalt?</TableCell>}
                                  <TableCell key={`user-header-delete`} />
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {data.event?.usersAttending?.map((signUp: SignUp) => (
                                  <TableRow key={`user-row-${signUp.user.id}`}>
                                    {signUpFields.map((field) => (
                                      <TableCell key={`user-${signUp.user.id}-cell--${field.field}`}>
                                        <CellContent signUp={signUp} field={field} />
                                      </TableCell>
                                    ))}
                                    {data.event.product && (
                                      <TableCell>
                                        {signUp.hasBoughtTicket ? <Check color="primary" /> : <Close color="error" />}
                                      </TableCell>
                                    )}
                                    <TableCell>
                                      <Tooltip title="Fjern påmelding" arrow>
                                        {signOffLoading ? (
                                          <CircularProgress />
                                        ) : (
                                          <IconButton
                                            aria-label="delete"
                                            onClick={() => handleDeleteSignUp(signUp.user.id)}
                                            size="large"
                                          >
                                            <DeleteIcon fontSize="small" />
                                          </IconButton>
                                        )}
                                      </Tooltip>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <Typography align="center" variant="body1">
                            Ingen påmeldte
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs>
                    <Card>
                      <CardHeader title="Venteliste" />
                      <CardContent>
                        {data.event?.usersOnWaitingList?.length !== 0 ? (
                          <TableContainer style={{ maxHeight: 600 }}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  {signUpFields.map((field) => (
                                    <TableCell key={`user-header-${field.header}`}>{field.header}</TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {data.event?.usersOnWaitingList?.map((signUp: SignUp) => (
                                  <TableRow key={`user-row-${signUp.user.id}`}>
                                    {signUpFields.map((field) => (
                                      <TableCell key={`user-${signUp.user.id}-cell--${field.field}`}>
                                        <CellContent signUp={signUp} field={field} />
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <Typography align="center" variant="body1">
                            Ingen på venteliste
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          </RootStyle>
        </>
      ) : null}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSignOffErrorSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSignOffErrorSnackbar(false)}
      >
        <Alert elevation={6} variant="filled" severity="error">
          {signOffError ? signOffError.message : "Avmelding feilet"}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSignOffSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSignOffSuccessSnackbar(false)}
      >
        <Alert elevation={6} variant="filled" severity="success">
          Avmelding fullført
        </Alert>
      </Snackbar>
    </>
  );
};

EventAdminPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default EventAdminPage;
