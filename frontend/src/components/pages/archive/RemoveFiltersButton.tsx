import { Box, Button } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React from "react";

interface RemoveFiltersButtonProps {
  handleRemoveFilterChanged: () => void;
}

export const RemoveFiltersButton: React.FC<RemoveFiltersButtonProps> = ({ handleRemoveFilterChanged }) => {
  return (
    <Box pb={3}>
      <Button variant="contained" startIcon={<Close />} onClick={handleRemoveFilterChanged}>
        Fjern filtrering
      </Button>
    </Box>
  );
};
