import MarkdownForm from "@components/pages/listings/markdown/MarkdownForm";
import { ListingInput } from "@interfaces/listings";
import { Organization } from "@interfaces/organizations";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Tooltip,
  InputAdornment,
} from "@material-ui/core";
import { HelpOutline, Save } from "@material-ui/icons";
import React, { ChangeEvent } from "react";

const useStyles = makeStyles((theme) => ({
  inputGroup: {
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
}));

/**
 * @description A form to create or edit a listing
 *
 * @param listing: ListingInput, the current state of the listing
 * @param setListing: (state: ListingInput) => void, the function for setting the listing state
 * @param onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void, the function to call when submitting
 * @param organizations: Organization[] | undefined, a list of organizations which the user is part of.
 * @returns ListingForm: React.FC, the listing form.
 */
const ListingForm: React.FC<{
  listing: ListingInput;
  setListing: (listing: ListingInput) => void;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  organizations: Organization[];
}> = ({ listing, setListing, onSubmit, organizations }) => {
  const classes = useStyles();

  /**
   * @description Helper method to handle changes to TextFields
   * @param event
   * @param property the property on state to update, e.g. description
   */
  const handlePropertyChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    property: keyof ListingInput
  ) => {
    setListing({ ...listing, [property]: event.target.value });
  };

  /**
   * @description Helper method to handle changes to boolean fields using checkboxes.
   * @param event
   * @param property the property on state to update, e.g. case
   */
  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, property: keyof ListingInput) => {
    setListing({ ...listing, [property]: event.target.checked });
  };

  return (
    <Card>
      <CardContent>
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <Typography variant="h5">Organisasjon</Typography>
            {organizations && listing.organization && (
              <>
                {organizations.length === 1 ? (
                  <Typography>{listing.organization.name}</Typography>
                ) : (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="select-organization-label">Velg organisasjon</InputLabel>
                    <Select
                      labelId="select-organization-label"
                      id="select-organization"
                      value={listing.organization.id}
                      onChange={(e) =>
                        setListing({
                          ...listing,
                          organization:
                            organizations.find((organization) => organization.id === e.target.value) ||
                            listing.organization,
                        })
                      }
                      fullWidth
                    >
                      {organizations.map((organization) => (
                        <MenuItem key={organization.id} value={organization.id}>
                          {organization.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </>
            )}
          </Grid>
          <Grid item>
            <Typography variant="h5">Informasjon</Typography>
            <TextField
              label="Tittel"
              value={listing.title}
              fullWidth
              onChange={(e) => handlePropertyChange(e, "title")}
              required
            />
          </Grid>
          <Grid item>
            <Grid container spacing={2} className={classes.inputGroup}>
              <Grid item xs>
                <TextField
                  label="Publiseringsdato"
                  value={listing.startDatetime || ""}
                  fullWidth
                  type="date"
                  onChange={(e) => handlePropertyChange(e, "startDatetime")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  label="Søknadsfrist"
                  value={listing.deadline || ""}
                  fullWidth
                  type="date"
                  required
                  onChange={(e) => handlePropertyChange(e, "deadline")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  label="Søknadslink"
                  value={listing.url || ""}
                  fullWidth
                  onChange={(e) => handlePropertyChange(e, "url")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip
                          placement="left"
                          enterTouchDelay={0}
                          leaveTouchDelay={2500}
                          title={
                            <>
                              <Typography>Søknad på indokntnu.no</Typography>
                              Du kan også lage søknad og håndtere alt av søknadsbehandling på denne nettsida.
                            </>
                          }
                        >
                          <HelpOutline />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="h5">Opptaksprosessen</Typography>
            <Grid container className={classes.inputGroup}>
              <Grid item xs>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={listing.application ?? false}
                      onChange={(e) => handleCheckboxChange(e, "application")}
                    />
                  }
                  label={"Søknad"}
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={listing.interview ?? false}
                      onChange={(e) => handleCheckboxChange(e, "interview")}
                    />
                  }
                  label={"Intervju"}
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={listing.case ?? false}
                      onChange={(e) => handleCheckboxChange(e, "case")}
                    />
                  }
                  label={"Case"}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row" spacing={1} alignItems="flex-end">
              <Grid item>
                <Typography variant="h5">Beskrivelse</Typography>
              </Grid>
              <Grid item>
                <Tooltip
                  placement="right"
                  enterTouchDelay={0}
                  leaveTouchDelay={3000}
                  title={
                    <>
                      <Typography>Vi støtter Markdown!</Typography>
                      Enkel guide:
                      <br />
                      ##### Overskrift
                      <br />*<em>Kursiv</em>*
                      <br />
                      **<b>Fet skrift</b>**
                    </>
                  }
                >
                  <HelpOutline />
                </Tooltip>
              </Grid>
            </Grid>
            <MarkdownForm markdown={listing.description} onTextChange={(e) => handlePropertyChange(e, "description")} />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Grid container justify="flex-end">
          <Grid item>
            <Button color="primary" variant="contained" onClick={onSubmit} startIcon={<Save />}>
              Lagre
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default ListingForm;
