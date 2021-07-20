import { ContactInfo, InputFieldsEvent, ContactInfoValidations, Cabin } from "@interfaces/cabins";
import {
  Divider,
  FormControl,
  Grid,
  Hidden,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { range } from "@utils/helpers";
import React from "react";

interface Props {
  contactInfo: ContactInfo;
  validations: ContactInfoValidations | undefined;
  onChange: (name: string, event: InputFieldsEvent) => void;
  errorTrigger: boolean;
  chosenCabins: Cabin[];
  header?: string;
}

/*
Component for rendering all input fields for the contact info of a booking
*/
export const InputFields: React.FC<Props> = ({ contactInfo, validations, onChange, errorTrigger, chosenCabins }) => {
  const totalGuestsAllowed = chosenCabins.reduce((sum, currentCabin) => sum + (currentCabin.maxGuests || 0), 0);

  return (
    <Grid container item spacing={3} lg={8} md={12} justify="center">
      <Hidden mdDown>
        <Grid item>
          <Typography variant="h3">Kontaktinfo</Typography>
          <Divider component="hr" />
        </Grid>
      </Hidden>

      <Grid item container spacing={5}>
        <Grid item xs={12} sm={6}>
          <TextField
            type="text"
            label="Fornavn"
            required
            name="firstname"
            onChange={(e) => onChange("firstname", e)}
            error={!validations?.firstname && errorTrigger}
            value={contactInfo.firstname}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="text"
            label="Etternavn"
            name="lastname"
            required
            onChange={(e) => onChange("lastname", e)}
            error={!validations?.lastname && errorTrigger}
            value={contactInfo.lastname}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="email"
            label="E-postadresse"
            name="receiverEmail"
            required
            onChange={(e) => onChange("receiverEmail", e)}
            error={!validations?.receiverEmail && errorTrigger}
            value={contactInfo.receiverEmail}
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
            error={!validations?.phone && errorTrigger}
            value={contactInfo.phone}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Antall indøkere</InputLabel>
            <Select
              defaultValue={0}
              onChange={(e) => onChange("internalParticipants", e)}
              name="internalParticipants"
              error={!validations?.internalParticipants && errorTrigger}
              value={contactInfo.internalParticipants}
            >
              {range(0, totalGuestsAllowed - contactInfo.externalParticipants).map((val: number) => (
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
              onChange={(e) => onChange("externalParticipants", e)}
              name="externalParticipants"
              error={!validations?.externalParticipants && errorTrigger}
              value={contactInfo.externalParticipants}
            >
              {range(0, totalGuestsAllowed - contactInfo.internalParticipants).map((val: number) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  );
};
