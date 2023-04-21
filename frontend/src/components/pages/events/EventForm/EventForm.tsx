import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, CardActions, CardContent, CardHeader, Step, StepLabel, Stepper } from "@mui/material";
import dayjs from "dayjs";
import deepmerge from "deepmerge";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";

import { IEventForm, schema } from "./schema";
import { Review, TimeAndPlace, Info, Registration } from "./Steps";
import { Organization } from "./types";

const steps = {
  0: {
    label: "Informasjon",
    slug: "info",
  },
  1: {
    label: "Tid/sted",
    slug: "timeAndPlace",
  },
  2: {
    label: "Påmelding",
    slug: "registration",
  },
  3: {
    label: "Oversikt",
    slug: "review",
  },
} as const;

type StepIndex = keyof typeof steps;

type StepProps = {
  organizations: Organization[];
  step: StepIndex;
};

const Steps: React.FC<StepProps> = ({ step, organizations }) => {
  switch (step) {
    case 0:
      return <Info organizations={organizations} />;
    case 1:
      return <TimeAndPlace />;
    case 2:
      return <Registration />;
    case 3:
      return <Review />;
  }
};

function parseQuery(step: string | string[] | undefined): StepIndex {
  switch (step) {
    case "0":
      return 0;
    case "1":
      return 1;
    case "2":
      return 2;
    case "3":
      return 3;
    default:
      return 0;
  }
}

type Props = {
  organizations: Organization[];
  defaultValues?: Partial<IEventForm>;
  onSubmit: (data: IEventForm) => void;
};

/**
 * Form for creating and editing events.
 * Built with `react-hook-form` and `yup`. Split into several steps, where each step
 * has limited responsibility in order to limit the cognitive complexity of the form.
 * Validation is performed on submission, and the validation must pass for `onSubmit` to be called.
 * Otherwise, the user is informed about the errors in the form.
 */
export const EventForm: React.FC<Props> = ({ organizations, defaultValues = {}, onSubmit }) => {
  const router = useRouter();
  const { step } = router.query;

  const activeStep: StepIndex = parseQuery(step);

  const methods = useForm<IEventForm>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: deepmerge(
      {
        info: {
          organizer: organizations[0]?.id ?? "",
          category: "",
          title: "",
          shortDescription: null,
          description: "",
          gradeYears: [],
        },
        timeAndPlace: {
          start: dayjs().add(1, "day").format("YYYY-MM-DDT18:15"),
          end: dayjs().add(1, "day").format("YYYY-MM-DDT20:00"),
          location: "",
        },
        registration: {
          isAttendable: false,
          details: {
            availableSeats: null,
            deadline: undefined,
            signUpOpen: undefined,
            binding: false,
          },
        },
      },
      defaultValues
    ),
  });

  const {
    formState: { errors },
    handleSubmit,
  } = methods;

  function navigateToStep(step: StepIndex) {
    router.push(
      {
        query: {
          step,
        },
      },
      undefined,
      {
        shallow: true,
        scroll: true,
      }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...methods}>
        <Card>
          <CardHeader title="Nytt arrangement" />
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
              {Object.values(steps).map(({ label, slug }, index) => (
                <Step key={label}>
                  <StepLabel
                    onClick={() => navigateToStep(index as StepIndex)}
                    error={index === 3 ? !isEmpty(errors) : Boolean(errors[slug])}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <Steps step={activeStep} organizations={organizations} />
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={() => navigateToStep(previousStep(activeStep))}>
              Forrige
            </Button>
            {steps[activeStep].slug === "review" ? (
              <Button variant="contained" type="submit" key="submit">
                Lag Arrangement
              </Button>
            ) : (
              <Button variant="contained" key="next" onClick={() => navigateToStep(nextStep(activeStep))}>
                Neste
              </Button>
            )}
          </CardActions>
        </Card>
      </FormProvider>
    </form>
  );
};

function previousStep(currentStep: StepIndex): StepIndex {
  switch (currentStep) {
    case 0:
      return 0;
    case 1:
      return 0;
    case 2:
      return 1;
    case 3:
      return 2;
  }
}

function nextStep(currentStep: StepIndex): StepIndex {
  switch (currentStep) {
    case 0:
      return 1;
    case 1:
      return 2;
    case 2:
      return 3;
    case 3:
      return 3;
  }
}
