import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Button, Stack, Typography } from "@mui/material";

import { REQUEST_STATUS_LABELS } from "@/components/pages/janhus/constants";

import { AdminFilters } from "./AdminFilters";
import type { AdminArea, AdminBookingRequest } from "./adminTypes";
import { RequestList } from "./RequestList";
import type { AdminFilterState } from "./useFilteredAdminRows";

type BookingRequestTabProps = Readonly<{
  areas: readonly AdminArea[];
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

export function BookingRequestTab({
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
  const filtersPanel = <AdminFilters areas={areas} statusLabels={REQUEST_STATUS_LABELS} filters={filters} />;
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
