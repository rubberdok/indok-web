import Listings from "@components/pages/listings/index/Listings";
import Title from "@components/Title";
import { Container, styled } from "@mui/material";
import { useRouter } from "next/router";
import Layout from "src/layouts";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "src/theme/constants";
import { NextPageWithLayout } from "../_app";

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up("md")]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

// page to show all listings open to users
const ListingsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const reload = () => {
    return router.reload();
  };
  // renders a ListingItem for each listing
  return (
    <RootStyle>
      <Title>Verv</Title>
      <Container>
        <Listings reload={reload} />
      </Container>
    </RootStyle>
  );
};

ListingsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ListingsPage;
