import { ThemeOptions } from "@mui/material";

export const Accordion: ThemeOptions["components"] = {
  MuiAccordion: {
    defaultProps: {
      elevation: 0,
    },
  },

  MuiAccordionDetails: {},

  MuiAccordionSummary: {},
};
