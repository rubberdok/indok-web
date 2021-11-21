import { gql } from "@apollo/client";

export const GET_SERVER_TIME = gql`
  query {
    serverTime
  }
`;
