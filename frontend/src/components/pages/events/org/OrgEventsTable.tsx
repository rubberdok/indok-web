import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";

import { AdminOrganizationFragment } from "@/generated/graphql";

type Props = { organization: AdminOrganizationFragment };

export const OrgEventsTable: React.FC<React.PropsWithChildren<Props>> = ({ organization }) => {
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
            <Link href={`${organization.id}/events/${event.id}`} passHref key={event.id}>
              <TableRow hover sx={{ pointer: "cursor" }}>
                <TableCell>{dayjs(event.startTime).format("HH:mm DD-MM-YYYY")}</TableCell>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.availableSlots}</TableCell>
                <TableCell>{event.usersAttending?.length}</TableCell>
                <TableCell>
                  <Chip
                    label={event.isFull ? "Fullt" : "Ledige Plasser"}
                    color={event.isFull ? "default" : "secondary"}
                  />
                </TableCell>
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
