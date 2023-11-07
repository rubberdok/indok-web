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
            <TableRow
              hover
              underline="none"
              component={Link}
              key={event.id}
              href={{
                pathname: "[organizationId]/events/[eventId]",
                query: { organizationId: organization.id, eventId: event.id },
              }}
            >
              <TableCell>{dayjs(event.startTime).format("HH:mm DD-MM-YYYY")}</TableCell>
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
