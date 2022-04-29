import { Box, Button, Dialog, DialogActions, DialogContent, Grid, TextField, Tooltip, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import React, { Dispatch, SetStateAction } from "react";
import { SendEmailProps } from "./EmailForm";

interface EmailFormDialogProps {
  showEmailForm: boolean;
  setShowEmailForm: Dispatch<SetStateAction<boolean>>;
  emailProps: SendEmailProps;
  setEmailProps: Dispatch<SetStateAction<SendEmailProps>>;
  validations: { subject: boolean; content: boolean };
  sendEmail: () => void;
}

const EmailFormDialog: React.FC<EmailFormDialogProps> = ({
  showEmailForm,
  setShowEmailForm,
  emailProps,
  setEmailProps,
  validations,
  sendEmail,
}) => {
  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={showEmailForm}
      onClose={() => setShowEmailForm(false)}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogContent>
        <Grid
          container
          item
          sm={12}
          md={6}
          direction="column"
          spacing={3}
          alignContent="center"
          style={{ margin: "auto" }}
        >
          <Grid item>
            <Typography variant="h5">Send en e-post til alle påmeldte</Typography>
            <Typography variant="body2">
              En kopi av e-posten vil bli sendt til kontaktpersonen for arrangementet.
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              required
              onChange={(e) => setEmailProps({ ...emailProps, subject: e.currentTarget.value })}
              label="Emne"
            />
          </Grid>
          <Grid item>
            <TextField
              multiline
              fullWidth
              required
              onChange={(e) => setEmailProps({ ...emailProps, content: e.currentTarget.value })}
              label="E-post-innhold"
              rows={4}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Typography variant="caption">
              Denne tjenesten er kun ment for informasjon om arrangementet. Promotering, nyhetsbrev, og lignende er ikke
              tillatt. Misbruk vil føre til utestengelse fra denne funksjonen.
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ClearIcon />} onClick={() => setShowEmailForm(false)} color="primary">
          Lukk
        </Button>

        <Tooltip disableHoverListener={Object.values(validations).every(Boolean)} title="Du må fylle inn alle feltene.">
          <Box>
            <Button
              startIcon={<SendIcon />}
              disabled={!Object.values(validations).every(Boolean)}
              onClick={() => sendEmail()}
              color="primary"
            >
              Send e-post
            </Button>
          </Box>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

export default EmailFormDialog;
