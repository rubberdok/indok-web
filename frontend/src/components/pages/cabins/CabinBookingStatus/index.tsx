import { NextPage, NextComponentType } from "next";
import { makeStyles, Theme, Typography, Box, Divider, Tooltip } from "@material-ui/core";
import { Cabin, ContactInfo } from "@interfaces/cabins";
import { DatePick } from "src/pages/cabins/book";
import dayjs from "dayjs";
import { ReactNode } from "react";
import { TypographyProps } from "@material-ui/core/Typography";
import { toStringChosenCabins } from "@utils/cabins";

interface Props {
  chosenCabins: Cabin[];
  datePick: DatePick;
  contactInfo: ContactInfo;
  cabinText?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  bold: {
    fontWeight: theme.typography.fontWeightBold,
    display: "inline",
  },
}));

const InfoText: NextComponentType<TypographyProps> = (props) => (
  <Typography variant="body2" align="center" component="span" display="block" {...props}>
    {props.children}
  </Typography>
);

const convertDateFormat = (date: string) => dayjs(date).format("DD-MM-YYYY");

const CabinBookingStatus: NextPage<Props> = ({ chosenCabins, datePick, contactInfo, cabinText }) => {
  const classes = useStyles();

  const infos: { info: Cabin[] | DatePick | ContactInfo; renderComponent: ReactNode }[] = [
    {
      info: chosenCabins,
      renderComponent: (
        <InfoText>
          {cabinText ?? "Du booker nå"} <Box className={classes.bold}>{toStringChosenCabins(chosenCabins)}</Box>
        </InfoText>
      ),
    },
    {
      info: datePick,
      renderComponent: (
        <>
          <InfoText>
            <Box className={classes.bold}>Innsjekk: </Box>
            {datePick.checkInDate !== undefined && convertDateFormat(datePick.checkInDate)}
          </InfoText>
          <InfoText>
            <Box className={classes.bold}>Utsjekk: </Box>
            {datePick.checkOutDate !== undefined && convertDateFormat(datePick.checkOutDate)}
          </InfoText>
        </>
      ),
    },
    {
      info: contactInfo,
      renderComponent: (
        <>
          <InfoText>
            <Box className={classes.bold}>Gjester: </Box>
            {contactInfo.numberIndok > 0 ? `${contactInfo.numberIndok} indøkere` : null}
            {contactInfo.numberIndok > 0 && contactInfo.numberExternal > 0 ? ", " : null}
            {contactInfo.numberExternal > 0 ? `${contactInfo.numberExternal} eksterne` : null}
          </InfoText>
          <InfoText>
            <Box className={classes.bold}>Pris: </Box>
            <Tooltip
              title={
                contactInfo.numberIndok >= contactInfo.numberExternal
                  ? "Du har fått internpris da det er flest indøkere med"
                  : "Du har fått eksternpris da det er for få indøkere med"
              }
              placement="right"
            >
              <Box display="inline">20000</Box>
            </Tooltip>
          </InfoText>
        </>
      ),
    },
  ];
  return (
    <Box p={3} border={3} borderColor="primary.main">
      {infos
        .filter((info) => info.info !== undefined)
        .map((info, index) => (
          <Box key={index}>
            <Box p={3}>{info.renderComponent}</Box>
            <Divider />
          </Box>
        ))}
    </Box>
  );
};

export default CabinBookingStatus;
