import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "@graphql/users/mutations";
import { GET_USER } from "@graphql/users/queries";
import { User, UserInput, UserInputValidations } from "@interfaces/users";
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
import { suggestNames, validateInput } from "./utils";

interface FirstLoginProps {
  open: boolean;
  onSubmit: () => void;
  fullName: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    disclaimer: {
      fontStyle: "italic",
      marginBottom: theme.spacing(5),
    },
  })
);

export const FirstLogin: React.FC<FirstLoginProps> = ({ open, onSubmit, fullName }) => {
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
  const { suggestedFirstName, suggestedLastName } = suggestNames(fullName);

  const [updateUserInput, setUpdateUserInput] = useState<Partial<UserInput>>({
    email: "",
    firstName: suggestedFirstName,
    lastName: suggestedLastName,
    phoneNumber: "",
    allergies: "",
    graduationYear: "",
  });
  const [validations, setValidations] = useState<UserInputValidations>(defaultValidations);

  useEffect(() => {
    setValidations(validateInput(updateUserInput));
  }, []);

  const invalidInput = () => !Object.values(validations).every(Boolean);

  const onInputChange = (key: string, event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newInput = {
      ...updateUserInput,
      [key]: event.target.value,
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
    <Dialog open={open} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
      <DialogTitle id="form-dialog-title">Første innlogging</DialogTitle>
      <DialogContent>
        <DialogContentText variant="body1">
          Det ser ut som at dette er første gang du logger inn på nettsiden. Dersom du ønsker kan du fylle ut
          informasjon under for å forbedre brukeropplevelsen.
        </DialogContentText>
        <DialogContentText variant="body2" className={classes.disclaimer}>
          Merk: Du kan til enhver tid oppdatere eller slette informasjon som er lagret om deg på profilen din.
        </DialogContentText>
        <Grid container spacing={5}>
          <Grid item xs={6}>
            <InputLabel>Fornavn</InputLabel>
            <TextField
              id="firstName"
              type="text"
              name="firstName"
              value={updateUserInput?.firstName}
              onChange={(e) => onInputChange("firstName", e)}
              placeholder="Ola"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <InputLabel>Etternavn</InputLabel>
            <TextField
              id="lastName"
              type="text"
              name="lastName"
              value={updateUserInput?.lastName}
              onChange={(e) => onInputChange("lastName", e)}
              placeholder="Nordmann"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Avgangsår*</InputLabel>
            <TextField
              id="graduationYear"
              error={!validations.graduationYear}
              type="number"
              name="graduationYear"
              value={updateUserInput?.graduationYear}
              onChange={(e) => onInputChange("graduationYear", e)}
              placeholder="2024"
              required
              fullWidth
            />
            <FormHelperText id="my-helper-text">
              Dersom du er usikker, skriv avgangsåret til kullet som gir mest mening.
            </FormHelperText>
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Foretrukket e-post </InputLabel>
            <TextField
              id="email"
              error={!validations.email}
              type="email"
              name="email"
              value={updateUserInput?.email}
              onChange={(e) => onInputChange("email", e)}
              placeholder="ola.nordmann@gmail.com"
              fullWidth
            />
            <FormHelperText id="my-helper-text">
              Dersom du ikke oppgir en foretrukket e-post vil stud-mailen din brukes.
            </FormHelperText>
          </Grid>
          <Grid item xs={12}>
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
              placeholder="Ønsker vegetarmat og har glutenallergi"
              fullWidth
            />
            <FormHelperText id="my-helper-text">
              Dersom du oppgir dette vil det kun brukes til kartlegging av matpreferanser ved eventuell påmelding på
              arrangementer.
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
