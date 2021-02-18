import { useQuery } from "@apollo/client";
import { GET_USER } from "@graphql/auth/queries";
import { User } from "@interfaces/users";
import { makeStyles } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/LockOpen";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { DATAPORTEN_SCOPES, generateAuthURL } from "./utils";

const links = [
  {
    id: "1",
    title: "Hjem",
    href: "/",
  },
  {
    id: "2",
    title: "Om foreningen",
    href: "/about",
  },
  {
    id: "3",
    title: "Arrangementer",
    href: "/events",
  },
  {
    id: "4",
    title: "Hyttebooking",
    href: "/cabins",
  },
];

const useStyles = makeStyles(() => ({
  navItem: {
    fontWeight: 600,
    fontSize: 12,
    textTransform: "uppercase",
    marginLeft: 50,
    padding: "10px 0",
    "&:hover": {
      cursor: "pointer",
    },
  },
  user: {
    color: "white",
    height: "100%",
    background: "#065A5A",
    padding: "25px 0",
    paddingLeft: 35,

    ["&::after"]: {
      content: "''",
      height: "100%",
      width: "7vw",
      background: "#065A5A",
      position: "absolute",
      top: 0,
    },

    ["&:hover, &:hover::after"]: {
      background: "#0b6666",
      textDecoration: "none",
    },
  },
}));

const NavbarLinks: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const signInURL = generateAuthURL(
    process.env.NEXT_PUBLIC_DATAPORTEN_ID,
    process.env.NEXT_PUBLIC_DATAPORTEN_STATE,
    process.env.NEXT_PUBLIC_DATAPORTEN_REDIRECT_URI,
    DATAPORTEN_SCOPES
  );

  const { loading, error, data: userData } = useQuery<{ user: User }>(GET_USER);

  return (
    <>
      {links.map((item) => (
        <Link key={item.id} href={item.href}>
          <p className={[router.pathname == item.href ? "active" : "", classes.navItem].join(" ")}>{item.title}</p>
        </Link>
      ))}

      {!userData || loading || !userData.user || error ? (
        <a className={[classes.navItem, classes.user].join(" ")} href={signInURL}>
          <PersonIcon fontSize="small" style={{ marginBottom: "-5px", marginRight: "16px" }} />
          Logg inn med Feide
        </a>
      ) : (
        <>
          <Link href="/archive">
            <p className={classes.navItem}>Arkiv</p>
          </Link>
          <Link href="/profile">
            <p className={[classes.navItem, classes.user].join(" ")}>{userData.user.firstName}</p>
          </Link>
          <Link href="/logout">
            <p className={classes.navItem}>Logg ut</p>
          </Link>
        </>
      )}
    </>
  );
};

export default NavbarLinks;
