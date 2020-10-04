import { gql } from "@apollo/client";

export const ALL_LISTINGS = gql`
    query allListings {
        allListings {
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

export const LISTING_BY_ID = gql`
    query listingById($ID: Int!) {
        listingById(id: $ID) {
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
