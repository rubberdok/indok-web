import { Box, Button } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React from "react";

interface Props {
  handleAction: () => void;
  text: string;
  isDisabled: boolean;
}

//TODO: Make a small space

const RemoveFilterButton: React.FC<Props> = ({ handleAction, text, isDisabled }) => {
  return (
    <Box pb={3}>
      <Button disabled={isDisabled} variant="contained" startIcon={<Close />} onClick={handleAction}>
        {text}
      </Button>
    </Box>
  );
};

export default RemoveFilterButton;
