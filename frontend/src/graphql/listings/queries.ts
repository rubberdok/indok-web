import { gql } from "@apollo/client";

export const LISTINGS = gql`
    query {
        listings {
            id
            title
            description
            startDateTime
            deadline
            endDateTime
            url
            slug
            organization {
                name
            }
        }
    }
`;

export const LISTING = gql`
    query listing($ID: ID!) {
        listing(id: $ID) {
            id
            title
            description
            startDateTime
            deadline
            endDateTime
            url
        }
    }
`;

export const RESPONSES = gql`
    query listing($ID: ID!) {
        listing(id: $ID) {
            responses {
                id
                response
            }
        }
    }
`;

/* export const ALL_ORGANIZATIONS = gql`
    query allOrganization {
        allOrganizations {
            id
            name
        }
    }
`; */
