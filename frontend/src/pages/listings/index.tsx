import Listings from "@components/pages/listings/index/Listings";
import Title from "@components/Title/";
import Layout from "@layouts/Layout";
import { Container } from "@mui/material";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";

// page to show all listings open to users
const ListingsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const reload = () => {
    return router.reload();
  };
  // renders a ListingItem for each listing
  return (
    <>
      <Title
        title="Verv"
        breadcrumbs={[
          { name: "Hjem", href: "/" },
          { name: "Verv", href: "/listings" },
        ]}
      />
      <Container>
        <Listings reload={reload} />
      </Container>
    </>
  );
};

ListingsPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default ListingsPage;
