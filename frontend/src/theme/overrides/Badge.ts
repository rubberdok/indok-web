import { Theme } from "@mui/system";

type Props = () => Theme["components"];

const Badge: Props = () => {
  return {
    MuiBadge: {
      styleOverrides: {
        dot: {
          width: 10,
          height: 10,
          borderRadius: "50%",
        },
      },
    },
  };
};

export default Badge;
