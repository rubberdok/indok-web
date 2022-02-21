import { Box, Button } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React from "react";

interface Props {
  handleAction: () => void;
  text: string;
}

//TODO: Make a small space

const RemoveFilterButton: React.FC<Props> = ({ handleAction, text }) => {
  return (
    <Box pb={3}>
      <Button variant="contained" startIcon={<Close />} onClick={handleAction}>
        {text}
      </Button>
    </Box>
  );
};

export default RemoveFilterButton;
