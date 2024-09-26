
// import {Box, ButtonBase} from '@mui/material';
// import { useState } from 'react';

// type Props = {
//   };
// export const Square: React.VFC<Props> = ({  }) => {
//     const [value, setValue] = useState<string>('');
//     const [turn, setTurn] = useState<string>('x');

//     function handleClick() {
//         if (value === '') {
//             setValue(turn);
//             if (turn === 'x') {
//                 setTurn('o');
//             }
//             else {
//                 setTurn('X')
//             }
//         }
//     }
//     return (
//         <ButtonBase onClick={() => setValue('x')}>
//             <Box height={'100px'} width={'100px'} border={1}>
//                 {value}
//             </Box>
//         </ButtonBase>

//     );
//   };
// export default Square;

import { Box, ButtonBase } from "@mui/material";
import { useState } from "react";
type Props = {
  value: string;
  handleMove: () => void;
};
export const Square: React.VFC<Props> = ({ value, handleMove }) => {
  return (
    <ButtonBase onClick={() => handleMove()}>
      <Box height={"100px"} width={"100px"} border={1}>
        {value}
      </Box>
    </ButtonBase>
  );
};
export default Square;