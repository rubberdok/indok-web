import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";

import dayjs from "@/lib/date";

type Props = {
  selectedCabins: { id: string; name: string; capacity: number }[];
  dates: { start: Date | undefined; end: Date | undefined };
  onSubmit: (values: { extraInfo: string }) => void;
  onPrevious: () => void;
};

function Questions({ onSubmit, onPrevious, selectedCabins, dates }: Props) {
  const { handleSubmit, register } = useForm<{ extraInfo: string }>({});

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container disableGutters maxWidth="sm">
        <Card>
          <CardHeader title="Spørsmål" />
          <CardContent>
            <Typography gutterBottom>
              På neste side sender du søknad om å booke {selectedCabins.map((cabin) => cabin.name).join(", ")} fra{" "}
              {dayjs(dates.start).format("LL")} til {dayjs(dates.end).format("LL")}. Hytteforeningen får en e-post med
              søknaden din, og hvis de godkjenner bookingen sender de en faktura. Har du noen spørsmål? Da kan du skrive
              de inn nedenfor, så sendes de sammen med søknaden din.
            </Typography>
            <TextField
              fullWidth
              label="Spørsmål"
              {...register("extraInfo")}
              multiline
              rows={3}
              placeholder="Er det mulig å..."
            />
          </CardContent>
          <CardActions>
            <Stack direction="row" width="100%" justifyContent="flex-end" spacing={2}>
              <Button onClick={() => onPrevious()} startIcon={<KeyboardArrowLeft />}>
                Tilbake
              </Button>
              <Button type="submit" endIcon={<KeyboardArrowRight />}>
                Neste
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </Container>
    </form>
  );
}

export { Questions };
