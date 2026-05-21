import { useLazyQuery } from "@apollo/client/react";
import { Add, Search } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { JanHusGuestSearchDocument, JanHusGuestSearchForRequestDocument } from "@/generated/graphql";

const SEARCH_MIN_LENGTH = 2;
const SEARCH_RESULT_LIMIT = 25;
const MANUAL_ENTRY_PREFIX = "manual:";

export type JanHusGuestListEntry = {
  feideUserId: string;
  displayName: string;
};

type GuestListDialogProps = {
  bookingId?: string;
  searchMode?: "booking" | "request";
  isAuthenticated?: boolean;
  allowManualEntries?: boolean;
  open: boolean;
  initialGuests: JanHusGuestListEntry[];
  saving?: boolean;
  onClose: () => void;
  onSave: (guests: JanHusGuestListEntry[]) => void | Promise<void>;
};

const normalizeGuestName = (value: string) => value.trim().toLowerCase();

const toManualGuestEntry = (displayName: string): JanHusGuestListEntry => {
  const normalizedDisplayName = displayName.trim();
  return {
    feideUserId: `${MANUAL_ENTRY_PREFIX}${normalizedDisplayName.toLowerCase().replace(/\s+/g, "-")}`,
    displayName: normalizedDisplayName,
  };
};

export const GuestListDialog = ({
  bookingId,
  searchMode,
  isAuthenticated = true,
  allowManualEntries,
  open,
  initialGuests,
  saving = false,
  onClose,
  onSave,
}: GuestListDialogProps) => {
  const resolvedSearchMode = searchMode ?? "booking";
  const manualEntriesEnabled = allowManualEntries ?? resolvedSearchMode === "request";

  const [searchInput, setSearchInput] = useState("");
  const [manualGuestInput, setManualGuestInput] = useState("");
  const [selectedGuests, setSelectedGuests] = useState<JanHusGuestListEntry[]>([]);
  const [searchResults, setSearchResults] = useState<JanHusGuestListEntry[]>([]);
  const [searchError, setSearchError] = useState<string | undefined>();

  const [runBookingGuestSearch, { loading: isSearchingBooking }] = useLazyQuery(JanHusGuestSearchDocument, {
    fetchPolicy: "network-only",
  });

  const [runRequestGuestSearch, { loading: isSearchingRequest }] = useLazyQuery(JanHusGuestSearchForRequestDocument, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (!open) return;

    setSelectedGuests(initialGuests);
    setSearchInput("");
    setManualGuestInput("");
    setSearchResults([]);
    setSearchError(undefined);
  }, [initialGuests, open]);

  const selectedGuestIds = useMemo(() => new Set(selectedGuests.map((guest) => guest.feideUserId)), [selectedGuests]);
  const selectedGuestNames = useMemo(
    () => new Set(selectedGuests.map((guest) => normalizeGuestName(guest.displayName))),
    [selectedGuests]
  );

  const isSearching = isSearchingBooking || isSearchingRequest;

  async function handleSearch() {
    setSearchError(undefined);

    const normalizedSearchInput = searchInput.trim();
    if (normalizedSearchInput.length < SEARCH_MIN_LENGTH) {
      setSearchResults([]);
      return;
    }

    try {
      if (resolvedSearchMode === "booking") {
        if (!bookingId) {
          setSearchResults([]);
          setSearchError("Kunne ikke søke etter gjester fordi bookingreferanse mangler.");
          return;
        }

        const { data } = await runBookingGuestSearch({
          variables: {
            bookingId,
            query: normalizedSearchInput,
            limit: SEARCH_RESULT_LIMIT,
          },
        });

        setSearchResults(
          (data?.janhusGuestSearch ?? []).map((guest) => ({
            feideUserId: guest.feideUserid,
            displayName: guest.displayName,
          }))
        );
        return;
      }

      if (!isAuthenticated) {
        setSearchResults([]);
        setSearchError("Logg inn for å bruke gjestesøk. Du kan fortsatt legge inn navn manuelt.");
        return;
      }

      const { data } = await runRequestGuestSearch({
        variables: {
          query: normalizedSearchInput,
          limit: SEARCH_RESULT_LIMIT,
        },
      });

      setSearchResults(
        (data?.janhusGuestSearchForRequest ?? []).map((guest) => ({
          feideUserId: guest.feideUserid,
          displayName: guest.displayName,
        }))
      );
    } catch (error) {
      setSearchResults([]);
      setSearchError(error instanceof Error ? error.message : "Kunne ikke søke etter gjester.");
    }
  }

  function addGuest(guest: JanHusGuestListEntry) {
    if (selectedGuestIds.has(guest.feideUserId) || selectedGuestNames.has(normalizeGuestName(guest.displayName))) {
      return;
    }

    setSelectedGuests((current) => [...current, guest]);
    setManualGuestInput("");
  }

  function removeGuest(feideUserId: string) {
    setSelectedGuests((current) => current.filter((guest) => guest.feideUserId !== feideUserId));
  }

  function addManualGuest() {
    if (!manualEntriesEnabled) {
      return;
    }

    const normalizedManualInput = manualGuestInput.trim();
    if (normalizedManualInput.length < SEARCH_MIN_LENGTH) {
      return;
    }

    addGuest(toManualGuestEntry(normalizedManualInput));
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="md">
      <DialogTitle>Gjesteliste</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Alert severity="info">
            {resolvedSearchMode === "booking"
              ? "Søk på navn eller telefon. Søkeresultatet viser kun navn."
              : "Søk på navn eller telefon for å finne eksisterende brukere. Du kan også legge inn navn manuelt."}
          </Alert>

          {resolvedSearchMode === "request" && !isAuthenticated ? (
            <Alert severity="info">Logg inn for å bruke søk. Manuell gjesteliste fungerer fortsatt.</Alert>
          ) : null}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              fullWidth
              size="small"
              label="Søk etter intern/indøker"
              placeholder="Minst 2 tegn"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleSearch();
                }
              }}
            />
            <Button
              variant="outlined"
              startIcon={isSearching ? <CircularProgress size={16} /> : <Search />}
              onClick={() => void handleSearch()}
              disabled={
                isSearching ||
                searchInput.trim().length < SEARCH_MIN_LENGTH ||
                (resolvedSearchMode === "request" && !isAuthenticated)
              }
            >
              Søk
            </Button>
          </Stack>

          {searchError ? <Alert severity="error">{searchError}</Alert> : null}

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Søkeresultater
            </Typography>
            {searchResults.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Ingen treff ennå.
              </Typography>
            ) : (
              <Stack spacing={1}>
                {searchResults.map((guest) => {
                  const alreadySelected =
                    selectedGuestIds.has(guest.feideUserId) ||
                    selectedGuestNames.has(normalizeGuestName(guest.displayName));
                  return (
                    <Box
                      key={guest.feideUserId}
                      sx={{
                        p: 1,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">{guest.displayName}</Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => addGuest(guest)}
                        disabled={alreadySelected}
                      >
                        {alreadySelected ? "Lagt til" : "Legg til"}
                      </Button>
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Box>

          {manualEntriesEnabled ? (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                fullWidth
                size="small"
                label="Legg til ekstern gjest"
                placeholder="F.eks. Ola Nordmann"
                value={manualGuestInput}
                onChange={(event) => setManualGuestInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addManualGuest();
                  }
                }}
              />
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={addManualGuest}
                disabled={manualGuestInput.trim().length < SEARCH_MIN_LENGTH}
              >
                Legg til
              </Button>
            </Stack>
          ) : null}

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Valgte gjester ({selectedGuests.length})
            </Typography>
            {selectedGuests.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Ingen gjester valgt.
              </Typography>
            ) : (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {selectedGuests.map((guest) => (
                  <Chip
                    key={guest.feideUserId}
                    label={guest.displayName}
                    onDelete={saving ? undefined : () => removeGuest(guest.feideUserId)}
                    disabled={saving}
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Avbryt
        </Button>
        <Button variant="contained" onClick={() => void onSave(selectedGuests)} disabled={saving}>
          Lagre gjesteliste
        </Button>
      </DialogActions>
    </Dialog>
  );
};
