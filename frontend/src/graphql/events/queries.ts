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
      publisher {
        id
        username
        email
        firstName
        lastName
        dateJoined
      }
      availableSlots
      price
      shortDescription
      signupOpenDate
      userAttendance {
        isSignedUp
        isOnWaitingList
      }
      isFull
      hasExtraInformation
    }
  }
`;

export const GET_DEFAULT_EVENTS = gql`
  query defaultEvents {
    defaultEvents {
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
      publisher {
        id
        username
        email
        firstName
        lastName
        dateJoined
      }
      availableSlots
      price
      shortDescription
      signupOpenDate
      userAttendance {
        isSignedUp
        isOnWaitingList
      }
      isFull
      hasExtraInformation
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
      publisher {
        id
        username
        email
        firstName
        lastName
        dateJoined
      }
      availableSlots
      price
      shortDescription
      signupOpenDate
      userAttendance {
        isSignedUp
        isOnWaitingList
      }
      isFull
      hasExtraInformation
    }
  }
`;

export const ADMIN_GET_EVENT = gql`
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
      publisher {
        id
        username
        email
        firstName
        lastName
        dateJoined
      }
      availableSlots
      price
      shortDescription
      signupOpenDate
      usersAttending {
        id
        username
        email
        firstName
        lastName
        gradeYear
      }
      usersOnWaitingList {
        id
        username
        email
        firstName
        lastName
        gradeYear
      }
      userAttendance {
        isSignedUp
        isOnWaitingList
      }
      isFull
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
  query {
    eventFilteredOrganizations {
      id
      name
      color
      children {
        id
        name
      }
    }
  }
`;

export const QUERY_SIGNED_UP_USERS = gql`
  query Event($id: ID!) {
    event(id: $id) {
      isAttendable
      usersAttending {
        id
        email
      }
    }
  }
`;
