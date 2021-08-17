import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { EDIT_USER_QUERY } from "@graphql/users/queries";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  TextField,
  useTheme,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { EditUser } from "src/types/users";

const EditProfilePage: NextPage = () => {
  const { data } = useQuery<{ user: EditUser }>(EDIT_USER_QUERY);
  const theme = useTheme();
  const router = useRouter();

  return (
    <Layout>
      <Container>
        <Grid container direction="row" justify="center">
          <Grid item md={8}>
            <Card style={{ marginTop: theme.spacing(8), marginBottom: theme.spacing(8) }}>
              <CardHeader title="Oppdater profil" />
              <CardContent>
                <Grid container direction="column" spacing={2}>
                  <Grid container item direction="row" spacing={2}>
                    <Grid item>
                      <TextField
                        label="Fornavn"
                        value={data?.user?.firstName}
                        variant="filled"
                        InputLabelProps={{
                          shrink: data?.user?.firstName !== undefined,
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        label="Etternavn"
                        value={data?.user?.lastName}
                        variant="filled"
                        InputLabelProps={{
                          shrink: data?.user?.lastName !== undefined,
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container item direction="row" spacing={2}>
                    <Grid item>
                      <TextField
                        label="E-post"
                        value={data?.user?.email}
                        variant="filled"
                        InputLabelProps={{
                          shrink: data?.user?.email !== undefined,
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        label="Uteksamineringsår"
                        value={data?.user?.graduationYear}
                        variant="filled"
                        InputLabelProps={{
                          shrink: data?.user?.graduationYear !== undefined,
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Allergier"
                      value={data?.user?.allergies}
                      variant="filled"
                      InputLabelProps={{
                        shrink: data?.user?.allergies !== undefined,
                      }}
                    >
                      {data?.user?.allergies}
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Grid container direction="row" justify="space-between" spacing={2}>
                  <Grid item md>
                    <Button variant="contained" style={{ backgroundColor: red[800], color: "white" }}>
                      Slett bruker
                    </Button>
                  </Grid>
                  <Grid container item md direction="row" justify="flex-end">
                    <Grid item>
                      <Button onClick={router.back}>Avbryt</Button>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" color="primary">
                        Lagre
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default EditProfilePage;
