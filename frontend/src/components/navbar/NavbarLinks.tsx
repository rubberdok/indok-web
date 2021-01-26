import { useQuery } from "@apollo/client";
import { GET_USER } from "@graphql/auth/queries";
import { User } from "@interfaces/users";
import { makeStyles } from "@material-ui/core";
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
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 12,
    display: "inline-block",
    textTransform: "uppercase",
    margin: "0 25px",
    position: "relative",
    padding: "10px 0",
    "&:hover": {
      cursor: "pointer",
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
        <a className={classes.navItem} href={signInURL}>
          Logg inn med Feide
        </a>
      ) : (
        <>
          <a className={classes.navItem} href={"/archive"}>
            Arkiv
          </a>
          <a className={classes.navItem} href={"/profile"}>
            {userData.user.firstName}
          </a>
          <a className={classes.navItem} href="/logout">
            Logg ut
          </a>
        </>
      )}
    </>
  );
};

export default NavbarLinks;
