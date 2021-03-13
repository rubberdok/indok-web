import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "@graphql/users/mutations";
import { GET_USER } from "@graphql/users/queries";
import { User, UserInput } from "@interfaces/users";
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  Grid,
  InputLabel,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { Check } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import validator from "validator";

interface FirstLoginProps {
  open: boolean;
  onSubmit: () => void;
}

interface Validations {
  email: boolean;
  phoneNumber: boolean;
  graduationYear: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {
      marginBottom: theme.spacing(1),
      // minWidth: "80%",
    },
  })
);

const validateInput = (input: Partial<UserInput>): Validations => {
  const { email, phoneNumber, graduationYear } = input;
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const validationResult: Validations = {
    email: email ? validator.isEmail(email) : true,
    phoneNumber: phoneNumber ? validator.isMobilePhone(phoneNumber) : true,
    graduationYear: false, // required field
  };

  if (graduationYear) {
    const graduationYearNumber = parseInt(graduationYear);
    validationResult.graduationYear = graduationYear
      ? Number.isInteger(graduationYear) && currentMonth < 8
        ? graduationYearNumber >= currentYear && graduationYearNumber <= currentYear + 4
        : graduationYearNumber >= currentYear + 1 && graduationYearNumber <= currentYear + 5
      : false;
  }
  return validationResult;
};

export const FirstLogin: React.FC<FirstLoginProps> = ({ open, onSubmit }) => {
  const classes = useStyles();
  const [updateUser, { error }] = useMutation<{
    updateUser: {
      user: User;
    };
  }>(UPDATE_USER, { errorPolicy: "all" });

  const defaultValidations = {
    email: true,
    phoneNumber: true,
    graduationYear: false,
  };

  const [updateUserInput, setUpdateUserInput] = useState<Partial<UserInput>>({
    email: "",
    phoneNumber: "",
    allergies: "",
    graduationYear: "",
  });
  const [validations, setValidations] = useState<Validations>(defaultValidations);

  useEffect(() => {
    setValidations(validateInput(updateUserInput));
  }, []);

  const invalidInput = () => !Object.values(validations).every(Boolean);

  const onInputChange = (key: string, event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newInput = {
      ...updateUserInput,
      [key]:
        key === "graduationYear"
          ? event.target.value === ""
            ? undefined
            : parseInt(event.target.value)
          : event.target.value,
    };
    setUpdateUserInput(newInput);
    setValidations(validateInput(newInput));
  };

  const handleSubmit = () => {
    updateUser({
      variables: { userData: updateUserInput },
      update: (cache, { data }) => {
        if (!data || !data.updateUser || !data.updateUser.user) {
          return;
        }
        cache.writeQuery<User>({ query: GET_USER, data: data.updateUser.user });
        onSubmit();
      },
    });
  };

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title" fullWidth maxWidth="sm">
      <DialogTitle id="form-dialog-title">Første innlogging</DialogTitle>
      <DialogContent>
        <DialogContentText variant="body1">
          Det ser ut som at dette er første gang du logger inn på nettsiden. Dersom du ønsker kan du fylle ut
          informasjon under for å forbedre brukeropplevelsen.
        </DialogContentText>
        <DialogContentText variant="body2" style={{ fontStyle: "italic" }}>
          Merk: Du kan til enhver tid oppdatere eller slette informasjon som er lagret om deg på profilen din.
        </DialogContentText>
        <Grid container direction="column" spacing={4}>
          <Grid item>
            <InputLabel>Avgangsår*</InputLabel>
            <TextField
              id="graduationYear"
              error={!validations.graduationYear}
              type="number"
              name="graduationYear"
              value={updateUserInput?.graduationYear}
              onChange={(e) => onInputChange("graduationYear", e)}
              placeholder="2024"
              className={classes.textField}
              required
              fullWidth
            />
            <FormHelperText id="my-helper-text">
              Dersom du er usikker, skriv avgangsåret til kullet som gir mest mening.
            </FormHelperText>
          </Grid>
          <Grid item>
            <InputLabel>Foretrukket e-post </InputLabel>
            <TextField
              id="email"
              error={!validations.email}
              type="email"
              name="email"
              value={updateUserInput?.email}
              onChange={(e) => onInputChange("email", e)}
              placeholder="ola.nordmann@gmail.com"
              className={classes.textField}
              fullWidth
            />
            <FormHelperText id="my-helper-text">
              Dersom du ikke oppgir en foretrukket e-post vil stud-mailen din brukes.
            </FormHelperText>
          </Grid>
          <Grid item>
            <InputLabel>Telefonnummer</InputLabel>
            <DialogContentText variant="body2">
              <strong>
                Dersom du ikke oppgir et telefonnummer innen du ønsker å melde deg på et arrangement vil det ikke være
                mulig å melde seg på da dette er påkrevd av arrangører.
              </strong>
            </DialogContentText>
            <TextField
              id="phoneNumber"
              error={!validations.phoneNumber}
              type="tel"
              name="phoneNumber"
              value={updateUserInput?.phoneNumber}
              onChange={(e) => onInputChange("phoneNumber", e)}
              placeholder="99887766"
              className={classes.textField}
              fullWidth
            />
            <FormHelperText id="my-helper-text">
              Telefonnummer vil kun benyttes til eventuell smittesporing ved påmelding på arrangementer.
            </FormHelperText>
          </Grid>
          <Grid item>
            <InputLabel>Matpreferanser eller allergier</InputLabel>
            <TextField
              id="allergies"
              type="text"
              name="allergies"
              value={updateUserInput?.allergies}
              onChange={(e) => onInputChange("allergies", e)}
              multiline
              placeholder="Vegetar og glutenallergi"
              className={classes.textField}
              fullWidth
            />
            <FormHelperText id="my-helper-text">
              Dersom du oppgir eventuelle allergier vil dette kun brukes under til kartlegging av matprefereanser ved
              eventuell påmelding på arrangementer.
            </FormHelperText>
          </Grid>
        </Grid>
        {error && invalidInput() && <Typography color="error">{error.message}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleSubmit()} color="primary" startIcon={<Check />} disabled={invalidInput()}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};
