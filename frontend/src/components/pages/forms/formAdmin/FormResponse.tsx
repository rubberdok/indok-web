import FormAnswer from "@components/pages/forms/formAdmin/FormAnswer";
import { Form, Response } from "@interfaces/forms";
import { Card, CardContent, FormHelperText, Grid, Typography } from "@mui/material";

/**
 * Component to see a user's answers to a form.
 *
 * Props:
 * - the answered form
 * - the response from an applicant
 */
const FormResponse: React.FC<{
  form: Form;
  response: Response;
}> = ({ form, response }) => {
  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Card>
          <CardContent>
            <Typography variant="h5">{form.name}</Typography>
            <FormHelperText>* Obligatorisk spørsmål</FormHelperText>
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <Card>
          <CardContent>
            <Grid container direction="row" spacing={1}>
              <Grid item>
                <Typography sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}>Søker:</Typography>
              </Grid>
              <Grid item>
                <Typography>
                  {response.respondent.firstName} {response.respondent.lastName}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <Grid container direction="column" spacing={1}>
          {form.questions
            // sorts questions by ID (hacky solution to maintain question order until we implement order field)
            .sort((q1, q2) => (parseInt(q1.id) || 0) - (parseInt(q2.id) || 0))
            .map((question) => (
              <Grid item key={question.id}>
                <Card>
                  <CardContent>
                    <FormAnswer
                      question={question}
                      answer={response.answers.find((answer) => answer.question?.id === question.id)}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FormResponse;
