import { useMutation } from "@apollo/client";
import { DELETE_QUESTION } from "@graphql/forms/mutations";
import { FORM } from "@graphql/forms/queries";
import { Form } from "@interfaces/forms";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Button,
  FormHelperText,
} from "@material-ui/core";

/**
 * component for confirmation dialog when deleting a question from a form
 * props:
 * - the id of the question to delete (if undefined: do not show the dialog)
 * - the id of the form to which the question belongs (for use in the cache update function)
 * - onClose function to execute when the dialog is closed
 */
const DeleteQuestion: React.FC<{
  questionId: string;
  formId: string;
  onClose: () => void;
}> = ({ questionId, formId, onClose }) => {
  // mutation to delete the question
  const [deleteQuestion] = useMutation<{ deleteQuestion: { deletedId: string } }>(DELETE_QUESTION, {
    // updates the cache upon deleting the question
    update: (cache, { data }) => {
      const cachedForm = cache.readQuery<{ form: Form }>({
        query: FORM,
        variables: { formId: formId },
      });
      const deletedId = data?.deleteQuestion.deletedId;
      if (cachedForm && deletedId) {
        cache.writeQuery({
          query: FORM,
          variables: { formId: formId },
          data: {
            form: {
              questions: cachedForm.form.questions.filter((question) => question.id !== deletedId),
            },
          },
        });
      }
    },
  });

  return (
    <Dialog open={questionId !== undefined} onClose={onClose} fullWidth>
      {questionId !== undefined && (
        <>
          <DialogContent>
            <DialogTitle>Slett spørsmål</DialogTitle>
            <DialogContentText>Er du sikker på at du vil slette dette spørsmålet?</DialogContentText>
            <FormHelperText error>
              Dette vil også slette alle svar fra søkere som har svart på spørsmålet.
            </FormHelperText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) => {
                e.preventDefault();
                deleteQuestion({ variables: { id: questionId } });
                onClose();
              }}
            >
              Slett spørsmål
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
            >
              Avbryt
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default DeleteQuestion;
