"use client";

import Board from "@/components/pages/ticTacToe/Board";
import { NextPageWithLayout } from "@/lib/next";
import { Box, Stack, Typography } from "@mui/material";
import { useRef, useState } from "react";

const TicTacToe: NextPageWithLayout = () => {
  const [history, setHistory] = useState<string[][]>([Array(9).fill("")]);
  const [turn, setTurn] = useState<string>("X");
  const [winner, setWinner] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const moveNumber = useRef(0);

  function handleMove(squareIndex: number) {
    if (history[history.length - 1][squareIndex] === "" && moveNumber.current < 9) {
      const newSquares = history[history.length - 1].slice();
      newSquares[squareIndex] = turn;
      setHistory([...history, newSquares]);
      if (turn === "X") {
        setTurn("O");
      } else {
        setTurn("X");
      }
      gameOver(newSquares);
      setStep(step + 1);
      moveNumber.current += 1;
    }
  }

  function gameOver(squares: string[]) {
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
    <Stack direction={"column"} alignItems={"center"}>
      <Box height={"20vh"}></Box>
      <Typography variant="h1" align="center">
        Tic Tac Toe
      </Typography>
      <Typography variant="h3" align="center">
        {generateGameOverString()}
      </Typography>
      <Board squares={history[history.length - 1]} handleMove={handleMove} />
    </Stack>
  );

  function generateGameOverString() {
    if (winner !== "") {
      return "The winner is " + winner;
    } else if (moveNumber.current === 9) {
      return "It's a Draw!";
    } else {
      return "";
    }
  }
};

export default TicTacToe;
