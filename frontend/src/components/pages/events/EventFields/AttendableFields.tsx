import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React from "react";

/**
 * Component for filling in attendable fields on an event (optional fields in general, but required given isAttenable true)
 */

type Props = {
  eventData: Record<string, any>;
  onEventDataChange: (data: Record<string, any>) => void;
  isAttendable: boolean;
  onIsAttendableChange: (isAttendable: boolean) => void;
};

const AttendableFields: React.FC<Props> = ({ eventData, onEventDataChange, isAttendable, onIsAttendableChange }) => {
  return (
    <>
      <Grid item xs={12} style={{ paddingBottom: 0, marginBottom: -10 }}>
        <Typography variant="h4">Frivillige felt</Typography>
      </Grid>

      <Grid item xs={12}>
        <Accordion expanded={isAttendable} onChange={() => onIsAttendableChange(!isAttendable)}>
          <AccordionSummary style={{ paddingLeft: 0, marginLeft: 0 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAttendable}
                  onChange={(e) => onIsAttendableChange(e.currentTarget.checked)}
                  name="isAttendable"
                  color="primary"
                  disableRipple
                />
              }
              label="Krever påmelding"
            />
          </AccordionSummary>
          <AccordionDetails style={{ paddingLeft: 0 }}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <InputLabel>Påmelding åpner</InputLabel>
                <Tooltip
                  disableHoverListener={isAttendable}
                  disableFocusListener={isAttendable}
                  title="Kun aktuelt ved påmelding"
                >
                  <TextField
                    type="datetime-local"
                    value={eventData.signupOpenDate}
                    onChange={(e) => onEventDataChange({ ...eventData, signupOpenDate: e.currentTarget.value })}
                    disabled={!isAttendable}
                  />
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Påmeldingsfrist</InputLabel>
                <Tooltip
                  disableHoverListener={isAttendable}
                  disableFocusListener={isAttendable}
                  title="Kun aktuelt ved påmelding"
                >
                  <TextField
                    type="datetime-local"
                    value={eventData.deadline}
                    onChange={(e) => onEventDataChange({ ...eventData, deadline: e.currentTarget.value })}
                    disabled={!isAttendable}
                  />
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Pris</InputLabel>
                <Tooltip title="Kommer snart!">
                  <TextField
                    type="number"
                    // value={eventData.price}
                    // onChange={(e) => setEventData({ ...eventData, price: e.currentTarget.value })}
                    margin={"dense"}
                    disabled
                  />
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Antall plasser</InputLabel>
                <Tooltip
                  disableHoverListener={isAttendable}
                  disableFocusListener={isAttendable}
                  title="Kun aktuelt ved påmelding"
                >
                  <TextField
                    type="number"
                    value={eventData.availableSlots}
                    onChange={(e) => onEventDataChange({ ...eventData, availableSlots: e.currentTarget.value })}
                    disabled={!isAttendable}
                  />
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <Tooltip
                  disableHoverListener={isAttendable}
                  disableFocusListener={isAttendable}
                  title="Kun aktuelt ved påmelding"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={eventData.bindingSignup}
                        onChange={(e) => onEventDataChange({ ...eventData, bindingSignup: e.currentTarget.checked })}
                        name="bindingSignup"
                        color="primary"
                        disableRipple
                      />
                    }
                    disabled={!isAttendable}
                    label="Bindende påmelding"
                  />
                </Tooltip>
                <FormHelperText>Gjør det umulig å melde seg av (kan fortsatt melde av venteliste)</FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Tooltip
                  disableHoverListener={isAttendable}
                  disableFocusListener={isAttendable}
                  title="Kun aktuelt ved påmelding"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={eventData.hasExtraInformation}
                        onChange={(e) =>
                          onEventDataChange({ ...eventData, hasExtraInformation: e.currentTarget.checked })
                        }
                        name="hasExtraInformation"
                        color="primary"
                        disableRipple
                      />
                    }
                    disabled={!isAttendable}
                    label="Utfylling av ekstrainformasjon"
                  />
                </Tooltip>
                <FormHelperText>Krev utfylling av en boks med ekstrainformasjon for påmelding</FormHelperText>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </>
  );
};

export default AttendableFields;
