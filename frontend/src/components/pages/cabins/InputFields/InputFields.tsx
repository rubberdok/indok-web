import { Validations } from "@interfaces/cabins";
import { User } from "@interfaces/users";
import {
  Container,
  createStyles,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Theme,
} from "@material-ui/core";
import { range } from "@utils/helpers";
import React, { ChangeEvent } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: "200px",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    border: {
      border: "1px solid red",
    },
  })
);

interface InputFieldsProps {
  onChange: (
    name: string,
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => void;
  userData: User | undefined;
  cabins: string[];
  numberIndok: number;
  numberExternal: number;
  validations: Validations | undefined;
}

export const InputFields: React.FC<InputFieldsProps> = ({
  onChange,
  userData,
  cabins,
  numberIndok,
  numberExternal,
  validations,
}) => {
  const classes = useStyles();

  const bjornenBeds = 20;
  const oksenBeds = 20;
  const totalGuestsAllowed =
    cabins?.length == 2 ? bjornenBeds + oksenBeds : cabins?.includes("Bjørnen") ? bjornenBeds : oksenBeds;

  return (
    <Container>
      <div className={classes.root}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <TextField
              error={!validations?.firstname && validations?.triggerError}
              type="text"
              label="Fornavn"
              defaultValue={userData?.firstName}
              required
              name="firstname"
              onChange={(e) => onChange("firstname", e)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              error={!validations?.lastname && validations?.triggerError}
              type="text"
              id="standard-basic"
              label="Etternavn"
              defaultValue={userData?.lastName}
              name="lastname"
              required
              onChange={(e) => onChange("surname", e)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              error={!validations?.email && validations?.triggerError}
              type="email"
              id="standard-basic"
              label="E-postadresse"
              defaultValue={userData?.email}
              name="email"
              required
              onChange={(e) => onChange("receiverEmail", e)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              error={!validations?.phone && validations?.triggerError}
              type="number"
              id="standard-basic"
              label="Mobilnummer"
              name="phone"
              required
              onChange={(e) => onChange("phone", e)}
            />
          </Grid>
          <Grid item xs={12} xl={12}>
            <Grid container direction={"row"}>
              <Grid item md={6} xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel>Antall indøkere</InputLabel>
                  <Select
                    defaultValue={0}
                    onChange={(e) => onChange("numberIndok", e)}
                    name="numberIndok"
                    error={!validations?.numberIndok && validations?.triggerError}
                  >
                    {range(0, totalGuestsAllowed - numberExternal).map((val: number) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel>Antall eksterne</InputLabel>
                  <Select
                    defaultValue={0}
                    onChange={(e) => onChange("numberExternal", e)}
                    name="numberExternal"
                    error={!validations?.numberExternal && validations?.triggerError}
                  >
                    {range(0, totalGuestsAllowed - numberIndok).map((val: number) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};
