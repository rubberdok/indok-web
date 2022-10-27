import { Card, CardContent, CardHeader, TableContainer } from "@mui/material";

import { SignUpWithTicketFragment } from "@/generated/graphql";

import { AttendeeTable } from "./Table";

type Props = {
  attendees: SignUpWithTicketFragment[];
  eventId: string;
};

export const Waitlist: React.FC<Props> = (props) => {
  return (
    <Card>
      <CardHeader title="Venteliste" />
      <CardContent>
        <TableContainer sx={{ maxHeight: 400, widht: "100%" }}>
          <AttendeeTable {...props} />
        </TableContainer>
      </CardContent>
    </Card>
  );
};
