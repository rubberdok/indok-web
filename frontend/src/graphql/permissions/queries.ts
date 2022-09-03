import { gql } from "@apollo/client";

export const HAS_PERMISSION = gql`
  query hasPermission($permission: String!) {
    hasPermission(permission: $permission)
  }
`;
