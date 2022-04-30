import { useMutation, useQuery } from "@apollo/client";
import ContractDialog from "@components/pages/cabins/Popup/ContractDialog";
import StepComponent from "@components/pages/cabins/StepComponent";
import { CREATE_BOOKING, SEND_EMAIL } from "@graphql/cabins/mutations";
import { QUERY_CABINS } from "@graphql/cabins/queries";
import { Cabin, ContactInfo, ContactInfoValidations, DatePick, ModalData } from "@interfaces/cabins";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Container,
  MobileStepper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  styled,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  allValuesFilled,
  cabinOrderStepReady,
  generateEmailAndBookingInput,
  isFormValid,
  validateInputForm,
} from "@utils/cabins";
import React, { useEffect, useState } from "react";
import Layout from "src/layouts";
import { NextPageWithLayout } from "src/pages/_app";

type StepReady = Record<number, { ready: boolean; errortext: string }>;

const steps = ["Book hytte", "Kontaktinfo", "Ekstra info", "Send søknad", "Kvittering"];

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

const RootStyle = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(6, 0),
  [theme.breakpoints.down("md")]: {
    backgroundColor: theme.palette.background.default,
    padding: 0,
  },
}));

/*
Main page for the booking of a cabin. 
The page renders different components depending on the step variale chosen.
*/
const CabinBookingPage: NextPageWithLayout = () => {
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
  const [createBooking] = useMutation(CREATE_BOOKING);
  const [sendEmail] = useMutation(SEND_EMAIL);

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
        sendEmail({
          variables: {
            emailInput: {
              ...generateEmailAndBookingInput(contactInfo, datePick, chosenCabins, extraInfo),
              emailType: "reserve_booking",
            },
          },
        });
        createBooking({
          variables: {
            bookingData: generateEmailAndBookingInput(contactInfo, datePick, chosenCabins, extraInfo),
          },
        });
      }
      setActiveStep((prev) => prev + 1);
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const NextButton = () => (
    <Tooltip
      title={stepReady[activeStep].errortext}
      placement="left"
      disableHoverListener={stepReady[activeStep].ready}
    >
      <Box display={activeStep == 4 ? "none" : "block"}>
        <Button onClick={handleNextClick} disabled={!stepReady[activeStep].ready} size="large" variant="contained">
          {activeStep == 3 ? "Send søknad" : "Neste"}
          <KeyboardArrowRight />
        </Button>
      </Box>
    </Tooltip>
  );

  const BackButton = () => (
    <Box display={activeStep == 4 ? "none" : "block"} sx={{ opacity: activeStep === 0 ? 0 : 1 }}>
      <Button
        size="large"
        onClick={() => setActiveStep((prev) => prev - 1)}
        disabled={activeStep === 0}
        variant="contained"
      >
        <KeyboardArrowLeft />
        Tilbake
      </Button>
    </Box>
  );

  return (
    <RootStyle>
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
        <Stack spacing={{ xs: 3, md: 5 }}>
          <div>
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
          </div>
          {isMobile ? (
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
          ) : (
            <Card>
              <Box sx={{ px: 4, py: 4 }}>
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
              <Stack
                width={1}
                direction="row"
                justifyContent="space-between"
                borderTop="1px solid"
                borderColor="divider"
              >
                <BackButton />
                <NextButton />
              </Stack>
            </Card>
          )}
        </Stack>
        {isMobile && activeStep != 3 ? (
          <MobileStepper
            steps={4}
            position="bottom"
            variant="progress"
            activeStep={activeStep}
            nextButton={<NextButton />}
            backButton={<BackButton />}
            sx={{ boxShadow: theme.shadows[24] }}
          />
        ) : (
          <></>
        )}
      </Container>
    </RootStyle>
  );
};

CabinBookingPage.getLayout = (page: React.ReactElement) => <Layout simpleHeader>{page}</Layout>;

export default CabinBookingPage;
