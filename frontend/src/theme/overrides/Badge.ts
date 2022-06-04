import { ComponentOverride } from "./types";

const Badge: ComponentOverride = () => {
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
