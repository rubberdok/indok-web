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
      price
      shortDescription
      signupOpenDate
      userAttendance {
        isSignedUp
        isOnWaitingList
        hasBoughtTicket
      }
      isFull
      hasExtraInformation
      allowedGradeYears
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
      price
      shortDescription
      signupOpenDate
      userAttendance {
        isSignedUp
        isOnWaitingList
      }
      isFull
      hasExtraInformation
      allowedGradeYears
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
        id
        name
      }
      category {
        id
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
        hasBoughtTicket
      }
      isFull
      hasExtraInformation
      bindingSignup
      contactEmail
      allowedGradeYears
      product {
        id
      }
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
        id
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
        user {
          id
          firstName
          lastName
        }
        userEmail
        userGradeYear
        userAllergies
        userPhoneNumber
        hasBoughtTicket
      }
      usersOnWaitingList {
        user {
          id
          firstName
          lastName
        }
        userEmail
        userGradeYear
        userAllergies
        userPhoneNumber
      }
      userAttendance {
        isSignedUp
        isOnWaitingList
      }
      isFull
      hasExtraInformation
      bindingSignup
      contactEmail
      allowedGradeYears
      product {
        id
      }
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

export const QUERY_ATTENDEE_REPORT = gql`
  query attendeeReport($eventId: ID!, $fields: [String], $filetype: String) {
    attendeeReport(eventId: $eventId, fields: $fields, filetype: $filetype)
  }
`;

export const QUERY_ATTENDEE_REPORT_ORG = gql`
  query attendeeReportOrg($orgId: ID!, $fields: [String], $filetype: String) {
    attendeeReportOrg(orgId: $orgId, fields: $fields, filetype: $filetype)
  }
`;

export const QUERY_ATTENDEE_REPORTS = gql`
  query attendeeReports($eventIds: [ID]!, $fields: [String], $filetype: String) {
    attendeeReports(eventIds: $eventIds, fields: $fields, filetype: $filetype)
  }
`;

export const QUERY_SIGNED_UP_USERS = gql`
  query Event($id: ID!) {
    event(id: $id) {
      isAttendable
      usersAttending {
        userEmail
      }
    }
  }
`;
