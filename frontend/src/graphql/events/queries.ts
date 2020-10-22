import { gql } from "@apollo/client";

export const GET_EVENTS = gql`
    query {
        allEvents {
            id
            title
            starttime
            endtime
            location
            description
            organization {
                name
            }
            category {
                name
            }
            image
            isAttendable
            deadline
            publisher
        }
    }
`;

export const GET_EVENT = gql`
    query Event($id: ID!) {
        event(id: $id) {
            id
            title
            starttime
            endtime
            location
            description
            organization {
                name
            }
            category {
                name
            }
            image
            isAttendable
            deadline
            publisher
        }
    }
`;

export const GET_CATEGORIES = gql`
    query {
        allCategories {
            id
            name
        }
    }
`;

export const GET_CATEGORY = gql`
    query Category($id: ID!) {
        category(id: $id) {
            id
            name
        }
    }
`;

export const QUERY_EVENT_FILTERED_ORGANIZATIONS = gql`
    {
        eventFilteredOrganizations {
            name
            children {
                name
            }
        }
    }
`;
