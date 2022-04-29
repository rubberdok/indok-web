import { useMutation } from "@apollo/client";
import ErrorDialog from "@components/dialogs/ErrorDialog";
import { UPDATE_BOOKING_SEMESTER } from "@graphql/cabins/mutations";

import useBookingSemester from "@hooks/cabins/useBookingSemester";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { Alert } from "@mui/material";
import dayjs from "dayjs";
import router from "next/router";
import { useState } from "react";

export type BookingSemester = {
  fallStartDate: string;
  fallEndDate: string;
  springStartDate: string;
  springEndDate: string;
  fallSemesterActive: boolean;
  springSemesterActive: boolean;
};

const BookingSemesterPicker: React.VFC = () => {
  const [updateBookingSemester] = useMutation<{ semesterData: BookingSemester }>(UPDATE_BOOKING_SEMESTER);
  const handleErrorDialogClose = () => router.push("/");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success");

  const { bookingSemester, setBookingSemester, loading, error } = useBookingSemester();

  const validateBookingSemesters = (): boolean => {
    const fallStart = dayjs(bookingSemester.fallStartDate);
    const fallEnd = dayjs(bookingSemester.fallEndDate);
    const springStart = dayjs(bookingSemester.springStartDate);
    const springEnd = dayjs(bookingSemester.springEndDate);

    if (fallStart.isAfter(fallEnd) || springStart.isAfter(springEnd)) {
      setSnackbarMessage("Start-datoer kan ikke vært før slutt-datoer.");
      setOpenSnackbar(true);
      setAlertSeverity("error");
      return false;
    }
    return true;
  };

  const handleUpdate = () => {
    if (validateBookingSemesters()) {
      updateBookingSemester({ variables: { semesterData: { ...bookingSemester } } }).then(() => {
        setAlertSeverity("success");
        setSnackbarMessage("Booking-semestrene er nå oppdatert.");
        setOpenSnackbar(true);
      });
    }
  };

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <ErrorDialog error={error} handleErrorDialogClose={handleErrorDialogClose} />
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
            <Alert severity={alertSeverity}>{snackbarMessage}</Alert>
          </Snackbar>
          <Grid container spacing={6} direction="row">
            <Grid item container direction="column" md={6} alignItems="center" spacing={3}>
              <Grid item>
                <Typography>Høst-semester</Typography>
              </Grid>
              <Grid item>
                <TextField
                  label="Start"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={bookingSemester?.fallStartDate}
                  onChange={(e) => setBookingSemester({ ...bookingSemester, fallStartDate: e.target.value })}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Slutt"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={bookingSemester?.fallEndDate}
                  onChange={(e) => setBookingSemester({ ...bookingSemester, fallEndDate: e.target.value })}
                />
              </Grid>
              <Grid item>
                <Tooltip title="Her kan du velge om booking på høst-semesteret skal være åpen eller ikke.">
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={bookingSemester.fallSemesterActive}
                        onChange={(e) =>
                          setBookingSemester({ ...bookingSemester, fallSemesterActive: e.target.checked })
                        }
                      />
                    }
                    label="Aktiv"
                  />
                </Tooltip>
              </Grid>
            </Grid>

            <Grid item container direction="column" md={6} alignItems="center" spacing={3}>
              <Grid item>
                <Typography>Vår-semester</Typography>
              </Grid>
              <Grid item>
                <TextField
                  label="Start"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={bookingSemester?.springStartDate}
                  onChange={(e) => setBookingSemester({ ...bookingSemester, springStartDate: e.target.value })}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Slutt"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={bookingSemester?.springEndDate}
                  onChange={(e) => setBookingSemester({ ...bookingSemester, springEndDate: e.target.value })}
                />
              </Grid>
              <Grid item>
                <Tooltip title="Her kan du velge om booking på vår-semesteret skal være åpen eller ikke.">
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={bookingSemester.springSemesterActive}
                        onChange={(e) =>
                          setBookingSemester({ ...bookingSemester, springSemesterActive: e.target.checked })
                        }
                      />
                    }
                    label="Aktiv"
                  />
                </Tooltip>
              </Grid>
            </Grid>
            <Grid item>
              <Button onClick={handleUpdate} variant="contained">
                Lagre
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default BookingSemesterPicker;
