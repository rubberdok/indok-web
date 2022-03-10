import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@material-ui/core";
import React from "react";
import SlotDistribution from "../SlotDistribution";
import { EventDataType } from "../constants";

/**
 * Component for the creating a new event
 */

type Props = {
  eventData: EventDataType;
  onEventDataChange: (data: EventDataType) => void;
  isAttendable: boolean;
  hasSlotDistribution: boolean;
  onHasSlotDistributionChange: (hasSlotDist: boolean) => void;
  slotDistribution: { grades: number[]; availableSlots: number }[];
  onUpdateSlotDistribution: (slotDist: { grades: number[]; availableSlots: number }[]) => void;
};

const SlotDistributionFields: React.FC<Props> = ({
  eventData,
  onEventDataChange,
  isAttendable,
  hasSlotDistribution,
  onHasSlotDistributionChange,
  onUpdateSlotDistribution,
  slotDistribution,
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Accordion
          expanded={hasSlotDistribution}
          onClick={() => onHasSlotDistributionChange(hasSlotDistribution)}
          onChange={() => onHasSlotDistributionChange(!hasSlotDistribution)}
        >
          <AccordionSummary style={{ padding: 0, margin: 0 }}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="select-grade-years-label" shrink>
                    Åpent for
                  </InputLabel>
                  <Select
                    labelId="select-grade-years-label"
                    id="select-grade-years"
                    name="grade-years"
                    value={eventData.allowedGradeYears}
                    multiple
                    onChange={(e) => {
                      onEventDataChange({ ...eventData, allowedGradeYears: e.target.value });
                    }}
                    displayEmpty
                  >
                    {[1, 2, 3, 4, 5].map((year: number) => (
                      <MenuItem key={year} value={year}>
                        {`${year}. klasse`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                        checked={hasSlotDistribution}
                        onChange={(e) => onHasSlotDistributionChange(e.currentTarget.checked)}
                        name="slotDistribution"
                        color="primary"
                        disableRipple
                      />
                    }
                    disabled={!isAttendable}
                    label="Bestemt plassfordeling"
                  />
                </Tooltip>
                <FormHelperText>Sett av et bestemt antall plasser for ulike klassetrinn</FormHelperText>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <SlotDistribution slotDistribution={slotDistribution} onUpdateSlotDistribution={onUpdateSlotDistribution} />
          </AccordionDetails>
        </Accordion>
      </Grid>
    </>
  );
};

export default SlotDistributionFields;
