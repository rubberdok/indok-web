import MarkdownForm from "@components/pages/listings/detail/MarkdownForm";
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
} from "@material-ui/core";
import Save from "@material-ui/icons/Save";
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
  root: {
    marginBottom: theme.spacing(4),
  },
}));

const ListingForm: React.FC<{
  state: ListingInput;
  setState: (state: ListingInput) => void;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  organizations: Organization[] | undefined;
}> = ({ state, setState, onSubmit, organizations }) => {
  const classes = useStyles();

  const handlePropertyChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, property: string) => {
    setState({ ...state, [property]: event.target.value });
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, property: string) => {
    setState({ ...state, [property]: event.target.checked})
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container direction="column" spacing={4}>
          <Grid item>
            <Typography variant="h3">Informasjon</Typography>
            <TextField label="Tittel" value={state.title} fullWidth onChange={(e) => handlePropertyChange(e, "title")} />
          </Grid>
          <Grid item>
            <Grid container spacing={2} className={classes.inputGroup}>
              <Grid item xs>
                <TextField
                  label="Søknadsfrist"
                  value={state.deadline || ""}
                  fullWidth
                  type="date"
                  onChange={(e) => handlePropertyChange(e, "deadline")}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  label="Åpningsdato"
                  value={state.startDatetime || ""}
                  fullWidth
                  type="date"
                  onChange={(e) => handlePropertyChange(e, "startDatetime")}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  label="Søknadslink"
                  value={state.url || ""}
                  fullWidth
                  onChange={(e) => handlePropertyChange(e, "url")}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="h3">Organisasjon</Typography>
            {organizations && state.organization && (
              <FormControl fullWidth variant="outlined">
                <InputLabel id="select-organization-label">Velg organisasjon</InputLabel>
                <Select
                  labelId="select-organization-label"
                  id="select-organization"
                  value={state.organization.id}
                  onChange={(e) =>
                    setState({
                      ...state,
                      organization: organizations.find((organization) => organization.id === e.target.value),
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
          </Grid>
          <Grid item>
            <Grid container spacing={2} className={classes.inputGroup}>
              <Grid item xs>
                <FormControlLabel
                  control={
                    <Checkbox 
                      color="primary"
                      checked={state.application}
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
                      checked={state.interview}
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
                      checked={state.case}
                      onChange={(e) => handleCheckboxChange(e, "case")} 
                    />
                  }
                  label={"Case"}
                />

              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="h3">Beskrivelse</Typography>
            <MarkdownForm markdown={state.description} onTextChange={(e) => handlePropertyChange(e, "description")} />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Grid container direction="row-reverse">
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
