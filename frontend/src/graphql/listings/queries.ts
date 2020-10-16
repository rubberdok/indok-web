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

export const RESPONSE = gql`
    query listing($listingID: ID!, $responseID: ID!) {
        listing(id: $listingID) {
            response(id: $responseID) {
                id
                response
            }
        }
    }
`;

export const ORGANIZATIONS = gql`
    query {
        allOrganizations {
            id
            name
            slug
            description
        }
    }
`;

export const ORGANIZATION = gql`
    query organization($ID: ID!) {
        organization(id: $ID) {
            id
            name
            slug
            description
        }
    }
`;

export const ORGANIZATION_LISTINGS = gql`
    query organization($ID: ID!) {
        organization(id: $ID) {
            listings {
                id
                title
                description
                startDateTime
                deadline
                endDateTime
                url
                responses {
                    id
                    response
                }
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
