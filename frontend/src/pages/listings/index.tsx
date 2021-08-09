import Layout from "@components/Layout";
import Listings from "@components/pages/listings/index/Listings";
import { Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";

// page to show all listings open to users
const ListingsPage: NextPage = () => {
  const router = useRouter();
  const reload = () => {
    return router.reload();
  };
  // renders a ListingItem for each listing
  return (
    <Layout title="Verv">
      <Container>
        <Typography variant="h1" component="h1" align="center">
          Verv
        </Typography>
        <Listings reload={reload} />
      </Container>
    </Layout>
  );
};

export default ListingsPage;
