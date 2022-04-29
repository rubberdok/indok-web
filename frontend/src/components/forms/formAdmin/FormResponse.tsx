import { Form, Response } from "@interfaces/forms";
import { Typography, Grid, Card, CardContent, FormHelperText } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import FormAnswer from "@components/forms/formAdmin/FormAnswer";

const useStyles = makeStyles(() => ({
  bold: {
    fontWeight: "bold",
  },
}));

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
  const classes = useStyles();
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
                <Typography className={classes.bold}>Søker:</Typography>
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
