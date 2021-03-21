import { useQuery } from "@apollo/client";
import Navbar from "@components/navbar/Navbar";
import CabinAvailability from "@components/pages/cabins/CabinAvailability";
import CabinContactInfo from "@components/pages/cabins/CabinContactInfo";
import ContractDialog from "@components/pages/cabins/Popup/ContractDialog";
import { QUERY_CABINS } from "@graphql/cabins/queries";
import { Cabin, ContactInfo, ContactInfoValidations } from "@interfaces/cabins";
import { Box, Grid, Step, StepLabel, Stepper, Button, Typography, Paper, Tooltip } from "@material-ui/core";
import { cabinOrderStepReady } from "@utils/cabins";
import { isFormValid, validateInputForm } from "@utils/helpers";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";

interface StepReady {
  [step: number]: { ready: boolean; errortext: string };
}
export interface DatePick {
  checkInDate?: string;
  checkOutDate?: string;
  isValid?: boolean;
}

export interface ModalData {
  contractViewed: boolean;
  displayPopUp: boolean;
}

const steps = ["Bestill", "Kontaktinfo", "Betaling", "Kvittering"];

const initalStepReady: StepReady = steps.reduce((initialObject, _step, index) => {
  initialObject[index] = {
    ready: false,
    errortext: "",
  };
  return initialObject;
}, {} as StepReady);

const defaultContactInfo: ContactInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  numberIndok: 0,
  numberExternal: 0,
};

const defaultModalData: ModalData = {
  contractViewed: false,
  displayPopUp: false,
};

const CabinBookingPage: NextPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [stepReady, setStepReady] = useState<StepReady>(initalStepReady);

  // Velg Hytte
  const [chosenCabins, setChosenCabins] = useState<Cabin[]>([]);
  const cabinQuery = useQuery<{ cabins: Cabin[] }>(QUERY_CABINS);
  const [modalData, setModalData] = useState<ModalData>(defaultModalData);

  // Innsjekk/Utsjekk
  const [datePick, setDatePick] = useState<DatePick>({});

  // Contact info state
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [validations, setValidations] = useState<ContactInfoValidations>();

  useEffect(() => {
    setStepReady({
      ...stepReady,
      0: cabinOrderStepReady(chosenCabins, datePick),
    });
  }, [chosenCabins, datePick]);

  useEffect(() => {
    setValidations(validateInputForm(contactInfo));
    setStepReady({
      ...stepReady,
      1: { ready: isFormValid(contactInfo), errortext: "Du må fylle ut alle felt for å gå videre" },
    });
  }, [contactInfo]);

  const getStepComponent = () => {
    switch (activeStep) {
      case 0:
        // Velg hytte
        return cabinQuery.data ? (
          <CabinAvailability
            allCabins={cabinQuery.data.cabins}
            chosenCabins={chosenCabins}
            setChosenCabins={setChosenCabins}
            setDatePick={setDatePick}
          />
        ) : null;
      case 1:
        // Velg Kontaktinfo
        return <CabinContactInfo contactInfo={contactInfo} setContactInfo={setContactInfo} validations={validations} />;
      case 2:
        // Betaling
        return <Typography variant="h3">Betaling placeholder</Typography>;
        2222222;
      case 3:
        // Kvittering
        return <Typography variant="h3">Kvittering placeholder</Typography>;
      default:
        <Typography>Step not found</Typography>;
    }
  };

  const handleNextClick = () => {
    if (activeStep == 1 && !modalData.contractViewed) {
      setModalData({ ...modalData, displayPopUp: true });
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  return (
    <>
      <Navbar />
      <ContractDialog
        modalData={modalData}
        setModalData={setModalData}
        chosenCabins={chosenCabins}
        datePick={datePick}
        contactInfo={contactInfo}
      />
      <Box m={10}>
        <Grid container direction="column" justify="center" spacing={1}>
          <Grid item>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
          <Grid item>
            <Paper>
              <Box p={10}>{getStepComponent()}</Box>
            </Paper>
          </Grid>
          <Grid item container justify="space-between">
            <Button variant="contained" disabled={activeStep === 0} onClick={() => setActiveStep((prev) => prev - 1)}>
              Forrige
            </Button>
            <Tooltip
              title={stepReady[activeStep].errortext}
              placement="left"
              disableHoverListener={stepReady[activeStep].ready}
            >
              <Box>
                <Button variant="contained" disabled={!stepReady[activeStep].ready} onClick={() => handleNextClick()}>
                  Neste
                </Button>
              </Box>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CabinBookingPage;
