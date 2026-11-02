import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useState } from "react";

const NEW_CARD_IMAGE: string = "/img/nfc/NyttNTNUKort.png";
const OLD_CARD_IMAGE: string = "/img/nfc/GammeltNTNUKort.png";

type CardExampleProps = {
  readonly title: string;
  readonly label: string;
  readonly image: string;
  readonly instruction: string;
};

function CardExample({ title, label, image, instruction }: CardExampleProps) {
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>
      <Box
        sx={{
          width: "fit-content",
          maxWidth: "100%",
          mx: "auto",
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={image}
          alt={`${title}, kortnummeret står etter «${label}»`}
          sx={{ display: "block", maxWidth: "100%", maxHeight: 360, width: "auto", height: "auto" }}
        />
      </Box>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {instruction}
      </Typography>
    </Box>
  );
}

export function CardNumberHelp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)} sx={{ px: 0, textTransform: "none" }}>
        Hvor finner jeg kortnummeret?
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="card-number-help-title"
      >
        <DialogTitle id="card-number-help-title">Hvor finner jeg kortnummeret?</DialogTitle>
        <DialogContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <CardExample
              title="Nyere NTNU-kort"
              label="UID"
              image={NEW_CARD_IMAGE}
              instruction="Skriv inn hele tallet som står etter 'UID'."
            />
            <CardExample
              title="Eldre NTNU-kort"
              label="M eller mS"
              image={OLD_CARD_IMAGE}
              instruction="Skriv inn hele tallet som står etter 'M' eller 'mS'."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Lukk</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
