import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "@graphql/users/mutations";
import { GET_USER } from "@graphql/users/queries";
import { User } from "@interfaces/users";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import { Check, Close } from "@material-ui/icons";
import { useEffect, useState } from "react";
import validator from "validator";

interface FirstLoginProps {
  open: boolean;
  onSubmit: (refetch: boolean) => void;
}

interface UpdateUserInput {
  email: string;
  phoneNumber: string;
  allergies: string;
  year: number;
}

interface Validations {
  email: boolean;
  phoneNumber: boolean;
  year: boolean;
}

const validateInput = (input: Partial<UpdateUserInput>): Validations => {
  const { email, phoneNumber, year } = input;
  return {
    email: email ? validator.isEmail(email) : true,
    phoneNumber: phoneNumber ? validator.isMobilePhone(phoneNumber) : true,
    year: year ? Number.isInteger(year) && year > 0 && year < 6 : true,
  };
};

export const FirstLogin: React.FC<FirstLoginProps> = ({ open, onSubmit }) => {
  const [updateUser, { error }] = useMutation<{
    updateUser: {
      user: User;
    };
  }>(UPDATE_USER, { errorPolicy: "all" });

  const defaultValidations = {
    email: true,
    phoneNumber: true,
    year: true,
  };

  const [updateUserInput, setUpdateUserInput] = useState<Partial<UpdateUserInput>>();
  const [validations, setValidations] = useState<Validations>(defaultValidations);

  const validationTriggered = () => !Object.values(validations).every((v) => !!v);

  useEffect(() => {
    // Reset errors when typing
    if (validationTriggered()) {
      setValidations(defaultValidations);
    }
  }, [updateUserInput]);

  const onInputChange = (key: string, event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setUpdateUserInput({
      ...updateUserInput,
      [key]: key === "year" ? parseInt(event.target.value) : event.target.value,
    });
  };

  const handleSubmit = () => {
    updateUserInput && setValidations(validateInput(updateUserInput));
    updateUser({
      variables: updateUserInput,
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
    <Dialog open={open} aria-labelledby="form-dialog-title" fullWidth>
      <DialogTitle id="form-dialog-title">Første innlogging</DialogTitle>
      <DialogContent>
        <DialogContentText variant="h6">
          Det ser ut som at dette er første gang du logger inn på nettsiden. Dersom du ønsker kan du fylle ut
          informasjon under for å forbedre brukeropplevelsen.
        </DialogContentText>
        <DialogContentText variant="body2">
          Dersom du ikke oppgir en foretrukket e-post vil stud-mailen din brukes dersom det blir nødvendig å kontakte
          deg via e-post.
        </DialogContentText>
        <DialogContentText variant="body2">
          Telefonnummer vil kun benyttes til eventuell smittesporing ved påmelding på arrangementer.{" "}
          <strong>
            Dersom du ikke oppgir et telefonnummer innen du ønsker å melde deg på et arrangement vil det per nå ikke
            være mulig å melde seg på da dette er påkrevd av arrangører.{" "}
          </strong>
        </DialogContentText>
        <DialogContentText variant="body2">
          Dersom du oppgir eventuelle allergier vil dette kun brukes under til kartlegging av matprefereanser ved
          eventuell påmelding på arrangementer.
        </DialogContentText>
        <DialogContentText variant="body2">
          Merk: Du kan til enhver tid oppdatere eller slette informasjon som er lagret om deg på profilen din.
        </DialogContentText>
        <Grid container direction="column" spacing={4}>
          <Grid item>
            <InputLabel>Foretrukket e-post </InputLabel>
            <TextField
              id="email"
              error={!validations.email}
              type="email"
              name="email"
              value={updateUserInput?.email}
              onChange={(e) => onInputChange("email", e)}
              placeholder="olaNordmann@gmail.no"
            />
          </Grid>
          <Grid item>
            <InputLabel>Telefonnummer</InputLabel>
            <TextField
              id="phoneNumber"
              error={!validations.phoneNumber}
              type="tel"
              name="phoneNumber"
              value={updateUserInput?.phoneNumber}
              onChange={(e) => onInputChange("phoneNumber", e)}
              placeholder="99887766"
            />
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
            />
          </Grid>
          <Grid item>
            <InputLabel>Årstrinn</InputLabel>
            <TextField
              id="year"
              error={!validations.year}
              type="number"
              name="year"
              value={updateUserInput?.year}
              onChange={(e) => onInputChange("year", e)}
            />
          </Grid>
        </Grid>
        {error && validationTriggered() && <Typography color="error">{error.message}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => onSubmit(false)} startIcon={<Close />}>
          Jeg ønsker ikke å fylle ut noe informasjon nå
        </Button>
        <Button onClick={() => handleSubmit()} color="primary" startIcon={<Check />}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};
