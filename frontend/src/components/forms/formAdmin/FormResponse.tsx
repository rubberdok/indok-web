import { Form, Answer, Response } from "@interfaces/forms";
import { Typography, Box, Grid, Card, CardContent, FormHelperText } from "@material-ui/core";

/**
 * component to see a user's answers to a form
 *
 * props:
 * - the form
 * - the response from an applicant
 */
const FormResponse: React.FC<{
  form: Form;
  response: Response;
}> = ({ form, response }) => (
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
              <Typography>
                <Box fontWeight="bold">Søker:</Box>
              </Typography>
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
        {form.questions.map((question) => (
          <Grid item key={question.id}>
            <Card>
              <CardContent>
                <Grid container direction="row" spacing={1}>
                  <Grid item>
                    <Typography>
                      <Box fontWeight="bold">{question.question}</Box>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{question.mandatory && " *"}</Typography>
                  </Grid>
                </Grid>
                <Typography>
                  {((answer: Answer | undefined) =>
                    answer ? answer.answer : <Box fontStyle="italic">Søker svarte ikke på spørsmålet.</Box>)(
                    response.answers.find((answer) => answer.question?.id === question.id)
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  </Grid>
);

export default FormResponse;
