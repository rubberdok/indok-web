import { gql } from "@apollo/client";

export const GET_SERVER_TIME = gql`
  query {
    serverTime
  }
`;

export const HAS_PERMISSION = gql`
  query hasPermission($permission: String!) {
    hasPermission(permission: $permission)
  }
`;
