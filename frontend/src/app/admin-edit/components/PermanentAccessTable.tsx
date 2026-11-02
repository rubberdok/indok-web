import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
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

import dayjs from "@/lib/date";

import type { AdminEditableUser } from "./types";

const STATUS: Record<string, { label: string; color: "success" | "warning" | "default" }> = {
  ACTIVE: { label: "Aktiv", color: "success" },
  NO_PIN: { label: "Mangler PIN", color: "warning" },
  CARD_DISABLED: { label: "Kortet er sperret", color: "warning" },
  ENDED: { label: "Utløpt", color: "warning" },
  INACTIVE_USER: { label: "Deaktivert bruker", color: "warning" },
  NOT_GRANTED: { label: "Ingen tilgang, bare notat", color: "default" },
};

export function formatDate(value: string): string {
  return dayjs(value).tz("Europe/Oslo").format("D. MMM YYYY");
}

export function PermanentAccessStatusChip({ status }: Readonly<{ status?: string | null }>) {
  const shown = STATUS[status ?? ""] ?? { label: status ?? "-", color: "default" as const };
  return <Chip size="small" label={shown.label} color={shown.color} />;
}

function searchableText(user: AdminEditableUser): string {
  return [
    user.firstName,
    user.lastName,
    user.username,
    user.email,
    user.feideEmail,
    user.nfcCardNumber,
    user.nfcNote,
    STATUS[user.nfcPermanentAccessStatus ?? ""]?.label,
    ...(user.organizations ?? []).map((organization) => organization.name),
  ]
    .join(" ")
    .toLowerCase();
}

type Props = {
  users: readonly AdminEditableUser[];
  loading: boolean;
  failed: boolean;
  onEdit: (userId: string) => void;
};

export function PermanentAccessTable({ users, loading, failed, onEdit }: Readonly<Props>) {
  const [filter, setFilter] = useState("");

  const shown = useMemo(() => {
    const words = filter.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return users.filter((user) => {
      const text = searchableText(user);
      return words.every((word) => text.includes(word));
    });
  }, [filter, users]);

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Permanent tilgang ({users.length})</Typography>
          <TextField
            fullWidth
            size="small"
            label="Filtrer"
            placeholder="Navn, e-post, kort, forening eller notat"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
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
                    <TableCell>Kort</TableCell>
                    <TableCell>Slutter</TableCell>
                    <TableCell>Foreninger</TableCell>
                    <TableCell>Notat</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shown.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.firstName} {user.lastName}
                        <Typography variant="caption" color="text.secondary" display="block">
                          {user.feideEmail || user.email || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <PermanentAccessStatusChip status={user.nfcPermanentAccessStatus} />
                      </TableCell>
                      <TableCell>{user.nfcCardNumber || "-"}</TableCell>
                      <TableCell>
                        {user.nfcPermanentAccessEnds ? formatDate(user.nfcPermanentAccessEnds) : "-"}
                      </TableCell>
                      <TableCell>{(user.organizations ?? []).map((org) => org.name).join(", ") || "-"}</TableCell>
                      <TableCell>
                        {user.nfcNote || "-"}
                        {user.nfcNoteUpdatedAt && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {formatDate(user.nfcNoteUpdatedAt)}
                            {user.nfcNoteUpdatedBy ? `, ${user.nfcNoteUpdatedBy}` : ""}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={() => onEdit(user.id)}>
                          Endre
                        </Button>
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
