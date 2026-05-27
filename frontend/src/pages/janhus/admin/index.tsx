import { useMutation, useQuery } from "@apollo/client/react";
import { ExpandMore, Settings } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControlLabel,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Tab,
  TextField,
  Tabs,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { PermissionRequired } from "@/components/Auth";
import { TabPanel } from "@/components/pages/about/TabPanel";
import { GuestListDialog, JanHusGuestListEntry } from "@/components/pages/janhus/GuestListDialog";
import { Title } from "@/components/Title";
import {
  AdminJanHusBookingsDocument,
  CreateJanhusPaymentProductDocument,
  DeleteJanhusBookingDocument,
  DeleteJanhusBookingRequestDocument,
  JanHusBookingRequestsDocument,
  JanhusJanHusBookingDepositStatusChoices,
  ReviewJanhusBookingRequestDocument,
  UpdateJanhusBookingDocument,
} from "@/generated/graphql";
import { Layout, RootStyle } from "@/layouts/Layout";
import dayjs from "@/lib/date";
import { NextPageWithLayout } from "@/lib/next";

type OwnerType = "PERSONAL" | "ORGANIZATION"; // | "EXTERNAL";
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

const DEPOSIT_STATUS_LABELS: Record<string, string> = {
  NOT_REQUIRED: "Ikke nødvendig",
  REQUIRED: "Påkrevd",
  REQUESTED: "Etterspurt",
  PAID: "Betalt",
  REFUNDED: "Refundert",
  WITHHELD: "Holdt tilbake",
};

const DOOR_ACCESS_POLICY_LABELS: Record<string, string> = {
  BOOKER_ONLY: "Kun bestiller",
  ALL_PARTICIPANTS: "Bestiller + gjesteliste",
};

const MANUAL_ENTRY_PREFIX = "manual:";

const OWNER_TYPE_LABELS: Record<OwnerType, string> = {
  PERSONAL: "Personlig",
  ORGANIZATION: "Forening",
  // EXTERNAL: "Ekstern",
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
const toDateTimeInput = (isoDate: string) => dayjs(isoDate).format("YYYY-MM-DDTHH:mm");

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
  // return "EXTERNAL";
  return "PERSONAL";
};

const bookingOwnerType = (booking: {
  isExternalBooking: boolean;
  ownerOrganization?: { id: string; name: string } | null;
}): OwnerType => {
  // if (booking.isExternalBooking) {
  //   return "EXTERNAL";
  // }
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
  const [bookingEdits, setBookingEdits] = useState<
    Record<
      string,
      {
        startsAt: string;
        endsAt: string;
        area: string;
        status: string;
        eventType: string;
        cleaningRequested: boolean;
        responsibleName: string;
        responsibleEmail: string;
        responsiblePhone: string;
        bookerName: string;
        bookerEmail: string;
        bookerPhone: string;
        depositStatus: string;
        depositAmount: string;
        guestListEntries: JanHusGuestListEntry[];
        doorAccessPolicy: string;
        comment: string;
        adminComment: string;
      }
    >
  >({});
  const [activeGuestListBookingId, setActiveGuestListBookingId] = useState<string | undefined>();
  const [expandedBookingIds, setExpandedBookingIds] = useState<Record<string, boolean>>({});

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

  const [availabilityWeekAnchor, setAvailabilityWeekAnchor] = useState(dayjs().format("YYYY-MM-DD"));

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
    const bookingList = bookingsData?.adminJanhusBookings;
    if (!bookingList) return;

    setBookingEdits((current) => {
      const next = { ...current };
      bookingList.forEach((booking) => {
        if (next[booking.id] === undefined) {
          next[booking.id] = {
            startsAt: toDateTimeInput(booking.startsAt),
            endsAt: toDateTimeInput(booking.endsAt),
            area: booking.area,
            status: booking.status,
            eventType: booking.eventType,
            cleaningRequested: booking.cleaningRequested,
            responsibleName: booking.responsibleName,
            responsibleEmail: booking.responsibleEmail,
            responsiblePhone: booking.responsiblePhone,
            bookerName: booking.bookerName,
            bookerEmail: booking.bookerEmail,
            bookerPhone: booking.bookerPhone,
            depositStatus: booking.depositStatus,
            depositAmount: String(booking.depositAmount ?? 0),
            guestListEntries: (booking.guestListEntries ?? []).map((guest) => ({
              feideUserId: guest.feideUserid,
              displayName: guest.displayName,
            })),
            doorAccessPolicy: booking.doorAccessPolicy,
            comment: booking.comment ?? "",
            adminComment: booking.adminComment ?? "",
          };
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

  const [updateBooking, { loading: bookingUpdating }] = useMutation(UpdateJanhusBookingDocument, {
    onCompleted: async () => {
      setAlert({ severity: "success", message: "Booking oppdatert." });
      await refetchBookings();
    },
    onError: (error) => setAlert({ severity: "error", message: error.message }),
  });

  const [deleteBooking, { loading: deletingBooking }] = useMutation(DeleteJanhusBookingDocument, {
    onCompleted: async () => {
      setAlert({ severity: "success", message: "Booking slettet." });
      await refetchBookings();
    },
    onError: (error) => setAlert({ severity: "error", message: error.message }),
  });

  const [deleteRequest, { loading: deletingRequest }] = useMutation(DeleteJanhusBookingRequestDocument, {
    onCompleted: async () => {
      setAlert({ severity: "success", message: "Forespørsel slettet." });
      await refetchRequests();
    },
    onError: (error) => setAlert({ severity: "error", message: error.message }),
  });

  const [createPaymentProduct, { loading: creatingPaymentProduct }] = useMutation(CreateJanhusPaymentProductDocument, {
    onCompleted: async (result) => {
      const productId = result.createJanhusPaymentProduct?.productId;
      setAlert({
        severity: "success",
        message: productId
          ? `Vipps-produkt opprettet (#${productId}). Bruker kan nå betale under Mine bookinger.`
          : "Vipps-produkt håndtert.",
      });
      await refetchBookings();
    },
    onError: (error) => setAlert({ severity: "error", message: error.message }),
  });

  const bookingRequests = useMemo(() => requestsData?.janhusBookingRequests ?? [], [requestsData]);
  const bookings = useMemo(() => bookingsData?.adminJanhusBookings ?? [], [bookingsData]);
  const activeGuestListBooking = useMemo(
    () => bookings.find((booking) => booking.id === activeGuestListBookingId),
    [activeGuestListBookingId, bookings]
  );

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
    const weekStart = dayjs(availabilityWeekAnchor).weekday(0);
    const weekDays = Array.from({ length: 7 }).map((_, index) => weekStart.add(index, "day"));

    const activeBookings = bookings.filter(
      (booking) => booking.status !== "DECLINED" && booking.status !== "CANCELLED"
    );

    return areas.map((area) => {
      const bookingsByDay = weekDays.map((day) => {
        const areaBookings = activeBookings
          .filter(
            (booking) => conflictingAreasFor(area).includes(booking.area) && dayjs(booking.startsAt).isSame(day, "day")
          )
          .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

        return {
          key: day.format("YYYY-MM-DD"),
          label: day.format("ddd DD.MM"),
          bookings: areaBookings,
        };
      });

      return { area, bookingsByDay };
    });
  }, [availabilityWeekAnchor, bookings]);

  const weekStartLabel = useMemo(
    () => dayjs(availabilityWeekAnchor).weekday(0).format("DD.MM.YYYY"),
    [availabilityWeekAnchor]
  );

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

  async function handleSaveBooking(id: string) {
    const edit = bookingEdits[id];
    if (!edit) return;

    await updateBooking({
      variables: {
        bookingData: {
          id,
          startsAt: dayjs(edit.startsAt).toISOString(),
          endsAt: dayjs(edit.endsAt).toISOString(),
          area: edit.area,
          status: edit.status,
          eventType: edit.eventType,
          cleaningRequested: edit.cleaningRequested,
          responsibleName: edit.responsibleName,
          responsibleEmail: edit.responsibleEmail,
          responsiblePhone: edit.responsiblePhone,
          bookerName: edit.bookerName,
          bookerEmail: edit.bookerEmail,
          bookerPhone: edit.bookerPhone,
          depositStatus: edit.depositStatus,
          depositAmount: Number(edit.depositAmount),
          guestList: serializeGuestListForUpdate(edit.guestListEntries),
          doorAccessPolicy: edit.doorAccessPolicy,
          comment: edit.comment,
          adminComment: edit.adminComment,
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

  async function handleDeleteBooking(id: string) {
    await deleteBooking({ variables: { bookingId: id } });
  }

  async function handleDeleteRequest(id: string) {
    await deleteRequest({ variables: { requestId: id } });
  }

  return (
    <>
      <Title
        title="Booking adminside"
        overline="Bookinger"
        variant="dark"
        breadcrumbs={[
          {
            name: "Hjem",
            href: "/",
          },
          {
            name: "JanHus",
            href: "/janhus",
          },
          {
            name: "Adminside",
            href: "/janhus/admin",
          },
        ]}
      />
      <Container sx={{ py: 4 }}>
        <PermissionRequired permission="janhus.manage_booking">
          <Stack spacing={0.75} mb={3}>
            <Box>
              <Button startIcon={<Settings />} onClick={() => router.push("/janhus/admin/settings")}>
                Innstillinger
              </Button>
            </Box>
          </Stack>

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
                        <MenuItem value="ORGANIZATION">Forening</MenuItem>
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

                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="flex-start"
                    sx={{ width: "100%", m: 0 }}
                  >
                    {filteredRequests.map((request) => (
                      <Grid
                        item
                        xs={12}
                        md={6}
                        key={request.id}
                        sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}
                      >
                        <Card variant="outlined" elevation={0} sx={{ width: "100%" }}>
                          <CardContent>
                            <Stack spacing={1.5}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">Forespørsel #{request.id}</Typography>
                                <Chip
                                  size="small"
                                  color={statusChipColor(request.status)}
                                  label={REQUEST_STATUS_LABELS[request.status] ?? request.status}
                                />
                              </Stack>
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(request.startsAt)} kl. {formatTime(request.startsAt)}–
                                {formatTime(request.endsAt)} · {AREA_LABELS[request.area] ?? request.area}
                              </Typography>
                              <Typography variant="body2">
                                Eiertype: {OWNER_TYPE_LABELS[requestOwnerType(request)]}
                                {request.ownerOrganization?.name ? ` · ${request.ownerOrganization.name}` : ""}
                              </Typography>
                              <Typography variant="body2">
                                Arrangement: {EVENT_TYPE_LABELS[request.eventType] ?? request.eventType}
                                {/* · Innleid
                              renhold: {request.cleaningRequested ? "Ja" : "Nei"} */}
                              </Typography>
                              <Typography variant="body2">
                                Bestiller: {request.requesterName} ({request.requesterEmail || "-"})
                              </Typography>
                              <Typography variant="body2">
                                Ansvarlig: {request.responsibleName} ({request.responsibleEmail})
                              </Typography>
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
                                  Godkjenn + booking (Foreløpig)
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
                                <Button
                                  size="small"
                                  color="error"
                                  variant="text"
                                  onClick={() => handleDeleteRequest(request.id)}
                                  disabled={deletingRequest}
                                >
                                  Slett
                                </Button>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
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

                  <Card variant="outlined" elevation={0}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Typography variant="h6">Tilgjengelighet (kompakt ukevisning)</Typography>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ md: "center" }}>
                          <TextField
                            type="date"
                            label="Uke (ankerdato)"
                            InputLabelProps={{ shrink: true }}
                            value={availabilityWeekAnchor}
                            onChange={(event) => setAvailabilityWeekAnchor(event.target.value)}
                            sx={{ maxWidth: 220 }}
                          />
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              setAvailabilityWeekAnchor(
                                dayjs(availabilityWeekAnchor).subtract(7, "day").format("YYYY-MM-DD")
                              )
                            }
                          >
                            Forrige uke
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              setAvailabilityWeekAnchor(
                                dayjs(availabilityWeekAnchor).add(7, "day").format("YYYY-MM-DD")
                              )
                            }
                          >
                            Neste uke
                          </Button>
                          <Typography variant="body2" color="text.secondary">
                            Uke starter {weekStartLabel}
                          </Typography>
                        </Stack>

                        <Grid container spacing={1}>
                          {availabilityByArea.map((areaInfo) => (
                            <Grid item xs={12} md={4} key={areaInfo.area}>
                              <Card variant="outlined" elevation={0}>
                                <CardContent>
                                  <Typography variant="subtitle1" gutterBottom>
                                    {AREA_LABELS[areaInfo.area] ?? areaInfo.area}
                                  </Typography>
                                  <Stack spacing={0.5}>
                                    {areaInfo.bookingsByDay.map((day) => (
                                      <Box key={`${areaInfo.area}-${day.key}`}>
                                        <Typography variant="caption" color="text.secondary">
                                          {day.label}
                                        </Typography>
                                        {day.bookings.length ? (
                                          <Typography variant="body2">
                                            {day.bookings
                                              .slice(0, 2)
                                              .map(
                                                (booking) =>
                                                  `${formatTime(booking.startsAt)}–${formatTime(booking.endsAt)}`
                                              )
                                              .join(", ")}
                                            {day.bookings.length > 2 ? ` (+${day.bookings.length - 2})` : ""}
                                          </Typography>
                                        ) : (
                                          <Typography variant="body2" color="success.main">
                                            Ledig
                                          </Typography>
                                        )}
                                      </Box>
                                    ))}
                                  </Stack>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
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
                        <MenuItem value="ORGANIZATION">Forening</MenuItem>
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

                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="flex-start"
                    sx={{ width: "100%", m: 0 }}
                  >
                    {filteredBookings.map((booking) => {
                      const edit = bookingEdits[booking.id];
                      if (!edit) return null;

                      const depositPaid = edit.depositStatus === JanhusJanHusBookingDepositStatusChoices.Paid;
                      const isExpanded = Boolean(expandedBookingIds[booking.id]);

                      return (
                        <Grid
                          item
                          xs={12}
                          md={6}
                          key={booking.id}
                          sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}
                        >
                          <Accordion
                            expanded={isExpanded}
                            onChange={(_event, expanded) =>
                              setExpandedBookingIds((current) => ({
                                ...current,
                                [booking.id]: expanded,
                              }))
                            }
                            disableGutters
                            elevation={0}
                            sx={{
                              width: "100%",
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 1,
                              overflow: "hidden",
                              "&:before": { display: "none" },
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMore />}
                              sx={{
                                px: 2,
                                "& .MuiAccordionSummary-content": {
                                  my: 1,
                                },
                              }}
                            >
                              <Stack spacing={0.5} width="100%" pr={1}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Typography variant="h6">Booking #{booking.id}</Typography>
                                  <Chip
                                    size="small"
                                    color={statusChipColor(edit.status)}
                                    label={BOOKING_STATUS_LABELS[edit.status] ?? edit.status}
                                  />
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(booking.startsAt)} kl. {formatTime(booking.startsAt)}–
                                  {formatTime(booking.endsAt)} · {AREA_LABELS[booking.area] ?? booking.area} ·{" "}
                                  {OWNER_TYPE_LABELS[bookingOwnerType(booking)]}
                                </Typography>
                              </Stack>
                            </AccordionSummary>
                            <AccordionDetails sx={{ pt: 0, px: 2, pb: 2 }}>
                              <Stack spacing={1.5}>
                                <Box display="grid" gap={1.5} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
                                  <TextField
                                    label="Fra"
                                    type="datetime-local"
                                    InputLabelProps={{ shrink: true }}
                                    value={edit.startsAt}
                                    onChange={(event) =>
                                      setBookingEdits((prev) => ({
                                        ...prev,
                                        [booking.id]: { ...prev[booking.id], startsAt: event.target.value },
                                      }))
                                    }
                                  />
                                  <TextField
                                    label="Til"
                                    type="datetime-local"
                                    InputLabelProps={{ shrink: true }}
                                    value={edit.endsAt}
                                    onChange={(event) =>
                                      setBookingEdits((prev) => ({
                                        ...prev,
                                        [booking.id]: { ...prev[booking.id], endsAt: event.target.value },
                                      }))
                                    }
                                  />
                                  <FormControl>
                                    <InputLabel>Område</InputLabel>
                                    <Select
                                      label="Område"
                                      value={edit.area}
                                      onChange={(event) =>
                                        setBookingEdits((prev) => ({
                                          ...prev,
                                          [booking.id]: { ...prev[booking.id], area: event.target.value },
                                        }))
                                      }
                                    >
                                      <MenuItem value="FIRST_FLOOR">1. etasje</MenuItem>
                                      <MenuItem value="SECOND_FLOOR">2. etasje</MenuItem>
                                      <MenuItem value="ENTIRE_HOUSE">Hele huset</MenuItem>
                                    </Select>
                                  </FormControl>
                                  <FormControl>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                      label="Status"
                                      value={edit.status}
                                      onChange={(event) =>
                                        setBookingEdits((prev) => ({
                                          ...prev,
                                          [booking.id]: { ...prev[booking.id], status: event.target.value },
                                        }))
                                      }
                                    >
                                      {Object.entries(BOOKING_STATUS_LABELS).map(([value, label]) => (
                                        <MenuItem key={value} value={value}>
                                          {label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  <FormControl>
                                    <InputLabel>Arrangementstype</InputLabel>
                                    <Select
                                      label="Arrangementstype"
                                      value={edit.eventType}
                                      onChange={(event) =>
                                        setBookingEdits((prev) => ({
                                          ...prev,
                                          [booking.id]: { ...prev[booking.id], eventType: event.target.value },
                                        }))
                                      }
                                    >
                                      {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                                        <MenuItem key={value} value={value}>
                                          {label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  <FormControl>
                                    <InputLabel>Depositumstatus</InputLabel>
                                    <Select
                                      label="Depositumstatus"
                                      value={edit.depositStatus}
                                      onChange={(event) =>
                                        setBookingEdits((prev) => ({
                                          ...prev,
                                          [booking.id]: { ...prev[booking.id], depositStatus: event.target.value },
                                        }))
                                      }
                                    >
                                      {Object.entries(DEPOSIT_STATUS_LABELS).map(([value, label]) => (
                                        <MenuItem key={value} value={value}>
                                          {label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  <TextField
                                    label="Depositum"
                                    type="number"
                                    value={edit.depositAmount}
                                    onChange={(event) =>
                                      setBookingEdits((prev) => ({
                                        ...prev,
                                        [booking.id]: { ...prev[booking.id], depositAmount: event.target.value },
                                      }))
                                    }
                                  />
                                  <FormControl>
                                    <InputLabel>Åpningspolicy</InputLabel>
                                    <Select
                                      label="Åpningspolicy"
                                      value={edit.doorAccessPolicy}
                                      onChange={(event) =>
                                        setBookingEdits((prev) => ({
                                          ...prev,
                                          [booking.id]: {
                                            ...prev[booking.id],
                                            doorAccessPolicy: event.target.value,
                                          },
                                        }))
                                      }
                                    >
                                      {Object.entries(DOOR_ACCESS_POLICY_LABELS).map(([value, label]) => (
                                        <MenuItem key={value} value={value}>
                                          {label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  {/* <FormControlLabel
                                  control={
                                    <Switch
                                      checked={edit.cleaningRequested}
                                      onChange={(event) =>
                                        setBookingEdits((prev) => ({
                                          ...prev,
                                          [booking.id]: {
                                            ...prev[booking.id],
                                            cleaningRequested: event.target.checked,
                                          },
                                        }))
                                      }
                                    />
                                  }
                                  label="Innleid renhold"
                                /> */}
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={depositPaid}
                                        onChange={(event) =>
                                          setBookingEdits((prev) => ({
                                            ...prev,
                                            [booking.id]: {
                                              ...prev[booking.id],
                                              depositStatus: event.target.checked
                                                ? JanhusJanHusBookingDepositStatusChoices.Paid
                                                : JanhusJanHusBookingDepositStatusChoices.Required,
                                            },
                                          }))
                                        }
                                      />
                                    }
                                    label="Depositum betalt"
                                  />
                                  <TextField
                                    label="Bestiller navn"
                                    value={edit.bookerName}
                                    onChange={(event) =>
                                      setBookingEdits((prev) => ({
                                        ...prev,
                                        [booking.id]: { ...prev[booking.id], bookerName: event.target.value },
                                      }))
                                    }
                                  />
                                  <TextField
                                    label="Ansvarlig navn"
                                    value={edit.responsibleName}
                                    onChange={(event) =>
                                      setBookingEdits((prev) => ({
                                        ...prev,
                                        [booking.id]: { ...prev[booking.id], responsibleName: event.target.value },
                                      }))
                                    }
                                  />
                                  <TextField
                                    label="Bestiller e-post"
                                    value={edit.bookerEmail}
                                    onChange={(event) =>
                                      setBookingEdits((prev) => ({
                                        ...prev,
                                        [booking.id]: { ...prev[booking.id], bookerEmail: event.target.value },
                                      }))
                                    }
                                  />
                                  <TextField
                                    label="Ansvarlig e-post"
                                    value={edit.responsibleEmail}
                                    onChange={(event) =>
                                      setBookingEdits((prev) => ({
                                        ...prev,
                                        [booking.id]: { ...prev[booking.id], responsibleEmail: event.target.value },
                                      }))
                                    }
                                  />
                                  <TextField
                                    label="Bestiller telefon"
                                    value={edit.bookerPhone}
                                    onChange={(event) =>
                                      setBookingEdits((prev) => ({
                                        ...prev,
                                        [booking.id]: { ...prev[booking.id], bookerPhone: event.target.value },
                                      }))
                                    }
                                  />
                                  <TextField
                                    label="Ansvarlig telefon"
                                    value={edit.responsiblePhone}
                                    onChange={(event) =>
                                      setBookingEdits((prev) => ({
                                        ...prev,
                                        [booking.id]: { ...prev[booking.id], responsiblePhone: event.target.value },
                                      }))
                                    }
                                  />
                                </Box>

                                <TextField
                                  label="Kommentar"
                                  multiline
                                  minRows={2}
                                  value={edit.comment}
                                  onChange={(event) =>
                                    setBookingEdits((prev) => ({
                                      ...prev,
                                      [booking.id]: { ...prev[booking.id], comment: event.target.value },
                                    }))
                                  }
                                />
                                <Box>
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Gjesteliste: {edit.guestListEntries.length} registrert
                                  </Typography>
                                  {edit.guestListEntries.length ? (
                                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                      {edit.guestListEntries.map((guest) => guest.displayName).join(", ")}
                                    </Typography>
                                  ) : null}
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => setActiveGuestListBookingId(booking.id)}
                                  >
                                    Rediger gjesteliste
                                  </Button>
                                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                                    Endringen lagres når du klikker «Lagre endringer».
                                  </Typography>
                                </Box>
                                <TextField
                                  label="Adminkommentar"
                                  multiline
                                  minRows={2}
                                  value={edit.adminComment}
                                  onChange={(event) =>
                                    setBookingEdits((prev) => ({
                                      ...prev,
                                      [booking.id]: { ...prev[booking.id], adminComment: event.target.value },
                                    }))
                                  }
                                />

                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => handleSaveBooking(booking.id)}
                                    disabled={bookingUpdating}
                                  >
                                    Lagre endringer
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() =>
                                      handleCreatePaymentProduct(booking.id, booking.ownerOrganization?.id)
                                    }
                                    disabled={creatingPaymentProduct || Boolean(booking.ownerOrganization)}
                                  >
                                    {booking.ownerOrganization
                                      ? "Intern håndtering (ingen Vipps)"
                                      : "Opprett Vipps-betaling"}
                                  </Button>
                                  <Button
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    onClick={() => handleDeleteBooking(booking.id)}
                                    disabled={deletingBooking}
                                  >
                                    Slett booking
                                  </Button>
                                </Stack>

                                <Typography variant="caption" color="text.secondary">
                                  Prisberegning nå: {booking.totalPrice ?? "-"}
                                </Typography>
                              </Stack>
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Stack>
              </TabPanel>
            </Box>
          </Box>

          {activeGuestListBooking ? (
            <GuestListDialog
              bookingId={activeGuestListBooking.id}
              open={Boolean(activeGuestListBooking)}
              allowManualEntries
              initialGuests={bookingEdits[activeGuestListBooking.id]?.guestListEntries ?? []}
              saving={bookingUpdating}
              onClose={() => setActiveGuestListBookingId(undefined)}
              onSave={(guests) => {
                setBookingEdits((current) => {
                  const currentBookingEdit = current[activeGuestListBooking.id];
                  if (!currentBookingEdit) {
                    return current;
                  }

                  return {
                    ...current,
                    [activeGuestListBooking.id]: {
                      ...currentBookingEdit,
                      guestListEntries: guests,
                    },
                  };
                });
                setActiveGuestListBookingId(undefined);
              }}
            />
          ) : null}
        </PermissionRequired>
      </Container>
    </>
  );
};

JanHusAdminPage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);

export default JanHusAdminPage;
