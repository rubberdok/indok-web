import Breadcrumbs from "@components/Breadcrumbs";
import useResponsive from "@hooks/useResponsive";
import { Button, Card, Container, Stack, styled, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const RootStyle = styled("div")(({ theme }) => ({
  color: "white",
  padding: theme.spacing(5, 0),

  backgroundColor: "black",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url('img/hytte.jpg')`,
}));

const CabinsHero: React.VFC = () => {
  const isMobile = useResponsive("down", "md");

  return (
    <>
      <RootStyle>
        <Container>
          <Breadcrumbs onDark links={[{ name: "Hjem", href: "/" }, { name: "Hyttebooking" }]} />
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={{ xs: 8, md: 0 }}
            sx={{ py: 12 }}
          >
            <Typography variant="h1">Hyttebooking</Typography>
            {!isMobile && <CabinsBookCard />}
          </Stack>
        </Container>
      </RootStyle>

      {isMobile && <CabinsBookCard />}
    </>
  );
};

const CabinsBookCard: React.FC = () => {
  return (
    <Card
      component={Stack}
      direction="row"
      sx={{ alignItems: "center", p: 1, pl: 3, bgcolor: "grey.900", color: "common.white" }}
      spacing={4}
      justifyContent="space-between"
    >
      <Typography variant="h6">Vi har ledige hytter</Typography>
      <Link href="/cabins/book" passHref>
        <Button variant="contained" size="large" color="success">
          Book nå
        </Button>
      </Link>
    </Card>
  );
};

export default CabinsHero;
