import Layout from "@components/Layout";
import Listings from "@components/pages/listings/index/Listings";
import Title from "@components/Title";
import { Container } from "@mui/material";
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
    <Layout>
      <Title>Verv</Title>
      <Container>
        <Listings reload={reload} />
      </Container>
    </Layout>
  );
};

export default ListingsPage;
