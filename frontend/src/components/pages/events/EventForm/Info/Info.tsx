import { MailOutlineRounded } from "@mui/icons-material";
import { InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { IEventForm } from "../schema";
import { Organization } from "../types";

import { Category } from "./Category";
import { GradeYears } from "./GradeYears";
import { Organizer } from "./Organizer";

type Props = {
  organizations: Organization[];
};

export const Info: React.FC<Props> = ({ organizations }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<IEventForm>();

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="subtitle2">Om</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          {...register("info.title")}
          error={Boolean(errors.info?.title)}
          helperText={errors.info?.title?.message}
          label="Tittel"
          required
          fullWidth
        />
        <TextField
          fullWidth
          {...register("info.shortDescription")}
          error={Boolean(errors.info?.shortDescription)}
          helperText={errors.info?.shortDescription?.message ?? "Vises i oversikten over arrangementer"}
          label="Kort beskrivelse"
          placeholder="Informasjonsmøte for ..."
        />
      </Stack>

      <TextField
        {...register("info.description")}
        error={Boolean(errors.info?.description)}
        helperText={errors.info?.description?.message ?? "Beskrivelsen støtter markdown"}
        label="Beskrivelse"
        placeholder="Linjeforeningen vår arrangerer..."
        required
        multiline
        rows={4}
      />

      <Typography variant="subtitle2">Klassetrinn og kategori</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <GradeYears />
        <Category />
      </Stack>

      <Typography variant="subtitle2">Arrangør og kontaktinformasjon</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Organizer organizations={organizations} />

        <TextField
          {...register("info.contactEmail")}
          error={Boolean(errors.info?.contactEmail)}
          helperText={errors.info?.contactEmail?.message}
          fullWidth
          label="Kontakt (e-post)"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <MailOutlineRounded />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Stack>
  );
};
