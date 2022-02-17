import { Box } from "@material-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import links from "./links";
import PermissionRequired from "@components/permissions/PermissionRequired";
import { useStyles } from "./styles";

type Props = {
  loggedIn: boolean;
};

const NavbarLinks: React.VFC<Props> = ({ loggedIn }) => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <>
      {links.map((item) => (
        <div key={item.id} className={classes.nav}>
          <Link href={item.href}>
            <a
              className={[
                item.href == "/" + router.pathname.split("/")[1] ? "active" : "",
                classes.navItem,
                classes.nonUserNavItem,
              ].join(" ")}
            >
              {item.title}
            </a>
          </Link>
          {item.dropdown && (
            <div className={classes.dropdown}>
              {item.dropdown.map((dropItem) => (
                <Link key={dropItem.title} href={dropItem.href}>
                  <a
                    className={[
                      router.pathname == dropItem.href ? "active" : "",
                      classes.navItem,
                      classes.nonUserNavItem,
                    ].join(" ")}
                  >
                    {dropItem.title}
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
      {loggedIn ? (
        <PermissionRequired permission="archive.view_archivedocument">
          <Box position="relative">
            <Link href="/archive">
              <a
                className={[
                  router.pathname == "/archive" ? "active" : "",
                  classes.navItem,
                  classes.nonUserNavItem,
                ].join(" ")}
              >
                Arkiv
              </a>
            </Link>
          </Box>
        </PermissionRequired>
      ) : (
        <Box position="relative">
          <a
            className={classes.navItem}
            href="https://www.ntnu.no/studier/mtiot"
            target="_blank"
            rel="noreferrer noopener"
          >
            Om studiet
          </a>
        </Box>
      )}
    </>
  );
};

export default NavbarLinks;
