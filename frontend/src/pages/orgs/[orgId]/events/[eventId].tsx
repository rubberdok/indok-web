import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { GET_EVENT } from "@graphql/events/queries";
import { Box, Card, CardContent, CardHeader, Grid, ListItem, TextField, Typography, List } from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const EventAdminPage: NextPage = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const { loading, data } = useQuery(GET_EVENT, {
    variables: { id: eventId },
  });

  return (
    <Layout>
      {!loading ? (
        <Box m={10}>
          <Grid container direction="column">
            <Grid item>
              <Typography variant="h1" align="center">
                Adminside for {data.event.title}
              </Typography>
            </Grid>
            <Grid item container>
              <Grid item xs>
                <Card variant="outlined">
                  <CardHeader title="Generell informasjon" />
                  <CardContent>
                    <List>
                      <ListItem>
                        <TextField defaultValue={data.event.title} helperText="Tittel" variant="outlined" />
                      </ListItem>
                      <ListItem>
                        <TextField defaultValue={data.event.location} helperText="Sted" variant="outlined" />
                      </ListItem>
                    </List>
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
