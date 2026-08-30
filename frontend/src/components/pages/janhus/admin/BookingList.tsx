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

import { JANHUS_EVENT_TYPE_LABELS } from "@/components/pages/janhus/constants";
import {
  BOOKING_STATUS_LABELS,
  DEPOSIT_STATUS_LABELS,
  DOOR_ACCESS_POLICY_LABELS,
  OWNER_TYPE_LABELS,
} from "@/components/pages/janhus/constants";
import { JanHusGuestListEntry } from "@/components/pages/janhus/GuestListDialog";
import { bookingOwnerType, formatDate, formatTime, statusColor, statusLabel } from "@/components/pages/janhus/helpers";
import { JanhusJanHusBookingDepositStatusChoices, JanHusBookingFragment } from "@/generated/graphql";

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
  comment: string;
  adminComment: string;
};

type Props = {
  bookings: readonly JanHusBookingFragment[];
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
                      setEdits((prev) => ({
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
                      setEdits((prev) => ({
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
                  <FormControl>
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
                  <FormControl>
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
                  <FormControl>
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
                  <FormControl>
                    <InputLabel>Åpningspolicy</InputLabel>
                    <Select
                      label="Åpningspolicy"
                      value={edit.doorAccessPolicy}
                      onChange={(event) =>
                        setEdits((prev) => ({
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
                  <FormControlLabel
                    control={
                      <Switch
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
                  <FormControl>
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
                  <Button size="small" variant="outlined" onClick={() => onOpenGuestList(booking.id)}>
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
                    setEdits((prev) => ({
                      ...prev,
                      [booking.id]: { ...prev[booking.id], adminComment: event.target.value },
                    }))
                  }
                />

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
