import { Close } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";

type Props = {
  handleRemoveFilterChanged: () => void;
};

export const RemoveFiltersButton: React.FC<Props> = ({ handleRemoveFilterChanged }) => {
  return (
    <Box pb={3}>
      <Button variant="contained" startIcon={<Close />} onClick={handleRemoveFilterChanged}>
        Fjern filtrering
      </Button>
    </Box>
  );
};
