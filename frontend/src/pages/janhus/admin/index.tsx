import { useMutation, useQuery } from "@apollo/client/react";
import { History, Nfc, Settings } from "@mui/icons-material";
import { Alert, Box, Button, Container, Stack, Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { PermissionRequired } from "@/components/Auth";
import { TabPanel } from "@/components/pages/about/TabPanel";
import {
  adminPanelStyles,
  BookingRequestTab,
  BookingTab,
  JanHusAdminDialogs,
  mergeBookingEdits,
  mergeRequestComments,
  useFilteredAdminRows,
  type BookingEdit,
  type PendingDelete,
} from "@/components/pages/janhus/admin";
import type { JanHusGuestListEntry } from "@/components/pages/janhus/GuestListDialog";
import {
  bookingOwnerType,
  describeOverlaps,
  isClosedBooking,
  isPast,
  requestOwnerType,
  serializeGuestListForUpdate,
} from "@/components/pages/janhus/helpers";
import { Title } from "@/components/Title";
import {
  AdminEditCapabilitiesDocument,
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

const JanHusAdminPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState<number>(0);
  const [alert, setAlert] = useState<{ severity: "success" | "error"; message: string } | undefined>();

  // janhus.manage_booking may change everything. janhus.view_all_bookings only sees the same page with
  // every field disabled and every action hidden; the backend refuses their mutations regardless.
  const { data: accessData } = useQuery(JanHusAdminAccessDocument);
  const canManage = accessData?.canManage ?? false;
  const canView = canManage || (accessData?.canView ?? false);
  const { data: capabilityData } = useQuery(AdminEditCapabilitiesDocument);

  const { data: bookingsData, refetch: refetchBookings } = useQuery(AdminJanHusBookingsDocument);
  const { data: requestsData, refetch: refetchRequests } = useQuery(JanHusBookingRequestsDocument);
  const { data: areasData } = useQuery(JanHusAreasDocument, {
    variables: { includeInactive: true },
  });
  const areas = useMemo(() => areasData?.janhusAreas ?? [], [areasData]);

  const [requestComments, setRequestComments] = useState<Record<string, string>>({});
  const [requestMessages, setRequestMessages] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | undefined>();
  const [bookingEdits, setBookingEdits] = useState<Record<string, BookingEdit>>({});
  const [activeGuestListBookingId, setActiveGuestListBookingId] = useState<string | undefined>();
  const [expandedBookingIds, setExpandedBookingIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const requests = requestsData?.janhusBookingRequests;
    if (requests) setRequestComments((current) => mergeRequestComments(current, requests));
  }, [requestsData]);

  useEffect(() => {
    const bookingList = bookingsData?.adminJanhusBookings;
    if (bookingList) setBookingEdits((current) => mergeBookingEdits(current, bookingList));
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

  const requestFilterState = useFilteredAdminRows(bookingRequests, requestOwnerType, "startsAt");
  const bookingFilterState = useFilteredAdminRows(bookings, bookingOwnerType, "startsAt");
  const filteredRequests = requestFilterState.filteredRows;
  const filteredBookings = bookingFilterState.filteredRows;

  const openRequests = useMemo(
    () => filteredRequests.filter((request) => request.status !== "REJECTED" && !isPast(request.endsAt)),
    [filteredRequests]
  );

  const archivedRequests = useMemo(
    () => filteredRequests.filter((request) => request.status === "REJECTED" || isPast(request.endsAt)),
    [filteredRequests]
  );

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

  const bookingToDelete =
    pendingDelete?.kind === "booking" ? bookings.find((booking) => booking.id === pendingDelete.id) : undefined;
  const deletionIsMailed = Boolean(
    bookingToDelete &&
    ["PENDING_ADMIN_REVIEW", "CONFIRMED"].includes(bookingToDelete.status) &&
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

  function handleSaveGuestList(bookingId: string, guests: JanHusGuestListEntry[]) {
    setBookingEdits((current) => {
      const currentBookingEdit = current[bookingId];
      if (!currentBookingEdit) {
        return current;
      }
      return {
        ...current,
        [bookingId]: { ...currentBookingEdit, guestListEntries: guests },
      };
    });
    setActiveGuestListBookingId(undefined);
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
      <Container sx={(theme) => ({ py: 4, ...adminPanelStyles(theme) })}>
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
                {capabilityData?.canManageUserNfc ? (
                  <Button startIcon={<Nfc />} onClick={() => router.push("/admin-edit/nfc")}>
                    NFC-kort
                  </Button>
                ) : null}
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
                  <BookingRequestTab
                    areas={areas}
                    filters={requestFilterState}
                    openRequests={openRequests}
                    archivedRequests={archivedRequests}
                    comments={requestComments}
                    messages={requestMessages}
                    reviewing={requestReviewing}
                    deleting={deletingRequest}
                    readOnly={!canManage}
                    onRefresh={() => refetchRequests()}
                    onCommentChange={(id, value) => setRequestComments((current) => ({ ...current, [id]: value }))}
                    onMessageChange={(id, value) => setRequestMessages((current) => ({ ...current, [id]: value }))}
                    onReview={handleReviewRequest}
                    onDelete={(id) => setPendingDelete({ kind: "request", id })}
                  />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <BookingTab
                    areas={areas}
                    filters={bookingFilterState}
                    bookings={bookings}
                    openBookings={openBookings}
                    archivedBookings={archivedBookings}
                    edits={bookingEdits}
                    setEdits={setBookingEdits}
                    expandedBookingIds={expandedBookingIds}
                    setExpandedBookingIds={setExpandedBookingIds}
                    updating={bookingUpdating}
                    deleting={deletingBooking}
                    creatingPaymentProduct={creatingPaymentProduct}
                    readOnly={!canManage}
                    onRefresh={() => refetchBookings()}
                    onSave={handleSaveBooking}
                    onCreatePaymentProduct={handleCreatePaymentProduct}
                    onDelete={(id) => setPendingDelete({ kind: "booking", id })}
                    onOpenGuestList={setActiveGuestListBookingId}
                  />
                </TabPanel>
              </Box>
            </Box>

            <JanHusAdminDialogs
              canManage={canManage}
              pendingDelete={pendingDelete}
              deletionIsMailed={deletionIsMailed}
              deletingBooking={deletingBooking}
              deletingRequest={deletingRequest}
              activeGuestListBooking={activeGuestListBooking}
              activeGuestListEntries={
                activeGuestListBooking ? (bookingEdits[activeGuestListBooking.id]?.guestListEntries ?? []) : []
              }
              bookingUpdating={bookingUpdating}
              onCancelDelete={() => setPendingDelete(undefined)}
              onConfirmDelete={handleConfirmDelete}
              onCloseGuestList={() => setActiveGuestListBookingId(undefined)}
              onSaveGuestList={handleSaveGuestList}
            />
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
