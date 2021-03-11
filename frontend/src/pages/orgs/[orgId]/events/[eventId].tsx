import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { GET_EVENT } from "@graphql/events/queries";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  ListItem,
  Typography,
  List,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  TableContainer,
} from "@material-ui/core";
import dayjs from "dayjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

interface HeaderValuePair<T> {
  header: string;
  field: keyof T;
}

const userFields: HeaderValuePair<User>[] = [
  { header: "Brukernavn", field: "username" },
  { header: "Navn", field: "firstName" },
  { header: "Mobilnummer", field: "phone" },
  { header: "Klassetrinn", field: "year" },
];

const stringEventFields: HeaderValuePair<Event>[] = [
  { header: "Tittel", field: "title" },
  { header: "Kort beskrivelse", field: "shortDescription" },
  { header: "Beskrivelse", field: "description" },
  { header: "Lokasjon", field: "location" },
  { header: "Starttid", field: "startTime" },
  { header: "Slutttid", field: "endTime" },
  { header: "Tilgjengelige plasser", field: "availableSlots" },
  { header: "Påmeldingsfrist", field: "deadline" },
  { header: "Påmeldingsdato", field: "signupOpenDate" },
];

const dateEventFields: HeaderValuePair<Event>[] = [
  { header: "Starttid", field: "startTime" },
  { header: "Slutttid", field: "endTime" },
  { header: "Påmeldingsfrist", field: "deadline" },
  { header: "Påmeldingsdato", field: "signupOpenDate" },
];

const EventAdminPage: NextPage = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const numberId = typeof eventId === "string" ? parseInt(eventId) : -1;

  const { loading, data } = useQuery<{ event: Event }, { id: number }>(GET_EVENT, {
    variables: { id: numberId },
  });

  const renderInfo = (label: string, value: string) => (
    <ListItem>
      <Typography>
        <Box fontWeight={1000} m={1} display="inline">
          {`${label}: `}
        </Box>
        {value}
      </Typography>
    </ListItem>
  );
  return (
    <Layout>
      {!loading && data?.event ? (
        <Box m={10}>
          <Grid container direction="column" spacing={5}>
            <Grid item>
              <Typography variant="h1" align="center">
                {data.event.title}
              </Typography>
            </Grid>
            <Grid item container spacing={5}>
              <Grid item xs>
                <Card variant="outlined">
                  <CardHeader title="Generell informasjon" />
                  <CardContent>
                    <List>
                      {stringEventFields.map((headerPair: HeaderValuePair<Event>) =>
                        renderInfo(headerPair.header, data.event[headerPair.field] as string)
                      )}
                      {dateEventFields.map((headerPair: HeaderValuePair<Event>) =>
                        renderInfo(
                          headerPair.header,
                          data.event[headerPair.field]
                            ? dayjs(data.event[headerPair.field] as string).format("HH:mm DD-MM-YYYY")
                            : ""
                        )
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs>
                <Card variant="outlined">
                  <CardHeader title="Påmeldte" />
                  <CardContent>
                    <TableContainer style={{ maxHeight: 600 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            {userFields.map((field) => (
                              <TableCell key={`user-header-${field.header}`}>{field.header}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {!loading && data.event.signedUpUsers ? (
                            data.event.signedUpUsers.map((user: User) => (
                              <TableRow key={`user-row-${user.id}`}>
                                {userFields.map((field) => (
                                  <TableCell key={`user-${user.id}-cell--${field.field}`}>
                                    {user[field.field]}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))
                          ) : (
                            <CircularProgress />
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Typography variant="body1">
              Dette er adminsiden for et gitt arrangement. Her skal man kunne detaljert admin-informasjon angående
              eventet og kunne redigere eventet. Man skal kunne se en liste over påmeldte (navn, trinn, tlf(korona),
              allergier, extra_info) og ha mulighet til å eksportere dette som CSV-fil (eller noe som kan åpnes i
              excel). Tenker på /events/ og /events/[id] burde man kunne finne en link som tar deg til denne siden
              dersom du er superuser eller medlem av organisasjonen som arrangerer arrangementet.
            </Typography>
          </Grid>
        </Box>
      ) : null}
    </Layout>
  );
};

export default EventAdminPage;
