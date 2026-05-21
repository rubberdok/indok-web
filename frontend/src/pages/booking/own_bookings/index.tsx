import { useMutation, useQuery } from "@apollo/client/react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { PayWithVipps } from "@/components/pages/ecommerce/PayWithVipps";
import { GuestListDialog, JanHusGuestListEntry } from "@/components/pages/janhus/GuestListDialog";
import {
  JanHusMyBookingsDocument,
  MyCabinBookingsDocument,
  PaymentStatus,
  UpdateJanhusBookingDocument,
  UserDocument,
  UserOrdersDocument,
} from "@/generated/graphql";
import { Layout, RootStyle } from "@/layouts/Layout";
import { addApolloState, initializeApollo } from "@/lib/apolloClient";
import dayjs from "@/lib/date";
import { NextPageWithLayout } from "@/lib/next";

const AREA_LABELS: Record<string, string> = {
  FIRST_FLOOR: "1. etasje",
  SECOND_FLOOR: "2. etasje",
  ENTIRE_HOUSE: "Hele huset",
};

const STATUS_LABELS: Record<string, string> = {
  PROVISIONAL: "Foreløpig",
  PENDING_ADMIN_REVIEW: "Venter behandling",
  CONFIRMED: "Godkjent",
  DECLINED: "Avslått",
  CANCELLED: "Kansellert",
  BLOCKED: "Blokkert",
};

const DEPOSIT_STATUS_LABELS: Record<string, string> = {
  NOT_REQUIRED: "Ikke nødvendig",
  REQUIRED: "Påkrevd",
  REQUESTED: "Etterspurt",
  PAID: "Betalt",
  REFUNDED: "Refundert",
  WITHHELD: "Holdt tilbake",
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  INTERNAL: "Intern",
  OPEN_FOR_INDOK: "Åpent for Indøk",
  PRIVATE: "Privat",
  EXTERNAL: "Ekstern",
};

const DOOR_ACCESS_POLICY_LABELS: Record<string, string> = {
  BOOKER_ONLY: "Kun bestiller",
  ALL_PARTICIPANTS: "Bestiller + gjesteliste",
};

const MANUAL_ENTRY_PREFIX = "manual:";

const formatDate = (dateTime: string) => dayjs(dateTime).format("DD.MM.YYYY");
const formatTime = (dateTime: string) => dayjs(dateTime).format("HH:mm");
const formatNok = (amount: number | null | undefined) =>
  new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount ?? 0));

const serializeGuestListForUpdate = (guests: JanHusGuestListEntry[]) => {
  const normalizedGuests = guests
    .map((guest) => {
      const displayName = guest.displayName.trim();
      const feideUserId = guest.feideUserId.trim();

      if (!displayName) {
        return null;
      }

      const isManualEntry = feideUserId.startsWith(MANUAL_ENTRY_PREFIX) || feideUserId === displayName;
      return isManualEntry ? displayName : feideUserId;
    })
    .filter((value): value is string => Boolean(value));

  return JSON.stringify(normalizedGuests);
};

const statusChipColor = (status: string): "default" | "success" | "warning" | "error" | "info" => {
  if (status === "CONFIRMED") {
    return "success";
  }
  if (status === "PENDING_ADMIN_REVIEW" || status === "PROVISIONAL") {
    return "warning";
  }
  if (status === "DECLINED" || status === "CANCELLED") {
    return "error";
  }
  if (status === "BLOCKED") {
    return "info";
  }
  return "default";
};

const OwnBookingsPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  const router = useRouter();
  const [paymentError, setPaymentError] = useState<string | undefined>();
  const [bookingUpdateAlert, setBookingUpdateAlert] = useState<
    { severity: "success" | "error"; message: string } | undefined
  >();
  const [savingGuestListBookingId, setSavingGuestListBookingId] = useState<string | undefined>();
  const [guestListEdits, setGuestListEdits] = useState<Record<string, JanHusGuestListEntry[]>>({});
  const [activeGuestListBookingId, setActiveGuestListBookingId] = useState<string | undefined>();

  const { data: janhusData, loading: janhusLoading, error: janhusError } = useQuery(JanHusMyBookingsDocument);
  const { data: cabinsData, loading: cabinsLoading, error: cabinsError } = useQuery(MyCabinBookingsDocument);
  const { data: ordersData, loading: ordersLoading } = useQuery(UserOrdersDocument);
  const [updateBooking] = useMutation(UpdateJanhusBookingDocument);

  const janhusBookings = useMemo(() => janhusData?.janhusMyBookings ?? [], [janhusData]);
  const cabinBookings = useMemo(() => cabinsData?.myCabinBookings ?? [], [cabinsData]);

  const orderByProductId = useMemo(() => {
    const orders = ordersData?.userOrders ?? [];
    const map = new Map<string, (typeof orders)[number]>();
    for (const order of orders) {
      map.set(order.product.id, order);
    }
    return map;
  }, [ordersData]);

  const isLoading = janhusLoading || cabinsLoading || ordersLoading;
  const error = janhusError || cabinsError;

  useEffect(() => {
    setGuestListEdits((current) => {
      const next = { ...current };
      janhusBookings.forEach((booking) => {
        if (next[booking.id] === undefined) {
          next[booking.id] = (booking.guestListEntries ?? []).map((guest) => ({
            feideUserId: guest.feideUserid,
            displayName: guest.displayName,
          }));
        }
      });
      return next;
    });
  }, [janhusBookings]);

  const activeGuestListBooking = useMemo(
    () => janhusBookings.find((booking) => booking.id === activeGuestListBookingId),
    [activeGuestListBookingId, janhusBookings]
  );

  async function handleSaveGuestList(bookingId: string, guests: JanHusGuestListEntry[]) {
    setBookingUpdateAlert(undefined);
    setSavingGuestListBookingId(bookingId);

    try {
      await updateBooking({
        variables: {
          bookingData: {
            id: bookingId,
            guestList: serializeGuestListForUpdate(guests),
          },
        },
      });
      setBookingUpdateAlert({ severity: "success", message: `Gjesteliste lagret for booking #${bookingId}.` });
      return true;
    } catch (mutationError) {
      setBookingUpdateAlert({
        severity: "error",
        message: mutationError instanceof Error ? mutationError.message : "Kunne ikke lagre gjesteliste.",
      });
      return false;
    } finally {
      setSavingGuestListBookingId(undefined);
    }
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box mb={2}>
        <Button onClick={() => router.back()}>Tilbake</Button>
      </Box>

      <Stack spacing={3}>
        <Typography variant="h4">Mine bookinger</Typography>
        <Typography color="text.secondary">Her ser du alle dine JanHus og Hytte bookinger.</Typography>

        {error ? <Alert severity="error">{error.message}</Alert> : null}
        {paymentError ? <Alert severity="error">{paymentError}</Alert> : null}
        {bookingUpdateAlert ? <Alert severity={bookingUpdateAlert.severity}>{bookingUpdateAlert.message}</Alert> : null}
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : null}

        {!isLoading ? (
          <>
            <Card variant="outlined" elevation={0}>
              <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      JanHus
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Organisasjonsbookinger vises kun for organisasjonsledere i denne oversikten. Depositum for
                      organisasjonsbookinger håndteres internt, uten direkte Vipps-betaling her.
                    </Typography>
                  </Box>

                  <Alert severity="info">
                    Trenger du mer informasjon om en booking eller betaling? Kontakt Janus Eiendom og oppgi
                    bookingreferansen (ID).
                  </Alert>

                  {janhusBookings.length === 0 ? (
                    <Typography color="text.secondary">Ingen JanHus-bookinger funnet.</Typography>
                  ) : (
                    <Grid
                      container
                      spacing={2}
                      justifyContent="center"
                      alignItems="flex-start"
                      sx={{ width: "100%", m: 0 }}
                    >
                      {janhusBookings.map((booking) => {
                        const productId = booking.vippsProduct?.id;
                        const linkedOrder =
                          booking.vippsOrder ?? (productId ? orderByProductId.get(productId) : undefined);
                        const isPaid =
                          linkedOrder?.paymentStatus === PaymentStatus.Captured ||
                          linkedOrder?.paymentStatus === PaymentStatus.Reserved;

                        const isOrganizationBooking = Boolean(booking.ownerOrganization);

                        const rentalPrice = Number(booking.totalPrice ?? 0);
                        const registeredDeposit = Number(booking.depositAmount ?? 0);
                        const outstandingDeposit = Number(booking.outstandingDepositAmount ?? 0);
                        const configuredVippsAmount = Number(booking.vippsProduct?.price ?? 0);
                        const fullPaymentAmount = rentalPrice + registeredDeposit;
                        const payableAmount = isOrganizationBooking
                          ? 0
                          : configuredVippsAmount > 0
                            ? configuredVippsAmount
                            : fullPaymentAmount;
                        const guestEntries = guestListEdits[booking.id] ?? [];

                        const bookerName =
                          booking.bookerName ||
                          `${booking.ownerUser?.firstName ?? ""} ${booking.ownerUser?.lastName ?? ""}`.trim();
                        const bookerEmail = booking.bookerEmail || "-";
                        const bookerPhone = booking.bookerPhone || "-";
                        const bookerSignature = `${bookerName}|${bookerEmail}|${bookerPhone}`;
                        const responsibleSignature = `${booking.responsibleName}|${booking.responsibleEmail}|${booking.responsiblePhone}`;
                        const showResponsibleContact =
                          responsibleSignature.toLowerCase() !== bookerSignature.toLowerCase();

                        return (
                          <Grid
                            item
                            xs={12}
                            md={6}
                            key={booking.id}
                            sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}
                          >
                            <Card
                              variant="outlined"
                              elevation={0}
                              sx={{ width: "100%", display: "flex", flexDirection: "column" }}
                            >
                              <CardContent sx={{ width: "100%", p: 2.5, "&:last-child": { pb: 2.5 } }}>
                                <Stack spacing={1.5}>
                                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                      <Typography variant="overline" color="text.secondary">
                                        {formatDate(booking.startsAt)}
                                      </Typography>
                                      <Typography variant="h6">
                                        {formatTime(booking.startsAt)}–{formatTime(booking.endsAt)}
                                      </Typography>
                                    </Box>
                                    <Chip
                                      size="small"
                                      color={statusChipColor(booking.status)}
                                      label={STATUS_LABELS[booking.status] ?? booking.status}
                                    />
                                  </Stack>

                                  <Typography variant="body2">
                                    {AREA_LABELS[booking.area] ?? booking.area} ·{" "}
                                    {booking.cleaningRequested ? "Med" : "Uten"} innleid renhold
                                  </Typography>

                                  <Typography variant="body2" color="text.secondary">
                                    Organisasjon: {booking.ownerOrganization?.name ?? "Ingen"}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Arrangementstype: {EVENT_TYPE_LABELS[booking.eventType] ?? booking.eventType}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Status: {STATUS_LABELS[booking.status] ?? booking.status}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Bestiller: {bookerName || "-"} ({bookerEmail}, {bookerPhone})
                                  </Typography>
                                  {showResponsibleContact ? (
                                    <Typography variant="body2" color="text.secondary">
                                      Ansvarlig: {booking.responsibleName} ({booking.responsibleEmail},{" "}
                                      {booking.responsiblePhone})
                                    </Typography>
                                  ) : null}

                                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                                    <Chip
                                      size="small"
                                      variant="outlined"
                                      label={`Depositumstatus: ${DEPOSIT_STATUS_LABELS[booking.depositStatus] ?? booking.depositStatus}`}
                                    />
                                    <Chip
                                      size="small"
                                      variant="outlined"
                                      color={isPaid ? "success" : "default"}
                                      label={`Betaling: ${isPaid ? "Betalt" : linkedOrder?.paymentStatus ?? "Ikke betalt"}`}
                                    />
                                    <Chip
                                      size="small"
                                      variant="outlined"
                                      label={`Åpningspolicy: ${DOOR_ACCESS_POLICY_LABELS[booking.doorAccessPolicy] ?? booking.doorAccessPolicy}`}
                                    />
                                  </Stack>

                                  <Box
                                    sx={{
                                      display: "grid",
                                      gridTemplateColumns: "1fr auto",
                                      columnGap: 2,
                                      rowGap: 0.5,
                                    }}
                                  >
                                    <Typography variant="body2" color="text.secondary">
                                      Leiepris
                                    </Typography>
                                    <Typography variant="body2">{formatNok(rentalPrice)}</Typography>

                                    <Typography variant="body2" color="text.secondary">
                                      Registrert depositum
                                    </Typography>
                                    <Typography variant="body2">{formatNok(registeredDeposit)}</Typography>

                                    <Typography variant="body2" color="text.secondary">
                                      Utestående depositum
                                    </Typography>
                                    <Typography variant="body2">{formatNok(outstandingDeposit)}</Typography>

                                    <Typography variant="subtitle2">Sum å betale</Typography>
                                    <Typography variant="subtitle2">{formatNok(payableAmount)}</Typography>
                                  </Box>

                                  <Typography variant="body2" color="text.secondary">
                                    Gjesteliste: {guestEntries.length} registrert
                                  </Typography>
                                  {guestEntries.length ? (
                                    <Typography variant="caption" color="text.secondary">
                                      {guestEntries.map((guest) => guest.displayName).join(", ")}
                                    </Typography>
                                  ) : null}
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      onClick={() => setActiveGuestListBookingId(booking.id)}
                                      disabled={savingGuestListBookingId === booking.id}
                                    >
                                      Rediger gjesteliste
                                    </Button>
                                  </Stack>

                                  {isOrganizationBooking ? (
                                    <Alert severity="info">
                                      Denne bookingen er gjort på vegne av organisasjon. Kostnad håndteres internt.
                                    </Alert>
                                  ) : null}

                                  {productId && !isOrganizationBooking ? (
                                    configuredVippsAmount > 0 ? (
                                      <PayWithVipps
                                        productId={productId}
                                        quantity={1}
                                        disabled={Boolean(isPaid)}
                                        fallbackRedirect="/booking/own_bookings"
                                        onError={(apolloError) =>
                                          setPaymentError(
                                            apolloError?.message ??
                                              "Kunne ikke opprette Vipps-betaling. Sjekk bookingpris/depositum og prøv igjen."
                                          )
                                        }
                                      />
                                    ) : (
                                      <Typography variant="caption" color="warning.main">
                                        Vipps-produktet står med 0 kr. Kontakt Janus Eiendom for å oppdatere depositum.
                                      </Typography>
                                    )
                                  ) : (
                                    <Typography variant="body2" color="text.secondary">
                                      {isOrganizationBooking
                                        ? "Ingen Vipps-betaling for organisasjonsbooking"
                                        : "Ingen Vipps-forespørsel ennå"}
                                    </Typography>
                                  )}

                                  <Typography variant="caption" color="text.secondary">
                                    Bookingreferanse (ID): #{booking.id}
                                  </Typography>
                                </Stack>
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined" elevation={0}>
              <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                <Typography variant="h5" gutterBottom>
                  Hytte
                </Typography>

                {cabinBookings.length === 0 ? (
                  <Typography color="text.secondary">Ingen hyttebookinger funnet.</Typography>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Fra</TableCell>
                        <TableCell>Til</TableCell>
                        <TableCell>Hytter</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cabinBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.id}</TableCell>
                          <TableCell>{formatDate(booking.checkIn)}</TableCell>
                          <TableCell>{formatDate(booking.checkOut)}</TableCell>
                          <TableCell>{booking.cabins.map((cabin) => cabin.name).join(", ")}</TableCell>
                          <TableCell>
                            {booking.isDeclined ? "Avslått" : booking.isTentative ? "Til behandling" : "Godkjent"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        ) : null}
      </Stack>

      {activeGuestListBooking ? (
        <GuestListDialog
          bookingId={activeGuestListBooking.id}
          open={Boolean(activeGuestListBooking)}
          allowManualEntries
          initialGuests={guestListEdits[activeGuestListBooking.id] ?? []}
          saving={savingGuestListBookingId === activeGuestListBooking.id}
          onClose={() => setActiveGuestListBookingId(undefined)}
          onSave={async (guests) => {
            setGuestListEdits((current) => ({
              ...current,
              [activeGuestListBooking.id]: guests,
            }));

            const saved = await handleSaveGuestList(activeGuestListBooking.id, guests);
            if (saved) {
              setActiveGuestListBookingId(undefined);
            }
          }}
        />
      ) : null}
    </Container>
  );
};

OwnBookingsPage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);

export default OwnBookingsPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = initializeApollo({}, ctx);
  const { data, error } = await client.query({ query: UserDocument });
  const user = data?.user;

  if (error) return { notFound: true };
  if (!user) {
    return { notFound: true };
  }

  return addApolloState(client, { props: { user } });
};
