import { ThemeOptions } from "@mui/material";

const Accordion: ThemeOptions["components"] = {
  MuiAccordion: {
    defaultProps: {
      elevation: 4,
    },
  },

  MuiAccordionDetails: {},

  MuiAccordionSummary: {},
};

export default Accordion;
