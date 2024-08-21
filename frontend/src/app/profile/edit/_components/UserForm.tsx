import { yupResolver } from "@hookform/resolvers/yup";
import { Refresh } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormHelperText,
  Unstable_Grid2 as Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { range } from "lodash";
import { useForm } from "react-hook-form";

import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import dayjs from "@/lib/date";

import { maxGraduationYear, minGraduationYear, userValidationSchema } from "./validationSchema";
import { usePathname, useRouter } from "next/navigation";
import { config } from "@/utils/config";

type Props = {
  onSubmit: (values: UserFields) => void;
  onCancel: () => void;
  user: FragmentType<typeof userFragment>;
  "data-test-id"?: string;
};

export type UserFields = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  graduationYear: number;
  allergies: string;
};

const userFragment = graphql(`
  fragment UserForm_User on PrivateUser {
    firstName
    lastName
    phoneNumber
    graduationYear
    allergies
    graduationYearUpdatedAt
    canUpdateYear
    gradeYear
    email
    studyProgram {
      id
      name
    }
  }
`);

function UserForm({ onSubmit, "data-test-id": dataTestId, onCancel, ...props }: Props) {
  const user = getFragmentData(userFragment, props.user);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserFields>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || "",
      graduationYear: user.graduationYear || suggestGraduationYear(),
      allergies: user.allergies || "",
    },
    resolver: yupResolver(userValidationSchema),
  });
  const router = useRouter();
  const pathname = usePathname();

  const minimumGraduationYear = Math.min(minGraduationYear, user?.graduationYear ?? minGraduationYear);
  const graduationYears = range(minimumGraduationYear, maxGraduationYear + 1, 1);
  function updateStudyProgram() {
    const updateStudyProgramUrl = new URL("/auth/study-program", config.API_URL);
    updateStudyProgramUrl.searchParams.set("return-to", `${config.FRONTEND_URI}${pathname}`);
    router.push(updateStudyProgramUrl.toString());
  }

  return (
    <Stack direction="row" justifyContent="center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" spacing={2} alignItems="flex-start">
          <Stack direction="column">
            <Typography variant="subtitle2" gutterBottom>
              Personalia
            </Typography>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <TextField
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                {...register("firstName")}
                label="Fornavn"
                required
                error={Boolean(errors.firstName)}
                helperText={errors.firstName?.message ?? " "}
                data-test-id={`${dataTestId}firstNameTextField`}
              />
              <TextField
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                {...register("lastName")}
                label="Etternavn"
                required
                error={Boolean(errors.lastName)}
                helperText={errors.lastName?.message ?? " "}
                data-test-id={`${dataTestId}lastNameTextField`}
              />
            </Stack>
          </Stack>
          <Stack direction="column">
            <Typography variant="subtitle2" gutterBottom>
              Kontaktinformasjon
            </Typography>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <TextField
                variant="outlined"
                disabled
                value={user?.email}
                InputLabelProps={{
                  shrink: true,
                }}
                label="E-post"
                helperText={"Kan ikke endres"}
                data-test-id={`${dataTestId}emailTextField`}
              />
              <TextField
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                {...register("phoneNumber")}
                label="Telefonnummer"
                error={Boolean(errors.phoneNumber)}
                helperText={errors.phoneNumber?.message ?? " "}
                data-test-id={`${dataTestId}phoneNumberTextField`}
              />
            </Stack>
          </Stack>
          <Stack direction="column" width="100%">
            <Typography variant="subtitle2" gutterBottom>
              Studieinformasjon
            </Typography>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <FormControl
                variant="outlined"
                required
                fullWidth
                error={Boolean(errors.graduationYear)}
                disabled={!user?.canUpdateYear}
              >
                <InputLabel id="graduation-year-select-label" shrink={true}>
                  Uteksamineringsår
                </InputLabel>
                <Select
                  {...register("graduationYear")}
                  label="Uteksamineringsår"
                  labelId="graduation-year-select-label"
                  id="graduation-year-select"
                  native
                  data-test-id={`${dataTestId}graduationYearSelect`}
                >
                  {graduationYears.map((year) => (
                    <option key={year} value={year}>
                      {`${year} (${currentGradeYear(year)}. klasse)`}
                    </option>
                  ))}
                </Select>
                {Boolean(errors.graduationYear) && (
                  <FormHelperText sx={{ color: (theme) => theme.vars.palette.error.main }}>
                    {errors.graduationYear?.message}
                  </FormHelperText>
                )}
                {user?.canUpdateYear && <FormHelperText>Kan bare endres én gang i året.</FormHelperText>}
                {!user?.canUpdateYear && (
                  <FormHelperText>
                    Kan ikke endres før: {dayjs(user?.graduationYearUpdatedAt).add(1, "year").format("L")}
                  </FormHelperText>
                )}
              </FormControl>
              <TextField
                variant="outlined"
                disabled
                value={user?.studyProgram?.name}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                label="Studieprogram"
                data-test-id={`${dataTestId}studyProgramTextField`}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          updateStudyProgram();
                        }}
                      >
                        <Refresh />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Stack>
          <Stack direction="column">
            <Typography variant="subtitle2" gutterBottom>
              Annet
            </Typography>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                {...register("allergies")}
                label="Allergier"
                error={Boolean(errors.allergies)}
                helperText={errors.allergies?.message ?? " "}
                data-test-id={`${dataTestId}allergiesTextField`}
              />
              <Typography variant="body1">{isVegetarian(watch("allergies")) && "💚"}</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Grid container md direction="row" justifyContent="flex-end">
          <Grid>
            <Button onClick={() => onCancel()}>Avbryt</Button>
          </Grid>
          <Grid>
            <Button variant="contained" color="primary" type="submit" data-test-id={`${dataTestId}saveButton`}>
              Lagre
            </Button>
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
}

function suggestGraduationYear() {
  const today = dayjs();
  const currentMonth = today.month();
  if (currentMonth > 7) {
    return today.year() + 5;
  }
  return today.year() + 4;
}

function isVegetarian(allergies: string | null): boolean {
  const options = ["veggis", "vegetar", "plantebasert", "vegan"];
  return options.some((option) => allergies?.toLowerCase().includes(option));
}

function currentGradeYear(graduationYear: number) {
  const today = dayjs();
  const currentMonth = today.month();
  if (currentMonth < 7) {
    return 5 - (graduationYear - today.year());
  }
  return 6 - (graduationYear - today.year());
}

export { UserForm };
