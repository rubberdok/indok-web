import { useMutation, useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
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
import range from "lodash/range";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { Link } from "@/components";
import { UpdateUserDocument, UserToEditDocument } from "@/generated/graphql";
import dayjs from "@/lib/date";

import {
  IUserForm,
  currentGradeYear,
  isVegetarian,
  maxGraduationYear,
  suggestGraduationYear,
  validationSchema,
} from "./helpers";

type Props = {
  kind: "register" | "update";
  title: string;
  onCompleted?: () => void;
  "data-test-id"?: string;
};

export const UserForm: React.FC<Props> = ({ kind, title, onCompleted, "data-test-id": dataTestId }) => {
  const { data } = useQuery(UserToEditDocument);
  const [updateUser] = useMutation(UpdateUserDocument, {
    onCompleted: onCompleted,
    refetchQueries: [{ query: UserToEditDocument }],
  });
  const router = useRouter();
  const currentYear = dayjs().year();
  const ID_PREFIX = `${dataTestId}`;

  const minimumGraduationYear = Math.min(currentYear, data?.user?.graduationYear ?? currentYear);
  const graduationYears = range(minimumGraduationYear, maxGraduationYear + 1, 1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IUserForm>({
    mode: "onTouched",
    defaultValues: {
      firstName: data?.user?.firstName || "",
      lastName: data?.user?.lastName || "",
      email: data?.user?.email || data?.user?.feideEmail || "",
      phoneNumber: data?.user?.phoneNumber || "",
      graduationYear: data?.user?.graduationYear || suggestGraduationYear(),
      allergies: data?.user?.allergies || "",
    },
    values: {
      firstName: data?.user?.firstName || "",
      lastName: data?.user?.lastName || "",
      email: data?.user?.email || data?.user?.feideEmail || "",
      phoneNumber: data?.user?.phoneNumber || "",
      graduationYear: data?.user?.graduationYear || suggestGraduationYear(),
      allergies: data?.user?.allergies || "",
    },
    resolver: yupResolver(validationSchema),
  });

  return (
    <form
      onSubmit={handleSubmit((values) =>
        updateUser({
          variables: { userData: values },
        })
      )}
    >
      <Card sx={{ mt: 8, mb: 8 }} elevation={6}>
        <CardContent>
          <Grid container>
            {kind === "update" && (
              <Grid item>
                <Button
                  component={Link}
                  href="/profile"
                  noLinkStyle
                  fullWidth
                  variant="text"
                  startIcon={<ArrowBack />}
                />
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("firstName")}
                  label="Fornavn"
                  required
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName?.message}
                  data-test-id={`${ID_PREFIX}firstNameTextField`}
                />
              </Grid>
              <Grid item>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("lastName")}
                  label="Etternavn"
                  required
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName?.message}
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("email")}
                  label="E-post"
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  data-test-id={`${ID_PREFIX}emailTextField`}
                />
              </Grid>
              <Grid item>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("phoneNumber")}
                  label="Telefonnummer"
                  error={Boolean(errors.phoneNumber)}
                  helperText={errors.phoneNumber?.message}
                  data-test-id={`${ID_PREFIX}phoneNumberTextField`}
                />
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2">Studieinformasjon</Typography>
            </Grid>
            <Grid item>
              <FormControl variant="standard">
                <InputLabel htmlFor="graduationYear" shrink={true}>
                  Uteksamineringsår
                </InputLabel>
                <NativeSelect
                  {...register("graduationYear")}
                  required
                  variant="filled"
                  error={Boolean(errors.graduationYear)}
                  data-test-id={`${ID_PREFIX}graduationYearSelect`}
                  disabled={!data?.user?.canUpdateYear}
                >
                  {graduationYears.map((year) => (
                    <option key={year} value={year}>
                      {`${year} (${currentGradeYear(year)}. klasse)`}
                    </option>
                  ))}
                </NativeSelect>
                {Boolean(errors.graduationYear) && (
                  <FormHelperText sx={{ color: (theme) => theme.vars.palette.error.main }}>
                    errors.phoneNumber?.message
                  </FormHelperText>
                )}
                {data?.user?.canUpdateYear && <FormHelperText>Kan bare endres én gang i året.</FormHelperText>}
                {!data?.user?.canUpdateYear && (
                  <FormHelperText>
                    Kan ikke endres før: {dayjs(data?.user?.yearUpdatedAt).add(1, "year").format("L")}
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("allergies")}
                  label="Allergier"
                  error={Boolean(errors.allergies)}
                  helperText={errors.allergies?.message}
                  data-test-id={`${ID_PREFIX}allergiesTextField`}
                />
              </Grid>
              <Grid item>
                <Typography variant="body1">{isVegetarian(watch("allergies")) && "💚"}</Typography>
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
