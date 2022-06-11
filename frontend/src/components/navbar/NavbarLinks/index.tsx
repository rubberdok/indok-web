import React from "react";
import links from "./links";
import PermissionRequired from "@components/permissions/PermissionRequired";
import NavbarItem from "./NavbarItem";

type Props = {
  loggedIn: boolean;
};

const NavbarLinks: React.VFC<Props> = ({ loggedIn }) => {
  return (
    <>
      {links
        .filter((link) => !link.loginRequired || loggedIn)
        .map((link) =>
          link.permissionRequired ? (
            <PermissionRequired key={link.id} permission={link.permissionRequired}>
              <NavbarItem link={link} />
            </PermissionRequired>
          ) : (
            <NavbarItem key={link.id} link={link} />
          )
        )}
    </>
  );
};
export default NavbarLinks;
