import { useMutation, useQuery } from "@apollo/client";
import { isVegetarian, validationSchema } from "@components/pages/profile/UserForm/helpers";
import { UPDATE_USER } from "@graphql/users/mutations";
import { EDIT_USER_QUERY } from "@graphql/users/queries";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  NativeSelect,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { range } from "@utils/helpers";
import dayjs from "dayjs";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { EditUser } from "src/types/users";
import { suggestNames } from "./helpers";

type Props = {
  kind: "register" | "update";
  title: string;
  onCompleted?: () => void;
};

const UserForm: React.VFC<Props> = ({ kind, title, onCompleted }) => {
  const { data } = useQuery<{ user: EditUser }>(EDIT_USER_QUERY);
  const [updateUser] = useMutation<{ updateUser: { user: EditUser } }>(UPDATE_USER, {
    onCompleted: onCompleted,
  });
  const theme = useTheme();
  const router = useRouter();
  const currentYear = dayjs().year();

  const { firstName, lastName } = suggestNames(data?.user.firstName);

  const formik = useFormik({
    initialValues: {
      firstName: (kind === "register" ? firstName : data?.user.firstName) || "",
      lastName: (kind === "register" ? lastName : data?.user.lastName) || "",
      email: data?.user.email || "",
      phoneNumber: data?.user.phoneNumber || "",
      graduationYear: data?.user.graduationYear || currentYear + 5,
      allergies: data?.user.allergies || "",
    },
    onSubmit: (values) =>
      updateUser({
        variables: { id: data?.user.id, userData: values },
      }),
    validationSchema,
    enableReinitialize: true,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card style={{ marginTop: theme.spacing(8), marginBottom: theme.spacing(8) }}>
        <CardContent style={{ paddingTop: 32 }}>
          <Grid container>
            {kind === "update" && (
              <Grid item>
                <Link href="/profile" passHref>
                  <Button fullWidth variant="text" startIcon={<ArrowBack />} />
                </Link>
              </Grid>
            )}
            <Grid item>
              <Typography variant="h4">{title}</Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardContent>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="subtitle2">Personalia</Typography>
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
                  onBlur={() => formik.setFieldTouched("firstName")}
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
                  onBlur={() => formik.setFieldTouched("lastName")}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2">Kontaktinformasjon</Typography>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item>
                <TextField
                  label="E-post"
                  name="email"
                  id="email"
                  variant="outlined"
                  onBlur={() => formik.setFieldTouched("email")}
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
                  onBlur={() => formik.setFieldTouched("phoneNumber")}
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
              <Typography variant="subtitle2">Studieinformasjon</Typography>
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
                  onBlur={() => formik.setFieldTouched("graduationYear")}
                  error={formik.touched.graduationYear && Boolean(formik.errors.graduationYear)}
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
              <Typography variant="subtitle2">Annet</Typography>
            </Grid>
            <Grid container item direction="row" alignItems="center" spacing={2}>
              <Grid item>
                <TextField
                  label="Allergier"
                  name="allergies"
                  variant="outlined"
                  value={formik.values.allergies}
                  onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("allergies")}
                  error={formik.touched.allergies && Boolean(formik.errors.allergies)}
                  helperText={formik.touched.allergies && formik.errors.allergies}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item>
                <Typography variant="body1">{isVegetarian(formik.values.allergies) && "💚"}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Grid container direction="column" spacing={2}>
            <Grid container item md direction="row" justifyContent="flex-end">
              {kind === "update" && (
                <Grid item>
                  <Button onClick={router.back}>Avbryt</Button>
                </Grid>
              )}
              <Grid item>
                <Button variant="contained" color="primary" type="submit">
                  {kind === "register" ? "Fullfør registrering" : "Lagre"}
                </Button>
              </Grid>
            </Grid>
            {kind === "update" && (
              <>
                <Grid item>
                  <Divider />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2">Irreversible operasjoner</Typography>
                </Grid>
                <Grid item>
                  <Grid item md>
                    <Button disabled variant="contained">
                      Slett bruker (kommer snart)
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </CardActions>
      </Card>
    </form>
  );
};

export default UserForm;
