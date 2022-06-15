import { useQuery } from "@apollo/client";
import Title from "@components/Title";
import { AllCabinsDocument } from "@generated/graphql";
import { Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import cabin from "@public/img/hytte.jpg";
import Link from "next/link";
import React from "react";

const CabinsHero: React.VFC = () => {
  return (
    <>
      <Title
        title="Hyttebooking"
        variant="dark"
        breadcrumbs={[
          { href: "/", name: "Hjem" },
          { href: "/cabins", name: "Hyttebooking" },
        ]}
        bgImage={cabin}
        disableGutters
      />
      <Box bgcolor="grey.900" py={4}>
        <Container maxWidth="sm">
          <CabinsBookCard />
        </Container>
      </Box>
    </>
  );
};

const CabinsBookCard: React.FC = () => {
  const { data } = useQuery(AllCabinsDocument);
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ color: "common.white" }}>
      <Stack direction="column">
        <Typography variant="h4" gutterBottom>
          Priser
        </Typography>
        <Typography variant="subtitle1">Hel hytte</Typography>
        <Divider />
        <Typography variant="subtitle2">Internpris: {data?.cabins?.[0]?.internalPrice} kr</Typography>
        <Typography variant="subtitle2">Eksternpris: {data?.cabins?.[0]?.externalPrice} kr</Typography>
      </Stack>
      <Link href="/cabins/book" passHref>
        <Button variant="contained" size="large" color="success">
          Book nå
        </Button>
      </Link>
    </Stack>
  );
};

export default CabinsHero;
