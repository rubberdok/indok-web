import MarkdownForm from "@components/markdown/MarkdownForm";
import { ListingInput } from "@interfaces/listings";
import { Organization } from "@interfaces/organizations";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Close, HelpOutline, Save } from "@mui/icons-material";
import React, { ChangeEvent } from "react";

const useStyles = makeStyles((theme) => ({
  inputGroup: {
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
}));

/**
 * A form to create or edit a listing.
 *
 * Props:
 * - the state of the listing to create/edit
 * - setListing function to set the state
 * - onSubmit callback for updating the database
 * - onCancel callback for discarding changes
 * - organizations of which the listing editor is an authorized member
 */
const ListingForm: React.FC<{
  listing: ListingInput;
  setListing: (listing: ListingInput) => void;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel: () => void;
  organizations: Organization[];
}> = ({ listing, setListing, onSubmit, onCancel, organizations }) => {
  const classes = useStyles();

  /**
   * Helper method to handle changes to TextFields.
   */
  const handlePropertyChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    property: keyof ListingInput
  ) => {
    setListing({ ...listing, [property]: event.target.value });
  };

  /**
   * Helper method to handle changes to boolean fields using checkboxes.
   */
  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, property: keyof ListingInput) => {
    setListing({ ...listing, [property]: event.target.checked });
  };

  return (
    <Card>
      <CardContent>
        <Grid container direction="column" spacing={4}>
          <Grid item>
            <Typography variant="h5" component="h2">
              Forening
            </Typography>
            {organizations && listing.organization && (
              <>
                {organizations.length === 1 ? (
                  <Typography>{listing.organization.name}</Typography>
                ) : (
                  <FormControl fullWidth variant="filled">
                    <InputLabel id="select-organization-label">Velg forening</InputLabel>
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
            <Typography variant="h5" component="h2">
              Informasjon
            </Typography>
            <TextField
              label="Tittel"
              variant="filled"
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
                  variant="filled"
                  label="Publiseringsdato"
                  value={listing.startDatetime || ""}
                  fullWidth
                  type="datetime-local"
                  onChange={(e) => handlePropertyChange(e, "startDatetime")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  variant="filled"
                  label="Søknadsfrist"
                  value={listing.deadline || ""}
                  fullWidth
                  type="datetime-local"
                  required
                  onChange={(e) => handlePropertyChange(e, "deadline")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} className={classes.inputGroup}>
              <Grid item xs>
                <TextField
                  label="Søknadslink"
                  variant="filled"
                  value={listing.applicationUrl || ""}
                  fullWidth
                  onChange={(e) => handlePropertyChange(e, "applicationUrl")}
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
              <Grid item xs>
                <TextField
                  label='Link til "Les mer"'
                  variant="filled"
                  value={listing.readMoreUrl || ""}
                  fullWidth
                  onChange={(e) => handlePropertyChange(e, "readMoreUrl")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip
                          placement="left"
                          enterTouchDelay={0}
                          leaveTouchDelay={2500}
                          title={
                            <>
                              Denne linken dukker opp under navnet til foreningen din, slik at søkere kan lese mer om
                              den.
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
            <Typography variant="h5" component="h2">
              Opptaksprosessen
            </Typography>
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
                <Typography variant="h5" component="h2">
                  Beskrivelse
                </Typography>
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
        <Grid container justifyContent="flex-end" spacing={1}>
          <Grid item>
            <Button variant="contained" onClick={onCancel} startIcon={<Close />}>
              Avbryt
            </Button>
          </Grid>
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
