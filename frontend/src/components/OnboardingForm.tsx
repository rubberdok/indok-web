import { User } from "@interfaces/users"
import { FormControl, Card, CardContent, Typography, Grid, Button, Stepper, Step, StepLabel } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { TextField } from "@components/formik/components";
dayjs.extend(utc);
dayjs.extend(tz);
dayjs.tz.setDefault("Europe/Oslo");

type Props = {
  user: User
}


const RegistrationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "For kort.")
    .max(50, "For langt.")
    .required("Påkrevd felt."),
  lastName: Yup.string()
    .min(2, "For kort.")
    .max(50, "For langt.")
    .required("Påkrevd felt."),
  graduationYear: Yup.number()
    .integer("Må være et tall.")
    .lessThan(dayjs().year() + 7, "For langt frem i tid.")
    .moreThan(dayjs().month() <= 6 ? dayjs().year() : dayjs().year() + 1, "Året du er ferdig på Indøk, kan ikke være i fortiden.")
})




const OnboardingForm: React.FC<Props> = ({ user }) => {
  const [progress, setProgress] = useState(0);
  const initialValues = {
    ...user
  }

  const progressStep = (progress: number) => {
    switch (progress) {
      case 0:

    }
  }

  const buttonProgress = (onSubmit?: () => void): { text: string, type: "button" | "submit", handleButtonClick: () => void } => {
    switch (progress) {
      case 0:
        return { text: "Neste", type: "button", handleButtonClick: () => setProgress(progress + 1) };
      case 1:
        return { text: "Registrer", type: "submit", handleButtonClick: () => onSubmit };
      default:
        return { text: "Noe er feil", type: "button", handleButtonClick: () => setProgress(0) };
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>Registrering</Typography>
        <Formik
          initialValues={initialValues}
          onSubmit={() => console.log("MUTATING")}
          validationSchema={RegistrationSchema}
        >
          {({ errors, touched, isSubmitting, handleSubmit }) => (
            <Form>
              <Grid container direction="column">
                <FormControl>
                  <Grid item container direction="row" spacing={2}>
                    <Grid item>
                      <Field
                        name="firstName"
                        label="Fornavn"
                        error={touched.firstName && errors.firstName}
                        helperText={errors.firstName && touched.firstName ? errors.firstName : ""}
                        component={TextField}
                        required
                      />
                    </Grid>
                    <Grid item>
                      <Field
                        name="lastName"
                        label="Etternavn"
                        error={touched.lastName && errors.lastName}
                        helperText={errors.lastName && touched.lastName ? errors.lastName : ""}
                        component={TextField}
                        required
                      />
                    </Grid>
                  </Grid>
                </FormControl>
                <Grid item>
                  <Field
                    name="graduationYear"
                    label="Årskull"
                    type="number"
                    placeholder={dayjs().year()}
                    error={touched.graduationYear && errors.graduationYear}
                    helperText={errors.graduationYear && touched.graduationYear ? errors.graduationYear : ""}
                    component={TextField}
                    required
                  />
                </Grid>
                <Grid container item justify="space-between">
                  <Grid item>
                    <Button color="inherit">
                      Avbryt
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button color="primary" onClick={buttonProgress(handleSubmit).handleButtonClick} disabled={isSubmitting}>
                      {buttonProgress().text}
                    </Button>
                  </Grid>
                </Grid>
                <Grid item>
                  <Stepper activeStep={progress}>
                    <Step key={0}>
                      <StepLabel>
                        Personalia
                      </StepLabel>
                    </Step>
                    <Step key={1}>
                      <StepLabel>
                        Ekstra informasjon
                      </StepLabel>
                    </Step>
                  </Stepper>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>

      </CardContent>
    </Card>
  )

}

export default OnboardingForm;