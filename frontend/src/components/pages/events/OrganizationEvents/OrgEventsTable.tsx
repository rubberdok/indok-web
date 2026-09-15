import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useRouter } from "next/router";

import { AdminOrganizationFragment } from "@/generated/graphql";
import dayjs from "@/lib/date";

type Props = { organization: AdminOrganizationFragment };

export const OrgEventsTable: React.FC<Props> = ({ organization }) => {
  const router = useRouter();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Dato</TableCell>
            <TableCell>Navn</TableCell>
            <TableCell>Antall Plasser</TableCell>
            <TableCell>Antall påmeldte</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(organization.events ?? []).map((event) => (
            <TableRow
              hover
              key={event.id}
              role="link"
              tabIndex={0}
              aria-label={`Administrer ${event.title}`}
              sx={{ cursor: "pointer" }}
              onClick={() => void router.push(`/orgs/${organization.id}/events/${event.id}`)}
              onKeyDown={(keyboardEvent) => {
                if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
                  keyboardEvent.preventDefault();
                  void router.push(`/orgs/${organization.id}/events/${event.id}`);
                }
              }}
            >
              <TableCell>{dayjs(event.startTime).tz("Europe/Oslo").format("HH:mm DD-MM-YYYY")}</TableCell>
              <TableCell>{event.title}</TableCell>
              <TableCell>{event.availableSlots}</TableCell>
              <TableCell>{event.usersAttending?.length}</TableCell>
              <TableCell>
                <Chip label={event.isFull ? "Fullt" : "Ledige Plasser"} color={event.isFull ? "default" : "warning"} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
