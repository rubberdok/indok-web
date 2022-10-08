import { useMutation, useQuery } from "@apollo/client";
import { ArrowBack } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  NativeSelect,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useFormik } from "formik";
import range from "lodash/range";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

import {
  currentGradeYear,
  isVegetarian,
  maxGraduationYear,
  suggestGraduationYear,
  validationSchema,
} from "@/components/pages/profile/UserForm/helpers";
import { UpdateUserDocument, UserToEditDocument } from "@/generated/graphql";

type Props = {
  kind: "register" | "update";
  title: string;
  onCompleted?: () => void;
  "data-test-id"?: string;
};

export const UserForm: React.VFC<Props> = ({ kind, title, onCompleted, "data-test-id": dataTestId }) => {
  const { data } = useQuery(UserToEditDocument);
  const [updateUser] = useMutation(UpdateUserDocument, { onCompleted, refetchQueries: [UserToEditDocument] });
  const router = useRouter();
  const currentYear = dayjs().year();
  const ID_PREFIX = `${dataTestId}`;

  const minimumGraduationYear = useMemo<number>(
    () => Math.min(currentYear, data?.user?.graduationYear ?? currentYear),
    [data?.user?.graduationYear, currentYear]
  );
  const graduationYears = useMemo<number[]>(
    () => range(minimumGraduationYear, maxGraduationYear + 1, 1),
    [minimumGraduationYear, currentYear]
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
        variables: { userData: values },
      }),
    validationSchema,
    enableReinitialize: true,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card sx={{ mt: (theme) => theme.spacing(8), mb: (theme) => theme.spacing(8) }} elevation={6}>
        <CardContent sx={{ pt: (theme) => theme.spacing(4) }}>
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
                  required
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("firstName")}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  data-test-id={`${ID_PREFIX}firstNameTextField`}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Etternavn"
                  name="lastName"
                  required
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("lastName")}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
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
                  onBlur={() => formik.setFieldTouched("email")}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  data-test-id={`${ID_PREFIX}emailTextField`}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Telefonnummer"
                  name="phoneNumber"
                  onBlur={() => formik.setFieldTouched("phoneNumber")}
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                  data-test-id={`${ID_PREFIX}phoneNumberTextField`}
                />
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2">Studieinformasjon</Typography>
            </Grid>
            <Grid item>
              <FormControl variant="standard">
                <InputLabel htmlFor="graduationYear">Uteksamineringsår</InputLabel>
                <NativeSelect
                  name="graduationYear"
                  required
                  variant="filled"
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
                  <FormHelperText sx={{ color: (theme) => theme.palette.error.main }}>
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
                  value={formik.values.allergies}
                  onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("allergies")}
                  error={formik.touched.allergies && Boolean(formik.errors.allergies)}
                  helperText={formik.touched.allergies && formik.errors.allergies}
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
          </Grid>
        </CardActions>
      </Card>
    </form>
  );
};
