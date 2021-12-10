import Layout from "@components/Layout";
import UserForm from "@components/pages/profile/UserForm";
import { Container, Grid } from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";

const EditProfilePage: NextPage = () => {
  const router = useRouter();
  return (
    <Layout>
      <Container>
        <Grid container direction="row" justifyContent="center">
          <Grid item md={8}>
            <UserForm kind="register" title="Registrering" onCompleted={() => router.push("/profile")} />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default EditProfilePage;
