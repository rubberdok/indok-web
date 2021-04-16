import { useQuery } from "@apollo/client";
import { FORM_ANSWERS } from "@graphql/forms/queries";
import { Answer, Question } from "@interfaces/forms";
import { User } from "@interfaces/users";
import { Typography, Box, Grid, Card, CardContent } from "@material-ui/core";

// specific type for this component to tie a question to a single answer
type QuestionWithAnswer = Question & {
  answer?: Answer;
};

/**
 * component to see a user's answers to a form
 * props:
 * - ID of the relevant form
 * - the applicant user
 */
const FormResponse: React.FC<{
  formId: number;
  user: User;
}> = ({ formId, user }) => {
  // fetches answers to the form by the given user
  const { loading, error, data } = useQuery<{ form: { name: string; questions: QuestionWithAnswer[] } }>(FORM_ANSWERS, {
    variables: { formId: formId, userId: parseInt(user.id) },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  // renders the applicant's answers to the form's questions
  return (
    <>
      {data && (
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <Card>
              <CardContent>
                <Typography variant="h5">{data.form.name}</Typography>
                <Typography>* = obligatorisk spørsmål</Typography>
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
                      {user.firstName} {user.lastName}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Grid container direction="column" spacing={1}>
              {data.form.questions.map((question) => (
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
                        {question.answer ? (
                          question.answer.answer
                        ) : (
                          <Box fontStyle="italic">Søker svarte ikke på spørsmålet</Box>
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default FormResponse;
