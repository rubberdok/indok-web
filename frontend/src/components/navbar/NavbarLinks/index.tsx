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
      {links.map(
        (link) =>
          (!link.loginRequired || (link.loginRequired && loggedIn)) &&
          (link.permissionRequired ? (
            <PermissionRequired permission={link.permissionRequired}>
              <NavbarItem link={link} />
            </PermissionRequired>
          ) : (
            <NavbarItem link={link} />
          ))
      )}
    </>
  );
};
export default NavbarLinks;
