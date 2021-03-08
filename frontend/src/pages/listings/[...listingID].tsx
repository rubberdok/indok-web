import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { LISTING } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import {
  Button, Card,
  CardContent,
  Container,
  Grid, makeStyles, Typography
} from "@material-ui/core";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import localizedFormat from "dayjs/plugin/localizedFormat";


const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },

  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  content: {
    flexDirection: "column",
    padding: theme.spacing(4),
  },

  wrapper: {
    flexDirection: "row",
    padding: theme.spacing(4),
  },

  organization: {
    flexDirection: "column",
    justifyContent: "space-between"
  },

  organizationContent: {
    flexDirection: "column",
    padding: theme.spacing(2),
    spacing: theme.spacing(10),
  },
}));

const ListingPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ listingID }) => {
  const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING, {
    variables: { ID: Number(listingID[0]) },
  });
  const classes = useStyles();

  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <>
      {data && (
        <Layout>
          <Container>
            <Container className={classes.container}>
              <Grid container direction="row" justify="space-between" spacing={2}>
                
                <Grid container item direction="column" xs={8}>
                  <Card>
                    <CardContent>
                      <Grid container className={classes.organizationContent} spacing={2}>
                        
                        <Grid item>
                          <Typography variant="h2" component="h2">
                            {data.listing.title}
                          </Typography>
                          <Typography variant="p" component="p" className={classes.date}> 
                            {dayjs(data.listing.deadline).locale(nb).format("dddd D. MMMM YYYY [kl.] HH:mm")}
                          </Typography>
                        </Grid>

                        <Grid item>
                          <Typography variant="p" component="p">
                            {data.listing.description}
                          </Typography>
                        </Grid>

                      </Grid>
                    </CardContent>
                  </Card>
                  <Button variant="contained" color="primary">
                    Søk her
                  </Button>
                </Grid>

                <Grid container item direction="column" xs={4}>
                  <Card>
                    <CardContent>
                      <Grid container className={classes.organizationContent} spacing={2}>
                        
                        <Grid item>
                          <Typography variant="h4" component="h3">
                            {data.listing.organization?.name || "Ingen organisasjon"}
                          </Typography>
                        </Grid>

                        <Grid item>
                          <Typography variant="p" component="p">
                            {data.listing.organization?.description || "Ingen organisasjon"}
                          </Typography>
                        </Grid>

                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

              </Grid>
            </Container>
          </Container>
        </Layout>
      )}
    </>
  );
};

export default ListingPage;

export const getServerSideProps: GetServerSideProps<{ listingID: string }> = async (context) => {
  const listingID = context.query.listingID as string;
  return {
    props: { listingID },
  };
};
