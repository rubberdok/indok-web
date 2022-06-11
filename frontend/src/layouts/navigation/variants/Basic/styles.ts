import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Theme } from "@mui/system";

type Props = {
  active?: boolean;
};

const activeDot = (theme: Theme) => ({
  "&:before": {
    left: -6,
    transform: "translateY(-25%)",
    marginLeft: -6,
    width: 6,
    height: 6,
    content: '""',
    borderRadius: "50%",
    display: "inline-block",
    position: "relative",
    backgroundColor: theme.palette.primary.main,
  },
});

export const RouteLink = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "active",
})<Props>(({ active, theme }) => ({
  ...(active && activeDot(theme)),
  cursor: "pointer",
  "&:hover": {
    color: theme.palette.text.primary,
  },
}));
