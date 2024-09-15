import { Box, ButtonBase } from "@mui/material";

type Props = {
  index: number;
  value: string;
  handleClick: (index: number) => void;
};

export const Square: React.VFC<Props> = ({ index, value, handleClick }) => {
  return (
    <ButtonBase onClick={() => handleClick(index)}>
      <Box height={"100px"} width={"100px"} border={1}>
        {value}
      </Box>
    </ButtonBase>
  );
};

export default Square;
