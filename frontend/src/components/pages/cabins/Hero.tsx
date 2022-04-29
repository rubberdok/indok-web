import { Button, Card, Container, Stack, styled, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const RootStyle = styled("div")(({ theme }) => ({
  color: "white",
  padding: theme.spacing(15, 0),

  backgroundColor: "black",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)), url('img/hytte.jpg')`,
}));

const Hero: React.VFC = () => {
  return (
    <RootStyle>
      <Container>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h1">Hyttebooking</Typography>
          <Card
            component={Stack}
            direction="row"
            sx={{ alignItems: "center", p: 1, pl: 3, bgcolor: "grey.900", color: "common.white" }}
            spacing={4}
          >
            <Typography variant="h6">Vi har ledige hytter</Typography>
            <Link href="/cabins/book" passHref>
              <Button variant="contained" size="large" color="success">
                Book nå
              </Button>
            </Link>
          </Card>
        </Stack>
      </Container>
    </RootStyle>
  );
};

export default Hero;
