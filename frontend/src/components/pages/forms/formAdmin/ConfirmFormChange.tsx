import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Button,
  FormHelperText,
} from "@mui/material";

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
 * Component for confirmation dialog when changing a form when it already has responses.
 *
 * Props:
 * - type of the dialog, decided by parent's state
 * - boolean to determine whether the dialog should be shown
 * - onConfirm function, making a change defined by the parent component
 * - onClose function to execute when the dialog is closed
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
