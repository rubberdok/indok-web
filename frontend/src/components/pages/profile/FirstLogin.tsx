import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputLabel,
  TextField,
} from "@material-ui/core";

export const FirstLogin: React.FC<{
  open: boolean;
  onChange: (key: string, e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}> = (open, onChange) => {
  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Første innlogging</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Det ser ut som at dette er første gang du logger inn på nettsiden. Vennligst fyll ut informasjonen under som
          er nødvendig for å benytte funksjonaliteten på nettsiden.
        </DialogContentText>
        <Grid container direction="column">
          <Grid item>
            <InputLabel>Foretrukket e-post (stud-mail brukes dersom annet ikke oppgis)</InputLabel>
            <TextField
              id="standard-basic"
              type="email"
              name="email"
              value={userData.feideEmail}
              onChange={(e) => onChange("email", e)}
            />
          </Grid>
          <Grid item>
            <InputLabel>Telefonnummer (nødvendig for smittesporing under arrangementer)</InputLabel>
            <TextField
              id="standard-basic"
              required
              type="tel"
              name="phone"
              value={userData.phoneNumber}
              onChange={(e) => onChange("phoneNumber", e)}
            />
          </Grid>
          <Grid item>
            <InputLabel>Allergier (benyttes ved påmelding på arrangementer)</InputLabel>
            <TextField
              id="standard-basic"
              required
              type="text"
              value={userData.allergies}
              onChange={(e) => onChange("allergies", e)}
            />
          </Grid>
          <Grid item>
            <InputLabel>Årstrinn</InputLabel>
            <TextField
              id="standard-basic"
              required
              type="number"
              value={userData.year}
              onChange={(e) => onChange("year", e)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleSubmit()} color="primary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};
