import { useMutation, useQuery } from "@apollo/client";
import {
  currentGradeYear,
  graduationYears,
  isVegetarian,
  minimumGraduationYear,
  validationSchema,
} from "@components/pages/profile/UserForm/helpers";
import { EditUserDocument, UpdateUserDocument } from "@graphql";
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
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type Props = {
  kind: "register" | "update";
  title: string;
  onCompleted?: () => void;
  "data-test-id"?: string;
};

interface UserForm {
  firstName: string;
  lastName: string;
  graduationYear: number;
  phoneNumber: string;
  allergies: string;
}

const UserForm: React.VFC<Props> = ({ kind, title, onCompleted, "data-test-id": dataTestId }) => {
  const [updateUser] = useMutation(UpdateUserDocument, {
    onCompleted: onCompleted,
  });
  const router = useRouter();
  const ID_PREFIX = `${dataTestId}`;

  const { handleSubmit, control, getValues, reset } = useForm<UserForm>({
    resolver: yupResolver(validationSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const { data } = useQuery(EditUserDocument, {
    onCompleted(data) {
      const defaultValues = {
        firstName: data.user?.firstName,
        lastName: data.user?.lastName,
        graduationYear: data.user?.graduationYear ?? minimumGraduationYear(data.user?.graduationYear),
        allergies: data.user?.allergies ?? "",
        phoneNumber: data.user?.phoneNumber ?? "",
      };
      reset(defaultValues);
    },
  });

  const onSubmit: SubmitHandler<UserForm> = (values) => {
    if (data?.user) {
      updateUser({
        variables: {
          id: data.user.id,
          data: values,
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ mt: (theme) => theme.spacing(8), mb: (theme) => theme.spacing(8) }}>
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
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field, fieldState: { error, isTouched } }) => {
                    return (
                      <TextField
                        label="Fornavn"
                        data-testid={`${ID_PREFIX}firstNameTextField`}
                        error={isTouched && Boolean(error)}
                        helperText={error?.message}
                        {...field}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field, fieldState: { error, isTouched } }) => (
                    <TextField
                      label="Etternavn"
                      required
                      data-testid={`${ID_PREFIX}lastNameTextField`}
                      error={isTouched && Boolean(error)}
                      helperText={error?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2">Kontaktinformasjon</Typography>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field, fieldState: { error, isTouched } }) => (
                    <TextField
                      label="Telefonnummer"
                      required
                      data-testid={`${ID_PREFIX}phoneNumberTextField`}
                      error={isTouched && Boolean(error)}
                      helperText={error?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2">Studieinformasjon</Typography>
            </Grid>
            <Grid item>
              <FormControl variant="standard">
                <InputLabel htmlFor="graduationYear">Uteksamineringsår</InputLabel>
                <Controller
                  name="graduationYear"
                  control={control}
                  render={({ field }) => (
                    <NativeSelect
                      type="number"
                      variant="filled"
                      data-test-id={`${ID_PREFIX}graduationYearSelect`}
                      disabled={!data?.user?.canUpdateYear}
                      {...field}
                    >
                      {graduationYears(data?.user?.graduationYear).map((year) => (
                        <option key={year} value={year}>
                          {`${year} (${currentGradeYear(year)}. klasse)`}
                        </option>
                      ))}
                    </NativeSelect>
                  )}
                />
                {data?.user?.canUpdateYear && <FormHelperText>Kan bare endres én gang i året.</FormHelperText>}
                {!data?.user?.canUpdateYear && (
                  <FormHelperText>
                    Kan ikke endres før:{" "}
                    {dayjs(data?.user?.graduationYearUpdatedAt).add(1, "year").format("DD.MM.YYYY")}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2">Annet</Typography>
            </Grid>
            <Grid container item direction="row" alignItems="center" spacing={2}>
              <Grid item>
                <Controller
                  name="allergies"
                  control={control}
                  render={({ field }) => (
                    <TextField label="Allergier" data-testid={`${ID_PREFIX}allergiesTextField`} {...field} />
                  )}
                />
              </Grid>
              <Grid item>
                <Typography variant="body1">{isVegetarian(getValues("allergies")) && "💚"}</Typography>
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

export default UserForm;
