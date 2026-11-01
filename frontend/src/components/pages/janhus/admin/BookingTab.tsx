import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Button, Stack, Typography } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";

import { BOOKING_STATUS_LABELS } from "@/components/pages/janhus/constants";

import { AdminFilters } from "./AdminFilters";
import type { AdminArea, AdminBooking, BookingEdit } from "./adminTypes";
import { AvailabilityOverview } from "./AvailabilityOverview";
import { BookingList } from "./BookingList";
import type { AdminFilterState } from "./useFilteredAdminRows";

type BookingTabProps = Readonly<{
  areas: readonly AdminArea[];
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

export function BookingTab({
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
  const filtersPanel = <AdminFilters areas={areas} statusLabels={BOOKING_STATUS_LABELS} filters={filters} />;
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
