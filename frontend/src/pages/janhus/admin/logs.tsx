import { useQuery } from "@apollo/client/react";
import {
  Alert,
  Box,
  Chip,
  Container,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { PermissionRequired } from "@/components/Auth";
import { adminPanelStyles } from "@/components/pages/janhus/admin";
import { Title } from "@/components/Title";
import { DoorLogDocument } from "@/generated/graphql";
import { Layout } from "@/layouts/Layout";
import dayjs from "@/lib/date";
import { NextPageWithLayout } from "@/lib/next";

const RESULTS: Record<string, { label: string; color: "success" | "error" | "info" }> = {
  ACCESS_GRANTED: { label: "Godkjent", color: "success" },
  ACCESS_DENIED: { label: "Avvist", color: "error" },
  DOOR_OPENED: { label: "Dør åpnet", color: "info" },
  EXIT_BUTTON: { label: "UT-knapp", color: "info" },
  FORCED_OPEN: { label: "Dør ugyldig åpnet", color: "error" },
};

// The door itself reported these, so no card or person belongs to them.
const DOOR_ONLY_EVENTS = new Set(["DOOR_OPENED", "EXIT_BUTTON", "FORCED_OPEN"]);

// Under the name: whose card it is. A card registered to a website user needs no note.
const HOLDER_NOTES: Record<string, string> = {
  EXTERNAL_CARD: "Eksternt kort (lagt inn i Django admin)",
  ARX_ONLY: "Kortet er ikke registrert på nettsiden. Navnet er hentet fra ARX.",
};

function toIsoStartOfDay(date: string): string | undefined {
  return date ? dayjs.tz(date, "Europe/Oslo").startOf("day").toISOString() : undefined;
}

const DoorLog: React.FC = () => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const { data, loading, error } = useQuery(DoorLogDocument, {
    variables: {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
      result: result || undefined,
      search: search.trim() || undefined,
      since: toIsoStartOfDay(fromDate),
      until: toDate ? dayjs.tz(toDate, "Europe/Oslo").add(1, "day").startOf("day").toISOString() : undefined,
    },
    fetchPolicy: "cache-and-network",
  });

  const events = data?.doorLog?.events ?? [];

  return (
    <Stack spacing={3}>
      <Typography variant="body2" color="text.secondary">
        Hendelser fra dørsystemet (ARX). De hentes hvert 30. minutt og slettes etter 60 dager.
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          label="Søk på navn, kortnummer eller dør"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          sx={{ flex: 2 }}
        />
        <TextField
          select
          label="Hendelse"
          value={result}
          onChange={(e) => {
            setResult(e.target.value);
            setPage(0);
          }}
          sx={{ flex: 1, minWidth: 160 }}
        >
          <MenuItem value="">Alle</MenuItem>
          {Object.entries(RESULTS).map(([value, { label }]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="date"
          label="Fra"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setPage(0);
          }}
        />
        <TextField
          type="date"
          label="Til og med"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setPage(0);
          }}
        />
      </Stack>

      {error ? <Alert severity="error">Kunne ikke hente dørloggen. Prøv igjen senere.</Alert> : null}

      <TableContainer>
        <Table size="small" aria-label="Dørlogg">
          <TableHead>
            <TableRow>
              <TableCell>Tid</TableCell>
              <TableCell>Hendelse</TableCell>
              <TableCell>Navn</TableCell>
              <TableCell>Kort</TableCell>
              <TableCell>Dør</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => {
              const resultInfo = RESULTS[event.eventType] ?? { label: event.eventType, color: "info" as const };
              const doorOnly = DOOR_ONLY_EVENTS.has(event.eventType);
              return (
                <TableRow key={event.id} hover>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {dayjs(event.occurredAt).tz("Europe/Oslo").format("DD.MM.YYYY HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={resultInfo.label} color={resultInfo.color} variant="outlined" />
                  </TableCell>
                  <TableCell>
                    {doorOnly
                      ? "–"
                      : event.name || (
                          <Typography variant="body2" color="text.secondary">
                            Ukjent
                          </Typography>
                        )}
                    {!doorOnly && HOLDER_NOTES[event.holderKind] ? (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {HOLDER_NOTES[event.holderKind]}
                      </Typography>
                    ) : null}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {event.mifareCsnReported || "–"}
                    {event.cardFormat ? (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {event.cardFormat}
                      </Typography>
                    ) : null}
                  </TableCell>
                  <TableCell>{event.doorIdentifier || "–"}</TableCell>
                </TableRow>
              );
            })}
            {!loading && events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="body2" color="text.secondary">
                    Ingen hendelser som passer søket.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>

      <Box>
        <TablePagination
          component="div"
          count={data?.doorLog?.total ?? 0}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number.parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[25, 50, 100, 200]}
          labelRowsPerPage="Rader per side"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} av ${count}`}
        />
      </Box>
    </Stack>
  );
};

const JanHusDoorLogPage: NextPageWithLayout = () => {
  return (
    <>
      <Title
        title="Dørlogg"
        overline="JanHus"
        breadcrumbs={[
          { name: "Hjem", href: "/" },
          { name: "JanHus", href: "/janhus" },
          { name: "Adminside", href: "/janhus/admin" },
          { name: "Dørlogg", href: "/janhus/admin/logs" },
        ]}
      />
      <Container sx={(theme) => ({ py: 4, ...adminPanelStyles(theme) })}>
        <PermissionRequired
          permission="nfc.view_door_log"
          fallback={<Alert severity="info">Du har ikke tilgang til dørloggen.</Alert>}
        >
          <DoorLog />
        </PermissionRequired>
      </Container>
    </>
  );
};

JanHusDoorLogPage.getLayout = (page) => <Layout>{page}</Layout>;

export default JanHusDoorLogPage;
