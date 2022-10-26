import { Box, Divider, Tooltip, Typography } from "@mui/material";
import { TypographyProps } from "@mui/material/Typography";

import { CabinFragment } from "@/generated/graphql";
import { useResponsive } from "@/hooks/useResponsive";
import { ContactInfo, DatePick } from "@/types/cabins";
import { calculatePrice, convertDateFormat, toStringChosenCabins } from "@/utils/cabins";

const InfoText: React.FC<React.PropsWithChildren<TypographyProps>> = (props) => (
  <Typography variant="body2" align="center" component="span" display="block" {...props}>
    {props.children}
  </Typography>
);

type Props = {
  chosenCabins: CabinFragment[];
  datePick: DatePick;
  contactInfo: ContactInfo;
  cabinText?: string;
  mailSent?: boolean;
};

/**
 * Statusbox with information about the current cabin booking.
 * Renders fields based on the props given.
 */
export const CabinBookingStatus: React.FC<React.PropsWithChildren<Props>> = ({
  chosenCabins,
  datePick,
  contactInfo,
  cabinText,
  mailSent,
}) => {
  const isMobile = useResponsive({ query: "down", key: "md" });

  return (
    <Box p={isMobile ? 0 : 3} border={3} borderColor="primary.main">
      {chosenCabins ? (
        <Box m={3}>
          <InfoText>
            {cabinText ?? "Du søker nå om å booke"}{" "}
            <Typography variant="body1" fontWeight={(theme) => theme.typography.fontWeightBold}>
              {toStringChosenCabins(chosenCabins)}
            </Typography>
          </InfoText>
        </Box>
      ) : null}

      <Divider />

      {datePick ? (
        <Box m={3}>
          <InfoText>
            <Typography variant="body1" fontWeight={(theme) => theme.typography.fontWeightBold}>
              Innsjekk:{" "}
            </Typography>
            {datePick.checkInDate !== undefined && convertDateFormat(datePick.checkInDate)}
          </InfoText>
          <InfoText>
            <Typography variant="body1" fontWeight={(theme) => theme.typography.fontWeightBold}>
              Utsjekk:{" "}
            </Typography>
            {datePick.checkOutDate !== undefined && convertDateFormat(datePick.checkOutDate)}
          </InfoText>
        </Box>
      ) : null}

      <Divider />

      {contactInfo ? (
        <Box m={3}>
          <InfoText>
            <Typography variant="body1" fontWeight={(theme) => theme.typography.fontWeightBold}>
              Gjester:{" "}
            </Typography>
            {contactInfo.internalParticipants > 0 ? `${contactInfo.internalParticipants} indøkere` : null}
            {contactInfo.internalParticipants > 0 && contactInfo.externalParticipants > 0 ? ", " : null}
            {contactInfo.externalParticipants > 0 ? `${contactInfo.externalParticipants} eksterne` : null}
          </InfoText>
          <InfoText>
            <Typography variant="body1" fontWeight={(theme) => theme.typography.fontWeightBold}>
              Pris:{" "}
            </Typography>
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
