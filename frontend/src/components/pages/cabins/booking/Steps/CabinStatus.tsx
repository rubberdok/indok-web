import { Box, Divider, Tooltip, Typography } from "@mui/material";
import { TypographyProps } from "@mui/material/Typography";

import { CabinFragment } from "@/generated/graphql";
import dayjs from "@/lib/date";

import { calculatePrice } from "./calculatePrice";
import { ContactInfo } from "./ContactInfo";

const InfoText: React.FC<React.PropsWithChildren<TypographyProps>> = (props) => (
  <Typography variant="body2" align="center" component="span" display="block" {...props}>
    {props.children}
  </Typography>
);

type Props = {
  chosenCabins: CabinFragment[];
  contactInfo: ContactInfo | undefined;
  cabinText?: string;
  mailSent?: boolean;
  startDate: dayjs.Dayjs | undefined;
  endDate: dayjs.Dayjs | undefined;
};

/**
 * Statusbox with information about the current cabin booking.
 * Renders fields based on the props given.
 */
export const CabinBookingStatus: React.FC<Props> = ({
  chosenCabins,
  startDate,
  endDate,
  contactInfo,
  cabinText,
  mailSent,
}) => {
  return (
    <Box p={{ xs: 0, md: 3 }} border={3} borderColor="primary.main">
      {chosenCabins && (
        <Box m={3}>
          <InfoText>
            {cabinText ?? "Du søker nå om å booke"}{" "}
            <Typography variant="body1" fontWeight={(theme) => theme.typography.fontWeightBold}>
              {chosenCabins.map((cabin) => cabin.name).join(", ")}
            </Typography>
          </InfoText>
        </Box>
      )}

      <Divider />

      <Box m={3}>
        <InfoText>
          <strong>Innsjekk:</strong> {startDate?.format("LL") ?? "Ikke valgt"}
        </InfoText>
        <InfoText>
          <strong>Utsjekk:</strong> {endDate?.format("LL") ?? "Ikke valgt"}
        </InfoText>
      </Box>

      <Divider />

      {contactInfo && (
        <Box m={3}>
          <InfoText>
            <Typography variant="body1" fontWeight={(theme) => theme.typography.fontWeightBold}>
              Gjester:{" "}
            </Typography>
            {contactInfo.internalParticipants > 0 ? `${contactInfo.internalParticipants} indøkere` : null}
            {contactInfo.internalParticipants > 0 &&
            (contactInfo.externalStudentParticipants > 0 || contactInfo.externalParticipants > 0)
              ? ", "
              : null}
            {contactInfo.externalStudentParticipants > 0
              ? `${contactInfo.externalStudentParticipants} eksterne (studenter)`
              : null}
            {contactInfo.externalStudentParticipants > 0 && contactInfo.externalParticipants > 0 ? ", " : null}
            {contactInfo.externalParticipants > 0 ? `${contactInfo.externalParticipants} eksterne` : null}
          </InfoText>
          <InfoText>
            <Typography variant="body1" fontWeight={(theme) => theme.typography.fontWeightBold}>
              Pris:{" "}
            </Typography>
            <Tooltip
              title={
                contactInfo.internalParticipants >=
                contactInfo.externalParticipants + contactInfo.externalStudentParticipants
                  ? "Du har fått internpris da det er flest indøkere med"
                  : "Du har fått eksternpris da det er for få indøkere med"
              }
              placement="right"
            >
              <Box display="inline">{calculatePrice(chosenCabins, contactInfo, startDate, endDate)} kr</Box>
            </Tooltip>
          </InfoText>
        </Box>
      )}

      <Divider />

      {mailSent && (
        <InfoText>
          <Box>
            <Typography variant="body1">
              Vi har sendt en mail til {contactInfo?.receiverEmail} med informasjon om søknaden.
            </Typography>
          </Box>
        </InfoText>
      )}
    </Box>
  );
};
