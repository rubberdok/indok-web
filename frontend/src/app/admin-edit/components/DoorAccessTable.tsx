import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import type { NfcDoorAccessQuery } from "@/generated/graphql";
import dayjs from "@/lib/date";

type Overview = NonNullable<NfcDoorAccessQuery["nfcDoorAccess"]>;
type Person = Overview["people"][number];
type Period = Person["periods"][number];
type ChipColor = "success" | "info" | "warning" | "default" | "primary" | "secondary";

const PERMANENT_STATUS: Record<string, { label: string; color: ChipColor }> = {
  ACTIVE: { label: "Aktiv", color: "success" },
  NO_PIN: { label: "Mangler PIN", color: "warning" },
  CARD_DISABLED: { label: "Kortet er sperret", color: "warning" },
  ENDED: { label: "Utløpt", color: "warning" },
  INACTIVE_USER: { label: "Deaktivert bruker", color: "warning" },
  NOT_GRANTED: { label: "Ingen tilgang, bare notat", color: "default" },
};

const STATE: Record<string, { label: string; color: ChipColor }> = {
  NOW: { label: "Adgang nå", color: "success" },
  UPCOMING: { label: "Får adgang", color: "info" },
  PAST: { label: "Hadde adgang", color: "default" },
  NOTE_ONLY: { label: "Bare notat", color: "default" },
};

const KIND: Record<string, { label: string; color: ChipColor }> = {
  PERMANENT: { label: "Permanent", color: "primary" },
  TEMPORARY: { label: "Midlertidig", color: "secondary" },
  BOOKING: { label: "Booking", color: "default" },
  MANUAL: { label: "Manuell", color: "info" },
  EXTERNAL: { label: "Eksternt kort", color: "default" },
};

const BLOCKED: Record<string, string> = {
  NO_CARD: "Mangler kort",
  NO_PIN: "Mangler PIN",
  CARD_DISABLED: "Kortet er sperret",
  CARD_AMBIGUOUS: "Kortnummeret er delt",
  INACTIVE_USER: "Deaktivert bruker",
};

const SHOWN_PERIODS = 3;
const PAST_DAY_OPTIONS = [0, 1, 3, 5, 7, 15, 30, 60];
const ALL = "ALL";
const BLOCKED_FILTER = "BLOCKED";

type AccessState = { state: string; blockedReason: string };

/** Without a card or PIN the door stays shut, so "now" is not true for them. */
function hasAccessNow(person: AccessState): boolean {
  return person.state === "NOW" && !person.blockedReason;
}

function stateChip(person: AccessState): { label: string; color: ChipColor } {
  if (person.state === "NOW" && person.blockedReason) {
    return { label: "Ville hatt adgang", color: "warning" };
  }
  return STATE[person.state] ?? { label: person.state, color: "default" };
}

export function formatDate(value: string): string {
  return dayjs(value).tz("Europe/Oslo").format("D. MMM YYYY");
}

export function formatTime(value: string): string {
  return dayjs(value).tz("Europe/Oslo").format("D. MMM YYYY HH:mm");
}

export function PermanentAccessStatusChip({ status }: Readonly<{ status?: string | null }>) {
  const shown = PERMANENT_STATUS[status ?? ""] ?? { label: status ?? "-", color: "default" as const };
  return <Chip size="small" label={shown.label} color={shown.color} />;
}

function periodText(period: Period): string {
  const from = period.startsAt ? formatTime(period.startsAt) : "";
  const to = period.endsAt ? formatTime(period.endsAt) : "uten sluttdato";
  const when = from ? `${from} – ${to}` : `til ${to}`;
  return period.detail ? `${when} (${period.detail})` : when;
}

function nameOf(person: Person): string {
  if (!person.user) {
    return person.holderName;
  }
  return `${person.user.firstName} ${person.user.lastName}`.trim() || person.user.username;
}

function searchableText(person: Person): string {
  return [
    nameOf(person),
    person.user?.username,
    person.user?.email,
    person.user?.feideEmail,
    person.cardNumber,
    person.user?.nfcNote,
    ...(person.user?.organizations ?? []).map((organization) => organization.name),
    ...person.periods.map((period) => period.detail),
  ]
    .join(" ")
    .toLowerCase();
}

function kindsOf(person: Person): string[] {
  return [...new Set(person.periods.map((period) => period.kind))];
}

type FilterChipsProps = {
  options: readonly { value: string; label: string; count: number }[];
  selected: string;
  onSelect: (value: string) => void;
};

function FilterChips({ options, selected, onSelect }: Readonly<FilterChipsProps>) {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {options.map((option) => (
        <Chip
          key={option.value}
          size="small"
          label={`${option.label} (${option.count})`}
          color={selected === option.value ? "primary" : "default"}
          variant={selected === option.value ? "filled" : "outlined"}
          onClick={() => onSelect(option.value)}
        />
      ))}
    </Stack>
  );
}

function PeriodList({ periods }: Readonly<{ periods: readonly Period[] }>) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? periods : periods.slice(0, SHOWN_PERIODS);
  return (
    <Stack spacing={0.5}>
      {shown.map((period, index) => (
        <Box key={`${period.kind}-${period.startsAt ?? ""}-${index}`}>
          <Chip
            size="small"
            label={KIND[period.kind]?.label ?? period.kind}
            color={KIND[period.kind]?.color ?? "default"}
            sx={{ mr: 1 }}
          />
          <Typography component="span" variant="caption">
            {periodText(period)}
          </Typography>
        </Box>
      ))}
      {periods.length > SHOWN_PERIODS && (
        <Button size="small" sx={{ alignSelf: "flex-start" }} onClick={() => setExpanded((open) => !open)}>
          {expanded ? "Vis færre" : `Vis alle (${periods.length})`}
        </Button>
      )}
    </Stack>
  );
}

type Props = {
  overview: Overview | null | undefined;
  loading: boolean;
  failed: boolean;
  pastDays: number;
  onPastDaysChange: (days: number) => void;
  onEdit: (userId: string) => void;
};

export function DoorAccessTable({ overview, loading, failed, pastDays, onPastDaysChange, onEdit }: Readonly<Props>) {
  const [filter, setFilter] = useState("");
  const [state, setState] = useState("NOW");
  const [kind, setKind] = useState(ALL);

  const people = useMemo(() => overview?.people ?? [], [overview]);
  const maxPastDays = overview?.maxPastDays ?? pastDays;
  const dayOptions = PAST_DAY_OPTIONS.filter((days) => days <= maxPastDays);

  const searched = useMemo(() => {
    const words = filter.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return people.filter((person) => {
      const text = searchableText(person);
      return words.every((word) => text.includes(word));
    });
  }, [filter, people]);

  const stateOptions = [
    { value: ALL, label: "Alle", count: searched.length },
    ...Object.entries(STATE).map(([value, { label }]) => ({
      value,
      label,
      count: searched.filter((person) => (value === "NOW" ? hasAccessNow(person) : person.state === value)).length,
    })),
    {
      value: BLOCKED_FILTER,
      label: "Ville hatt adgang",
      count: searched.filter((person) => person.blockedReason).length,
    },
  ];
  const kindOptions = [
    { value: ALL, label: "Alle typer", count: searched.length },
    ...Object.entries(KIND).map(([value, { label }]) => ({
      value,
      label,
      count: searched.filter((person) => kindsOf(person).includes(value)).length,
    })),
  ];

  const shown = searched.filter((person) => {
    const matchesFilter: Record<string, boolean> = {
      [ALL]: true,
      [BLOCKED_FILTER]: Boolean(person.blockedReason),
      NOW: hasAccessNow(person),
    };
    const matchesState = matchesFilter[state] ?? person.state === state;
    return matchesState && (kind === ALL || kindsOf(person).includes(kind));
  });

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Adgang til JanHus ({shown.length})</Typography>
          <Typography variant="body2" color="text.secondary">
            Bruk filtrene for å se kommende, tidligere eller andre tilgangsperioder.
          </Typography>
          {overview && !overview.areasConnected && (
            <Alert severity="warning">Ingen områder er koblet til en dør i ARX, kontakt Rubberdøk!</Alert>
          )}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth
              size="small"
              label="Filtrer"
              placeholder="Navn, e-post, kort, forening, område eller notat"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            />
            <TextField
              select
              size="small"
              label="Vis bakover"
              value={pastDays}
              sx={{ minWidth: 160 }}
              onChange={(event) => onPastDaysChange(Number(event.target.value))}
            >
              {dayOptions.map((days) => (
                <MenuItem key={days} value={days}>
                  {days} dager
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <FilterChips options={stateOptions} selected={state} onSelect={setState} />
          <FilterChips options={kindOptions} selected={kind} onSelect={setKind} />
          {loading && <CircularProgress size={24} />}
          {failed && <Alert severity="error">Kunne ikke hente listen.</Alert>}
          {!loading && !failed && shown.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Ingen å vise.
            </Typography>
          )}
          {shown.length > 0 && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Navn</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Adgang</TableCell>
                    <TableCell>Kort</TableCell>
                    <TableCell>Foreninger</TableCell>
                    <TableCell>Notat</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shown.map((person) => (
                    <TableRow key={person.key}>
                      <TableCell>
                        {nameOf(person)}
                        <Typography variant="caption" color="text.secondary" display="block">
                          {person.user ? person.user.feideEmail || person.user.email || "-" : "Uten nettsidebruker"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5} alignItems="flex-start">
                          <Chip size="small" label={stateChip(person).label} color={stateChip(person).color} />
                          {person.blockedReason && (
                            <Chip
                              size="small"
                              color="warning"
                              label={BLOCKED[person.blockedReason] ?? person.blockedReason}
                            />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <PeriodList periods={person.periods} />
                      </TableCell>
                      <TableCell>{person.cardNumber || "-"}</TableCell>
                      <TableCell>
                        {(person.user?.organizations ?? []).map((organization) => organization.name).join(", ") || "-"}
                      </TableCell>
                      <TableCell>
                        {person.user?.nfcNote || "-"}
                        {person.user?.nfcNoteUpdatedAt && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {formatDate(person.user.nfcNoteUpdatedAt)}
                            {person.user.nfcNoteUpdatedBy ? `, ${person.user.nfcNoteUpdatedBy}` : ""}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {person.user && (
                          <Button size="small" onClick={() => person.user && onEdit(person.user.id)}>
                            Endre
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
