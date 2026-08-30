import { Button, Card, CardContent, Chip, Grid, Stack, TextField, Typography } from "@mui/material";

import { JANHUS_EVENT_TYPE_LABELS } from "@/components/pages/janhus/constants";
import { OWNER_TYPE_LABELS, REQUEST_STATUS_LABELS } from "@/components/pages/janhus/constants";
import { formatDate, formatTime, requestOwnerType, statusColor, statusLabel } from "@/components/pages/janhus/helpers";
import { JanHusBookingRequestFragment } from "@/generated/graphql";

type Props = {
  requests: readonly JanHusBookingRequestFragment[];
  comments: Record<string, string>;
  reviewing: boolean;
  deleting: boolean;
  onCommentChange: (id: string, value: string) => void;
  onReview: (id: string, status: "APPROVED" | "REJECTED", convertToBooking: boolean) => void;
  onDelete: (id: string) => void;
};

export const RequestList: React.FC<Props> = ({
  requests,
  comments,
  reviewing,
  deleting,
  onCommentChange,
  onReview,
  onDelete,
}) => (
  <Grid container spacing={2} justifyContent="center" alignItems="flex-start" sx={{ width: "100%", m: 0 }}>
    {requests.map((request) => (
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
                <Chip size="small" color={statusColor(request)} label={statusLabel(request, REQUEST_STATUS_LABELS)} />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {formatDate(request.startsAt)} kl. {formatTime(request.startsAt)}–{formatTime(request.endsAt)} ·{" "}
                {request.area.name}
              </Typography>
              <Typography variant="body2">
                Eiertype: {OWNER_TYPE_LABELS[requestOwnerType(request)]}
                {request.ownerOrganization?.name ? ` · ${request.ownerOrganization.name}` : ""}
              </Typography>
              <Typography variant="body2">
                Arrangement: {JANHUS_EVENT_TYPE_LABELS[request.eventType] ?? request.eventType} · Innleid renhold:{" "}
                {request.cleaningRequested ? "Ja" : "Nei"}
              </Typography>
              <Typography variant="body2">
                Bestiller: {request.requesterName} ({request.requesterEmail || "-"})
              </Typography>
              <Typography variant="body2">
                Ansvarlig: {request.responsibleName} ({request.responsibleEmail})
              </Typography>
              {request.comment ? (
                <>
                  <Typography variant="body2">Kommentar fra bestiller:</Typography>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2">{request.comment}</Typography>
                    </CardContent>
                  </Card>
                </>
              ) : null}
              <TextField
                size="small"
                label="Adminkommentar"
                value={comments[request.id] ?? ""}
                onChange={(event) => onCommentChange(request.id, event.target.value)}
              />
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onReview(request.id, "APPROVED", true)}
                  disabled={reviewing}
                >
                  Godkjenn + booking (Foreløpig)
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => onReview(request.id, "REJECTED", false)}
                  disabled={reviewing}
                >
                  Avvis
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="text"
                  onClick={() => onDelete(request.id)}
                  disabled={deleting}
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
);
