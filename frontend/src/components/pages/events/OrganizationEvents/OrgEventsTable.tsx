import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import { Link } from "@/components";
import { AdminOrganizationFragment } from "@/generated/graphql";
import dayjs from "@/lib/date";

type Props = { organization: AdminOrganizationFragment };

export const OrgEventsTable: React.FC<Props> = ({ organization }) => {
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
            <TableRow hover key={event.id} sx={{ position: "relative" }}>
              <TableCell>
                <Link
                  href={{
                    pathname: "[organizationId]/events/[eventId]",
                    query: { organizationId: organization.id, eventId: event.id },
                  }}
                  underline="none"
                  color="inherit"
                  aria-label={event.title}
                  sx={{ position: "absolute", inset: 0 }}
                />
                {dayjs(event.startTime).tz("Europe/Oslo").format("HH:mm DD-MM-YYYY")}
              </TableCell>
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
