import { Cabin, ContactInfo, DatePick } from "@interfaces/cabins";
import { Box, Divider, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { TypographyProps } from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import { calculatePrice, convertDateFormat, toStringChosenCabins } from "@utils/cabins";
import { NextPage } from "next";

interface Props {
  chosenCabins: Cabin[];
  datePick: DatePick;
  contactInfo: ContactInfo;
  cabinText?: string;
  mailSent?: boolean;
}

const useStyles = makeStyles({
  bold: {
    fontWeight: 800,
    display: "inline",
  },
});

const InfoText: React.FC<TypographyProps> = (props) => (
  <Typography variant="body2" align="center" component="span" display="block" {...props}>
    {props.children}
  </Typography>
);

/*
Statusbox with information about the current cabin booking.
Renders fields based on the props given.
*/
const CabinBookingStatus: NextPage<Props> = ({ chosenCabins, datePick, contactInfo, cabinText, mailSent }) => {
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box p={isMobile ? 0 : 3} border={3} borderColor="primary.main">
      {chosenCabins ? (
        <Box m={3}>
          <InfoText>
            {cabinText ?? "Du søker nå om å booke"}{" "}
            <Box className={classes.bold}>{toStringChosenCabins(chosenCabins)}</Box>
          </InfoText>
        </Box>
      ) : null}

      <Divider />

      {datePick ? (
        <Box m={3}>
          <InfoText>
            <Box className={classes.bold}>Innsjekk: </Box>
            {datePick.checkInDate !== undefined && convertDateFormat(datePick.checkInDate)}
          </InfoText>
          <InfoText>
            <Box className={classes.bold}>Utsjekk: </Box>
            {datePick.checkOutDate !== undefined && convertDateFormat(datePick.checkOutDate)}
          </InfoText>
        </Box>
      ) : null}

      <Divider />

      {contactInfo ? (
        <Box m={3}>
          <InfoText>
            <Box className={classes.bold}>Gjester: </Box>
            {contactInfo.internalParticipants > 0 ? `${contactInfo.internalParticipants} indøkere` : null}
            {contactInfo.internalParticipants > 0 && contactInfo.externalParticipants > 0 ? ", " : null}
            {contactInfo.externalParticipants > 0 ? `${contactInfo.externalParticipants} eksterne` : null}
          </InfoText>
          <InfoText>
            <Box className={classes.bold}>Pris: </Box>
            <Tooltip
              title={
                contactInfo.internalParticipants >= contactInfo.externalParticipants
                  ? "Du har fått internpris da det er flest indøkere med"
                  : "Du har fått eksternpris da det er for få indøkere med"
              }
              placement="right"
            >
              <Box display="inline">{calculatePrice(chosenCabins, contactInfo, datePick)} kr</Box>
            </Tooltip>
          </InfoText>
        </Box>
      ) : null}

      <Divider />

      {mailSent ? (
        <InfoText>
          <Box>
            <Typography variant={isMobile ? "body2" : "body1"}>
              Vi har sendt en mail til {contactInfo.receiverEmail} med informasjon om søknaden.
            </Typography>
          </Box>
        </InfoText>
      ) : null}
    </Box>
  );
};

export default CabinBookingStatus;
