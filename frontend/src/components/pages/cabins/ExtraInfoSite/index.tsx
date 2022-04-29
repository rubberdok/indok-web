import { Cabin, DatePick } from "@interfaces/cabins";
import { Box, Divider, Hidden, Stack, TextField, Typography } from "@mui/material";
import { convertDateFormat, toStringChosenCabins } from "@utils/cabins";

type Props = {
  setExtraInfo: React.Dispatch<React.SetStateAction<string>>;
  chosenCabins: Cabin[];
  datePick: DatePick;
};

const ExtraInfoSite: React.VFC<Props> = ({ setExtraInfo, datePick, chosenCabins }) => {
  const fromDate = datePick.checkInDate !== undefined && convertDateFormat(datePick.checkInDate);
  const toDate = datePick.checkOutDate !== undefined && convertDateFormat(datePick.checkOutDate);

  return (
    <Box display="flex" justifyContent="center">
      <Stack alignItems="center" direction="column" spacing={5} maxWidth={600}>
        <Hidden lgDown>
          <Typography variant="h4">Ekstra informasjon</Typography>
          <Divider />
        </Hidden>

        <div>
          <Typography variant="body1">
            På neste side sender du søknad om å booke {toStringChosenCabins(chosenCabins)} fra {fromDate} til {toDate}.
          </Typography>
          <Typography variant="body1">
            Hyttestyret får en e-post med søknaden din, og hvis de godkjenner bookingen sender de en faktura.
          </Typography>
          <Typography variant="body1">
            Har du noen spørsmål? Da kan du skrive de inn nedenfor, så sendes de sammen med søknaden din.
          </Typography>
        </div>
        <TextField
          placeholder="Fyll inn spørsmål..."
          variant="outlined"
          multiline
          rows={6}
          fullWidth
          onChange={(e) => setExtraInfo(e.target.value)}
        />
      </Stack>
    </Box>
  );
};

export default ExtraInfoSite;
