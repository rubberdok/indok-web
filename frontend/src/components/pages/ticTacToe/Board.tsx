import { Box, Stack } from "@mui/material";
import { useRef, useState } from "react";
import Square from "./Square";

type Props = { squares: string[]; handleMove: (squareIndex: number) => void };

export const Board: React.VFC<Props> = ({ squares, handleMove }) => {
  return (
    <Box>
      <Stack direction={"row"}>
        <Square value={squares[0]} handleMove={() => handleMove(0)} />
        <Square value={squares[1]} handleMove={() => handleMove(1)} />
        <Square value={squares[2]} handleMove={() => handleMove(2)} />
      </Stack>
      <Stack direction={"row"}>
        <Square value={squares[3]} handleMove={() => handleMove(3)} />
        <Square value={squares[4]} handleMove={() => handleMove(4)} />
        <Square value={squares[5]} handleMove={() => handleMove(5)} />
      </Stack>
      <Stack direction={"row"}>
        <Square value={squares[6]} handleMove={() => handleMove(6)} />
        <Square value={squares[7]} handleMove={() => handleMove(7)} />
        <Square value={squares[8]} handleMove={() => handleMove(8)} />
      </Stack>
    </Box>
  );
};
export default Board;
