import Link from "next/link";
import { Route } from "../../types";
import { RouteLink } from "./styles";

type Props = {
  active?: boolean;
  route: Route;
};

const NavigationLink: React.FC<Props> = ({ active, route }) => {
  return (
    <Link href={route.path} passHref>
      <RouteLink
        variant="body2"
        fontWeight={(theme) => theme.typography.fontWeightMedium}
        color={(theme) => (active ? theme.palette.text.primary : theme.palette.text.secondary)}
      >
        {route.title}
      </RouteLink>
    </Link>
  );
};

export default NavigationLink;
