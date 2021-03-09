import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "@graphql/auth/mutations";
import { GET_USER } from "@graphql/auth/queries";
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
import { useEffect, useState } from "react";
import validator from "validator";

interface FirstLoginProps {
  open: boolean;
  onChange: (key: string, e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  userData?: Partial<User> | undefined;
}

interface UpdateUserInput {
  email: string;
  phone: string;
  foodPreferences: string;
  year: number;
}

interface Validations {
  email: boolean;
  phone: boolean;
  year: boolean;
  triggerError: boolean;
}

const validateInput = (input: Partial<UpdateUserInput>): Validations => {
  const { email, phone, year } = input;
  return {
    email: email ? validator.isEmail(email) : true,
    phone: phone ? validator.isMobilePhone(phone) : true,
    year: year ? Number.isInteger(year) && year > 0 && year < 6 : true,
    triggerError: false,
  };
};

export const FirstLogin: React.FC<FirstLoginProps> = ({ open, onChange, userData }) => {
  const [updateUser] = useMutation<{
    updateUser: {
      user: User;
    };
  }>(UPDATE_USER);

  const [updateUserInput, setUpdateUserInput] = useState({});
  const [validations, setValidations] = useState<Validations>();

  // useEffect(() => {
  //   if (validations && Object.values(validations).any() {
  //     validations.triggerError = true;
  //   }
  // }, [validations]);

  const onInputChange = (key: string, event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setUpdateUserInput({ ...updateUserInput, [key]: event.target.value });
    setValidations(validateInput(updateUserInput));
    onChange(key, event);
  };

  const handleSubmit = () => {
    updateUser({
      variables: { updateUserInput },
      update: (cache, { data }) => {
        if (!data || !data.updateUser || !data.updateUser.user) {
          return;
        }
        cache.writeQuery<User>({ query: GET_USER, data: data.updateUser.user });
      },
    });
  };

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Første innlogging</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="body1">
            Det ser ut som at dette er første gang du logger inn på nettsiden. Dersom du ønsker kan du fylle ut
            informasjon under for å forbedre brukeropplevelsen.
          </Typography>
          <Typography variant="body2">
            Dersom du ikke oppgir en foretrukket e-post vil stud-mailen din brukes dersom det blir nødvendig å kontakte
            deg via e-post.
          </Typography>
          <Typography variant="body2">
            Telefonnummer vil kun benyttes til eventuell smittesporing ved påmelding på arrangementer.{" "}
            <strong>
              Dersom du ikke oppgir et telefonnummer innen du ønsker å melde deg på et arrangement vil det per nå ikke
              være mulig å melde seg på da dette er påkrevd av arrangører.{" "}
            </strong>
          </Typography>
          <Typography variant="body2">
            Dersom du oppgir eventuelle allergier vil dette kun brukes under til kartlegging av matprefereanser ved
            eventuell påmelding på arrangementer.
          </Typography>
          <Typography variant="body2">
            Merk: Du kan til enhver tid oppdatere eller slette informasjon som er lagret om deg på profilen din.
          </Typography>
        </DialogContentText>
        <Grid container direction="column" spacing={4}>
          <Grid item>
            <InputLabel>Foretrukket e-post </InputLabel>
            <TextField
              id="standard-basic"
              error={!validations?.email}
              type="email"
              name="email"
              value={userData?.feideEmail}
              onChange={(e) => onInputChange("email", e)}
            />
          </Grid>
          <Grid item>
            <InputLabel>Telefonnummer</InputLabel>
            <TextField
              id="standard-basic"
              error={!validations?.phone}
              type="tel"
              name="phone"
              value={userData?.phoneNumber}
              onChange={(e) => onInputChange("phoneNumber", e)}
            />
          </Grid>
          <Grid item>
            <InputLabel>Matpreferanser eller allergier</InputLabel>
            <TextField
              id="standard-basic"
              type="text"
              value={userData?.allergies}
              onChange={(e) => onInputChange("allergies", e)}
            />
          </Grid>
          <Grid item>
            <InputLabel>Årstrinn</InputLabel>
            <TextField
              id="standard-basic"
              error={!validations?.year}
              type="number"
              value={userData?.year}
              onChange={(e) => onInputChange("year", e)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="submit" color="primary">
          Jeg ønsker ikke å fylle ut noe informasjon nå
        </Button>
        <Button onClick={() => handleSubmit()} color="primary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};
