import { Box, ButtonBase } from "@mui/material";
import { useState } from "react";

type Props = {};

export const Square: React.VFC<Props> = ({}) => {
  const [value, setValue] = useState<string>("");
  const [turn, setTurn] = useState<string>("X");

  function handleClick() {
    if (value === "") {
      setValue(turn);
      if (turn === "X") {
        setTurn("O");
      } else {
        setTurn("X");
      }
    }
  }

  return (
    <ButtonBase onClick={() => handleClick()}>
      <Box height={"100px"} width={"100px"} border={1}>
        {value}
      </Box>
    </ButtonBase>
  );
};

export default Square;
