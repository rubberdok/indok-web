import { ContactInfo, InputFieldsEvent, ContactInfoValidations, Cabin } from "@interfaces/cabins";
import {
  createStyles,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import theme from "@styles/theme";
import { range } from "@utils/helpers";
import React from "react";

interface Props {
  contactInfo: ContactInfo;
  validations: ContactInfoValidations | undefined;
  onChange: (name: string, event: InputFieldsEvent) => void;
  chosenCabins: Cabin[];
}

const useStyles = makeStyles(() =>
  createStyles({
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    center: {
      margin: "auto",
    },
    border: {
      border: "1px solid red",
    },
    blue: {
      border: "1px solid blue",
    },
    input: {
      width: "500px",
    },
  })
);

export const InputFields: React.FC<Props> = ({ contactInfo, validations, onChange, chosenCabins }) => {
  const classes = useStyles();
  const totalGuestsAllowed = chosenCabins.reduce((a, b) => a + (b.maxGuests || 0), 0);

  return (
    <>
      <Grid container alignItems="center" spacing={3} lg={8} md={12} className={classes.center}>
        <Grid item>
          <Typography variant="h3">Kontaktinfo</Typography>
          <Divider component="hr" />
        </Grid>
        <Grid item container spacing={5}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              label="Fornavn"
              required
              name="firstName"
              onChange={(e) => onChange("firstName", e)}
              error={!validations?.firstName}
              value={contactInfo.firstName}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              label="Etternavn"
              name="lastName"
              required
              onChange={(e) => onChange("lastName", e)}
              error={!validations?.lastName}
              value={contactInfo.lastName}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="email"
              label="E-postadresse"
              name="email"
              required
              onChange={(e) => onChange("email", e)}
              error={!validations?.email}
              value={contactInfo.email}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="number"
              label="Mobilnummer"
              name="phone"
              required
              onChange={(e) => onChange("phone", e)}
              error={!validations?.phone}
              value={contactInfo.phone}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Antall indøkere</InputLabel>
              <Select
                defaultValue={0}
                onChange={(e) => onChange("numberIndok", e)}
                name="numberIndok"
                error={!validations?.numberIndok}
                value={contactInfo.numberIndok}
              >
                {range(0, totalGuestsAllowed - contactInfo.numberExternal).map((val: number) => (
                  <MenuItem key={val} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Antall eksterne</InputLabel>
              <Select
                defaultValue={0}
                onChange={(e) => onChange("numberExternal", e)}
                name="numberExternal"
                error={!validations?.numberExternal}
                value={contactInfo.numberExternal}
              >
                {range(0, totalGuestsAllowed - contactInfo.numberIndok).map((val: number) => (
                  <MenuItem key={val} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
