import { Link } from "@/components";

import { Route } from "../../types";

type Props = {
  route: Route;
  active?: boolean;
};

export const NavigationLink: React.FC<Props> = ({ route, active }) => {
  return (
    <Link
      variant="body2"
      href={route.path}
      fontWeight={(theme) => theme.typography.fontWeightMedium}
      color={active ? "text.primary" : "text.secondary"}
      underline="none"
      sx={{
        ":hover": {
          color: "text.primary",
        },
        ...(active && {
          "&:before ": {
            left: -6,
            transform: "translateY(-25%)",
            width: 6,
            height: 6,
            content: '""',
            borderRadius: "50%",
            display: "inline-block",
            position: "relative",
            backgroundColor: "primary.main",
          },
        }),
      }}
    >
      {route.title}
    </Link>
  );
};
