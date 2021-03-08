import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { LISTING } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Link from "next/link";
import { Card, CardContent, Container, CardHeader, Typography, makeStyles } from "@material-ui/core";
import theme from "@styles/theme";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },

  title: {
    flexDirection: "row",
    justifyContent: "flex-end",
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
              <div className={classes.title}>
                <div md={8}>
                  <Typography variant="h1" component="h1">
                    {data.listing.title}
                  </Typography>
                </div>
                <div md={2}>
                  <Typography variant="h6" component="p">
                    {"I morgen"}
                  </Typography>
                </div>
              </div>
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
