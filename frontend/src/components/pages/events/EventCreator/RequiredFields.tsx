import { gql, useMutation, useQuery } from "@apollo/client";
import { CREATE_EVENT } from "@graphql/events/mutations";
import { GET_CATEGORIES } from "@graphql/events/queries";
import { GET_USER } from "@graphql/users/queries";
import { Category, Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActions,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Alert from "@components/Alert";
import SlotDistribution from "../SlotDistribution";
import { DEFAULTINPUT } from "./constants";
import { getFormattedData } from "./helpers";

/**
 * Component for filling in required fields on an event
 */

const RequiredFields: React.FC = () => {
  return (
    <>
      <Box paddingTop={3}>
        <Typography variant="h4">Påkrevde felt</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            label="Tittel"
            placeholder="Tittel"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.currentTarget.value })}
          />
        </Grid>
        <Grid item xs={6}>
          <InputLabel>Starttid</InputLabel>
          <TextField
            type="datetime-local"
            value={eventData.startTime}
            onChange={(e) => setEventData({ ...eventData, startTime: e.currentTarget.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Beskrivelse"
            multiline
            rows={3}
            required
            placeholder="Beskrivelse ..."
            variant="outlined"
            value={eventData.description}
            onChange={(e) => setEventData({ ...eventData, description: e.currentTarget.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <InputLabel id="select-org-label">Organisasjon</InputLabel>
            <Select
              labelId="select-org-label"
              id="select-org"
              name="organization"
              value={eventData.organizationId}
              onChange={(e) => setEventData({ ...eventData, organizationId: e.target.value })}
              disabled={userData.user.organizations.length < 2}
            >
              {userData.user.organizations.map((organization) => (
                <MenuItem key={organization.id} value={organization.id}>
                  {organization.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
};

export default RequiredFields;
