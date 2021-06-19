import { User } from "@interfaces/users"
import { FormControl, Card, CardContent, TextField } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { useState } from "react";

type Props = {
  user: User
}


const MUITextField: MUITextField = ({ form, field, label }) => {
  const { name, value } = field;
  const { setFieldValue } = form;
  return (
    <TextField 
      name={name}
      value={value}
      onChange={(e) => {
        setFieldValue(name, e.target.value)
      }}
      variant="filled"
      label={label}
    />
  )

}

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

  return (
    <Card>
      <CardContent>
        <Formik
          initialValues={initialValues}
          onSubmit={(e) => console.log("MUTATING")}
        >
          <Form>
            <Field name="firstname" label="Fornavn" component={MUITextField} />
            <Field name="surname" label="Etternavn" component={MUITextField} />
          </Form>

        </Formik>

      </CardContent>
    </Card>
  )

}

export default OnboardingForm;