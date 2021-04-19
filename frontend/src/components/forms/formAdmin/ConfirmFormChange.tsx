import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Button,
  FormHelperText,
} from "@material-ui/core";

// utility function to return text for the dialog based on its type
const dialogText = (type: "create" | "update" | "delete") => {
  switch (type) {
    case "create":
      return {
        title: "Nytt spørsmål",
        body: "Er du sikker på at du vil legge til et nytt spørsmål på søknaden?",
        warning: "Søkere har allerede svart på søknaden uten dette spørsmålet.",
      };
    case "update":
      return {
        title: "Oppdater spørsmål",
        body: "Er du sikker på at du vil endre på dette spørsmålet?",
        warning: "Søkere har allerede svart på spørsmålet slik som det var.",
      };
    case "delete":
      return {
        title: "Slett spørsmål",
        body: "Er du sikker på at du vil slette dette spørsmålet?",
        warning: "Dette vil slette svar fra søkere som har svart på spørsmålet.",
      };
  }
};

/**
 * component for confirmation dialog when changing a form when it already has responses
 *
 * props:
 * - boolean to determine whether the dialog should be shown
 * - onConfirm function, making a change defined by the parent component
 * - onClose function to execute when the dialog is closed
 * - titleText string for the dialog's title
 * - bodyText string for the dialog's main text
 * - optional warningText string
 */
const ConfirmFormChange: React.FC<{
  type: "create" | "update" | "delete";
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}> = ({ type, open, onConfirm, onClose }) => {
  const { title, body, warning } = dialogText(type);
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogContentText>{body}</DialogContentText>
        <FormHelperText error>{warning}</FormHelperText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {title}
        </Button>
        <Button
          onClick={() => {
            onClose();
          }}
        >
          Avbryt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmFormChange;
