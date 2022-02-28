import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import TabPanel from "@components/pages/about/TabPanel";
import AdminCabinTable from "@components/pages/cabins/Admin/AdminCabinTable";
import DeleteBookingDialog from "@components/pages/cabins/Admin/DeleteBookingDialog";
import PermissionRequired from "@components/permissions/PermissionRequired";
import { QUERY_ADMIN_ALL_BOOKINGS } from "@graphql/cabins/queries";
import { BookingFromQuery } from "@interfaces/cabins";
import {
  Box,
  Button,
  Container,
  Grid,
  makeStyles,
  Snackbar,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import dayjs from "dayjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Settings from "@material-ui/icons/Settings";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    overflowX: "auto",
    marginBottom: theme.spacing(4),
  },
}));

/*
Page for booking admininistration showing all upcoming bookings and buttons for actions on these bookings.
*/
const AdminPage: NextPage = () => {
  const theme = useTheme();
  const { data, refetch } = useQuery<{
    adminAllBookings: BookingFromQuery[];
  }>(QUERY_ADMIN_ALL_BOOKINGS, { variables: { after: dayjs().subtract(1, "day").format("YYYY-MM-DD") } });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [bookingToBeDeleted, setBookingToBeDeleted] = useState<BookingFromQuery | undefined>();
  const [accepted, setAccepted] = useState<BookingFromQuery[]>();
  const [declined, setDeclined] = useState<BookingFromQuery[]>();
  const [tentative, setTentative] = useState<BookingFromQuery[]>();
  const [tabValue, setTabValue] = useState<number>(0);
  const router = useRouter();

  const handleTabChange = (newTabValue: number) => setTabValue(newTabValue);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();

  useEffect(() => {
    if (data?.adminAllBookings) {
      setAccepted(data.adminAllBookings.filter((booking) => !booking.isTentative && !booking.isDeclined));
      setDeclined(data.adminAllBookings.filter((booking) => !booking.isTentative && booking.isDeclined));
      setTentative(data.adminAllBookings.filter((booking) => booking.isTentative));
    }
  }, [data]);

  return (
    <Layout>
      <Container>
        <PermissionRequired permission="cabins.manage_booking">
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
            <Alert severity="success">{snackbarMessage}</Alert>
          </Snackbar>
          <DeleteBookingDialog
            bookingToBeDeleted={bookingToBeDeleted}
            setBookingToBeDeleted={setBookingToBeDeleted}
            setSnackbarMessage={setSnackbarMessage}
            setOpenSnackbar={setOpenSnackbar}
            refetch={refetch}
          />
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Box p={3}>
                <Typography variant={isMobile ? "h3" : "h1"} align="center">
                  Booking adminside
                </Typography>
                <Button startIcon={<Settings />} onClick={() => router.push("admin/settings")}>
                  Innstillinger
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Box className={classes.root} marginBottom={5} component="div">
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  onChange={(_e, newValue) => handleTabChange(newValue)}
                  value={tabValue}
                  indicatorColor="primary"
                  variant="fullWidth"
                >
                  <Tab label="Nye søknader" />
                  <Tab label="Godkjente søknader" />
                  <Tab label="Underkjente søknader" />
                </Tabs>
              </Box>
              <TabPanel value={tabValue} index={0}>
                <AdminCabinTable
                  bookings={tentative}
                  setBookingToBeDeleted={setBookingToBeDeleted}
                  setOpenSnackbar={setOpenSnackbar}
                  setSnackbarMessage={setSnackbarMessage}
                  refetch={refetch}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <AdminCabinTable bookings={accepted} />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <AdminCabinTable bookings={declined} />
              </TabPanel>
            </Box>
          </Box>
        </PermissionRequired>
      </Container>
    </Layout>
  );
};

export default AdminPage;
