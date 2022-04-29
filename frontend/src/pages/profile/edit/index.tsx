import UserForm from "@components/pages/profile/UserForm";
import { Alert, Container, Grid, Snackbar, styled } from "@mui/material";
import React, { useState } from "react";
import Layout from "src/layouts";
import { NextPageWithLayout } from "src/pages/_app";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "src/theme/constants";

const ID_PREFIX = "editUser-";

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  margin: theme.spacing(4, 0),
  [theme.breakpoints.up("md")]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

const EditPage: NextPageWithLayout = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <RootStyle>
      <Container>
        <Snackbar
          autoHideDuration={6000}
          open={open}
          onClose={() => setOpen(false)}
          data-test-id={`${ID_PREFIX}successSnackbar`}
        >
          <Alert elevation={6} variant="standard" severity="success">
            Endringene er lagret.
          </Alert>
        </Snackbar>
        <Grid container direction="row" justifyContent="center">
          <Grid item md={8}>
            <UserForm
              kind="update"
              title="Oppdater profil"
              onCompleted={() => setOpen(true)}
              data-test-id={ID_PREFIX}
            />
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
};

EditPage.getLayout = (page: React.ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default EditPage;
