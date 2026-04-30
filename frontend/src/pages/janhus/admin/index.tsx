import { useMutation, useQuery } from "@apollo/client";
import { Settings } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
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
  ReviewJanhusBookingDocument,
  ReviewJanhusBookingRequestDocument,
} from "@/generated/graphql";
import { Layout, RootStyle } from "@/layouts/Layout";
import dayjs from "@/lib/date";
import { NextPageWithLayout } from "@/lib/next";

type OwnerType = "PERSONAL" | "ORGANIZATION" | "EXTERNAL";
type SortDirection = "asc" | "desc";

const AREA_LABELS: Record<string, string> = {
  FIRST_FLOOR: "1. etasje",
  SECOND_FLOOR: "2. etasje",
  ENTIRE_HOUSE: "Hele huset",
};

const REQUEST_STATUS_LABELS: Record<string, string> = {
  PENDING: "Venter",
  APPROVED: "Godkjent",
  REJECTED: "Avslått",
};

const BOOKING_STATUS_LABELS: Record<string, string> = {
  PROVISIONAL: "Foreløpig",
  PENDING_ADMIN_REVIEW: "Venter behandling",
  CONFIRMED: "Godkjent",
  DECLINED: "Avslått",
  CANCELLED: "Kansellert",
  BLOCKED: "Blokkert",
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  INTERNAL: "Intern",
  OPEN_FOR_INDOK: "Åpent for Indøk",
  PRIVATE: "Privat",
  EXTERNAL: "Ekstern",
};

const OWNER_TYPE_LABELS: Record<OwnerType, string> = {
  PERSONAL: "Personlig",
  ORGANIZATION: "Organisasjon",
  EXTERNAL: "Ekstern",
};

const statusChipColor = (status: string): "default" | "success" | "warning" | "error" | "info" => {
  if (status === "CONFIRMED" || status === "APPROVED") {
    return "success";
  }
  if (status === "PENDING_ADMIN_REVIEW" || status === "PENDING" || status === "PROVISIONAL") {
    return "warning";
  }
  if (status === "DECLINED" || status === "REJECTED" || status === "CANCELLED") {
    return "error";
  }
  if (status === "BLOCKED") {
    return "info";
  }
  return "default";
};

const toDateKey = (isoDate: string) => dayjs(isoDate).format("YYYY-MM-DD");
const formatDate = (isoDate: string) => dayjs(isoDate).format("DD.MM.YYYY");
const formatTime = (isoDate: string) => dayjs(isoDate).format("HH:mm");

const requestOwnerType = (request: {
  ownerOrganization?: { id: string; name: string } | null;
  requesterUser?: { id: string } | null;
}): OwnerType => {
  if (request.ownerOrganization) {
    return "ORGANIZATION";
  }
  if (request.requesterUser) {
    return "PERSONAL";
  }
  return "EXTERNAL";
};

const bookingOwnerType = (booking: {
  isExternalBooking: boolean;
  ownerOrganization?: { id: string; name: string } | null;
}): OwnerType => {
  if (booking.isExternalBooking) {
    return "EXTERNAL";
  }
  if (booking.ownerOrganization) {
    return "ORGANIZATION";
  }
  return "PERSONAL";
};

const conflictingAreasFor = (area: string) => {
  if (area === "ENTIRE_HOUSE") {
    return ["ENTIRE_HOUSE", "FIRST_FLOOR", "SECOND_FLOOR"];
  }
  if (area === "FIRST_FLOOR") {
    return ["FIRST_FLOOR", "ENTIRE_HOUSE"];
  }
  return ["SECOND_FLOOR", "ENTIRE_HOUSE"];
};

const JanHusAdminPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState<number>(0);
  const [alert, setAlert] = useState<{ severity: "success" | "error"; message: string } | undefined>();

  const { data: bookingsData, refetch: refetchBookings } = useQuery(AdminJanHusBookingsDocument);
  const { data: requestsData, refetch: refetchRequests } = useQuery(JanHusBookingRequestsDocument);

  const [requestComments, setRequestComments] = useState<Record<string, string>>({});
  const [bookingComments, setBookingComments] = useState<Record<string, string>>({});

  const [requestDateFilter, setRequestDateFilter] = useState("");
  const [requestAreaFilter, setRequestAreaFilter] = useState("ALL");
  const [requestStatusFilter, setRequestStatusFilter] = useState("ALL");
  const [requestEventTypeFilter, setRequestEventTypeFilter] = useState("ALL");
  const [requestOwnerTypeFilter, setRequestOwnerTypeFilter] = useState<"ALL" | OwnerType>("ALL");
  const [requestSortBy, setRequestSortBy] = useState<"startsAt" | "area" | "eventType" | "status" | "ownerType">(
    "startsAt"
  );
  const [requestSortDirection, setRequestSortDirection] = useState<SortDirection>("asc");

  const [bookingDateFilter, setBookingDateFilter] = useState("");
  const [bookingAreaFilter, setBookingAreaFilter] = useState("ALL");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("ALL");
  const [bookingEventTypeFilter, setBookingEventTypeFilter] = useState("ALL");
  const [bookingOwnerTypeFilter, setBookingOwnerTypeFilter] = useState<"ALL" | OwnerType>("ALL");
  const [bookingSortBy, setBookingSortBy] = useState<"startsAt" | "area" | "eventType" | "status" | "ownerType">(
    "startsAt"
  );
  const [bookingSortDirection, setBookingSortDirection] = useState<SortDirection>("asc");

  const [availabilityDate, setAvailabilityDate] = useState(dayjs().format("YYYY-MM-DD"));

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

  const bookingRequests = useMemo(() => requestsData?.janhusBookingRequests ?? [], [requestsData]);
  const bookings = useMemo(() => bookingsData?.adminJanhusBookings ?? [], [bookingsData]);

  const filteredRequests = useMemo(() => {
    const sortFactor = requestSortDirection === "asc" ? 1 : -1;

    return [...bookingRequests]
      .filter((request) => {
        if (requestDateFilter && toDateKey(request.startsAt) !== requestDateFilter) {
          return false;
        }
        if (requestAreaFilter !== "ALL" && request.area !== requestAreaFilter) {
          return false;
        }
        if (requestStatusFilter !== "ALL" && request.status !== requestStatusFilter) {
          return false;
        }
        if (requestEventTypeFilter !== "ALL" && request.eventType !== requestEventTypeFilter) {
          return false;
        }
        if (requestOwnerTypeFilter !== "ALL" && requestOwnerType(request) !== requestOwnerTypeFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (requestSortBy === "startsAt") {
          return (new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()) * sortFactor;
        }
        if (requestSortBy === "area") {
          return a.area.localeCompare(b.area) * sortFactor;
        }
        if (requestSortBy === "eventType") {
          return a.eventType.localeCompare(b.eventType) * sortFactor;
        }
        if (requestSortBy === "status") {
          return a.status.localeCompare(b.status) * sortFactor;
        }
        return requestOwnerType(a).localeCompare(requestOwnerType(b)) * sortFactor;
      });
  }, [
    bookingRequests,
    requestAreaFilter,
    requestDateFilter,
    requestEventTypeFilter,
    requestOwnerTypeFilter,
    requestSortBy,
    requestSortDirection,
    requestStatusFilter,
  ]);

  const filteredBookings = useMemo(() => {
    const sortFactor = bookingSortDirection === "asc" ? 1 : -1;

    return [...bookings]
      .filter((booking) => {
        if (bookingDateFilter && toDateKey(booking.startsAt) !== bookingDateFilter) {
          return false;
        }
        if (bookingAreaFilter !== "ALL" && booking.area !== bookingAreaFilter) {
          return false;
        }
        if (bookingStatusFilter !== "ALL" && booking.status !== bookingStatusFilter) {
          return false;
        }
        if (bookingEventTypeFilter !== "ALL" && booking.eventType !== bookingEventTypeFilter) {
          return false;
        }
        if (bookingOwnerTypeFilter !== "ALL" && bookingOwnerType(booking) !== bookingOwnerTypeFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (bookingSortBy === "startsAt") {
          return (new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()) * sortFactor;
        }
        if (bookingSortBy === "area") {
          return a.area.localeCompare(b.area) * sortFactor;
        }
        if (bookingSortBy === "eventType") {
          return a.eventType.localeCompare(b.eventType) * sortFactor;
        }
        if (bookingSortBy === "status") {
          return a.status.localeCompare(b.status) * sortFactor;
        }
        return bookingOwnerType(a).localeCompare(bookingOwnerType(b)) * sortFactor;
      });
  }, [
    bookingAreaFilter,
    bookingDateFilter,
    bookingEventTypeFilter,
    bookingOwnerTypeFilter,
    bookingSortBy,
    bookingSortDirection,
    bookingStatusFilter,
    bookings,
  ]);

  const availabilityByArea = useMemo(() => {
    const areas = ["FIRST_FLOOR", "SECOND_FLOOR", "ENTIRE_HOUSE"];
    const dayBookings = bookings.filter((booking) => {
      if (toDateKey(booking.startsAt) !== availabilityDate) {
        return false;
      }
      return booking.status !== "DECLINED" && booking.status !== "CANCELLED";
    });

    return areas.map((area) => {
      const areaBookings = dayBookings
        .filter((booking) => conflictingAreasFor(area).includes(booking.area))
        .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
      return { area, bookings: areaBookings };
    });
  }, [availabilityDate, bookings]);

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

                <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "repeat(4, 1fr)" }}>
                  <TextField
                    type="date"
                    label="Dato"
                    InputLabelProps={{ shrink: true }}
                    value={requestDateFilter}
                    onChange={(event) => setRequestDateFilter(event.target.value)}
                  />
                  <FormControl>
                    <InputLabel>Område</InputLabel>
                    <Select
                      value={requestAreaFilter}
                      label="Område"
                      onChange={(event) => setRequestAreaFilter(event.target.value)}
                    >
                      <MenuItem value="ALL">Alle</MenuItem>
                      <MenuItem value="FIRST_FLOOR">1. etasje</MenuItem>
                      <MenuItem value="SECOND_FLOOR">2. etasje</MenuItem>
                      <MenuItem value="ENTIRE_HOUSE">Hele huset</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel>Eiertype</InputLabel>
                    <Select
                      value={requestOwnerTypeFilter}
                      label="Eiertype"
                      onChange={(event) => setRequestOwnerTypeFilter(event.target.value as "ALL" | OwnerType)}
                    >
                      <MenuItem value="ALL">Alle</MenuItem>
                      <MenuItem value="PERSONAL">Personlig</MenuItem>
                      <MenuItem value="ORGANIZATION">Organisasjon</MenuItem>
                      <MenuItem value="EXTERNAL">Ekstern</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel>Arrangementstype</InputLabel>
                    <Select
                      value={requestEventTypeFilter}
                      label="Arrangementstype"
                      onChange={(event) => setRequestEventTypeFilter(event.target.value)}
                    >
                      <MenuItem value="ALL">Alle</MenuItem>
                      {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}>
                  <FormControl>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={requestStatusFilter}
                      label="Status"
                      onChange={(event) => setRequestStatusFilter(event.target.value)}
                    >
                      <MenuItem value="ALL">Alle</MenuItem>
                      {Object.entries(REQUEST_STATUS_LABELS).map(([value, label]) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel>Sorter på</InputLabel>
                    <Select
                      value={requestSortBy}
                      label="Sorter på"
                      onChange={(event) =>
                        setRequestSortBy(
                          event.target.value as "startsAt" | "area" | "eventType" | "status" | "ownerType"
                        )
                      }
                    >
                      <MenuItem value="startsAt">Tid (fra)</MenuItem>
                      <MenuItem value="area">Område</MenuItem>
                      <MenuItem value="eventType">Arrangementstype</MenuItem>
                      <MenuItem value="ownerType">Eiertype</MenuItem>
                      <MenuItem value="status">Status</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel>Retning</InputLabel>
                    <Select
                      value={requestSortDirection}
                      label="Retning"
                      onChange={(event) => setRequestSortDirection(event.target.value as SortDirection)}
                    >
                      <MenuItem value="asc">Stigende</MenuItem>
                      <MenuItem value="desc">Synkende</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Dato</TableCell>
                      <TableCell>Fra</TableCell>
                      <TableCell>Til</TableCell>
                      <TableCell>Område</TableCell>
                      <TableCell>Eiertype</TableCell>
                      <TableCell>Organisasjon</TableCell>
                      <TableCell>Arrangementstype</TableCell>
                      <TableCell>Renhold</TableCell>
                      <TableCell>Bestiller / Ansvarlig</TableCell>
                      <TableCell>Telefon</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Handlinger</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{formatDate(request.startsAt)}</TableCell>
                        <TableCell>{formatTime(request.startsAt)}</TableCell>
                        <TableCell>{formatTime(request.endsAt)}</TableCell>
                        <TableCell>{AREA_LABELS[request.area] ?? request.area}</TableCell>
                        <TableCell>{OWNER_TYPE_LABELS[requestOwnerType(request)]}</TableCell>
                        <TableCell>{request.ownerOrganization?.name ?? "-"}</TableCell>
                        <TableCell>{EVENT_TYPE_LABELS[request.eventType] ?? request.eventType}</TableCell>
                        <TableCell>{request.cleaningRequested ? "Ja" : "Nei"}</TableCell>
                        <TableCell>
                          {request.requesterName}
                          <Typography variant="caption" display="block" color="text.secondary">
                            {request.requesterEmail}
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Ansvarlig: {request.responsibleName} ({request.responsibleEmail})
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {request.requesterPhone}
                          <Typography variant="caption" display="block" color="text.secondary">
                            Ansvarlig: {request.responsiblePhone}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            color={statusChipColor(request.status)}
                            label={REQUEST_STATUS_LABELS[request.status] ?? request.status}
                          />
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

                <Card variant="outlined">
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="h6">Tilgjengelighet (fargekodet dagsoversikt)</Typography>
                      <TextField
                        type="date"
                        label="Vis dato"
                        InputLabelProps={{ shrink: true }}
                        value={availabilityDate}
                        onChange={(event) => setAvailabilityDate(event.target.value)}
                        sx={{ maxWidth: 220 }}
                      />

                      <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}>
                        {availabilityByArea.map((areaInfo) => (
                          <Card key={areaInfo.area} variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle1" gutterBottom>
                                {AREA_LABELS[areaInfo.area] ?? areaInfo.area}
                              </Typography>
                              {areaInfo.bookings.length === 0 ? (
                                <Chip label="Ledig" color="success" size="small" />
                              ) : (
                                <Stack spacing={1}>
                                  {areaInfo.bookings.map((booking) => (
                                    <Chip
                                      key={booking.id}
                                      size="small"
                                      color={statusChipColor(booking.status)}
                                      label={`${formatTime(booking.startsAt)}–${formatTime(booking.endsAt)} · ${BOOKING_STATUS_LABELS[booking.status] ?? booking.status} · ${booking.responsibleName}`}
                                    />
                                  ))}
                                </Stack>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "repeat(4, 1fr)" }}>
                  <TextField
                    type="date"
                    label="Dato"
                    InputLabelProps={{ shrink: true }}
                    value={bookingDateFilter}
                    onChange={(event) => setBookingDateFilter(event.target.value)}
                  />
                  <FormControl>
                    <InputLabel>Område</InputLabel>
                    <Select
                      value={bookingAreaFilter}
                      label="Område"
                      onChange={(event) => setBookingAreaFilter(event.target.value)}
                    >
                      <MenuItem value="ALL">Alle</MenuItem>
                      <MenuItem value="FIRST_FLOOR">1. etasje</MenuItem>
                      <MenuItem value="SECOND_FLOOR">2. etasje</MenuItem>
                      <MenuItem value="ENTIRE_HOUSE">Hele huset</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel>Eiertype</InputLabel>
                    <Select
                      value={bookingOwnerTypeFilter}
                      label="Eiertype"
                      onChange={(event) => setBookingOwnerTypeFilter(event.target.value as "ALL" | OwnerType)}
                    >
                      <MenuItem value="ALL">Alle</MenuItem>
                      <MenuItem value="PERSONAL">Personlig</MenuItem>
                      <MenuItem value="ORGANIZATION">Organisasjon</MenuItem>
                      <MenuItem value="EXTERNAL">Ekstern</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel>Arrangementstype</InputLabel>
                    <Select
                      value={bookingEventTypeFilter}
                      label="Arrangementstype"
                      onChange={(event) => setBookingEventTypeFilter(event.target.value)}
                    >
                      <MenuItem value="ALL">Alle</MenuItem>
                      {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}>
                  <FormControl>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={bookingStatusFilter}
                      label="Status"
                      onChange={(event) => setBookingStatusFilter(event.target.value)}
                    >
                      <MenuItem value="ALL">Alle</MenuItem>
                      {Object.entries(BOOKING_STATUS_LABELS).map(([value, label]) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel>Sorter på</InputLabel>
                    <Select
                      value={bookingSortBy}
                      label="Sorter på"
                      onChange={(event) =>
                        setBookingSortBy(
                          event.target.value as "startsAt" | "area" | "eventType" | "status" | "ownerType"
                        )
                      }
                    >
                      <MenuItem value="startsAt">Tid (fra)</MenuItem>
                      <MenuItem value="area">Område</MenuItem>
                      <MenuItem value="eventType">Arrangementstype</MenuItem>
                      <MenuItem value="ownerType">Eiertype</MenuItem>
                      <MenuItem value="status">Status</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel>Retning</InputLabel>
                    <Select
                      value={bookingSortDirection}
                      label="Retning"
                      onChange={(event) => setBookingSortDirection(event.target.value as SortDirection)}
                    >
                      <MenuItem value="asc">Stigende</MenuItem>
                      <MenuItem value="desc">Synkende</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Dato</TableCell>
                      <TableCell>Fra</TableCell>
                      <TableCell>Til</TableCell>
                      <TableCell>Område</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Eiertype</TableCell>
                      <TableCell>Organisasjon</TableCell>
                      <TableCell>Arrangementstype</TableCell>
                      <TableCell>Renhold</TableCell>
                      <TableCell>Ansvarlig</TableCell>
                      <TableCell>Telefon</TableCell>
                      <TableCell>Depositum</TableCell>
                      <TableCell>Pris</TableCell>
                      <TableCell>Handlinger</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.id}</TableCell>
                        <TableCell>{formatDate(booking.startsAt)}</TableCell>
                        <TableCell>{formatTime(booking.startsAt)}</TableCell>
                        <TableCell>{formatTime(booking.endsAt)}</TableCell>
                        <TableCell>{AREA_LABELS[booking.area] ?? booking.area}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            color={statusChipColor(booking.status)}
                            label={BOOKING_STATUS_LABELS[booking.status] ?? booking.status}
                          />
                        </TableCell>
                        <TableCell>{OWNER_TYPE_LABELS[bookingOwnerType(booking)]}</TableCell>
                        <TableCell>{booking.ownerOrganization?.name ?? "-"}</TableCell>
                        <TableCell>{EVENT_TYPE_LABELS[booking.eventType] ?? booking.eventType}</TableCell>
                        <TableCell>{booking.cleaningRequested ? "Ja" : "Nei"}</TableCell>
                        <TableCell>{booking.responsibleName}</TableCell>
                        <TableCell>{booking.responsiblePhone || "-"}</TableCell>
                        <TableCell>{booking.depositStatus}</TableCell>
                        <TableCell>{booking.totalPrice ?? "-"}</TableCell>
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
