import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import {
  BOOKING_STATUS_LABELS,
  DEPOSIT_STATUS_LABELS,
  JANHUS_EVENT_TYPE_LABELS,
  OWNER_TYPE_LABELS,
} from "@/components/pages/janhus/constants";
import { JanHusGuestListEntry } from "@/components/pages/janhus/GuestListDialog";
import { bookingOwnerType, formatDate, formatTime, statusColor, statusLabel } from "@/components/pages/janhus/helpers";
import { JanhusJanHusBookingDepositStatusChoices, JanHusAdminBookingFragment } from "@/generated/graphql";

import { DoorAccessFields } from "./DoorAccessFields";
import { PickedUser } from "./UserPicker";

export type BookingEdit = {
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
  bookerUser: PickedUser | null;
  responsibleUser: PickedUser | null;
  comment: string;
  adminComment: string;
  bookerMessage: string;
};

type Props = {
  bookings: readonly JanHusAdminBookingFragment[];
  areas: readonly { id: string; name: string; isActive: boolean }[];
  edits: Record<string, BookingEdit>;
  setEdits: Dispatch<SetStateAction<Record<string, BookingEdit>>>;
  expanded: Record<string, boolean>;
  setExpanded: Dispatch<SetStateAction<Record<string, boolean>>>;
  updating: boolean;
  deleting: boolean;
  creatingPaymentProduct: boolean;
  onSave: (id: string) => void;
  onCreatePaymentProduct: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenGuestList: (id: string) => void;
  /** View-only users (janhus.view_all_bookings): fields are shown disabled and every action is hidden. */
  readOnly?: boolean;
};

export const BookingList: React.FC<Props> = ({
  bookings,
  areas,
  edits,
  setEdits,
  expanded,
  setExpanded,
  updating,
  deleting,
  creatingPaymentProduct,
  onSave,
  onCreatePaymentProduct,
  onDelete,
  onOpenGuestList,
  readOnly = false,
}) => (
  <Grid container spacing={2} justifyContent="center" alignItems="flex-start" sx={{ width: "100%", m: 0 }}>
    {bookings.map((booking) => {
      const edit = edits[booking.id];
      if (!edit) return null;

      const depositPaid = edit.depositStatus === JanhusJanHusBookingDepositStatusChoices.Paid;
      const isExpanded = Boolean(expanded[booking.id]);

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
              setExpanded((current) => ({
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
                    color={statusColor({ status: edit.status, endsAt: booking.endsAt })}
                    label={statusLabel({ status: edit.status, endsAt: booking.endsAt }, BOOKING_STATUS_LABELS)}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(booking.startsAt)} kl. {formatTime(booking.startsAt)}–{formatTime(booking.endsAt)} ·{" "}
                  {booking.area.name} · {OWNER_TYPE_LABELS[bookingOwnerType(booking)]}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                  Referanse: {booking.reference}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {booking.requestedAt
                    ? `Forespurt ${formatDate(booking.requestedAt)} kl. ${formatTime(booking.requestedAt)}`
                    : `Opprettet ${formatDate(booking.createdAt)} kl. ${formatTime(booking.createdAt)}`}
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, px: 2, pb: 2 }}>
              <Stack spacing={1.5}>
                <Box display="grid" gap={1.5} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
                  <TextField
                    disabled={readOnly}
                    label="Fra"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={edit.startsAt}
                    onChange={(event) =>
                      setEdits((prev) => ({
                        ...prev,
                        [booking.id]: { ...prev[booking.id], startsAt: event.target.value },
                      }))
                    }
                  />
                  <TextField
                    disabled={readOnly}
                    label="Til"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={edit.endsAt}
                    onChange={(event) =>
                      setEdits((prev) => ({
                        ...prev,
                        [booking.id]: { ...prev[booking.id], endsAt: event.target.value },
                      }))
                    }
                  />
                  <FormControl disabled={readOnly}>
                    <InputLabel>Område</InputLabel>
                    <Select
                      label="Område"
                      value={edit.area}
                      onChange={(event) =>
                        setEdits((prev) => ({
                          ...prev,
                          [booking.id]: { ...prev[booking.id], area: event.target.value },
                        }))
                      }
                    >
                      {areas.map((areaOption) => (
                        <MenuItem
                          key={areaOption.id}
                          value={areaOption.id}
                          disabled={!areaOption.isActive && areaOption.id !== edit.area}
                        >
                          {areaOption.name}
                          {!areaOption.isActive && " (arkivert)"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl disabled={readOnly}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      value={edit.status}
                      onChange={(event) =>
                        setEdits((prev) => ({
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
                  <FormControl disabled={readOnly}>
                    <InputLabel>Arrangementstype</InputLabel>
                    <Select
                      label="Arrangementstype"
                      value={edit.eventType}
                      onChange={(event) =>
                        setEdits((prev) => ({
                          ...prev,
                          [booking.id]: { ...prev[booking.id], eventType: event.target.value },
                        }))
                      }
                    >
                      {Object.entries(JANHUS_EVENT_TYPE_LABELS).map(([value, label]) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl disabled={readOnly}>
                    <InputLabel>Depositumstatus</InputLabel>
                    <Select
                      label="Depositumstatus"
                      value={edit.depositStatus}
                      onChange={(event) =>
                        setEdits((prev) => ({
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
                    disabled={readOnly}
                    label="Depositum"
                    type="number"
                    value={edit.depositAmount}
                    onChange={(event) =>
                      setEdits((prev) => ({
                        ...prev,
                        [booking.id]: { ...prev[booking.id], depositAmount: event.target.value },
                      }))
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        disabled={readOnly}
                        checked={edit.cleaningRequested}
                        onChange={(event) =>
                          setEdits((prev) => ({
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
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        disabled={readOnly}
                        checked={depositPaid}
                        onChange={(event) =>
                          setEdits((prev) => ({
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
                  <FormControl disabled={readOnly}>
                    <InputLabel>Prisoverstyring</InputLabel>
                    <Select
                      label="Prisoverstyring"
                      value={edit.priceOverrideTier}
                      onChange={(event) =>
                        setEdits((prev) => ({
                          ...prev,
                          [booking.id]: { ...prev[booking.id], priceOverrideTier: event.target.value },
                        }))
                      }
                    >
                      <MenuItem value="">Ingen overstyring</MenuItem>
                      <MenuItem value="INTERNAL">Internpris</MenuItem>
                      <MenuItem value="EXTERNAL">Eksternpris</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    disabled={readOnly}
                    label="Fast pris (overstyrer alt annet)"
                    type="number"
                    value={edit.priceOverrideAmount}
                    onChange={(event) =>
                      setEdits((prev) => ({
                        ...prev,
                        [booking.id]: { ...prev[booking.id], priceOverrideAmount: event.target.value },
                      }))
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        disabled={readOnly}
                        checked={edit.manuallyMarkedAsPaid}
                        onChange={(event) =>
                          setEdits((prev) => ({
                            ...prev,
                            [booking.id]: {
                              ...prev[booking.id],
                              manuallyMarkedAsPaid: event.target.checked,
                            },
                          }))
                        }
                      />
                    }
                    label="Betalt utenfor Vipps (manuelt bekreftet)"
                  />
                  <TextField
                    disabled={readOnly}
                    label="Bestiller navn"
                    value={edit.bookerName}
                    onChange={(event) =>
                      setEdits((prev) => ({
                        ...prev,
                        [booking.id]: { ...prev[booking.id], bookerName: event.target.value },
                      }))
                    }
                  />
                  <TextField
                    disabled={readOnly}
                    label="Ansvarlig navn"
                    value={edit.responsibleName}
                    onChange={(event) =>
                      setEdits((prev) => ({
                        ...prev,
                        [booking.id]: { ...prev[booking.id], responsibleName: event.target.value },
                      }))
                    }
                  />
                  <TextField
                    disabled={readOnly}
                    label="Bestiller e-post"
                    value={edit.bookerEmail}
                    onChange={(event) =>
                      setEdits((prev) => ({
                        ...prev,
                        [booking.id]: { ...prev[booking.id], bookerEmail: event.target.value },
                      }))
                    }
                  />
                  <TextField
                    disabled={readOnly}
                    label="Ansvarlig e-post"
                    value={edit.responsibleEmail}
                    onChange={(event) =>
                      setEdits((prev) => ({
                        ...prev,
                        [booking.id]: { ...prev[booking.id], responsibleEmail: event.target.value },
                      }))
                    }
                  />
                  <TextField
                    disabled={readOnly}
                    label="Bestiller telefon"
                    value={edit.bookerPhone}
                    onChange={(event) =>
                      setEdits((prev) => ({
                        ...prev,
                        [booking.id]: { ...prev[booking.id], bookerPhone: event.target.value },
                      }))
                    }
                  />
                  <TextField
                    disabled={readOnly}
                    label="Ansvarlig telefon"
                    value={edit.responsiblePhone}
                    onChange={(event) =>
                      setEdits((prev) => ({
                        ...prev,
                        [booking.id]: { ...prev[booking.id], responsiblePhone: event.target.value },
                      }))
                    }
                  />
                </Box>

                <TextField
                  disabled={readOnly}
                  label="Kommentar"
                  multiline
                  minRows={2}
                  value={edit.comment}
                  onChange={(event) =>
                    setEdits((prev) => ({
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
                  {readOnly ? null : (
                    <>
                      <Button size="small" variant="outlined" onClick={() => onOpenGuestList(booking.id)}>
                        Rediger gjesteliste
                      </Button>
                      <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                        Endringen lagres når du klikker «Lagre endringer».
                      </Typography>
                    </>
                  )}
                </Box>
                <DoorAccessFields
                  value={edit}
                  onChange={(patch) =>
                    setEdits((prev) => ({
                      ...prev,
                      [booking.id]: { ...prev[booking.id], ...patch },
                    }))
                  }
                  isOrganizationBooking={Boolean(booking.ownerOrganization)}
                  warnings={booking.doorAccessWarnings}
                  readOnly={readOnly}
                />
                <TextField
                  disabled={readOnly}
                  label="Melding til bestilleren"
                  helperText="Sendes med e-posten når statusen endres til godkjent eller avslått. Bestilleren ser den også under «Mine bookinger»."
                  multiline
                  minRows={2}
                  value={edit.bookerMessage}
                  onChange={(event) =>
                    setEdits((prev) => ({
                      ...prev,
                      [booking.id]: { ...prev[booking.id], bookerMessage: event.target.value },
                    }))
                  }
                />
                <TextField
                  disabled={readOnly}
                  label="Intern kommentar (bare for admin)"
                  multiline
                  minRows={2}
                  value={edit.adminComment}
                  onChange={(event) =>
                    setEdits((prev) => ({
                      ...prev,
                      [booking.id]: { ...prev[booking.id], adminComment: event.target.value },
                    }))
                  }
                />

                {readOnly ? null : (
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button size="small" variant="contained" onClick={() => onSave(booking.id)} disabled={updating}>
                      Lagre endringer
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onCreatePaymentProduct(booking.id)}
                      disabled={creatingPaymentProduct || Boolean(booking.ownerOrganization)}
                    >
                      {booking.ownerOrganization ? "Intern håndtering (ingen Vipps)" : "Opprett Vipps-betaling"}
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => onDelete(booking.id)}
                      disabled={deleting}
                    >
                      Slett booking
                    </Button>
                  </Stack>
                )}

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
);
