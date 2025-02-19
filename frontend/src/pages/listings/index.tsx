import { Container } from "@mui/material";
import { useRouter } from "next/router";

import { Listings } from "@/components/pages/listings/index/Listings";
import { Title } from "@/components/Title/";
import { NextPageWithLayout } from "@/lib/next";

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
        title="Ledige vervstillinger"
        breadcrumbs={[
          { name: "Hjem", href: "/" },
          { name: "Ledige vervstillinger", href: "/listings" },
        ]}
      />
      <Container>
        <Listings reload={reload} />
      </Container>
    </>
  );
};

export default ListingsPage;
