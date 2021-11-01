import { useMutation, useQuery } from "@apollo/client";
import ErrorDialog from "@components/dialogs/ErrorDialog";
import { UPDATE_BOOKING_SEMESTER } from "@graphql/cabins/mutations";
import { QUERY_BOOKING_SEMESTERS } from "@graphql/cabins/queries";
import { Box, Button, CircularProgress, Grid, Snackbar, TextField, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import dayjs from "dayjs";
import router from "next/router";
import React, { useEffect, useState } from "react";

type BookingSemester = {
  fallStartDate?: string;
  fallEndDate?: string;
  springStartDate?: string;
  springEndDate?: string;
};

const defaultBookingSemester: BookingSemester = {
  fallStartDate: "",
  fallEndDate: "",
  springStartDate: "",
  springEndDate: "",
};

const BookingSemesterPicker = () => {
  const [bookingSemester, setBookingSemester] = useState<BookingSemester>(defaultBookingSemester);
  const [updateBookingSemester] = useMutation<{ semesterData: BookingSemester }>(UPDATE_BOOKING_SEMESTER);
  const handleErrorDialogClose = () => router.push("/");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success");

  const { data, loading, error } = useQuery<{ bookingSemester: BookingSemester }>(QUERY_BOOKING_SEMESTERS);

  useEffect(() => {
    if (data?.bookingSemester) {
      const { fallStartDate, fallEndDate, springStartDate, springEndDate } = data.bookingSemester;
      setBookingSemester({
        fallStartDate: fallStartDate,
        fallEndDate: fallEndDate,
        springStartDate: springStartDate,
        springEndDate: springEndDate,
      });
    }
  }, [data]);

  const validateBookingSemesters = (): boolean => {
    const fallStart = dayjs(bookingSemester.fallStartDate);
    const fallEnd = dayjs(bookingSemester.fallEndDate);
    const springStart = dayjs(bookingSemester.springStartDate);
    const springEnd = dayjs(bookingSemester.springEndDate);
    if (fallStart.isAfter(fallEnd) || springStart.isAfter(springEnd) || fallEnd.isAfter(springStart)) {
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
                <Typography>Høst-semesteret</Typography>
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
            </Grid>

            <Grid item container direction="column" md={6} alignItems="center" spacing={3}>
              <Grid item>
                <Typography>Vår-semesteret</Typography>
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
