import { useMutation, useQuery } from "@apollo/client";
import {
  currentGradeYear,
  isVegetarian,
  maxGraduationYear,
  suggestGraduationYear,
  validationSchema,
} from "@components/pages/profile/UserForm/helpers";
import { UPDATE_USER } from "@graphql/users/mutations";
import { EDIT_USER_QUERY } from "@graphql/users/queries";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  NativeSelect,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { range } from "@utils/helpers";
import dayjs from "dayjs";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { EditUser } from "src/types/users";

type Props = {
  kind: "register" | "update";
  title: string;
  onCompleted?: () => void;
  "data-test-id"?: string;
};

const UserForm: React.VFC<Props> = ({ kind, title, onCompleted, "data-test-id": dataTestId }) => {
  const { data } = useQuery<{ user?: EditUser }>(EDIT_USER_QUERY);
  const [updateUser] = useMutation<{ updateUser: { user: EditUser } }>(UPDATE_USER, {
    onCompleted: onCompleted,
    refetchQueries: ["editUserInfo"],
  });
  const theme = useTheme();
  const router = useRouter();
  const currentYear = dayjs().year();
  const ID_PREFIX = `${dataTestId}`;

  const minimumGraduationYear = useMemo<number>(
    () => Math.min(currentYear, data?.user?.graduationYear || currentYear),
    [data?.user?.graduationYear]
  );
  const graduationYears = useMemo<number[]>(
    () => range(minimumGraduationYear, maxGraduationYear, 1),
    [minimumGraduationYear]
  );

  const formik = useFormik({
    initialValues: {
      firstName: data?.user?.firstName || "",
      lastName: data?.user?.lastName || "",
      email: data?.user?.email || data?.user?.feideEmail || "",
      phoneNumber: data?.user?.phoneNumber || "",
      graduationYear: data?.user?.graduationYear || suggestGraduationYear(),
      allergies: data?.user?.allergies || "",
    },
    onSubmit: (values) =>
      updateUser({
        variables: { id: data?.user?.id, userData: values },
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
            <Grid item data-test-id={`${ID_PREFIX}title`}>
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
                  data-test-id={`${ID_PREFIX}firstNameTextField`}
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
                  data-test-id={`${ID_PREFIX}lastNameTextField`}
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
                  data-test-id={`${ID_PREFIX}emailTextField`}
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
                  data-test-id={`${ID_PREFIX}phoneNumberTextField`}
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
                  data-test-id={`${ID_PREFIX}graduationYearSelect`}
                  disabled={!data?.user?.canUpdateYear}
                >
                  {graduationYears.map((year) => (
                    <option key={year} value={year}>
                      {`${year} (${currentGradeYear(year)}. klasse)`}
                    </option>
                  ))}
                </NativeSelect>
                {formik.touched.graduationYear && Boolean(formik.errors.graduationYear) && (
                  <FormHelperText style={{ color: theme.palette.error.main }}>
                    {formik.touched.graduationYear && formik.errors.graduationYear}
                  </FormHelperText>
                )}
                {data?.user?.canUpdateYear && <FormHelperText>Kan bare endres én gang i året.</FormHelperText>}
                {!data?.user?.canUpdateYear && (
                  <FormHelperText>
                    Kan ikke endres før: {dayjs(data?.user?.yearUpdatedAt).add(1, "year").format("DD.MM.YYYY")}
                  </FormHelperText>
                )}
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
                  data-test-id={`${ID_PREFIX}allergiesTextField`}
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
                <Button variant="contained" color="primary" type="submit" data-test-id={`${ID_PREFIX}saveButton`}>
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
