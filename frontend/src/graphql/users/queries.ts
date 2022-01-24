import { gql } from "@apollo/client";
import { USER_FRAMGENT } from "./fragments";

export const GET_USER = gql`
  ${USER_FRAMGENT}
  query user {
    user {
      ...UserFields
      events {
        id
      }
      organizations {
        id
        name
      }
    }
  }
`;
