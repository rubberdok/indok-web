import { useMutation, useQuery } from "@apollo/client";
import { Settings } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { PermissionRequired } from "@/components/Auth";
import { TabPanel } from "@/components/pages/about/TabPanel";
import {
  AdminJanHusBookingsDocument,
  CreateJanhusPaymentProductDocument,
  JanHusBookingRequestsDocument,
  MarkJanhusBankIdSignedDocument,
  ReviewJanhusBookingDocument,
  ReviewJanhusBookingRequestDocument,
  StartJanhusBankIdSigningDocument,
} from "@/generated/graphql";
import { Layout, RootStyle } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

const JanHusAdminPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState<number>(0);
  const [alert, setAlert] = useState<{ severity: "success" | "error"; message: string } | undefined>();

  const { data: bookingsData, refetch: refetchBookings } = useQuery(AdminJanHusBookingsDocument);
  const { data: requestsData, refetch: refetchRequests } = useQuery(JanHusBookingRequestsDocument);

  const [requestComments, setRequestComments] = useState<Record<string, string>>({});
  const [bookingComments, setBookingComments] = useState<Record<string, string>>({});

  useEffect(() => {
    const requests = requestsData?.janhusBookingRequests;
    if (!requests) return;

    setRequestComments((current) => {
      const next = { ...current };
      requests.forEach((request) => {
        if (next[request.id] === undefined) {
          next[request.id] = request.adminComment || "";
        }
      });
      return next;
    });
  }, [requestsData]);

  useEffect(() => {
    const bookings = bookingsData?.adminJanhusBookings;
    if (!bookings) return;

    setBookingComments((current) => {
      const next = { ...current };
      bookings.forEach((booking) => {
        if (next[booking.id] === undefined) {
          next[booking.id] = booking.adminComment || "";
        }
      });
      return next;
    });
  }, [bookingsData]);

  const [reviewRequest, { loading: requestReviewing }] = useMutation(ReviewJanhusBookingRequestDocument, {
    onCompleted: async (result) => {
      const createdBookingId = result.reviewJanhusBookingRequest?.booking?.id;
      setAlert({
        severity: "success",
        message: createdBookingId
          ? `Forespørsel behandlet. Opprettet booking #${createdBookingId}.`
          : "Forespørsel behandlet.",
      });
      await Promise.all([refetchRequests(), refetchBookings()]);
    },
    onError: (error) => setAlert({ severity: "error", message: error.message }),
  });

  const [reviewBooking, { loading: bookingReviewing }] = useMutation(ReviewJanhusBookingDocument, {
    onCompleted: async () => {
      setAlert({ severity: "success", message: "Booking oppdatert." });
      await refetchBookings();
    },
    onError: (error) => setAlert({ severity: "error", message: error.message }),
  });

  const [createPaymentProduct, { loading: creatingPaymentProduct }] = useMutation(CreateJanhusPaymentProductDocument, {
    onCompleted: async (result) => {
      const productId = result.createJanhusPaymentProduct?.productId;
      setAlert({
        severity: "success",
        message: productId ? `Vipps-produkt opprettet (#${productId}).` : "Vipps-produkt håndtert.",
      });
      await refetchBookings();
    },
    onError: (error) => setAlert({ severity: "error", message: error.message }),
  });

  const [startBankIdSigning, { loading: startingBankIdSigning }] = useMutation(StartJanhusBankIdSigningDocument, {
    onCompleted: async (result) => {
      const signingUrl = result.startJanhusBankidSigning?.signing?.signingUrl;
      setAlert({
        severity: "success",
        message: signingUrl ? `BankID-signering startet: ${signingUrl}` : "BankID-signering startet.",
      });

      if (signingUrl && typeof window !== "undefined") {
        window.open(signingUrl, "_blank", "noopener,noreferrer");
      }

      await refetchBookings();
    },
    onError: (error) => setAlert({ severity: "error", message: error.message }),
  });

  const [markBankIdSigned, { loading: markingBankIdSigned }] = useMutation(MarkJanhusBankIdSignedDocument, {
    onCompleted: async () => {
      setAlert({ severity: "success", message: "Booking markert som signert." });
      await refetchBookings();
    },
    onError: (error) => setAlert({ severity: "error", message: error.message }),
  });

  const bookingRequests = useMemo(() => requestsData?.janhusBookingRequests ?? [], [requestsData]);
  const bookings = useMemo(() => bookingsData?.adminJanhusBookings ?? [], [bookingsData]);

  async function handleReviewRequest(id: string, status: "APPROVED" | "REJECTED", convertToBooking: boolean) {
    await reviewRequest({
      variables: {
        reviewData: {
          id,
          status,
          convertToBooking,
          adminComment: requestComments[id] ?? "",
        },
      },
    });
  }

  async function handleReviewBooking(id: string, status: string) {
    await reviewBooking({
      variables: {
        reviewData: {
          id,
          status,
          adminComment: bookingComments[id] ?? "",
        },
      },
    });
  }

  async function handleCreatePaymentProduct(bookingId: string, organizationId?: string) {
    await createPaymentProduct({
      variables: {
        bookingId,
        organizationId,
      },
    });
  }

  async function handleStartBankIdSigning(bookingId: string) {
    await startBankIdSigning({
      variables: {
        bookingId,
      },
    });
  }

  async function handleMarkBankIdSigned(bookingId: string) {
    await markBankIdSigned({
      variables: {
        bookingId,
      },
    });
  }

  return (
    <Container>
      <PermissionRequired permission="janhus.manage_booking">
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Box p={3}>
              <Typography variant="h3" align="center">
                JanHus adminside
              </Typography>
              <Button startIcon={<Settings />} onClick={() => router.push("/janhus/admin/settings")}>
                Innstillinger
              </Button>
            </Box>
          </Grid>
        </Grid>

        {alert ? <Alert severity={alert.severity}>{alert.message}</Alert> : null}

        <Box sx={(theme) => ({ width: "100%", overflowX: "auto", mb: theme.spacing(4) })} component="div">
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                onChange={(_e, newValue) => setTabValue(newValue)}
                value={tabValue}
                indicatorColor="primary"
                variant="fullWidth"
              >
                <Tab label="Forespørsler" />
                <Tab label="Bookinger" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Stack spacing={2} mt={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5">Bookingforespørsler</Typography>
                  <Button variant="text" onClick={() => refetchRequests()}>
                    Oppdater
                  </Button>
                </Stack>

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Fra</TableCell>
                      <TableCell>Til</TableCell>
                      <TableCell>Område</TableCell>
                      <TableCell>Bestiller</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Handlinger</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{new Date(request.startsAt).toLocaleString()}</TableCell>
                        <TableCell>{new Date(request.endsAt).toLocaleString()}</TableCell>
                        <TableCell>{request.area}</TableCell>
                        <TableCell>
                          {request.requesterName}
                          <Typography variant="caption" display="block" color="text.secondary">
                            {request.requesterEmail}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip size="small" label={request.status} />
                        </TableCell>
                        <TableCell>
                          <Stack spacing={1}>
                            <TextField
                              size="small"
                              label="Adminkommentar"
                              value={requestComments[request.id] ?? ""}
                              onChange={(event) =>
                                setRequestComments((prev) => ({
                                  ...prev,
                                  [request.id]: event.target.value,
                                }))
                              }
                            />
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleReviewRequest(request.id, "APPROVED", true)}
                                disabled={requestReviewing}
                              >
                                Godkjenn + booking
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleReviewRequest(request.id, "APPROVED", false)}
                                disabled={requestReviewing}
                              >
                                Godkjenn
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={() => handleReviewRequest(request.id, "REJECTED", false)}
                                disabled={requestReviewing}
                              >
                                Avvis
                              </Button>
                            </Stack>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Stack spacing={2} mt={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5">Bookinger</Typography>
                  <Button variant="text" onClick={() => refetchBookings()}>
                    Oppdater
                  </Button>
                </Stack>

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Fra</TableCell>
                      <TableCell>Til</TableCell>
                      <TableCell>Område</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Ansvarlig</TableCell>
                      <TableCell>Depositum</TableCell>
                      <TableCell>Pris</TableCell>
                      <TableCell>Handlinger</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.id}</TableCell>
                        <TableCell>{new Date(booking.startsAt).toLocaleString()}</TableCell>
                        <TableCell>{new Date(booking.endsAt).toLocaleString()}</TableCell>
                        <TableCell>{booking.area}</TableCell>
                        <TableCell>
                          <Chip size="small" label={booking.status} />
                        </TableCell>
                        <TableCell>{booking.responsibleName}</TableCell>
                        <TableCell>{booking.depositStatus}</TableCell>
                        <TableCell>{booking.totalPrice}</TableCell>
                        <TableCell>
                          <Stack spacing={1}>
                            <TextField
                              size="small"
                              label="Adminkommentar"
                              value={bookingComments[booking.id] ?? ""}
                              onChange={(event) =>
                                setBookingComments((prev) => ({
                                  ...prev,
                                  [booking.id]: event.target.value,
                                }))
                              }
                            />
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleReviewBooking(booking.id, "CONFIRMED")}
                                disabled={bookingReviewing}
                              >
                                Sett bekreftet
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleReviewBooking(booking.id, "PENDING_ADMIN_REVIEW")}
                                disabled={bookingReviewing}
                              >
                                Sett pending
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={() => handleReviewBooking(booking.id, "DECLINED")}
                                disabled={bookingReviewing}
                              >
                                Sett avslått
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleCreatePaymentProduct(booking.id, booking.ownerOrganization?.id)}
                                disabled={creatingPaymentProduct || !booking.ownerOrganization}
                              >
                                Opprett Vipps-produkt
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleStartBankIdSigning(booking.id)}
                                disabled={startingBankIdSigning}
                              >
                                Start BankID
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleMarkBankIdSigned(booking.id)}
                                disabled={markingBankIdSigned}
                              >
                                Marker signert
                              </Button>
                            </Stack>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Stack>
            </TabPanel>
          </Box>
        </Box>
      </PermissionRequired>
    </Container>
  );
};

JanHusAdminPage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);

export default JanHusAdminPage;
