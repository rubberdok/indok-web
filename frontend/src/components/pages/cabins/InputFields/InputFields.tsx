import { Cabin, ContactInfo, ContactInfoValidations, InputFieldsEvent } from "@interfaces/cabins";
import { FormControl, Grid, Hidden, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
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
    <Grid container item spacing={3} lg={8} md={12} justifyContent="center">
      <Hidden lgDown>
        <Grid item>
          <Typography variant="h3">Kontaktinfo</Typography>
        </Grid>
      </Hidden>

      <Grid item container spacing={5}>
        <Grid item xs={12} sm={6}>
          <TextField
            type="text"
            label="Fornavn"
            required
            name="firstName"
            onChange={(e) => onChange("firstName", e)}
            error={!validations?.firstName && errorTrigger}
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
            error={!validations?.lastName && errorTrigger}
            value={contactInfo.lastName}
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
              label="Antall indøkere"
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
              label="Antall eksterne"
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
