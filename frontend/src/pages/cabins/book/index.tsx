import { useMutation, useQuery } from "@apollo/client";
import ContractDialog from "@components/pages/cabins/Popup/ContractDialog";
import { QUERY_CABINS } from "@graphql/cabins/queries";
import { Cabin, ContactInfo, ContactInfoValidations, DatePick, ModalData } from "@interfaces/cabins";
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
  Container,
} from "@mui/material";
import {
  allValuesFilled,
  cabinOrderStepReady,
  generateEmailAndBookingInput,
  isFormValid,
  validateInputForm,
} from "@utils/cabins";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { CREATE_BOOKING, SEND_EMAIL } from "@graphql/cabins/mutations";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import Layout from "@components/Layout";
import StepComponent from "@components/pages/cabins/StepComponent";

type StepReady = Record<number, { ready: boolean; errortext: string }>;

const steps = ["Bestill", "Kontaktinfo", "Ekstra info", "Send søknad", "Kvittering"];

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
  receiverEmail: "",
  phone: "",
  internalParticipants: 0,
  externalParticipants: 0,
};

const defaultModalData: ModalData = {
  contractViewed: false,
  displayPopUp: false,
};
/*
Main page for the booking of a cabin. 
The page renders different components depending on the step variale chosen.
*/
const CabinBookingPage: NextPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [stepReady, setStepReady] = useState<StepReady>(initalStepReady);

  // Choose cabin
  const [chosenCabins, setChosenCabins] = useState<Cabin[]>([]);
  const cabinQuery = useQuery<{ cabins: Cabin[] }>(QUERY_CABINS);
  const [modalData, setModalData] = useState<ModalData>(defaultModalData);

  // Check in/Check out
  const [datePick, setDatePick] = useState<DatePick>({});

  // Contact info state
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [validations, setValidations] = useState<ContactInfoValidations>();
  const [errorTrigger, setErrorTrigger] = useState(false);

  // Booking creation and email mutations
  const [create_booking] = useMutation(CREATE_BOOKING);
  const [send_email] = useMutation(SEND_EMAIL);

  // Extra info from the user, sent to Hyttestyret
  const [extraInfo, setExtraInfo] = useState("");

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
      3: { ready: true, errortext: "" },
    });
  }, [contactInfo]);

  const handleNextClick = () => {
    if (activeStep == 2 && !modalData.contractViewed) {
      setModalData({ ...modalData, displayPopUp: true });
    } else {
      if (activeStep == 3) {
        send_email({
          variables: {
            emailInput: {
              ...generateEmailAndBookingInput(contactInfo, datePick, chosenCabins),
              emailType: "reserve_booking",
              extraInfo: extraInfo,
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const getMargin = () => (isMobile ? 2 : 10);

  const NextButton = () => (
    <Tooltip
      title={stepReady[activeStep].errortext}
      placement="left"
      disableHoverListener={stepReady[activeStep].ready}
    >
      <Box display={activeStep == 4 ? "none" : "block"}>
        <Button
          onClick={handleNextClick}
          disabled={!stepReady[activeStep].ready}
          variant={isMobile ? "text" : "contained"}
        >
          {activeStep == 3 ? "Send søknad" : "Neste"}
          <KeyboardArrowRight />
        </Button>
      </Box>
    </Tooltip>
  );

  const BackButton = () => (
    <Box display={activeStep == 4 ? "none" : "block"}>
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
      <Container>
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
          <Grid container direction="column" justifyContent="center" alignItems="stretch" spacing={1}>
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
                <Box p={getMargin()}>
                  <StepComponent
                    cabinQuery={cabinQuery}
                    activeStep={activeStep}
                    chosenCabins={chosenCabins}
                    contactInfo={contactInfo}
                    datePick={datePick}
                    errorTrigger={errorTrigger}
                    validations={validations}
                    setContactInfo={setContactInfo}
                    setChosenCabins={setChosenCabins}
                    setDatePick={setDatePick}
                    setExtraInfo={setExtraInfo}
                  />
                </Box>
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
                <Grid item container justifyContent="space-between">
                  <BackButton />
                  <NextButton />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default CabinBookingPage;
