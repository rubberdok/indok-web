import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { GET_EVENTS } from "@graphql/events/queries";
import { Event } from "@interfaces/events";
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  CircularProgress,
  Divider,
} from "@material-ui/core";
import dayjs from "dayjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";

const OrganizationDetailPage: NextPage = () => {
  const router = useRouter();
  const { orgId } = router.query;
  const numberId = typeof orgId === "string" && parseInt(orgId);

  const { loading, data } = useQuery(GET_EVENTS, {
    variables: {},
  });

  return (
    <Layout>
      <Box m={10}>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="h1" align="center">
              Adminside for Organisasjon {numberId}
            </Typography>
          </Grid>
          <Grid item container>
            <Grid item>
              <Card variant="outlined">
                <CardHeader title="Arragementer" />
                <Divider variant="middle" />
                <CardContent>
                  {!loading ? (
                    <List>
                      {data.allEvents.map((event: Event) => (
                        <Link href={`${numberId}/events/${event.id}`} passHref key={event.id}>
                          <ListItem button>{`${dayjs(event.startTime).format("DD-MM-YY")}: ${event.title}`}</ListItem>
                        </Link>
                      ))}
                    </List>
                  ) : (
                    <CircularProgress />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Typography variant="body1">
            Dette er adminsiden til en gitt organisasjon. Her skal man kunne se en oversikt over for eksempel alle
            nåværende åpne arrangementer (tenk et kort per arrangement med oppsumert info som antall påmeldte). Andre
            ting som er nyttig her vil være liste over åpne vervstillinger, administrere medlemmer, kanskje
            organisasjonsspesifikk info elns.
          </Typography>
        </Grid>
      </Box>
    </Layout>
  );
};

export default OrganizationDetailPage;
