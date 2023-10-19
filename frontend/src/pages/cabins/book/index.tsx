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
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { ContractDialog } from "@/components/pages/cabins/Popup/ContractDialog";
import { StepComponent } from "@/components/pages/cabins/StepComponent";
import { CabinFragment, CabinsDocument, CreateBookingDocument, SendEmailDocument } from "@/generated/graphql";
import { useResponsive } from "@/hooks/useResponsive";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";
import { ContactInfo, ContactInfoValidations, DatePick, ModalData } from "@/types/cabins";
import {
  allValuesFilled,
  cabinOrderStepReady,
  generateEmailAndBookingInput,
  isFormValid,
  validateInputForm,
} from "@/utils/cabins";

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

/**
 * Main page for the booking of a cabin.
 * The page renders different components depending on the step variable chosen.
 */
const CabinBookingPage: NextPageWithLayout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [stepReady, setStepReady] = useState<StepReady>(initalStepReady);

  // Choose cabin
  const [chosenCabins, setChosenCabins] = useState<CabinFragment[]>([]);
  const { data } = useQuery(CabinsDocument);
  const [modalData, setModalData] = useState<ModalData>(defaultModalData);

  // Check in/Check out
  const [datePick, setDatePick] = useState<DatePick>({});

  // Contact info state
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [validations, setValidations] = useState<ContactInfoValidations>();
  const [errorTrigger, setErrorTrigger] = useState(false);

  // Booking creation and email mutations
  const [createBooking] = useMutation(CreateBookingDocument);
  const [sendEmail] = useMutation(SendEmailDocument);

  // Extra info from the user, sent to Hytteforeningen
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

  const isMobile = useResponsive({ query: "down", key: "md" });

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
          size={isMobile ? "small" : "large"}
          variant="contained"
        >
          {activeStep == 3 ? "Send" : "Neste"}
          <KeyboardArrowRight />
        </Button>
      </Box>
    </Tooltip>
  );

  const BackButton = () => (
    <Box display={activeStep == 4 ? "none" : "block"} sx={{ opacity: activeStep === 0 ? 0 : 1 }}>
      <Button
        size={isMobile ? "small" : "large"}
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
        {data?.cabins &&
          (isMobile ? (
            <StepComponent
              allCabins={data.cabins}
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
                  allCabins={data.cabins}
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
          ))}
      </Stack>
      {isMobile ? (
        <MobileStepper
          steps={4}
          position="bottom"
          variant="progress"
          activeStep={activeStep}
          nextButton={<NextButton />}
          backButton={<BackButton />}
          sx={{ boxShadow: (theme) => theme.shadows[24] }}
        />
      ) : (
        <></>
      )}
    </Container>
  );
};

CabinBookingPage.getLayout = (page) => <Layout simpleHeader>{page}</Layout>;

export default CabinBookingPage;
