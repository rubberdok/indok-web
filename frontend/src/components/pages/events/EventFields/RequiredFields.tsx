import React from "react";
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import { User } from "@interfaces/users";

/**
 * Component for filling in required fields on an event
 */

type Props = {
  eventData: Record<string, any>;
  onEventDataChange: (data: Record<string, any>) => void;
  user?: User;
};

const RequiredFields: React.FC<Props> = ({ eventData, onEventDataChange, user }) => {
  return (
    <>
      <Box paddingTop={3}>
        <Typography variant="h4">Påkrevde felt</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            required
            label="Tittel"
            placeholder="Tittel"
            value={eventData.title}
            onChange={(e) => onEventDataChange({ ...eventData, title: e.currentTarget.value })}
          />
        </Grid>
        <Grid item xs={6}>
          <InputLabel>Starttid</InputLabel>
          <TextField
            required
            type="datetime-local"
            value={eventData.startTime}
            onChange={(e) => onEventDataChange({ ...eventData, startTime: e.currentTarget.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Beskrivelse"
            required
            multiline
            rows={3}
            placeholder="Beskrivelse ..."
            variant="outlined"
            value={eventData.description}
            onChange={(e) => onEventDataChange({ ...eventData, description: e.currentTarget.value })}
            fullWidth
          />
        </Grid>

        {user && (
          <Grid item xs={12}>
            <FormControl>
              <InputLabel id="select-org-label">Forening</InputLabel>
              <Select
                labelId="select-org-label"
                id="select-org"
                name="organization"
                value={eventData.organizationId}
                onChange={(e) => onEventDataChange({ ...eventData, organizationId: e.target.value })}
                disabled={user.organizations.length < 2}
              >
                {user.organizations.map((organization) => (
                  <MenuItem key={organization.id} value={organization.id}>
                    {organization.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default RequiredFields;
