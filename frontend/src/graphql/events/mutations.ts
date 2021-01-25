import { gql } from "@apollo/client";

export const CREATE_EVENT = gql`
  mutation CreateEvent(
    $title: String
    $startTime: DateTime
    $endTime: DateTime
    $location: String
    $description: String
    $organizationId: ID
    $categoryId: ID
    $image: String
    $isAttendable: Boolean
    $deadline: DateTime
  ) {
    createEvent(
      eventData: {
        title: $title
        startTime: $startTime
        endTime: $endTime
        location: $location
        description: $description
        organizationId: $organizationId
        categoryId: $categoryId
        image: $image
        isAttendable: $isAttendable
        deadline: $deadline
      }
    ) {
      event {
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
      }
      ok
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String) {
    createCategory(categoryData: { name: $name }) {
      category {
        id
        name
      }
      ok
    }
  }
`;
