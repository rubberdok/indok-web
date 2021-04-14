import { Card, CardContent, CardActions, Button, Grid, Typography, TextField, Checkbox, MenuItem, makeStyles, Select, InputLabel, FormControl } from "@material-ui/core"
import MarkdownForm from "@components/pages/listings/detail/MarkdownForm"
import { Listing, ListingInput } from "@interfaces/listings";
import { Organization } from "@interfaces/organizations";

const useStyles = makeStyles((theme) => ({
  inputGroup: {
    [theme.breakpoints.up("md")]: {
      flexDirection: "row"
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column"
    }
  }
}));

const ListingForm: React.FC<{state: Listing | ListingInput, setState: (state: Listing | ListingInput) => void, onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void, organizations: Organization[] }> = ({ state, setState, onSubmit, organizations }) => {
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent< HTMLTextAreaElement | HTMLInputElement>, property: string) => {
    setState({...state, [property]: event.target.value})
  }

  return (
    <Card>
      <CardContent>
        <Grid container direction="column" spacing={4}>
          <Grid item>
            <Typography variant="h3">
              Informasjon
            </Typography>
            <TextField label="Tittel" fullWidth onChange={(e) => handleChange(e, "title")} />
          </Grid>
          <Grid item>
            <Grid container spacing={2} className={classes.inputGroup}>
              <Grid item xs>
                <TextField label="Søknadsfrist" fullWidth type="date" onChange={(e) => handleChange(e, "deadline")} />
              </Grid>
              <Grid item xs>
                <TextField label="Åpningsdato" fullWidth type="date" onChange={(e) => handleChange(e, "startDatetime")} />
              </Grid>
              <Grid item xs>
                <TextField label="Søknadslink" fullWidth type="url" onChange={(e) => handleChange(e, "url")} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="h3">
              Organisasjon
            </Typography>
            <FormControl>
              <InputLabel>Velg organisasjon</InputLabel>
              <Select
                value={state.organization}
                onChange={(e) => setState({...state, organization: organizations.find(organization => organization.id === e.target.value)})}
              >
                {organizations.map((organization) => (
                  <MenuItem key={organization.id} value={organization.id}>{organization.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/*<Grid item>
            <Grid container spacing={2} className={classes.inputGroup}>
              <Grid item xs>
                <Checkbox color="primary" checked={listing.application} />
              </Grid>
              <Grid item xs>
                <Checkbox color="primary" checked={listing.case} />
              </Grid>
              <Grid item xs>
                <Checkbox color="primary" checked={listing.interview} />
              </Grid>
            </Grid>
          </Grid>*/}
          <Grid item>
            <Typography variant="h3">Beskrivelse</Typography>
            <MarkdownForm markdown={state.description} onChange={(e) => handleChange(e, "description")} />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Grid container direction="row-reverse">
          <Grid item>
            <Button color="primary" variant="contained" onClick={onSubmit}>
              Lagre
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  )
}

export default ListingForm;