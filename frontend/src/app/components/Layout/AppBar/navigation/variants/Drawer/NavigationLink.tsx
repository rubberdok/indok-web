import { Link } from "@/app/components/Link";

import { Route } from "../props";

type Props = {
  active?: boolean;
  route: Route;
};

export const NavigationLink: React.FC<Props> = ({ active, route }) => {
  return (
    <Link
      href={route.path}
      variant="body2"
      underline="none"
      fontWeight={(theme) => theme.typography.fontWeightMedium}
      color={active ? "text.primary" : "text.secondary"}
      sx={{
        ":hover": {
          color: "text.primary",
        },
      }}
    >
      {route.title}
    </Link>
  );
};
