import { gql } from "@apollo/client";

export const GET_EVENTS = gql`
    query {
        allEvents {
            id
            title
            description
            starttime
        }
    }
`;

export const GET_EVENT = gql`
    query Event($id: ID!) {
        event(id: $id) {
            id
            title
            description
            starttime
        }
    }
`;
