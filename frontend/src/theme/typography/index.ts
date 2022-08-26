import { ThemeOptions } from "@mui/material/styles";

const PRIMARY = "Poppins, sans-serif";
const SECONDARY = "Merriweather, sans-serif";

const typography: ThemeOptions["typography"] = {
  fontFamily: PRIMARY,
  h1: {
    fontFamily: SECONDARY,
    fontWeight: 800,
    lineHeight: 80 / 64,
    fontSize: "2.5rem",
  },
  h2: {
    fontFamily: SECONDARY,
    fontWeight: 800,
    lineHeight: 64 / 48,
    fontSize: "2rem",
  },
  h3: {
    fontFamily: SECONDARY,
    fontWeight: 800,
    lineHeight: 1.5,
    fontSize: "1.5rem",
  },
  h4: {
    fontFamily: SECONDARY,
    fontWeight: 800,
    lineHeight: 1.5,
    fontSize: "1.25rem",
  },
  h5: {
    fontFamily: SECONDARY,
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: "1rem",
  },
  h6: {
    fontFamily: SECONDARY,
    fontWeight: 600,
    lineHeight: 28 / 18,
    fontSize: "1rem",
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 28 / 16,
    fontSize: "1rem",
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 26 / 14,
    fontSize: "0.875rem",
  },
  subtitle3: {
    fontWeight: 600,
    lineHeight: 24 / 13,
    fontSize: "0.75rem",
  },
  body1: {
    lineHeight: 28 / 16,
    fontSize: "1rem",
  },
  body2: {
    lineHeight: 26 / 14,
    fontSize: "0.875rem",
  },
  body3: {
    lineHeight: 24 / 13,
    fontSize: "0.75rem",
  },
  caption: {
    lineHeight: 20 / 12,
    fontSize: "0.75rem",
  },
  overline: {
    fontWeight: 600,
    lineHeight: 20 / 12,
    fontSize: "0.75rem",
    textTransform: "uppercase",
  },
  button: {
    fontWeight: 600,
    lineHeight: 24 / 14,
    fontSize: "0.875rem",
  },
};

export default typography;
