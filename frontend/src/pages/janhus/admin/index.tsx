import { useMutation, useQuery } from "@apollo/client/react";
import { ExpandMore, History, Settings } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Container,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { PermissionRequired } from "@/components/Auth";
import { TabPanel } from "@/components/pages/about/TabPanel";
import {
  AdminFilters,
  AvailabilityOverview,
  BookingList,
  DeleteDialog,
  RequestList,
} from "@/components/pages/janhus/admin";
import {
  BOOKING_STATUS_LABELS,
  OwnerType,
  REQUEST_STATUS_LABELS,
  SortBy,
  SortDirection,
} from "@/components/pages/janhus/constants";
import { GuestListDialog, JanHusGuestListEntry } from "@/components/pages/janhus/GuestListDialog";
import {
  bookingOwnerType,
  describeOverlaps,
  isClosedBooking,
  isPast,
  requestOwnerType,
  serializeGuestListForUpdate,
  toDateKey,
  toDateTimeInput,
} from "@/components/pages/janhus/helpers";
import { Title } from "@/components/Title";
import {
  AdminJanHusBookingsDocument,
  CreateJanhusPaymentProductDocument,
  DeleteJanhusBookingDocument,
  DeleteJanhusBookingRequestDocument,
  JanHusAdminAccessDocument,
  JanHusAreasDocument,
  JanHusBookingRequestsDocument,
  ReviewJanhusBookingRequestDocument,
  UpdateJanhusBookingDocument,
} from "@/generated/graphql";
import { Layout, RootStyle } from "@/layouts/Layout";
import dayjs from "@/lib/date";
import { NextPageWithLayout } from "@/lib/next";

/** A linked website user as the door access pickers show it. */
function pickedUser(user: { id: string; firstName: string; lastName: string } | null | undefined) {
  return user ? { id: user.id, displayName: `${user.firstName} ${user.lastName}`.trim() } : null;
}

const JanHusAdminPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState<number>(0);
  const [alert, setAlert] = useState<{ severity: "success" | "error"; message: string } | undefined>();

  // janhus.manage_booking may change everything. janhus.view_all_bookings only sees the same page with
  // every field disabled and every action hidden; the backend refuses their mutations regardless.
  const { data: accessData } = useQuery(JanHusAdminAccessDocument);
  const canManage = accessData?.canManage ?? false;
  const canView = canManage || (accessData?.canView ?? false);

  const { data: bookingsData, refetch: refetchBookings } = useQuery(AdminJanHusBookingsDocument);
  const { data: requestsData, refetch: refetchRequests } = useQuery(JanHusBookingRequestsDocument);
  const { data: areasData } = useQuery(JanHusAreasDocument, {
    variables: { includeInactive: true },
  });
  const areas = useMemo(() => areasData?.janhusAreas ?? [], [areasData]);

  const [requestComments, setRequestComments] = useState<Record<string, string>>({});
  const [requestMessages, setRequestMessages] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<{ kind: "booking" | "request"; id: string } | undefined>();
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
        priceOverrideTier: string;
        priceOverrideAmount: string;
        manuallyMarkedAsPaid: boolean;
        guestListEntries: JanHusGuestListEntry[];
        doorAccessPolicy: string;
        organizationDoorAccess: string;
        bookerUser: { id: string; displayName: string } | null;
        responsibleUser: { id: string; displayName: string } | null;
        comment: string;
        adminComment: string;
        bookerMessage: string;
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
  const [requestSortBy, setRequestSortBy] = useState<SortBy>("startsAt");
  const [requestSortDirection, setRequestSortDirection] = useState<SortDirection>("asc");

  const [bookingDateFilter, setBookingDateFilter] = useState("");
  const [bookingAreaFilter, setBookingAreaFilter] = useState("ALL");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("ALL");
  const [bookingEventTypeFilter, setBookingEventTypeFilter] = useState("ALL");
  const [bookingOwnerTypeFilter, setBookingOwnerTypeFilter] = useState<"ALL" | OwnerType>("ALL");
  const [bookingSortBy, setBookingSortBy] = useState<SortBy>("startsAt");
  const [bookingSortDirection, setBookingSortDirection] = useState<SortDirection>("asc");

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
            area: booking.area.id,
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
            priceOverrideTier: booking.priceOverrideTier ?? "",
            priceOverrideAmount: booking.priceOverrideAmount != null ? String(booking.priceOverrideAmount) : "",
            manuallyMarkedAsPaid: booking.manuallyMarkedAsPaid,
            guestListEntries: (booking.guestListEntries ?? []).map((guest) => ({
              feideUserId: guest.feideUserid,
              displayName: guest.displayName,
            })),
            doorAccessPolicy: booking.doorAccessPolicy,
            organizationDoorAccess: booking.organizationDoorAccess,
            bookerUser: pickedUser(booking.bookerUser),
            responsibleUser: pickedUser(booking.responsibleUser),
            comment: booking.comment ?? "",
            adminComment: booking.adminComment ?? "",
            bookerMessage: booking.bookerMessage ?? "",
          };
        }
      });
      return next;
    });
  }, [bookingsData]);

  const [reviewRequest, { loading: requestReviewing }] = useMutation(ReviewJanhusBookingRequestDocument, {
    onCompleted: async (result) => {
      const createdBookingId = result.reviewJanhusBookingRequest?.booking?.id;
      const overlapWarning = describeOverlaps(result.reviewJanhusBookingRequest?.overlappingBookings);
      setAlert({
        severity: overlapWarning ? "error" : "success",
        message: [
          createdBookingId
            ? `Forespørsel behandlet. Opprettet booking #${createdBookingId}.`
            : "Forespørsel behandlet.",
          overlapWarning,
        ]
          .filter(Boolean)
          .join(" "),
      });
      await Promise.all([refetchRequests(), refetchBookings()]);
    },
    onError: (error) => setAlert({ severity: "error", message: error.message }),
  });

  const [updateBooking, { loading: bookingUpdating }] = useMutation(UpdateJanhusBookingDocument, {
    onCompleted: async (result) => {
      const overlapWarning = describeOverlaps(result.updateJanhusBooking?.overlappingBookings);
      setAlert({
        severity: overlapWarning ? "error" : "success",
        message: ["Booking oppdatert.", overlapWarning].filter(Boolean).join(" "),
      });
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
        if (requestAreaFilter !== "ALL" && request.area.id !== requestAreaFilter) {
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
          return a.area.name.localeCompare(b.area.name) * sortFactor;
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

  const openRequests = useMemo(
    () => filteredRequests.filter((request) => request.status !== "REJECTED" && !isPast(request.endsAt)),
    [filteredRequests]
  );

  const archivedRequests = useMemo(
    () => filteredRequests.filter((request) => request.status === "REJECTED" || isPast(request.endsAt)),
    [filteredRequests]
  );

  const filteredBookings = useMemo(() => {
    const sortFactor = bookingSortDirection === "asc" ? 1 : -1;

    return [...bookings]
      .filter((booking) => {
        if (bookingDateFilter && toDateKey(booking.startsAt) !== bookingDateFilter) {
          return false;
        }
        if (bookingAreaFilter !== "ALL" && booking.area.id !== bookingAreaFilter) {
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
          return a.area.name.localeCompare(b.area.name) * sortFactor;
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

  const openBookings = useMemo(
    () => filteredBookings.filter((booking) => !isClosedBooking(booking)),
    [filteredBookings]
  );

  const archivedBookings = useMemo(() => filteredBookings.filter(isClosedBooking), [filteredBookings]);

  async function handleReviewRequest(id: string, status: "APPROVED" | "REJECTED", convertToBooking: boolean) {
    await reviewRequest({
      variables: {
        reviewData: {
          id,
          status,
          convertToBooking,
          adminComment: requestComments[id] ?? "",
          bookerMessage:
            requestMessages[id] ??
            requestsData?.janhusBookingRequests?.find((request) => request.id === id)?.bookerMessage,
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
          priceOverrideTier: edit.priceOverrideTier,
          priceOverrideAmount: edit.priceOverrideAmount ? Number(edit.priceOverrideAmount) : null,
          manuallyMarkedAsPaid: edit.manuallyMarkedAsPaid,
          guestList: serializeGuestListForUpdate(edit.guestListEntries),
          doorAccessPolicy: edit.doorAccessPolicy,
          organizationDoorAccess: edit.organizationDoorAccess,
          bookerUser: edit.bookerUser?.id ?? "",
          responsibleUser: edit.responsibleUser?.id ?? "",
          comment: edit.comment,
          adminComment: edit.adminComment,
          bookerMessage: edit.bookerMessage,
        },
      },
    });
  }

  async function handleCreatePaymentProduct(bookingId: string) {
    await createPaymentProduct({
      variables: {
        bookingId,
      },
    });
  }

  // The backend mails the booker about a deleted booking only when it is still coming and not declined.
  const bookingToDelete =
    pendingDelete?.kind === "booking" ? bookings.find((booking) => booking.id === pendingDelete.id) : undefined;
  const deletionIsMailed = Boolean(
    bookingToDelete &&
    ["PROVISIONAL", "PENDING_ADMIN_REVIEW", "CONFIRMED"].includes(bookingToDelete.status) &&
    !isPast(bookingToDelete.endsAt)
  );

  async function handleConfirmDelete(message: string) {
    if (!pendingDelete) return;
    const { kind, id } = pendingDelete;
    setPendingDelete(undefined);
    if (kind === "booking") {
      await deleteBooking({ variables: { bookingId: id, message: deletionIsMailed ? message : undefined } });
    } else {
      await deleteRequest({ variables: { requestId: id } });
    }
  }

  return (
    <>
      <Title
        title="Booking adminside"
        overline="Bookinger"
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
        {canView ? (
          <>
            <Stack spacing={0.75} mb={3}>
              {!canManage ? (
                <Alert severity="info">
                  Du har lesetilgang: du kan se alle bookinger og forespørsler, men kan ikke endre dem.
                </Alert>
              ) : null}
              <Box>
                {canManage ? (
                  <Button startIcon={<Settings />} onClick={() => router.push("/janhus/admin/settings")}>
                    Innstillinger
                  </Button>
                ) : null}
                <PermissionRequired permission="nfc.view_door_log">
                  <Button startIcon={<History />} onClick={() => router.push("/janhus/admin/logs")}>
                    Dørlogg
                  </Button>
                </PermissionRequired>
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

                    <AdminFilters
                      areas={areas}
                      statusLabels={REQUEST_STATUS_LABELS}
                      dateFilter={requestDateFilter}
                      areaFilter={requestAreaFilter}
                      ownerTypeFilter={requestOwnerTypeFilter}
                      eventTypeFilter={requestEventTypeFilter}
                      statusFilter={requestStatusFilter}
                      sortBy={requestSortBy}
                      sortDirection={requestSortDirection}
                      onDateFilterChange={setRequestDateFilter}
                      onAreaFilterChange={setRequestAreaFilter}
                      onOwnerTypeFilterChange={setRequestOwnerTypeFilter}
                      onEventTypeFilterChange={setRequestEventTypeFilter}
                      onStatusFilterChange={setRequestStatusFilter}
                      onSortByChange={setRequestSortBy}
                      onSortDirectionChange={setRequestSortDirection}
                    />

                    {openRequests.length ? (
                      <RequestList
                        requests={openRequests}
                        comments={requestComments}
                        reviewing={requestReviewing}
                        deleting={deletingRequest}
                        onCommentChange={(id, value) => setRequestComments((prev) => ({ ...prev, [id]: value }))}
                        messages={requestMessages}
                        onMessageChange={(id, value) => setRequestMessages((prev) => ({ ...prev, [id]: value }))}
                        onReview={handleReviewRequest}
                        onDelete={(id) => setPendingDelete({ kind: "request", id })}
                        readOnly={!canManage}
                      />
                    ) : (
                      <Typography color="text.secondary">Ingen forespørsler å behandle.</Typography>
                    )}

                    {archivedRequests.length ? (
                      <Accordion
                        disableGutters
                        elevation={0}
                        variant="outlined"
                        defaultExpanded={requestStatusFilter === "REJECTED"}
                      >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle1">
                            Tidligere og avslåtte forespørsler ({archivedRequests.length})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <RequestList
                            requests={archivedRequests}
                            comments={requestComments}
                            reviewing={requestReviewing}
                            deleting={deletingRequest}
                            onCommentChange={(id, value) => setRequestComments((prev) => ({ ...prev, [id]: value }))}
                            messages={requestMessages}
                            onMessageChange={(id, value) => setRequestMessages((prev) => ({ ...prev, [id]: value }))}
                            onReview={handleReviewRequest}
                            onDelete={(id) => setPendingDelete({ kind: "request", id })}
                            readOnly={!canManage}
                          />
                        </AccordionDetails>
                      </Accordion>
                    ) : null}
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

                    <AvailabilityOverview areas={areas} bookings={bookings} />

                    <AdminFilters
                      areas={areas}
                      statusLabels={BOOKING_STATUS_LABELS}
                      dateFilter={bookingDateFilter}
                      areaFilter={bookingAreaFilter}
                      ownerTypeFilter={bookingOwnerTypeFilter}
                      eventTypeFilter={bookingEventTypeFilter}
                      statusFilter={bookingStatusFilter}
                      sortBy={bookingSortBy}
                      sortDirection={bookingSortDirection}
                      onDateFilterChange={setBookingDateFilter}
                      onAreaFilterChange={setBookingAreaFilter}
                      onOwnerTypeFilterChange={setBookingOwnerTypeFilter}
                      onEventTypeFilterChange={setBookingEventTypeFilter}
                      onStatusFilterChange={setBookingStatusFilter}
                      onSortByChange={setBookingSortBy}
                      onSortDirectionChange={setBookingSortDirection}
                    />

                    {openBookings.length ? (
                      <BookingList
                        bookings={openBookings}
                        areas={areas}
                        edits={bookingEdits}
                        setEdits={setBookingEdits}
                        expanded={expandedBookingIds}
                        setExpanded={setExpandedBookingIds}
                        updating={bookingUpdating}
                        deleting={deletingBooking}
                        creatingPaymentProduct={creatingPaymentProduct}
                        onSave={handleSaveBooking}
                        onCreatePaymentProduct={handleCreatePaymentProduct}
                        onDelete={(id) => setPendingDelete({ kind: "booking", id })}
                        onOpenGuestList={setActiveGuestListBookingId}
                        readOnly={!canManage}
                      />
                    ) : (
                      <Typography color="text.secondary">Ingen aktive bookinger.</Typography>
                    )}

                    {archivedBookings.length ? (
                      <Accordion
                        disableGutters
                        elevation={0}
                        variant="outlined"
                        defaultExpanded={["DECLINED", "CANCELLED"].includes(bookingStatusFilter)}
                      >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle1">
                            Tidligere og avslåtte bookinger ({archivedBookings.length})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <BookingList
                            bookings={archivedBookings}
                            areas={areas}
                            edits={bookingEdits}
                            setEdits={setBookingEdits}
                            expanded={expandedBookingIds}
                            setExpanded={setExpandedBookingIds}
                            updating={bookingUpdating}
                            deleting={deletingBooking}
                            creatingPaymentProduct={creatingPaymentProduct}
                            onSave={handleSaveBooking}
                            onCreatePaymentProduct={handleCreatePaymentProduct}
                            onDelete={(id) => setPendingDelete({ kind: "booking", id })}
                            onOpenGuestList={setActiveGuestListBookingId}
                            readOnly={!canManage}
                          />
                        </AccordionDetails>
                      </Accordion>
                    ) : null}
                  </Stack>
                </TabPanel>
              </Box>
            </Box>

            {canManage && pendingDelete ? (
              <DeleteDialog
                key={`${pendingDelete.kind}-${pendingDelete.id}`}
                open
                title={
                  pendingDelete.kind === "booking"
                    ? `Slette booking #${pendingDelete.id}?`
                    : `Slette forespørsel #${pendingDelete.id}?`
                }
                description={
                  pendingDelete.kind === "request"
                    ? "Forespørselen slettes for godt, og bestilleren får ingen e-post. Vil du gi beskjed, bruk «Avvis»."
                    : deletionIsMailed
                      ? "Bookingen slettes for godt. Bestilleren og ansvarlig får en e-post om at den er slettet."
                      : "Bookingen slettes for godt. Den er over, avslått eller kansellert, så ingen får e-post."
                }
                allowMessage={deletionIsMailed}
                deleting={deletingBooking || deletingRequest}
                onCancel={() => setPendingDelete(undefined)}
                onConfirm={handleConfirmDelete}
              />
            ) : null}

            {canManage && activeGuestListBooking ? (
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
          </>
        ) : null}
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
