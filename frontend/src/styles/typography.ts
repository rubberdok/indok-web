import breakpoints from "./breakpoints";

//TODO: convert all fontsizes from px to root em, then make the website root fontsize responsive
//TODO: make fontsizes follow correct type hierarchy

const typography = {
  fontFamily: ["Open Sans", "sans-serif"].join(","),
  h1: {
    fontFamily: ["Playfair Display", "sans-serif"].join(","),
    fontSize: "4rem",
    fontWeight: 800,
  },
  h2: {
    fontFamily: ["Playfair Display", "sans-serif"].join(","),
    fontSize: 48,
    fontWeight: 700,
    lineHeight: "3.5rem",

    ["@media (max-width: " + breakpoints.values.sm + "px)"]: {
      fontSize: 40,
    },
  },
  h3: {
    fontFamily: ["Playfair Display", "sans-serif"].join(","),
    fontSize: 48,
    fontWeight: 500,

    ["@media (max-width: " + breakpoints.values.sm + "px)"]: {
      fontSize: 40,
    },
  },
  h4: {
    fontFamily: ["Playfair Display", "sans-serif"].join(","),
    fontWeight: 700,
    fontSize: "2rem",
  },
  h5: {
    fontFamily: ["Playfair Display", "sans-serif"].join(","),
    fontWeight: 700,
    fontSize: "1.5rem",
    margin: "5px 0",
  },
  h6: {
    fontFamily: ["Playfair Display", "sans-serif"].join(","),
    fontWeight: 700,
    fontSize: 22,
    lineHeight: "23px",
    color: "rgb(43 39 28 / 35%)",
  },
  subtitle1: {
    fontFamily: ["Playfair Display", "sans-serif"].join(","),
    fontWeight: 400,
    fontSize: 25,
    lineHeight: "43px",
  },
  overline: {
    fontSize: 13,
    letterSpacing: "0.05em",
    fontWeight: 600,
    color: "#b0aca5",
  },
  body1: {
    fontFamily: ["Open Sans", "sans-serif"].join(","),
    fontSize: 24,
    fontWeight: 300,
    lineHeight: "40px",
  },
  body2: {
    fontFamily: ["Open Sans", "sans-serif"].join(","),
    fontSize: 18,
    fontWeight: 300,
    lineHeight: "30px",
  },
};

export default typography;
