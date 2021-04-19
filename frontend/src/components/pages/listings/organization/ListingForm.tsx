import MarkdownForm from "@components/pages/listings/markdown/MarkdownForm";
import { ListingInput } from "@interfaces/listings";
import { Organization } from "@interfaces/organizations";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Tooltip,
  InputAdornment,
  InputLabel,
} from "@material-ui/core";
import { HelpOutline, Save } from "@material-ui/icons";
import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(tz);
dayjs.tz.setDefault("europe/oslo");


const useStyles = makeStyles((theme) => ({
  inputGroup: {
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
}));

const validationSchema = yup.object({
  title: yup.string()
    .min(3, "Tittelen må være minst 3 tegn.")
    .max(50, "Tittelen kan ikke være mer enn 50 tegn.")
    .required("Tittel er obligatorisk."),
  deadline: yup.date()
    .required("Obligatorisk"),
  startDatetime: yup.date()
    .max(yup.ref("deadline"),
      ({ max }) => `Publiseringsdato må være før ${dayjs(max).isValid() ? dayjs(max).toISOString() : "N/A"}`
    )
})

/**
 * A form to create or edit a listing
 *
 */
const ListingForm: React.FC<{
  listing: ListingInput;
  onSubmit: (listing: ListingInput) => void;
  organizations: Organization[];
}> = ({ listing, onSubmit, organizations }) => {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: listing,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  })

  return (
    <Card>
      <form onSubmit={formik.handleSubmit}>
        <CardContent>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Typography variant="h5" component="h2">Organisasjon</Typography>
              {organizations && listing.organization && (
                <>
                  {organizations.length === 1 ? (
                    <Typography>{listing.organization.name}</Typography>
                  ) : (
                    <FormControl fullWidth variant="filled">
                      <InputLabel id="select-organization-label">Velg organisasjon</InputLabel>
                      <Select
                        labelId="select-organization-label"
                        id="select-organization"
                        value={formik.values.organization.id || organizations[0].id}
                        onChange={formik.handleChange("organization.id")}
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
              <Typography variant="h5" component="h2">Informasjon</Typography>
              <TextField
                id="title"
                label="Tittel"
                variant="filled"
                required
                fullWidth
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item>
              <Grid container spacing={2} className={classes.inputGroup}>
                <Grid item xs>
                  <TextField
                    variant="filled"
                    label="Publiseringsdato"
                    id="startDatetime"
                    fullWidth
                    type="date"
                    value={formik.values.startDatetime}
                    onChange={formik.handleChange("startDatetime")}
                    onBlur={formik.handleBlur}
                    error={formik.touched.startDatetime && Boolean(formik.errors.startDatetime)}
                    helperText={formik.touched.startDatetime && formik.errors.startDatetime}
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    variant="filled"
                    label="Søknadsfrist"
                    id="deadline"
                    type="date"
                    required
                    fullWidth
                    value={formik.values.deadline}
                    onChange={formik.handleChange("deadline")}
                    onBlur={formik.handleBlur}
                    error={formik.touched.deadline && Boolean(formik.errors.deadline)}
                    helperText={formik.touched.deadline && formik.errors.deadline}
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    id="url"
                    label="Søknadslink"
                    variant="filled"
                    value={formik.values.url || ""}
                    fullWidth
                    onChange={formik.handleChange}
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
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="h5" component="h2">Opptaksprosessen</Typography>
              <Grid container className={classes.inputGroup}>
                <Grid item xs>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="application"
                        color="primary"
                        checked={formik.values.application ?? false}
                        onChange={formik.handleChange}
                      />
                    }
                    label={"Søknad"}
                  />
                </Grid>
                <Grid item xs>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="interview"
                        color="primary"
                        checked={formik.values.interview ?? false}
                        onChange={formik.handleChange}
                      />
                    }
                    label={"Intervju"}
                  />
                </Grid>
                <Grid item xs>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="case"
                        color="primary"
                        checked={formik.values.case ?? false}
                        onChange={formik.handleChange}
                      />
                    }
                    label={"Case" }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="row" spacing={1} alignItems="flex-end">
                <Grid item>
                  <Typography variant="h5" component="h2">Beskrivelse</Typography>
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
              <MarkdownForm markdown={formik.values.description} onChange={formik.handleChange("description")} />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Grid container justify="flex-end">
            <Grid item>
              <Button color="primary" variant="contained" type="submit" startIcon={<Save />}>
                Lagre
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </form>
    </Card>
  );
};

export default ListingForm;
