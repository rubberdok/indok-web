import { useMutation, useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { UPDATE_USER } from "@graphql/users/mutations";
import { EDIT_USER_QUERY } from "@graphql/users/queries";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  Grid,
  InputLabel,
  NativeSelect,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { EditUser } from "src/types/users";
import * as Yup from "yup";

const EditProfilePage: NextPage = () => {
  const { data } = useQuery<{ user: EditUser }>(EDIT_USER_QUERY);
  const [updateUser] = useMutation<{ updateUser: { user: EditUser } }>(UPDATE_USER);
  const theme = useTheme();
  const router = useRouter();
  const currentYear = dayjs().year();

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required().min(2, "Kan ikke være kortere enn 2 tegn."),
    lastName: Yup.string().required().min(2, "Kan ikke være kortere enn to tegn."),
    email: Yup.string().email().notRequired(),
    allergies: Yup.string().notRequired(),
    graduationYear: Yup.number().required().min(currentYear),
  });

  const formik = useFormik({
    initialValues: data?.user || {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      graduationYear: currentYear,
      allergies: "",
    },
    onSubmit: (values) =>
      updateUser({
        variables: { id: values.id, userData: values },
        onCompleted: () => router.push("/profile"),
      }),
    validationSchema,
    enableReinitialize: true,
  });

  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

  return (
    <Layout>
      <Container>
        <Grid container direction="row" justifyContent="center">
          <Grid item md={8}>
            <form onSubmit={formik.handleSubmit}>
              <Card style={{ marginTop: theme.spacing(8), marginBottom: theme.spacing(8) }}>
                <CardHeader title="Oppdater profil" />
                <CardContent>
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <Typography variant="subtitle1">Personalia</Typography>
                    </Grid>
                    <Grid container item direction="row" spacing={2}>
                      <Grid item>
                        <TextField
                          label="Fornavn"
                          name="firstName"
                          variant="outlined"
                          required
                          value={formik.values.firstName}
                          onChange={formik.handleChange}
                          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                          helperText={formik.touched.firstName && formik.errors.firstName}
                          InputLabelProps={{
                            shrink: formik.values.firstName !== undefined,
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          label="Etternavn"
                          name="lastName"
                          variant="outlined"
                          required
                          value={formik.values.lastName}
                          onChange={formik.handleChange}
                          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                          helperText={formik.touched.lastName && formik.errors.lastName}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">Kontaktinformasjon</Typography>
                    </Grid>
                    <Grid container item direction="row" spacing={2}>
                      <Grid item>
                        <TextField
                          label="E-post"
                          name="email"
                          variant="outlined"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          error={formik.touched.email && Boolean(formik.errors.email)}
                          helperText={formik.touched.email && formik.errors.email}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          label="Telefonnummer"
                          name="phoneNumber"
                          variant="outlined"
                          value={formik.values.phoneNumber}
                          onChange={formik.handleChange}
                          error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                          helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">Studieinformasjon</Typography>
                    </Grid>
                    <Grid item>
                      <FormControl>
                        <InputLabel htmlFor="graduationYear" shrink>
                          Uteksamineringsår
                        </InputLabel>
                        <NativeSelect
                          name="graduationYear"
                          variant="outlined"
                          required
                          value={formik.values.graduationYear}
                          onChange={formik.handleChange}
                          error={formik.touched.graduationYear && Boolean(formik.errors.graduationYear)}
                          // helperText={formik.touched.graduationYear && formik.errors.graduationYear}
                        >
                          {range(currentYear, currentYear + 7, 1).map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </NativeSelect>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">Annet</Typography>
                    </Grid>
                    <Grid item>
                      <TextField
                        label="Allergier"
                        name="allergies"
                        variant="outlined"
                        value={formik.values.allergies}
                        onChange={formik.handleChange}
                        error={formik.touched.allergies && Boolean(formik.errors.allergies)}
                        helperText={formik.touched.allergies && formik.errors.allergies}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Grid container direction="row" justifyContent="space-between" spacing={2}>
                    <Grid item md>
                      <Button disabled variant="contained" style={{ backgroundColor: red[800], color: "white" }}>
                        Slett bruker
                      </Button>
                    </Grid>
                    <Grid container item md direction="row" justifyContent="flex-end">
                      <Grid item>
                        <Button onClick={router.back}>Avbryt</Button>
                      </Grid>
                      <Grid item>
                        <Button variant="contained" color="primary" type="submit">
                          Lagre
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardActions>
              </Card>
            </form>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default EditProfilePage;
