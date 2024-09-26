

// import { useState } from 'react';
// import {Square} from '@/components/pages/TicTacToe/Square';
// import { Box, ButtonBase, Stack, Typography } from "@mui/material";

// type Props = {
// };
// export const Board: React.VFC<Props> = ({  }) => {
//     return (
//         <Box>
//             <Stack direction={'row'}>
//                 <Square/>
//                 <Square/>
//                 <Square/>
//             </Stack>
//             <Stack direction={'row'}>
//                 <Square/>
//                 <Square/>
//                 <Square/>
//             </Stack>
//             <Stack direction={'row'}>
//                 <Square/>
//                 <Square/>
//                 <Square/>
//             </Stack>
//         </Box>
//     )

// }
// export default Board;

import { Box, ButtonBase, Stack } from "@mui/material";
import { useState } from "react";
import Square from "./Square";
type Props = {};
export const Board: React.VFC<Props> = ({}) => {
  const [squares, setSquares] = useState<string[]>(Array(9).fill(""));
  const [winner, setWinner] = useState<string>("");
  const [turn, setTurn] = useState<string>("X");
  function handleMove(squareIndex: number) {
    if (squares[squareIndex] === "") {
      const newSquares = squares.slice();
      newSquares[squareIndex] = turn;
      setSquares(newSquares);
      if (turn === "X") {
        setTurn("O");
      } else {
        setTurn("X");
      }
      gameOver();
    }
  }
  function gameOver() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] !== "" && squares[a] === squares[b] && squares[a] === squares[c]) {
        setWinner(squares[a]);
      }
    }
  }
  return (
    <Box>
      The winner is ... {winner}
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





