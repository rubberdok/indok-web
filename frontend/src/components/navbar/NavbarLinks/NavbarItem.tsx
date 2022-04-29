import Link from "next/link";
import { useSharedStyles } from "./styles";
import { useRouter } from "next/router";
import { NavbarLink } from "./links";
import makeStyles from "@mui/styles/makeStyles";
import { breakpoint } from "../Navbar";

const useStyles = makeStyles((theme) => ({
  nonUserNavItem: {
    [theme.breakpoints.down(breakpoint)]: {
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
    },

    "&:hover, &.active": {
      color: "#fff",
      [theme.breakpoints.down(breakpoint)]: {
        color: theme.palette.primary.main,
      },
    },
  },
  nav: {
    position: "relative",

    "&:hover $dropdown": {
      display: "block",
    },
  },
  dropdown: {
    display: "none",
    background: theme.palette.primary.dark,
    position: "absolute",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(1),
    ["& > *"]: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    [theme.breakpoints.down(breakpoint)]: {
      display: "none!important",
    },
  },
}));

type ItemProps = {
  link: NavbarLink;
};

const NavbarItem: React.VFC<ItemProps> = ({ link }) => {
  const classes = { ...useSharedStyles(), ...useStyles() };
  const router = useRouter();

  return (
    <div key={link.id} className={classes.nav}>
      <Link href={link.href}>
        <a
          className={[
            classes.navItem,
            classes.nonUserNavItem,
            ...(link.href === "/" + router.pathname.split("/")[1] ? ["active"] : []),
          ].join(" ")}
        >
          {link.title}
        </a>
      </Link>
      {link.dropdown && (
        <div className={classes.dropdown}>
          {link.dropdown.map((dropItem) => (
            <Link key={dropItem.title} href={dropItem.href}>
              <a
                className={[
                  classes.navItem,
                  classes.nonUserNavItem,
                  ...(router.pathname === dropItem.href ? ["active"] : []),
                ].join(" ")}
              >
                {dropItem.title}
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavbarItem;
