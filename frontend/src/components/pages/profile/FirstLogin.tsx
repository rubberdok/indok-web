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
  Grid,
  InputLabel,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { Check, Close } from "@material-ui/icons";
import { useState } from "react";
import validator from "validator";

interface FirstLoginProps {
  open: boolean;
  onSubmit: (refetch: boolean) => void;
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
      minWidth: "30%",
    },
  })
);

const validateInput = (input: Partial<UserInput>): Validations => {
  const { email, phoneNumber, graduationYear } = input;
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  return {
    email: email ? validator.isEmail(email) : true,
    phoneNumber: phoneNumber ? validator.isMobilePhone(phoneNumber) : true,
    graduationYear: graduationYear
      ? Number.isInteger(graduationYear) && currentMonth < 8
        ? graduationYear >= currentYear && graduationYear <= currentYear + 4
        : graduationYear >= currentYear + 1 && graduationYear <= currentYear + 5
      : true,
  };
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
    graduationYear: true,
  };

  const [updateUserInput, setUpdateUserInput] = useState<Partial<UserInput>>();
  const [validations, setValidations] = useState<Validations>(defaultValidations);

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
        onSubmit(true);
      },
    });
  };

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
      <DialogTitle id="form-dialog-title">Første innlogging</DialogTitle>
      <DialogContent>
        <DialogContentText variant="h6">
          Det ser ut som at dette er første gang du logger inn på nettsiden. Dersom du ønsker kan du fylle ut
          informasjon under for å forbedre brukeropplevelsen.
        </DialogContentText>
        <DialogContentText variant="body2">
          Merk: Du kan til enhver tid oppdatere eller slette informasjon som er lagret om deg på profilen din.
        </DialogContentText>
        <Grid container direction="column" spacing={4}>
          <Grid item>
            <InputLabel>Foretrukket e-post </InputLabel>
            <DialogContentText variant="body2">
              Dersom du ikke oppgir en foretrukket e-post vil stud-mailen din brukes dersom det blir nødvendig å
              kontakte deg via e-post.
            </DialogContentText>
            <TextField
              id="email"
              error={!validations.email}
              type="email"
              name="email"
              value={updateUserInput?.email}
              onChange={(e) => onInputChange("email", e)}
              placeholder="olaNordmann@gmail.no"
              className={classes.textField}
            />
          </Grid>
          <Grid item>
            <InputLabel>Telefonnummer</InputLabel>
            <DialogContentText variant="body2">
              Telefonnummer vil kun benyttes til eventuell smittesporing ved påmelding på arrangementer.{" "}
              <strong>
                Dersom du ikke oppgir et telefonnummer innen du ønsker å melde deg på et arrangement vil det per nå ikke
                være mulig å melde seg på da dette er påkrevd av arrangører.{" "}
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
            />
          </Grid>
          <Grid item>
            <InputLabel>Matpreferanser eller allergier</InputLabel>
            <DialogContentText variant="body2">
              Dersom du oppgir eventuelle allergier vil dette kun brukes under til kartlegging av matprefereanser ved
              eventuell påmelding på arrangementer.
            </DialogContentText>
            <TextField
              id="allergies"
              type="text"
              name="allergies"
              value={updateUserInput?.allergies}
              onChange={(e) => onInputChange("allergies", e)}
              multiline
              placeholder="Vegetar og glutenallergi"
              className={classes.textField}
            />
          </Grid>
          <Grid item>
            <InputLabel>Avgangsår</InputLabel>
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
            />
          </Grid>
        </Grid>
        {error && invalidInput() && <Typography color="error">{error.message}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => onSubmit(false)} startIcon={<Close />}>
          Jeg ønsker ikke å fylle ut noe informasjon nå
        </Button>
        <Button onClick={() => handleSubmit()} color="primary" startIcon={<Check />} disabled={invalidInput()}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};
