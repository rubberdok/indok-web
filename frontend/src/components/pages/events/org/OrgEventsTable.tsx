import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";

import { OrgAdminEventFragment, AdminOrganizationFragment } from "@/generated/graphql";
import { HeaderValuePair } from "@/types/utils";

const eventFields: HeaderValuePair<OrgAdminEventFragment>[] = [
  { header: "Navn", field: "title" },
  { header: "Antall Plasser", field: "availableSlots" },
];

type Props = { organization: AdminOrganizationFragment };

const OrgEventsTable: React.FC<Props> = ({ organization }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Dato</TableCell>
            {eventFields.map((field) => (
              <TableCell key={`header-${field.header}`}>{field.header}</TableCell>
            ))}
            <TableCell>Antall påmeldte</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(organization.events ?? []).map((event) => (
            <Link href={`${organization.id}/events/${event.id}`} passHref key={event.id}>
              <TableRow hover sx={{ pointer: "cursor" }}>
                <TableCell>{dayjs(event.startTime).format("HH:mm DD-MM-YYYY")}</TableCell>
                {eventFields.map((field) => (
                  <TableCell key={`event-${event.id}-cell-${field.field}`}>{event[field.field]}</TableCell>
                ))}
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

export default OrgEventsTable;
