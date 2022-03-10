import { useMutation } from "@apollo/client";
import { DELETE_EVENT } from "@graphql/events/mutations";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import { Close, Delete } from "@material-ui/icons";
import React, { useState } from "react";
import Alert from "@components/Alert";

type Props = {
  open: boolean;
  onClose: () => void;
  eventId: string;
};

/**
 * Component (Dialog) for confirming deletion of an event
 *
 * Props:
 * - open: whether the dialog should be open
 * - onClose: called when the doalog should be closed
 * - event: The event to be edited
 */

const DeleteEventModal: React.FC<Props> = ({ open, onClose, eventId }) => {
  const [openDeleteSuccessSnackbar, setOpenDeleteSuccessSnackbar] = useState(false);
  const router = useRouter();

  const [deleteEvent, { loading: deleteEventLoading, error: deleteEventError }] = useMutation<{
    deleteEvent: { id: string };
  }>(DELETE_EVENT, {
    variables: { id: eventId },
    onCompleted: () => {
      setOpenDeleteSuccessSnackbar(true);
      router.push("/events");
    },
    update: (cache) => {
      const normalizedId = cache.identify({ id: eventId, __typename: "EventType" });
      cache.evict({ id: normalizedId });
      cache.gc();
    },
  });

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="md">
      <DialogTitle>
        <Typography variant="h4">Slett arrangement</Typography>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Typography>Er du sikker på at du vil slette dette arrangementet?</Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        {deleteEventError && <Typography color="error">Feil: {deleteEventError.message}</Typography>}
        {deleteEventLoading && <CircularProgress />}
        <Button onClick={() => onClose()} color="primary" startIcon={<Close />}>
          Avbryt
        </Button>
        <Button onClick={() => deleteEvent({ variables: { id: eventId } })} color="primary" startIcon={<Delete />}>
          Slett
        </Button>
      </DialogActions>

      <Alert
        severity="success"
        open={openDeleteSuccessSnackbar}
        onClose={() => setOpenDeleteSuccessSnackbar(false)}
        description={"Arrangement slettet"}
      />
    </Dialog>
  );
};

export default DeleteEventModal;
