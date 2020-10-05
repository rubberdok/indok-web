import { gql } from "@apollo/client";

export const CREATE_EVENT = gql`
    mutation CreateEvent($title: String, $description: String, $starttime: DateTime) {
        createEvent(title: $title, description: $description, starttime: $starttime) {
            ok
            event {
                id
                title
                description
                starttime
            }
        }
    }
`;
