import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

// Placeholders until photos of the cards exist: put the photos in public/img/janhus/
// (for example card-new.jpg and card-old.jpg) and point these paths at them.
const NEW_CARD_IMAGE: string | null = null;
const OLD_CARD_IMAGE: string | null = null;
const PLACEHOLDER = { light: "/img/rubberdok_logo_black.svg", dark: "/img/rubberdok_logo_white.svg" };

type CardExampleProps = {
  readonly title: string;
  readonly label: string;
  readonly image: string | null;
  readonly instruction: string;
};

function CardExample({ title, label, image, instruction }: CardExampleProps) {
  const theme = useTheme();
  const isPlaceholder = image === null;
  const src = image ?? PLACEHOLDER[theme.palette.mode];

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>
      <Box
        sx={{
          aspectRatio: "85.6 / 54",
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          p: isPlaceholder ? 4 : 0,
        }}
      >
        <Box
          component="img"
          src={src}
          alt={isPlaceholder ? "Bilde av kortet kommer" : `${title}, kortnummeret står etter «${label}»`}
          sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: isPlaceholder ? "contain" : "cover" }}
        />
      </Box>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {instruction}
      </Typography>
    </Box>
  );
}

/** "Hvor finner jeg kortnummeret?": shows where the number is on new and old NTNU cards. */
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
              instruction="Skriv inn hele nummeret som står etter «UID»."
            />
            <CardExample
              title="Eldre NTNU-kort"
              label="mS"
              image={OLD_CARD_IMAGE}
              instruction="Skriv inn de 10 sifrene som står etter «mS». På de eldste kortene står det «M»."
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
