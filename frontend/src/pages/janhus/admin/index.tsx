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
import { useEffect, useMemo, useState, type ComponentProps, type Dispatch, type SetStateAction } from "react";

import { PermissionRequired } from "@/components/Auth";
import { TabPanel } from "@/components/pages/about/TabPanel";
import {
  AdminFilters,
  adminPanelStyles,
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
import type { AdminJanHusBookingsQuery, JanHusBookingRequestsQuery } from "@/generated/graphql";
import { Layout, RootStyle } from "@/layouts/Layout";
import dayjs from "@/lib/date";
import { NextPageWithLayout } from "@/lib/next";

/** A linked website user as the door access pickers show it. */
function pickedUser(user: { id: string; firstName: string; lastName: string } | null | undefined) {
  return user ? { id: user.id, displayName: `${user.firstName} ${user.lastName}`.trim() } : null;
}

function getDeletionDescription(kind: "booking" | "request", isMailed: boolean) {
  if (kind === "request") {
    return "Forespørselen slettes for godt, og bestilleren får ingen e-post. Vil du gi beskjed, bruk «Avvis».";
  }
  if (isMailed) {
    return "Bookingen slettes for godt. Bestilleren og ansvarlig får en e-post om at den er slettet.";
  }
  return "Bookingen slettes for godt. Den er over, avslått eller kansellert, så ingen får e-post.";
}

type AdminFilterableRow = {
  startsAt: string;
  area: { id: string; name: string };
  status: string;
  eventType: string;
};

type AdminRowFilters = {
  date: string;
  area: string;
  status: string;
  eventType: string;
  ownerType: "ALL" | OwnerType;
};

type AdminFilterState<T extends AdminFilterableRow> = {
  filteredRows: T[];
  dateFilter: string;
  setDateFilter: Dispatch<SetStateAction<string>>;
  areaFilter: string;
  setAreaFilter: Dispatch<SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: Dispatch<SetStateAction<string>>;
  eventTypeFilter: string;
  setEventTypeFilter: Dispatch<SetStateAction<string>>;
  ownerTypeFilter: "ALL" | OwnerType;
  setOwnerTypeFilter: Dispatch<SetStateAction<"ALL" | OwnerType>>;
  sortBy: SortBy;
  setSortBy: Dispatch<SetStateAction<SortBy>>;
  sortDirection: SortDirection;
  setSortDirection: Dispatch<SetStateAction<SortDirection>>;
};

type AdminFilterAreas = ComponentProps<typeof BookingList>["areas"];
type AdminBooking = NonNullable<AdminJanHusBookingsQuery["adminJanhusBookings"]>[number];
type AdminBookingRequest = NonNullable<JanHusBookingRequestsQuery["janhusBookingRequests"]>[number];

type BookingEdit = {
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
};

type PendingDelete = { kind: "booking" | "request"; id: string };

function mergeRequestComments(current: Record<string, string>, requests: readonly AdminBookingRequest[]) {
  const next = { ...current };
  for (const request of requests) {
    next[request.id] ??= request.adminComment || "";
  }
  return next;
}

function bookingEditFrom(booking: AdminBooking): BookingEdit {
  return {
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

function mergeBookingEdits(current: Record<string, BookingEdit>, bookings: readonly AdminBooking[]) {
  const next = { ...current };
  for (const booking of bookings) {
    next[booking.id] ??= bookingEditFrom(booking);
  }
  return next;
}

function matchesAdminFilters<T extends AdminFilterableRow>(
  row: T,
  filters: AdminRowFilters,
  getOwnerType: (row: T) => OwnerType
) {
  if (filters.date && toDateKey(row.startsAt) !== filters.date) return false;
  if (filters.area !== "ALL" && row.area.id !== filters.area) return false;
  if (filters.status !== "ALL" && row.status !== filters.status) return false;
  if (filters.eventType !== "ALL" && row.eventType !== filters.eventType) return false;
  if (filters.ownerType !== "ALL" && getOwnerType(row) !== filters.ownerType) return false;
  return true;
}

function compareAdminRows<T extends AdminFilterableRow>(
  left: T,
  right: T,
  sortBy: SortBy,
  getOwnerType: (row: T) => OwnerType
) {
  if (sortBy === "startsAt") {
    return new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime();
  }
  if (sortBy === "area") {
    return left.area.name.localeCompare(right.area.name);
  }
  if (sortBy === "eventType") {
    return left.eventType.localeCompare(right.eventType);
  }
  if (sortBy === "status") {
    return left.status.localeCompare(right.status);
  }
  return getOwnerType(left).localeCompare(getOwnerType(right));
}

function filterAndSortAdminRows<T extends AdminFilterableRow>(
  rows: T[],
  filters: AdminRowFilters,
  sortBy: SortBy,
  sortDirection: SortDirection,
  getOwnerType: (row: T) => OwnerType
) {
  const sortFactor = sortDirection === "asc" ? 1 : -1;
  return [...rows]
    .filter((row) => matchesAdminFilters(row, filters, getOwnerType))
    .sort((left, right) => compareAdminRows(left, right, sortBy, getOwnerType) * sortFactor);
}

function useFilteredAdminRows<T extends AdminFilterableRow>(
  rows: T[],
  getOwnerType: (row: T) => OwnerType,
  initialSortBy: SortBy
) {
  const [dateFilter, setDateFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [eventTypeFilter, setEventTypeFilter] = useState("ALL");
  const [ownerTypeFilter, setOwnerTypeFilter] = useState<"ALL" | OwnerType>("ALL");
  const [sortBy, setSortBy] = useState<SortBy>(initialSortBy);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const filteredRows = useMemo(
    () =>
      filterAndSortAdminRows(
        rows,
        {
          date: dateFilter,
          area: areaFilter,
          status: statusFilter,
          eventType: eventTypeFilter,
          ownerType: ownerTypeFilter,
        },
        sortBy,
        sortDirection,
        getOwnerType
      ),
    [areaFilter, dateFilter, eventTypeFilter, getOwnerType, ownerTypeFilter, rows, sortBy, sortDirection, statusFilter]
  );
  return {
    filteredRows,
    dateFilter,
    setDateFilter,
    areaFilter,
    setAreaFilter,
    statusFilter,
    setStatusFilter,
    eventTypeFilter,
    setEventTypeFilter,
    ownerTypeFilter,
    setOwnerTypeFilter,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
  };
}

type JanHusAdminDialogsProps = Readonly<{
  canManage: boolean;
  pendingDelete: PendingDelete | undefined;
  deletionIsMailed: boolean;
  deletingBooking: boolean;
  deletingRequest: boolean;
  activeGuestListBooking: AdminBooking | undefined;
  activeGuestListEntries: JanHusGuestListEntry[];
  bookingUpdating: boolean;
  onCancelDelete: () => void;
  onConfirmDelete: (message: string) => void | Promise<void>;
  onCloseGuestList: () => void;
  onSaveGuestList: (bookingId: string, guests: JanHusGuestListEntry[]) => void;
}>;

type BookingRequestTabProps = Readonly<{
  areas: AdminFilterAreas;
  filters: AdminFilterState<AdminBookingRequest>;
  openRequests: AdminBookingRequest[];
  archivedRequests: AdminBookingRequest[];
  comments: Record<string, string>;
  messages: Record<string, string>;
  reviewing: boolean;
  deleting: boolean;
  readOnly: boolean;
  onRefresh: () => void;
  onCommentChange: (id: string, value: string) => void;
  onMessageChange: (id: string, value: string) => void;
  onReview: (id: string, status: "APPROVED" | "REJECTED", convertToBooking: boolean) => void;
  onDelete: (id: string) => void;
}>;

function BookingRequestTab({
  areas,
  filters,
  openRequests,
  archivedRequests,
  comments,
  messages,
  reviewing,
  deleting,
  readOnly,
  onRefresh,
  onCommentChange,
  onMessageChange,
  onReview,
  onDelete,
}: BookingRequestTabProps) {
  const filtersPanel = (
    <AdminFilters
      areas={areas}
      statusLabels={REQUEST_STATUS_LABELS}
      dateFilter={filters.dateFilter}
      areaFilter={filters.areaFilter}
      ownerTypeFilter={filters.ownerTypeFilter}
      eventTypeFilter={filters.eventTypeFilter}
      statusFilter={filters.statusFilter}
      sortBy={filters.sortBy}
      sortDirection={filters.sortDirection}
      onDateFilterChange={filters.setDateFilter}
      onAreaFilterChange={filters.setAreaFilter}
      onOwnerTypeFilterChange={filters.setOwnerTypeFilter}
      onEventTypeFilterChange={filters.setEventTypeFilter}
      onStatusFilterChange={filters.setStatusFilter}
      onSortByChange={filters.setSortBy}
      onSortDirectionChange={filters.setSortDirection}
    />
  );
  const requestList = (requests: AdminBookingRequest[]) => (
    <RequestList
      requests={requests}
      comments={comments}
      reviewing={reviewing}
      deleting={deleting}
      onCommentChange={onCommentChange}
      messages={messages}
      onMessageChange={onMessageChange}
      onReview={onReview}
      onDelete={onDelete}
      readOnly={readOnly}
    />
  );

  return (
    <Stack spacing={2} mt={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Bookingforespørsler</Typography>
        <Button variant="text" onClick={onRefresh}>
          Oppdater
        </Button>
      </Stack>
      {filtersPanel}
      {openRequests.length ? (
        requestList(openRequests)
      ) : (
        <Typography color="text.secondary">Ingen forespørsler å behandle.</Typography>
      )}
      {archivedRequests.length ? (
        <Accordion
          disableGutters
          elevation={0}
          variant="outlined"
          defaultExpanded={filters.statusFilter === "REJECTED"}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1">Tidligere og avslåtte forespørsler ({archivedRequests.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>{requestList(archivedRequests)}</AccordionDetails>
        </Accordion>
      ) : null}
    </Stack>
  );
}

type BookingTabProps = Readonly<{
  areas: AdminFilterAreas;
  filters: AdminFilterState<AdminBooking>;
  bookings: AdminBooking[];
  openBookings: AdminBooking[];
  archivedBookings: AdminBooking[];
  edits: Record<string, BookingEdit>;
  setEdits: Dispatch<SetStateAction<Record<string, BookingEdit>>>;
  expandedBookingIds: Record<string, boolean>;
  setExpandedBookingIds: Dispatch<SetStateAction<Record<string, boolean>>>;
  updating: boolean;
  deleting: boolean;
  creatingPaymentProduct: boolean;
  readOnly: boolean;
  onRefresh: () => void;
  onSave: (id: string) => void | Promise<void>;
  onCreatePaymentProduct: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void;
  onOpenGuestList: (id: string) => void;
}>;

function BookingTab({
  areas,
  filters,
  bookings,
  openBookings,
  archivedBookings,
  edits,
  setEdits,
  expandedBookingIds,
  setExpandedBookingIds,
  updating,
  deleting,
  creatingPaymentProduct,
  readOnly,
  onRefresh,
  onSave,
  onCreatePaymentProduct,
  onDelete,
  onOpenGuestList,
}: BookingTabProps) {
  const filtersPanel = (
    <AdminFilters
      areas={areas}
      statusLabels={BOOKING_STATUS_LABELS}
      dateFilter={filters.dateFilter}
      areaFilter={filters.areaFilter}
      ownerTypeFilter={filters.ownerTypeFilter}
      eventTypeFilter={filters.eventTypeFilter}
      statusFilter={filters.statusFilter}
      sortBy={filters.sortBy}
      sortDirection={filters.sortDirection}
      onDateFilterChange={filters.setDateFilter}
      onAreaFilterChange={filters.setAreaFilter}
      onOwnerTypeFilterChange={filters.setOwnerTypeFilter}
      onEventTypeFilterChange={filters.setEventTypeFilter}
      onStatusFilterChange={filters.setStatusFilter}
      onSortByChange={filters.setSortBy}
      onSortDirectionChange={filters.setSortDirection}
    />
  );
  const bookingList = (items: AdminBooking[]) => (
    <BookingList
      bookings={items}
      areas={areas}
      edits={edits}
      setEdits={setEdits}
      expanded={expandedBookingIds}
      setExpanded={setExpandedBookingIds}
      updating={updating}
      deleting={deleting}
      creatingPaymentProduct={creatingPaymentProduct}
      onSave={onSave}
      onCreatePaymentProduct={onCreatePaymentProduct}
      onDelete={onDelete}
      onOpenGuestList={onOpenGuestList}
      readOnly={readOnly}
    />
  );

  return (
    <Stack spacing={2} mt={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Bookinger</Typography>
        <Button variant="text" onClick={onRefresh}>
          Oppdater
        </Button>
      </Stack>
      <AvailabilityOverview areas={areas} bookings={bookings} />
      {filtersPanel}
      {openBookings.length ? (
        bookingList(openBookings)
      ) : (
        <Typography color="text.secondary">Ingen aktive bookinger.</Typography>
      )}
      {archivedBookings.length ? (
        <Accordion
          disableGutters
          elevation={0}
          variant="outlined"
          defaultExpanded={["DECLINED", "CANCELLED"].includes(filters.statusFilter)}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1">Tidligere og avslåtte bookinger ({archivedBookings.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>{bookingList(archivedBookings)}</AccordionDetails>
        </Accordion>
      ) : null}
    </Stack>
  );
}

function JanHusAdminDialogs({
  canManage,
  pendingDelete,
  deletionIsMailed,
  deletingBooking,
  deletingRequest,
  activeGuestListBooking,
  activeGuestListEntries,
  bookingUpdating,
  onCancelDelete,
  onConfirmDelete,
  onCloseGuestList,
  onSaveGuestList,
}: JanHusAdminDialogsProps) {
  return (
    <>
      {canManage && pendingDelete ? (
        <DeleteDialog
          key={`${pendingDelete.kind}-${pendingDelete.id}`}
          open
          title={
            pendingDelete.kind === "booking"
              ? `Slette booking #${pendingDelete.id}?`
              : `Slette forespørsel #${pendingDelete.id}?`
          }
          description={getDeletionDescription(pendingDelete.kind, deletionIsMailed)}
          allowMessage={deletionIsMailed}
          deleting={deletingBooking || deletingRequest}
          onCancel={onCancelDelete}
          onConfirm={onConfirmDelete}
        />
      ) : null}

      {canManage && activeGuestListBooking ? (
        <GuestListDialog
          bookingId={activeGuestListBooking.id}
          open
          allowManualEntries
          initialGuests={activeGuestListEntries}
          saving={bookingUpdating}
          onClose={onCloseGuestList}
          onSave={(guests) => onSaveGuestList(activeGuestListBooking.id, guests)}
        />
      ) : null}
    </>
  );
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
