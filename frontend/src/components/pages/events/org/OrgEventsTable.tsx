import { Event } from "@interfaces/events";
import { Organization } from "@interfaces/organizations";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import dayjs from "dayjs";
import Link from "next/link";

const useStyles = makeStyles(() => ({
  hover: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

type Props = {
  organization: Organization;
};

const OrgEventsTable: React.FC<Props> = ({ organization }) => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs>
        <Card variant="outlined">
          <CardHeader title="Arrangementer" />
          <Divider variant="middle" />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Dato</TableCell>
                    <TableCell>Navn</TableCell>
                    <TableCell>Antall plasser</TableCell>
                    <TableCell>Antall påmeldte</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(organization.events ?? []).map((event: Event) => (
                    <Link href={`${organization.id}/events/${event.id}`} passHref key={event.id}>
                      <TableRow className={classes.hover} hover>
                        <TableCell>{dayjs(event.startTime).format("HH:mm DD-MM-YYYY")}</TableCell>
                        <TableCell>{event.title}</TableCell>
                        <TableCell>{event.attendable ? event.attendable?.totalAvailableSlots : "-"}</TableCell>
                        <TableCell>{event.attendable ? event.attendable?.usersAttending?.length : "-"}</TableCell>
                        <TableCell>
                          {event.attendable ? (
                            <Chip
                              label={event.attendable?.isFull ? "Fullt" : "Ledige Plasser"}
                              color={event.attendable?.isFull ? "default" : "secondary"}
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    </Link>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default OrgEventsTable;
