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
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { Check, Close } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { validateInput } from "./utils";

interface EditUserProps {
  open: boolean;
  user: User;
  onSubmit: () => void;
  onClose: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    graduationYearInfo: {
      marginBottom: theme.spacing(5),
    },
  })
);

export const EditUser: React.FC<EditUserProps> = ({ open, user, onSubmit, onClose }) => {
  const classes = useStyles();
  const [updateUser, { error }] = useMutation<{
    updateUser: {
      user: User;
    };
  }>(UPDATE_USER, { errorPolicy: "all" });

  const defaultValidations = {
    email: true,
    phoneNumber: true,
  };

  const [updateUserInput, setUpdateUserInput] = useState<Partial<UserInput>>({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    allergies: user.allergies,
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
    <Dialog open={open} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth onClose={() => onClose()}>
      <DialogContent>
        <DialogContentText variant="body2" className={classes.graduationYearInfo}>
          OBS: Registrert i feil årstrinn? Send en mail til{" "}
          <Link href="mailto:contact@rubberdok.no">contact@rubberdok.no</Link>.
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
        <DialogActions>
          <Button onClick={() => onClose()} color="primary" startIcon={<Close />}>
            Avbryt
          </Button>
          <Button onClick={() => handleSubmit()} color="primary" startIcon={<Check />} disabled={invalidInput()}>
            Send
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
