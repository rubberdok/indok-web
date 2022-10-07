import { useMutation, useQuery } from "@apollo/client";
import { Check, Close, Delete, Edit } from "@mui/icons-material";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState } from "react";

import AttendeeExport from "@/components/pages/events/AttendeeExport";
import EmailForm from "@/components/pages/events/email/EmailForm";
import EditEvent from "@/components/pages/events/EventEditor";
import OrganizationEventHero from "@/components/pages/organization/OrganizationEventHero";
import { AdminEventDocument, AdminEventFragment, AdminEventSignOffDocument, SignUpFragment } from "@/generated/graphql";
import Layout from "@/layouts/Layout";
import { NextPageWithLayout } from "@/pages/_app";
import { HeaderValuePair } from "@/types/utils";

const signUpFields: HeaderValuePair<SignUpFragment>[] = [
  { header: "Navn", field: "user" },
  { header: "Mobilnummer", field: "userPhoneNumber" },
  { header: "Klassetrinn", field: "userGradeYear" },
  { header: "Matpreferanser", field: "userAllergies" },
  { header: "E-post", field: "userEmail" },
];

const stringEventFields: HeaderValuePair<AdminEventFragment>[] = [
  { header: "Tittel", field: "title" },
  { header: "Kort beskrivelse", field: "shortDescription" },
  // { header: "Beskrivelse", field: "description" },
  { header: "Lokasjon", field: "location" },
  { header: "Tilgjengelige plasser", field: "availableSlots" },
  { header: "Krever ekstrainformasjon", field: "hasExtraInformation" },
  { header: "Bindende påmelding", field: "bindingSignup" },
];

const dateEventFields: HeaderValuePair<AdminEventFragment>[] = [
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
  const eventIdString = eventId as string;

  const { loading, data, refetch } = useQuery(AdminEventDocument, {
    variables: { id: eventIdString },
    skip: Number.isNaN(parseInt(eventIdString)),
  });

  const [adminEventSignOff, { loading: signOffLoading, error: signOffError }] = useMutation(AdminEventSignOffDocument);

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
    adminEventSignOff({ variables: { eventId: eventIdString, userId: userId } })
      .then(() => {
        refetch({ id: eventIdString });
        setOpenSignOffSuccessSnackbar(true);
      })
      .catch(() => {
        setOpenSignOffErrorSnackbar(true);
      });
  };

  const CellContent = ({ signUp, field }: { signUp: SignUpFragment; field: HeaderValuePair<SignUpFragment> }) => {
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
                          {stringEventFields.map(
                            (headerPair) =>
                              data.event && renderInfo(headerPair.header, data.event[headerPair.field] as string)
                          )}
                          {dateEventFields.map(
                            (headerPair) =>
                              data.event &&
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
                        {eventId ? <EmailForm eventId={eventIdString} /> : <CircularProgress color="primary" />}
                        <AttendeeExport eventId={eventIdString} />
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
                                {data.event?.usersAttending?.map((signUp) => (
                                  <TableRow key={`user-row-${signUp.user.id}`}>
                                    {signUpFields.map((field) => (
                                      <TableCell key={`user-${signUp.user.id}-cell--${field.field}`}>
                                        <CellContent signUp={signUp} field={field} />
                                      </TableCell>
                                    ))}
                                    {data.event?.product && (
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
                                            <Delete fontSize="small" />
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
                                {data.event?.usersOnWaitingList?.map((signUp) => (
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
