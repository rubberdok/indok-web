import { KeyboardArrowLeft, Send } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, Divider, Stack, Typography } from "@mui/material";
import { useState } from "react";

import { CabinFragment } from "@/generated/graphql";
import dayjs from "@/lib/date";

import { useStepContext } from "../StepContext";

import { CabinBookingStatus } from "./CabinStatus";
import { ContactInfo } from "./ContactInfo";
import { Stepper } from "./Stepper";

type Props = {
  chosenCabins: CabinFragment[];
  contactInfo: ContactInfo | undefined;
  startDate: dayjs.Dayjs | undefined;
  endDate: dayjs.Dayjs | undefined;
  onSubmitBooking: () => void;
};

/**
 * One of the steps in the cabins/book page.
 * The page shows the a description of the current booking and a button to confirm the booking.
 */
export const PaymentSite: React.FC<Props> = ({ onSubmitBooking, ...props }) => {
  const [open, setOpen] = useState(false);
  const { previousStep, nextStep } = useStepContext();

  function submitBooking() {
    onSubmitBooking();
    setOpen(false);
    nextStep();
  }

  return (
    <>
      {open && (
        <Dialog open={open}>
          <DialogContent>Er du sikker på at du vil sende denne bookingen?</DialogContent>
          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={() => setOpen(false)}>
              Avbryt
            </Button>
            <Button endIcon={<Send />} onClick={() => submitBooking()} variant="contained">
              Send
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Stack direction="column" justifyContent="center" alignItems="center" divider={<Divider flexItem />} spacing={4}>
        <Typography variant="h3" textAlign="center" gutterBottom>
          Se igjennom og send søknad
        </Typography>
        <Stack>
          <CabinBookingStatus {...props} />
        </Stack>
      </Stack>
      <Stepper
        nextButton={
          <Button variant="outlined" endIcon={<Send />} onClick={() => setOpen(true)}>
            Send
          </Button>
        }
        backButton={
          <Button variant="outlined" startIcon={<KeyboardArrowLeft />} onClick={() => previousStep()}>
            Tilbake
          </Button>
        }
      />
    </>
  );
};
