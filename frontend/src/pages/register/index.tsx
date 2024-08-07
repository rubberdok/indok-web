import { Container, Grid } from "@mui/material";
import { useRouter } from "next/router";

import { UserForm } from "@/components/pages/profile/UserForm";
import { Layout, RootStyle } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

const ID_PREFIX = "registerUser-";

const EditProfilePage: NextPageWithLayout = () => {
  const router = useRouter();
  return (
    <Container>
      <Grid container direction="row" justifyContent="center">
        <Grid item md={8}>
          <UserForm
            kind="register"
            title="Registrering"
            onCompleted={() => router.push("/profile")}
            data-test-id={ID_PREFIX}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

EditProfilePage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);

export default EditProfilePage;
