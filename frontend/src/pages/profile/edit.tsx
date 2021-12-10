import Layout from "@components/Layout";
import UserForm from "@components/pages/profile/UserForm";
import { Container, Grid, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { NextPage } from "next";
import { useState } from "react";

const EditProfilePage: NextPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Layout>
      <Container>
        <Snackbar autoHideDuration={6000} open={open} onClose={() => setOpen(false)}>
          <Alert elevation={6} variant="standard" severity="success">
            Endringene er lagret.
          </Alert>
        </Snackbar>
        <Grid container direction="row" justifyContent="center">
          <Grid item md={8}>
            <UserForm kind="update" title="Oppdater profil" onCompleted={() => setOpen(true)} />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default EditProfilePage;
