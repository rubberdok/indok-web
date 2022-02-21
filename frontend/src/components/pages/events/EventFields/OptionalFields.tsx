import { Category } from "@interfaces/events";
import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Tooltip } from "@material-ui/core";
import React from "react";

/**
 * Component for filling in the fully optional fields
 */

type Props = {
  eventData: Record<string, any>;
  onEventDataChange: (data: Record<string, any>) => void;
  allCategories: Category[];
};

const OptionalFields: React.FC<Props> = ({ eventData, onEventDataChange, allCategories }) => {
  return (
    <>
      <Grid item xs={6}>
        <TextField
          label="Kontakt-epost"
          placeholder="ola.nordmann@gmail.com"
          value={eventData.contactEmail}
          onChange={(e) => onEventDataChange({ ...eventData, contactEmail: e.currentTarget.value })}
        />
        <FormHelperText>E-postadresse for kontakt angående arrangementet</FormHelperText>
      </Grid>

      <Grid item xs={6}>
        <InputLabel>Sluttid for arrangement</InputLabel>
        <TextField
          type="datetime-local"
          value={eventData.endTime}
          onChange={(e) => onEventDataChange({ ...eventData, endTime: e.currentTarget.value })}
          margin={"dense"}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="Kort beskrivelse"
          placeholder="Beskrivelse"
          value={eventData.shortDescription}
          onChange={(e) => onEventDataChange({ ...eventData, shortDescription: e.currentTarget.value })}
        />
        <FormHelperText>Beskrivelsen blir vist i listen av arrangementer</FormHelperText>
      </Grid>
      <Grid item xs={6}>
        <FormControl>
          <InputLabel id="select-category-label" shrink>
            Kategori
          </InputLabel>
          <Select
            labelId="select-category-label"
            id="select-category"
            name="category"
            value={eventData.categoryId}
            onChange={(e) => {
              onEventDataChange({ ...eventData, categoryId: e.target.value as string });
            }}
            displayEmpty
          >
            <MenuItem value="">{"Ingen kategori"}</MenuItem>
            {allCategories.map((category: Category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Lokasjon"
          placeholder="Lokasjon"
          value={eventData.location}
          onChange={(e) => onEventDataChange({ ...eventData, location: e.currentTarget.value })}
        />
      </Grid>
      <Grid item xs={6}>
        <Tooltip title="Kommer snart!">
          <TextField
            label="Bilde (URL)"
            placeholder="Bilde URL"
            value={eventData.image}
            onChange={(e) => onEventDataChange({ ...eventData, image: e.currentTarget.value })}
            disabled
          />
        </Tooltip>
        <FormHelperText>Bildet vil bli vist på infosiden til eventet</FormHelperText>
      </Grid>
    </>
  );
};

export default OptionalFields;
