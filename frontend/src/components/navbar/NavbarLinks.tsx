import { useQuery } from "@apollo/client";
import { GET_USER } from "@graphql/auth/queries";
import { User } from "@interfaces/users";
import { makeStyles } from "@material-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { generateQueryString } from "src/utils/helpers";

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
    margin: "0 25px",
    padding: "10px 0",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const DATAPORTEN_SCOPES = [
  "openid",
  "userid",
  "userid-feide",
  "userinfo-name",
  "userinfo-photo",
  "email",
  "groups-edu",
];

const NavbarLinks: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();

  const queryString = generateQueryString({
    client_id: process.env.NEXT_PUBLIC_DATAPORTEN_ID,
    state: process.env.NEXT_PUBLIC_DATAPORTEN_STATE,
    redirect_uri: process.env.NEXT_PUBLIC_DATAPORTEN_REDIRECT_URI,
    response_type: "code",
    scope: DATAPORTEN_SCOPES.join(" "),
  });
  const signInURL = "https://auth.dataporten.no/oauth/authorization" + queryString;

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
          <Link href="/archive">
            <p className={classes.navItem}>Arkiv</p>
          </Link>
          <Link href="/profile">
            <p className={classes.navItem}>{userData.user.firstName}</p>
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
