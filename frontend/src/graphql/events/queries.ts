import { gql } from "@apollo/client";

export const GET_EVENTS = gql`
    query AllEvents($organization: String, $category: String, $startTime: DateTime, $endTime: DateTime) {
        allEvents(organization: $organization, category: $category, startTime: $startTime, endTime: $endTime) {
            id
            title
            startTime
            endTime
            location
            description
            organization {
                name
                color
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
  }
`;

export const GET_EVENT = gql`
  query Event($id: ID!) {
    event(id: $id) {
      id
      title
      startTime
      endTime
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
<<<<<<< HEAD
    {
        eventFilteredOrganizations {
            id
            name
            color
            children {
                id
                name
            }
        }
=======
  {
    eventFilteredOrganizations {
      id
      name
      children {
        id
        name
      }
>>>>>>> ed4941e252ea2290abc600cd3d0c6a252a791b50
    }
  }
`;
