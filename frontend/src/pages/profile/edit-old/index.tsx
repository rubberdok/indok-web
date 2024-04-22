import { Alert, Container, Grid, Snackbar } from "@mui/material";
import { useState } from "react";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { UserForm } from "@/components/pages/profile/UserForm";
import { Layout, RootStyle } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

const ID_PREFIX = "editUser-";

const EditPage: NextPageWithLayout = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Container>
      <Breadcrumbs
        links={[
          { name: "Hjem", href: "/" },
          { name: "Profil", href: "/profile" },
          { name: "Rediger", href: "/profile/edit" },
        ]}
      />
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
          <UserForm kind="update" title="Oppdater profil" onCompleted={() => setOpen(true)} data-test-id={ID_PREFIX} />
        </Grid>
      </Grid>
    </Container>
  );
};

EditPage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);

export default EditPage;
