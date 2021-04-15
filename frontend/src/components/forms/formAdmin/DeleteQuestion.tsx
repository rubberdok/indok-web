import { useMutation } from "@apollo/client";
import { DELETE_QUESTION } from "@graphql/forms/mutations";
import { FORM_FRAGMENT } from "@graphql/forms/queries";
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
 * - deleteQuestion function, calling on mutation in its parent
 * - onClose function to execute when the dialog is closed
 */
const DeleteQuestion: React.FC<{
  questionId: string;
  deleteQuestion: (id: string) => void;
  onClose: () => void;
}> = ({ questionId, deleteQuestion, onClose }) => (
  <Dialog open={questionId !== undefined} onClose={onClose} fullWidth>
    {questionId !== undefined && (
      <>
        <DialogContent>
          <DialogTitle>Slett spørsmål</DialogTitle>
          <DialogContentText>Er du sikker på at du vil slette dette spørsmålet?</DialogContentText>
          <FormHelperText error>Dette vil også slette alle svar fra søkere som har svart på spørsmålet.</FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.preventDefault();
              deleteQuestion(questionId);
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

export default DeleteQuestion;
