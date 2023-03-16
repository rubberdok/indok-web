import { ThemeOptions } from "@mui/material";
import { Poppins, Merriweather } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  fallback: ["sans-serif"],
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const PRIMARY = poppins.style.fontFamily;
const SECONDARY = merriweather.style.fontFamily;

export const typography: ThemeOptions["typography"] = {
  fontFamily: PRIMARY,
  h1: {
    fontFamily: SECONDARY,
    fontWeight: 800,
    lineHeight: 80 / 64,
    fontSize: "4rem",
  },
  h2: {
    fontFamily: SECONDARY,
    fontWeight: 800,
    lineHeight: 64 / 48,
    fontSize: "3rem",
  },
  h3: {
    fontFamily: SECONDARY,
    fontWeight: 800,
    lineHeight: 1.5,
    fontSize: "2rem",
  },
  h4: {
    fontFamily: SECONDARY,
    fontWeight: 800,
    lineHeight: 1.5,
    fontSize: "1.5rem",
  },
  h5: {
    fontFamily: SECONDARY,
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: "1.25rem",
  },
  h6: {
    fontFamily: SECONDARY,
    fontWeight: 600,
    lineHeight: 28 / 18,
    fontSize: "1.125rem",
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
    textTransform: "none",
  },
};
