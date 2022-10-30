import { useMutation, useQuery } from "@apollo/client";
import { ErrorOutline } from "@mui/icons-material";
import {
  PlaceOutlined,
  CreditCardRounded,
  MailOutline,
  SettingsRounded,
  SchoolRounded,
  CreateRounded,
  WidgetsOutlined,
  CalendarTodayOutlined,
} from "@mui/icons-material";
import {
  Alert as MuiAlert,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Container,
  Grid,
  Hidden,
  LinearProgress,
  Paper,
  Snackbar as MuiSnackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import { PermissionRequired } from "@/components/Auth";
import { LoginRequired } from "@/components/Auth/LoginRequired";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LabeledIcon } from "@/components/LabeledIcon";
import * as components from "@/components/MarkdownForm/components";
import {
  EventDocument,
  EventSignOffDocument,
  EventSignUpDocument,
  ServerTimeDocument,
  UserWithEventsAndOrgsDocument,
} from "@/generated/graphql";
import { calendarFile } from "@/utils/calendars";

import { CountdownButton } from "./CountdownButton";
import { EditEvent } from "./EditEvent";

type AlertProps = {
  open: boolean;
  onClose: () => void | undefined;
  severity: "success" | "info" | "warning" | "error";
};

const Alert: React.FC<React.PropsWithChildren<AlertProps>> = ({ open, onClose, children, severity }) => {
  return (
    <MuiSnackbar
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      onClose={onClose}
    >
      <MuiAlert elevation={6} variant="filled" severity={severity}>
        {children}
      </MuiAlert>
    </MuiSnackbar>
  );
};

type Props = {
  eventId: string;
};

export const EventDetails: React.FC<Props> = ({ eventId }) => {
  const [openSignUpSnackbar, setOpenSignUpSnackbar] = useState(false);
  const [openSignOffSnackbar, setOpenSignOffSnackbar] = useState(false);
  const [openOnWaitingListSnackbar, setOpenOnWaitingListSnackbar] = useState(false);
  const [openOffWaitingListSnackbar, setOpenOffWaitingListSnackbar] = useState(false);
  const [openSignUpErrorSnackbar, setOpenSignUpErrorSnackbar] = useState(false);
  const [openSignOffErrorSnackbar, setOpenSignOffErrorSnackbar] = useState(false);
  const [extraInformation, setExtraInformation] = useState<string>();
  const router = useRouter();

  const [eventSignUp, { loading: signUpLoading, error: signUpError }] = useMutation(EventSignUpDocument);

  const [eventSignOff, { loading: signOffLoading }] = useMutation(EventSignOffDocument);

  const { data: userData } = useQuery(UserWithEventsAndOrgsDocument);

  const { data: timeData } = useQuery(ServerTimeDocument, { fetchPolicy: "network-only" });

  const {
    data: eventData,
    error: eventError,
    loading: eventLoading,
    refetch: refetchEventData,
  } = useQuery(EventDocument, { variables: { id: eventId } });

  const [openEditEvent, setOpenEditEvent] = useState(false);

  if (eventLoading) return <LinearProgress variant="indeterminate" sx={{ width: 1, mb: "100vh" }} />;

  if (eventError) return <p>Error :(</p>;

  if (!eventData || !eventData.event || !userData)
    return <Typography variant="body1">Kunne ikke laste arrangementet</Typography>;

  const event = eventData.event;
  const user = userData.user;

  const handleClick = () => {
    if (!user) return;
    if (event.userAttendance?.isSignedUp) {
      eventSignOff({ variables: { eventId } })
        .then(() => {
          refetchEventData({ id: eventId });
          setOpenSignOffSnackbar(true);
        })
        .catch(() => {
          setOpenSignOffErrorSnackbar(true);
        });
      return;
    }
    if (event.userAttendance?.isOnWaitingList) {
      eventSignOff({ variables: { eventId } })
        .then(() => {
          refetchEventData({ id: eventId });
          setOpenOffWaitingListSnackbar(true);
        })
        .catch(() => {
          setOpenSignOffErrorSnackbar(true);
        });
      return;
    }
    eventSignUp({ variables: { eventId, extraInformation } })
      .then(() => {
        refetchEventData({ id: eventId }).then((res) => {
          res.data.event?.userAttendance?.isSignedUp ? setOpenSignUpSnackbar(true) : setOpenOnWaitingListSnackbar(true);
        });
      })
      .catch(() => {
        setOpenSignUpErrorSnackbar(true);
      });
  };

  return (
    <>
      {openEditEvent && <EditEvent open={openEditEvent} onClose={() => setOpenEditEvent(false)} event={event} />}
      <Box width="100%" py={5} bgcolor="background.elevated" pb={{ xs: 5, md: 10 }}>
        <Container>
          <Breadcrumbs
            sx={{ mb: { xs: 5, md: 8 } }}
            links={[{ name: "Hjem", href: "/" }, { name: "Arrangementer", href: "/events" }, { name: event.title }]}
          />
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 5, md: 10 }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start ", md: "center" }}
          >
            <Stack spacing={2} alignItems="flex-start">
              <Typography variant="h2">{event.title}</Typography>
              <Typography variant="subtitle1" display="block" color="text.secondary">
                Arrangert av {event.organization?.name}
              </Typography>
            </Stack>

            {!event.isAttendable ? null : !user ? (
              <LoginRequired redirect />
            ) : user.gradeYear && !event.allowedGradeYears?.includes(user.gradeYear) ? (
              <Typography variant="h5">Ikke aktuell</Typography>
            ) : (
              <>
                <PermissionRequired permission="events.add_signup">
                  {!user.phoneNumber && !event.userAttendance?.isSignedUp && !event.userAttendance?.isOnWaitingList && (
                    <MuiAlert severity="error">
                      Du må oppgi et telefonnummer på brukeren din for å kunne melde deg på
                    </MuiAlert>
                  )}

                  {event.hasExtraInformation &&
                    !event.userAttendance?.isSignedUp &&
                    !event.userAttendance?.isOnWaitingList && (
                      <TextField
                        label="Ekstrainformasjon"
                        multiline
                        rows={2}
                        required
                        placeholder="Skriv her..."
                        onChange={(e) => setExtraInformation(e.target.value)}
                      />
                    )}
                  {timeData?.serverTime && event.deadline && dayjs(event.deadline).isAfter(dayjs()) && (
                    <Stack spacing={2}>
                      <CountdownButton
                        countDownDate={event.signupOpenDate ?? ""}
                        isSignedUp={event.userAttendance?.isSignedUp ?? false}
                        isOnWaitingList={event.userAttendance?.isOnWaitingList ?? false}
                        isFull={event.isFull ?? false}
                        loading={signOffLoading || signUpLoading || eventLoading}
                        disabled={
                          (!user.phoneNumber &&
                            !event.userAttendance?.isSignedUp &&
                            !event.userAttendance?.isOnWaitingList) ||
                          (event.bindingSignup && event.userAttendance?.isSignedUp) ||
                          (event.hasExtraInformation &&
                            !extraInformation &&
                            !event.userAttendance?.isSignedUp &&
                            !event.userAttendance?.isOnWaitingList)
                        }
                        onClick={handleClick}
                        currentTime={timeData.serverTime}
                      />
                      {event.bindingSignup && (
                        <LabeledIcon
                          spacing={1}
                          value={
                            <Typography color="error" variant="subtitle2">
                              Bindende påmelding
                            </Typography>
                          }
                          icon={<ErrorOutline color="error" />}
                        />
                      )}
                    </Stack>
                  )}
                  {event.product &&
                    event.userAttendance?.isSignedUp &&
                    (event.userAttendance.hasBoughtTicket ? (
                      <MuiAlert severity="success">Du har betalt for billett</MuiAlert>
                    ) : (
                      <Link
                        href={`/ecommerce/checkout?productId=${event.product.id}&quantity=1&redirect=${router.asPath}`}
                        passHref
                      >
                        <Button size="large" variant="contained" color={"primary"}>
                          Gå til betaling
                        </Button>
                      </Link>
                    ))}
                </PermissionRequired>
              </>
            )}
          </Stack>
        </Container>
      </Box>
      <Container sx={{ pb: 6, mt: (theme) => theme.spacing(4) }}>
        {user?.organizations.map((organization) => organization.id).includes(event.organization.id) && (
          <Paper
            sx={{
              py: 2,
              px: { xs: 0, md: 3 },
              bgcolor: { md: "secondary.main" },
              mb: { md: 5 },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Hidden smDown>
              <Typography variant="h5" color="secondary.darker">
                Administrer
              </Typography>
            </Hidden>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="contrast"
                startIcon={<CreateRounded />}
                onClick={() => {
                  setOpenEditEvent(true);
                }}
              >
                Rediger
              </Button>
              <Link href={`/orgs/${event.organization.id}/events/${eventId}`} passHref>
                <Button variant="contained" color="contrast" startIcon={<SettingsRounded />}>
                  Administrer
                </Button>
              </Link>
            </Stack>
          </Paper>
        )}
        <Grid container spacing={8}>
          {/* Description card */}
          <Grid item xs={12} md={8}>
            <Typography variant="h3" mb={3}>
              Beskrivelse
            </Typography>
            <ReactMarkdown components={components}>{event.description}</ReactMarkdown>
          </Grid>

          {/* Information card */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Informasjon" />
              <Stack sx={{ m: 3 }} spacing={2}>
                {event.price && (
                  <LabeledIcon
                    spacing={2}
                    alignItems="flex-start"
                    icon={<CreditCardRounded />}
                    value={
                      <Stack>
                        <Typography variant="subtitle2">Pris</Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {event.price}
                        </Typography>
                      </Stack>
                    }
                  />
                )}
                {event.location && (
                  <LabeledIcon
                    spacing={2}
                    alignItems="flex-start"
                    icon={<PlaceOutlined />}
                    value={
                      <Stack>
                        <Typography variant="subtitle2">Sted</Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {event.location}
                        </Typography>
                      </Stack>
                    }
                  />
                )}
                {event.category && (
                  <LabeledIcon
                    spacing={2}
                    alignItems="flex-start"
                    icon={<WidgetsOutlined />}
                    value={
                      <Stack>
                        <Typography variant="subtitle2">Kategori</Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {event.category?.name}
                        </Typography>
                      </Stack>
                    }
                  />
                )}
                {event.contactEmail && (
                  <LabeledIcon
                    spacing={2}
                    alignItems="flex-start"
                    icon={<MailOutline />}
                    value={
                      <Stack>
                        <Typography variant="subtitle2">Kontakt</Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {event.contactEmail}
                        </Typography>
                      </Stack>
                    }
                  />
                )}

                <LabeledIcon
                  spacing={2}
                  alignItems="flex-start"
                  icon={<CalendarTodayOutlined />}
                  value={
                    <Stack>
                      <Typography variant="subtitle2">Starter</Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {dayjs(event.startTime).format("LLLL")}
                      </Typography>
                    </Stack>
                  }
                />

                {event.endTime && (
                  <LabeledIcon
                    spacing={2}
                    alignItems="flex-start"
                    icon={<CalendarTodayOutlined />}
                    value={
                      <Stack>
                        <Typography variant="subtitle2">Slutter</Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {dayjs(event.endTime).format("LLLL")}
                        </Typography>
                      </Stack>
                    }
                  />
                )}
                {event.allowedGradeYears && event.allowedGradeYears.length < 5 && (
                  <LabeledIcon
                    spacing={2}
                    alignItems="flex-start"
                    icon={<SchoolRounded />}
                    value={
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2">Åpent for trinn</Typography>
                        <Stack direction="row" spacing={1}>
                          {event.allowedGradeYears.map((grade) => (
                            <Chip color="primary" key={grade} label={`${grade}.`} />
                          ))}
                        </Stack>
                      </Stack>
                    }
                  />
                )}
                <Button
                  variant="outlined"
                  color="contrast"
                  href={calendarFile(event.title, event.startTime, event.endTime, event.location, event.description)}
                  download="event.ics"
                >
                  Last ned i kalender
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
      {/* Alerts */}
      <Alert severity="error" open={openSignUpErrorSnackbar} onClose={() => setOpenSignUpErrorSnackbar(false)}>
        {signUpError ? signUpError.message : "Påmelding feilet"}
      </Alert>

      <Alert open={openSignOffErrorSnackbar} severity="error" onClose={() => setOpenSignUpErrorSnackbar(false)}>
        Avmelding feilet
      </Alert>

      <Alert severity="info" open={openSignOffSnackbar} onClose={() => setOpenSignOffSnackbar(false)}>
        Du er nå avmeldt
      </Alert>

      <Alert severity="success" open={openSignUpSnackbar} onClose={() => setOpenSignUpSnackbar(false)}>
        Du er nå påmeldt
      </Alert>

      <Alert severity="info" open={openOnWaitingListSnackbar} onClose={() => setOpenOnWaitingListSnackbar(false)}>
        Du er på ventelisten
      </Alert>

      <Alert severity="info" open={openOffWaitingListSnackbar} onClose={() => setOpenOffWaitingListSnackbar(false)}>
        Du er ikke lenger på ventelisten
      </Alert>
    </>
  );
};
