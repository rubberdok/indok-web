import { ToggleButton, ToggleButtonGroup } from "@mui/material";

type Props = {
  selectables?: Array<string>;
};

export const SelectorDisplay: React.VFC<Props> = ({ selectables }) => {
  const handleClick = (selectable: string) => {
    //TODO implement
    console.log(selectable);
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
