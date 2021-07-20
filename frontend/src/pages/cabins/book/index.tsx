import { useMutation, useQuery } from "@apollo/client";
import CheckInOut from "@components/pages/cabins/CheckInOut";
import CabinContactInfo from "@components/pages/cabins/CabinContactInfo";
import ContractDialog from "@components/pages/cabins/Popup/ContractDialog";
import { QUERY_CABINS } from "@graphql/cabins/queries";
import { Cabin, ContactInfo, ContactInfoValidations } from "@interfaces/cabins";
import {
  Box,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Button,
  Typography,
  Paper,
  Tooltip,
  useTheme,
  useMediaQuery,
  MobileStepper,
} from "@material-ui/core";
import {
  allValuesFilled,
  cabinOrderStepReady,
  generateEmailAndBookingInput,
  isFormValid,
  validateInputForm,
} from "@utils/cabins";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import PaymentSite from "@components/pages/cabins/PaymentSite";
import ReceiptSite from "@components/pages/cabins/ReceiptSite";
import { CREATE_BOOKING, SEND_EMAIL } from "@graphql/cabins/mutations";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import Layout from "@components/Layout";

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
  firstname: "",
  lastname: "",
  receiverEmail: "",
  phone: "",
  internalParticipants: 0,
  externalParticipants: 0,
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
  const [errorTrigger, setErrorTrigger] = useState(false);

  // Booking creation and email mutations
  const [create_booking] = useMutation(CREATE_BOOKING);
  const [send_email] = useMutation(SEND_EMAIL);

  useEffect(() => {
    setStepReady({
      ...stepReady,
      0: cabinOrderStepReady(chosenCabins, datePick),
    });
  }, [chosenCabins, datePick]);

  useEffect(() => {
    setValidations(validateInputForm(contactInfo));
    if (allValuesFilled(contactInfo)) {
      setErrorTrigger(true);
    }
    setStepReady({
      ...stepReady,
      1: { ready: isFormValid(contactInfo), errortext: "Du må fylle ut alle felt for å gå videre" },
      2: { ready: true, errortext: "" },
    });
  }, [contactInfo]);

  const getStepComponent = () => {
    switch (activeStep) {
      case 0:
        // Velg hytte
        return cabinQuery.data ? (
          <CheckInOut
            allCabins={cabinQuery.data.cabins}
            chosenCabins={chosenCabins}
            setChosenCabins={setChosenCabins}
            setDatePick={setDatePick}
          />
        ) : null;
      case 1:
        // Velg Kontaktinfo
        return (
          <CabinContactInfo
            contactInfo={contactInfo}
            setContactInfo={setContactInfo}
            validations={validations}
            errorTrigger={errorTrigger}
            chosenCabins={chosenCabins}
          />
        );
      case 2:
        // Betaling
        return <PaymentSite chosenCabins={chosenCabins} datePick={datePick} contactInfo={contactInfo} />;
      case 3:
        // Kvittering
        return <ReceiptSite chosenCabins={chosenCabins} datePick={datePick} contactInfo={contactInfo} mailSent />;

      default:
        <Typography>Step not found</Typography>;
    }
  };

  const handleNextClick = () => {
    if (activeStep == 1 && !modalData.contractViewed) {
      setModalData({ ...modalData, displayPopUp: true });
    } else {
      if (activeStep == 2) {
        send_email({
          variables: {
            emailInput: {
              ...generateEmailAndBookingInput(contactInfo, datePick, chosenCabins),
              emailType: "reserve_booking",
            },
          },
        });
        create_booking({
          variables: {
            bookingData: generateEmailAndBookingInput(contactInfo, datePick, chosenCabins),
          },
        });
      }
      setActiveStep((prev) => prev + 1);
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const getMargin = () => (isMobile ? 2 : 10);

  const NextButton = () => (
    <Tooltip
      title={stepReady[activeStep].errortext}
      placement="left"
      disableHoverListener={stepReady[activeStep].ready}
    >
      <Box display={activeStep == 3 ? "none" : "block"}>
        <Button
          onClick={handleNextClick}
          disabled={!stepReady[activeStep].ready}
          variant={isMobile ? "text" : "contained"}
        >
          {activeStep == 2 ? "Send søknad" : "Neste"}
          <KeyboardArrowRight />
        </Button>
      </Box>
    </Tooltip>
  );

  const BackButton = () => (
    <Box display={activeStep == 3 ? "none" : "block"}>
      <Button
        onClick={() => setActiveStep((prev) => prev - 1)}
        disabled={activeStep === 0}
        variant={isMobile ? "text" : "contained"}
      >
        <KeyboardArrowLeft />
        Tilbake
      </Button>
    </Box>
  );

  return (
    <Layout>
      <ContractDialog
        modalData={modalData}
        setModalData={setModalData}
        chosenCabins={chosenCabins}
        datePick={datePick}
        contactInfo={contactInfo}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />
      <Box m={getMargin()}>
        <Grid container direction="column" justify="center" alignItems="stretch" spacing={1}>
          <Grid item>
            {isMobile ? (
              <Typography variant="h4" align="center">
                {steps[activeStep]}
              </Typography>
            ) : (
              <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}
          </Grid>
          <Grid item>
            <Paper>
              <Box p={getMargin()}>{getStepComponent()}</Box>
            </Paper>
          </Grid>
          <Grid item>
            {isMobile && activeStep != 3 ? (
              <MobileStepper
                steps={4}
                position="bottom"
                variant="progress"
                activeStep={activeStep}
                nextButton={<NextButton />}
                backButton={<BackButton />}
              />
            ) : (
              <Grid item container justify="space-between">
                <BackButton />
                <NextButton />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default CabinBookingPage;
