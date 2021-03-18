import { useQuery } from "@apollo/client";
import Navbar from "@components/navbar/Navbar";
import CabinAvailability from "@components/pages/cabins/CabinAvailability";
import CabinContactInfo from "@components/pages/cabins/CabinContactInfo";
import CabinDatePicker from "@components/pages/cabins/CabinDatePicker";
import ContractDialog from "@components/pages/cabins/Popup/ContractDialog";
import { QUERY_CABINS } from "@graphql/cabins/queries";
import { Cabin, ContactInfo, Validations } from "@interfaces/cabins";
import { Box, Grid, Step, StepLabel, Stepper, Button, Typography, Paper, Tooltip } from "@material-ui/core";
import { isFormValid, validateInputForm } from "@utils/helpers";
import dayjs from "dayjs";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";

interface StepReady {
  [step: number]: { ready: boolean; stepName: string; errortext: string };
}
export interface DatePick {
  checkInDate?: string;
  checkOutDate?: string;
}

export interface ModalData {
  contractViewed: boolean;
  displayPopUp: boolean;
}

const steps = ["Velg hytte", "Innsjekk/Utsjekk", "Kontaktinfo", "Betaling", "Kvittering"];

const initalStepReady: StepReady = steps.reduce((initialObject, step, index) => {
  initialObject[index] = {
    stepName: step,
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
  const [validations, setValidations] = useState<Validations>();

  useEffect(() => {
    // Cannot go to next step if no cabin is chosen

    setValidations(validateInputForm(contactInfo)); // could be moved to a separate useEffect reliying on contactInfo change?

    setStepReady({
      ...stepReady,
      0: { ...stepReady[0], ready: chosenCabins.length > 0, errortext: "Du må velge en hytte for å gå videre" },
      1: {
        ...stepReady[1],
        ready:
          datePick.checkInDate && datePick.checkOutDate
            ? dayjs(datePick.checkInDate).isBefore(dayjs(datePick.checkOutDate))
            : false,
        errortext: "Du må velge innsjekk og utsjekk dato for å gå videre. Innsjekk må være før utsjekk.",
      },
      2: { ...stepReady[2], ready: isFormValid(contactInfo), errortext: "Du må fylle ut alle felt for å gå videre" },
    });
  }, [chosenCabins, datePick, contactInfo]);

  const getStepComponent = () => {
    switch (activeStep) {
      case 0:
        // Velg hytte
        return cabinQuery.data ? (
          <CabinAvailability
            allCabins={cabinQuery.data.cabins}
            chosenCabins={chosenCabins}
            setChosenCabins={setChosenCabins}
            datePick={datePick}
            setDatePick={setDatePick}
          />
        ) : null;
      case 1:
        // Velg innsjekk
        return <CabinDatePicker chosenCabins={chosenCabins} datePick={datePick} setDatePick={setDatePick} />;
      case 2:
        // Velg Kontaktinfo
        return <CabinContactInfo contactInfo={contactInfo} setContactInfo={setContactInfo} validations={validations} />;
      case 3:
        // Betaling
        return <Typography variant="h3">Betaling placeholder</Typography>;
      case 4:
        // Kvittering
        return <Typography variant="h3">Kvittering placeholder</Typography>;
      default:
        <Typography>Step not found</Typography>;
    }
  };

  const handleNextClick = () => {
    if (activeStep == 2 && !modalData.contractViewed) {
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
