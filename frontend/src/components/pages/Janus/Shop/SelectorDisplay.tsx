import { Box, ButtonBase, Grid, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";

type Props = {
  selectables?: Array<string>;
};

export const SelectorDisplay: React.VFC<Props> = ({ selectables }) => {
  const handleClick = (selectable) => {
    //TODO implement
  };

  return (
    <ToggleButtonGroup color="primary" exclusive>
      {selectables?.map((selectable) => {
        return (
          <ToggleButton key={selectable} value={selectable} onClick={() => handleClick(selectable)}>
            {selectable}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
};
