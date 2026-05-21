import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBack } from "@mui/icons-material";
import {
  Alert,
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
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  IUserForm,
  currentGradeYear,
  isVegetarian,
  maxGraduationYear,
  suggestGraduationYear,
  validationSchema,
} from "./helpers";

import { Link } from "@/components";
import { UpdateUserDocument, UserToEditDocument } from "@/generated/graphql";
import dayjs from "@/lib/date";

const UserNfcSettingsDocument = gql`
  query userNfcSettings {
    nfcSelfServiceEnabled
    nfcAccepts4ByteUid
    nfcAccepts7ByteUid
  }
`;

type Props = {
  kind: "register" | "update";
  title: string;
  onCompleted?: () => void;
  "data-test-id"?: string;
};

export const UserForm: React.FC<Props> = ({ kind, title, onCompleted, "data-test-id": dataTestId }) => {
  const [submitError, setSubmitError] = useState<string | undefined>();

  const { data: nfcSettingsData } = useQuery(UserNfcSettingsDocument);

  const nfcSelfServiceEnabled = nfcSettingsData?.nfcSelfServiceEnabled ?? true;
  const accepts4ByteUid = nfcSettingsData?.nfcAccepts4ByteUid ?? false;
  const accepts7ByteUid = nfcSettingsData?.nfcAccepts7ByteUid ?? true;

  const acceptedUidLengthLabel = () => {
    if (accepts4ByteUid && accepts7ByteUid) {
      return "4 eller 7 byte";
    }
    if (accepts4ByteUid) {
      return "4 byte";
    }
    if (accepts7ByteUid) {
      return "7 byte";
    }
    return "ingen aktiv lengde";
  };

  const formatUidLengthMessage = (rawMessage: string) => {
    const allows4Byte = /\b4\s*bytes?\b|\b8\s*hex\b/i.test(rawMessage);
    const allows7Byte = /\b7\s*bytes?\b|\b14\s*hex\b/i.test(rawMessage);

    if (allows4Byte && allows7Byte) {
      return "UID har feil lengde. UID må være 4 eller 7 byte hex (8 eller 14 tegn).";
    }
    if (allows4Byte) {
      return "UID har feil lengde. UID må være 4 byte hex (8 tegn).";
    }
    if (allows7Byte) {
      return "UID har feil lengde. UID må være 7 byte hex (14 tegn).";
    }

    return "UID har feil lengde. Bruk riktig kortlengde som er satt i systemet.";
  };

  const toUserFriendlyError = (error: ApolloError) => {
    const rawMessage = error.graphQLErrors[0]?.message || error.message || "";

    if (rawMessage.includes("Egenregistrering av UID er deaktivert")) {
      return "Du kan ikke registrere UID akkurat nå. Ta kontakt med Rubberdøk.";
    }
    if (rawMessage.includes("Du kan bare registrere UID én gang")) {
      return "Du har allerede registrert kort. Hvis du trenger å bytte kort, kontakt Rubberdøk.";
    }
    if (rawMessage.includes("UID er allerede i bruk")) {
      return "Denne UID-en er allerede registrert på en annen bruker. Sjekk at du skrev riktig UID. Ta kontakt med Rubberdøk hvis du tror dette er en feil.";
    }
    if (rawMessage.includes("UID kan ikke være tom")) {
      return "UID kan ikke være tom. Skriv inn UID eller la feltet stå urørt.";
    }
    if (rawMessage.includes("UID must be exactly") || rawMessage.includes("UID must be one of")) {
      return formatUidLengthMessage(rawMessage);
    }
    if (rawMessage.includes("PIN-kode må være nøyaktig 4 sifre")) {
      return "PIN-kode må være nøyaktig 4 sifre.";
    }
    if (error.networkError) {
      return "Kunne ikke lagre nå på grunn av en feil. Prøv igjen om litt.";
    }

    return "Kunne ikke lagre endringer. Sjekk feltene og prøv igjen.";
  };

  const { data } = useQuery(UserToEditDocument);
  const [updateUser] = useMutation(UpdateUserDocument, {
    onCompleted: () => {
      setSubmitError(undefined);
      onCompleted?.();
    },
    onError: (error) => setSubmitError(toUserFriendlyError(error)),
    refetchQueries: [{ query: UserToEditDocument }],
  });
  const router = useRouter();
  const currentYear = dayjs().tz("Europe/Oslo").year();
  const ID_PREFIX = `${dataTestId}`;
  const hasRegisteredUid = Boolean((data?.user?.nfcUidHex || "").trim());

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
      nfcUidHex: data?.user?.nfcUidHex || "",
      nfcPinCode: data?.user?.nfcPinCode || "",
    },
    values: {
      firstName: data?.user?.firstName || "",
      lastName: data?.user?.lastName || "",
      email: data?.user?.email || data?.user?.feideEmail || "",
      phoneNumber: data?.user?.phoneNumber || "",
      graduationYear: data?.user?.graduationYear || suggestGraduationYear(),
      allergies: data?.user?.allergies || "",
      nfcUidHex: data?.user?.nfcUidHex || "",
      nfcPinCode: data?.user?.nfcPinCode || "",
    },
    resolver: yupResolver(validationSchema),
  });
  const hasUidForPin = Boolean((watch("nfcUidHex") || data?.user?.nfcUidHex || "").trim());

  return (
    <form
      onSubmit={handleSubmit((values) => {
        setSubmitError(undefined);
        const userData = { ...values };

        const normalizedUidInput = userData.nfcUidHex?.trim() || "";
        if (!normalizedUidInput) {
          delete userData.nfcUidHex;
        } else {
          userData.nfcUidHex = normalizedUidInput;
        }

        if (!hasUidForPin && !userData.nfcUidHex) {
          delete userData.nfcPinCode;
        }

        return updateUser({
          variables: { userData },
        });
      })}
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
          {submitError ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {submitError}
            </Alert>
          ) : null}
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
                    {errors.graduationYear?.message}
                  </FormHelperText>
                )}
                {data?.user?.canUpdateYear && <FormHelperText>Kan bare endres én gang i året.</FormHelperText>}
                {!data?.user?.canUpdateYear && (
                  <FormHelperText>
                    Kan ikke endres før: {dayjs(data?.user?.yearUpdatedAt).tz("Europe/Oslo").add(1, "year").format("L")}
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

            <Grid item>
              <Typography variant="subtitle2">Adgangskort</Typography>
            </Grid>
            <Grid container item direction="row" spacing={1}>
              <Grid item>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="UID"
                  {...register("nfcUidHex")}
                  InputProps={{
                    readOnly: hasRegisteredUid,
                  }}
                  error={Boolean(errors.nfcUidHex)}
                  helperText={
                    errors.nfcUidHex?.message ||
                    (hasRegisteredUid
                      ? "Kontakt Rubberdøk for endring av kort."
                      : nfcSelfServiceEnabled
                        ? `Skriv inn UID (hex). Systemet godtar ${acceptedUidLengthLabel()} UID.`
                        : "Egenregistrering av UID er deaktivert.")
                  }
                  data-test-id={`${ID_PREFIX}nfcUidHexTextField`}
                />
              </Grid>
              <Grid item>
                <TextField
                  sx={{
                    width: "18ch",
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("nfcPinCode")}
                  label="PIN-kode (4 sifre)"
                  error={Boolean(errors.nfcPinCode)}
                  helperText={
                    errors.nfcPinCode?.message ||
                    (hasUidForPin
                      ? "Denne PIN-koden brukes til å låse opp JanHus, når du skal ha tilgang."
                      : "PIN-kode kan kun settes når du har et aktivt kort.")
                  }
                  inputProps={{
                    inputMode: "numeric",
                    maxLength: 4,
                    pattern: "[0-9]{4}",
                  }}
                  disabled={!hasUidForPin}
                  data-test-id={`${ID_PREFIX}nfcPinCodeTextField`}
                />
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
