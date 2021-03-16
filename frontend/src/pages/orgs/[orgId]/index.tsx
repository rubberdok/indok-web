import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { Event } from "@interfaces/events";
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  makeStyles,
  Chip,
  TableBody,
  Button,
} from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { GET_ORGANIZATION } from "@graphql/orgs/queries";
import { Organization } from "@interfaces/organizations";
import dayjs from "dayjs";
import { Listing } from "@interfaces/listings";
interface HeaderValuePair<T> {
  header: string;
  field: keyof T;
}

const eventFields: HeaderValuePair<Event>[] = [
  { header: "Navn", field: "title" },
  { header: "Antall Plasser", field: "availableSlots" },
];

const useStyles = makeStyles(() => ({
  hover: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const OrganizationDetailPage: NextPage = () => {
  const router = useRouter();
  const { orgId } = router.query;
  const orgNumberId = parseInt(orgId as string);

  const classes = useStyles();

  const { loading, data } = useQuery<{ organization: Organization }, { orgId: number }>(GET_ORGANIZATION, {
    variables: { orgId: orgNumberId },
    skip: Number.isNaN(orgNumberId),
  });

  return (
    <Layout>
      <Box m={10}>
        {!loading && data?.organization?.events ? (
          <Grid container direction="column" spacing={10}>
            <Grid item>
              <Typography variant="h1" align="center">
                {data.organization.name}
              </Typography>
            </Grid>
            <Grid item container>
              <Grid item xs>
                <Card variant="outlined">
                  <CardHeader title="Arragementer" />
                  <Divider variant="middle" />
                  <CardContent>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Dato</TableCell>
                            {eventFields.map((field: HeaderValuePair<Event>) => (
                              <TableCell key={`header-${field.header}`}>{field.header}</TableCell>
                            ))}
                            <TableCell>Antall påmeldte</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.organization.events.map((event: Event) => (
                            <Link href={`${orgNumberId}/events/${event.id}`} passHref key={event.id}>
                              <TableRow className={classes.hover} hover>
                                <TableCell>{dayjs(event.startTime).format("HH:mm DD-MM-YYYY")}</TableCell>
                                {eventFields.map((field: HeaderValuePair<Event>) => (
                                  <TableCell key={`event-${event.id}-cell-${field.field}`}>
                                    {event[field.field]}
                                  </TableCell>
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
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            {data?.organization?.listings && (
              <Grid item container>
                <Grid item xs>
                  <Card variant="outlined">
                    <CardHeader title="Verv" />
                    <Divider variant="middle" />
                    <CardContent>
                      <Button variant="contained">Opprett nytt verv</Button>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Tittel</TableCell>
                              <TableCell>Frist</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {data.organization.listings.map((listing: Listing) => (
                              <Link href={`${orgNumberId}/listings/${listing.id}`} passHref key={listing.id}>
                                <TableRow className={classes.hover} hover>
                                  <TableCell>{listing.title}</TableCell>
                                  <TableCell>{dayjs(listing.deadline).format("HH:mm DD-MM-YYYY")}</TableCell>
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
            )}
          </Grid>
        ) : null}
      </Box>
    </Layout>
  );
};

export default OrganizationDetailPage;
