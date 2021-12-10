import { gql } from "@apollo/client";

export const GET_EVENTS_DEFAULT_EVENTS_AND_USERS = gql`
  query AllEventsDefaultEventsAndUsers(
    $organization: String
    $category: String
    $startTime: DateTime
    $endTime: DateTime
  ) {
    allEvents(organization: $organization, category: $category, startTime: $startTime, endTime: $endTime) {
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
      shortDescription
      hasExtraInformation
      contactEmail
      allowedGradeYears

      attendable {
        id
        deadline
        bindingSignup
        price
        signupOpenDate
      }

      userAttendance {
        isSignedUp
        isOnWaitingList
      }
      isFull
    }
    defaultEvents {
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
      shortDescription
      hasExtraInformation
      contactEmail
      allowedGradeYears

      attendable {
        id
        deadline
        bindingSignup
        price
        signupOpenDate
      }

      userAttendance {
        isSignedUp
        isOnWaitingList
      }
      isFull
    }
    user {
      id
      feideEmail
      email
      username
      firstName
      lastName
      dateJoined
      graduationYear
      gradeYear
      allergies
      phoneNumber
      firstLogin
      events {
        id
      }
      organizations {
        id
        name
      }
    }
  }
`;

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
        id
        name
      }
      category {
        id
        name
      }
      image
      shortDescription
      hasExtraInformation
      contactEmail
      allowedGradeYears

      attendable {
        id
        deadline
        bindingSignup
        price
        signupOpenDate
      }

      userAttendance {
        isSignedUp
        isOnWaitingList
      }
      isFull
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
        id
        name
      }
      category {
        id
        name
      }
      image
      shortDescription
      hasExtraInformation
      contactEmail
      allowedGradeYears

      attendable {
        id
        deadline
        bindingSignup
        price
        signupOpenDate
      }

      userAttendance {
        isSignedUp
        isOnWaitingList
      }
      isFull
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
      shortDescription
      hasExtraInformation
      contactEmail
      allowedGradeYears

      attendable {
        id
        deadline
        bindingSignup
        price
        signupOpenDate
      }

      availableSlots {
        category
        availableSlots
      }

      userAttendance {
        isSignedUp
        isOnWaitingList
      }
      isFull
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

      attendable {
        id
        deadline
        bindingSignup
        price
        signupOpenDate
      }

      image

      publisher {
        id
        username
        email
        firstName
        lastName
        dateJoined
      }
      availableSlots {
        category
        availableSlots
      }
      shortDescription
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
      hasExtraInformation
      contactEmail
      allowedGradeYears
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
      attendable {
        id
      }
      usersAttending {
        userEmail
      }
    }
  }
`;
