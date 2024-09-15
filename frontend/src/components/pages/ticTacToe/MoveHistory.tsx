import { Box, ButtonBase, List, ListItemButton } from "@mui/material";
import { useState } from "react";

type Props = {
  history: string[][];
  jumpTo: (step: number) => void;
  currentlyViewing: number;
};

export const MoveHistory: React.VFC<Props> = ({ history, jumpTo, currentlyViewing }) => {
  return (
    <List>
      {history.map((history, index) => (
        <ListItemButton key={index} onClick={() => jumpTo(index)} selected={currentlyViewing === index}>
          Move nr. {index + 1}
        </ListItemButton>
      ))}
    </List>
  );
};

export default MoveHistory;
