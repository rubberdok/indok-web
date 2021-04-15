import { useQuery } from "@apollo/client";
import { FORM_ANSWERS } from "@graphql/forms/queries";
import { Answer, Question } from "@interfaces/forms";
import { User } from "@interfaces/users";
import { Typography, Box } from "@material-ui/core";

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
  if (error) return <p>Error...</p>;

  // renders the applicant's answers to the form's questions
  return (
    <>
      {data && (
        <>
          <Typography variant="h3">{data.form.name}</Typography>
          <Typography>
            <Box fontWeight="bold">Søker:</Box> {user.firstName} {user.lastName}
          </Typography>
          <Typography>* = obligatorisk spørsmål</Typography>
          {data.form.questions.map((question) => (
            <>
              <Typography>
                <Box fontWeight="bold">{question.question}</Box>
                {question.mandatory && " *"}
              </Typography>
              <Typography>
                {question.answer ? (
                  question.answer.answer
                ) : (
                  <Box fontStyle="italic">Søker svarte ikke på spørsmålet</Box>
                )}
              </Typography>
            </>
          ))}
        </>
      )}
    </>
  );
};

export default FormResponse;
