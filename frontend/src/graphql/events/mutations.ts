import { gql } from "@apollo/client";

export const CREATE_EVENT = gql`
  mutation CreateEvent($eventData: CreateEventInput!, $attendableData: CreateAttendableInput) {
    createEvent(eventData: $eventData, attendableData: $attendableData) {
      event {
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
        contactEmail
        allowedGradeYears

        attendable {
          id
          deadline
          bindingSignup
          price
          signupOpenDate
          slotDistribution {
            gradeGroup
            availableSlots
          }
          hasExtraInformation
          totalAvailableSlots
          isFull
        }
      }
      ok
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent(
    $id: ID!
    $isAttendable: Boolean!
    $eventData: UpdateEventInput
    $attendableData: UpdateAttendableInput
  ) {
    updateEvent(id: $id, isAttendable: $isAttendable, eventData: $eventData, attendableData: $attendableData) {
      event {
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
        contactEmail
        allowedGradeYears

        attendable {
          id
          deadline
          bindingSignup
          price
          signupOpenDate
          slotDistribution {
            gradeGroup
            availableSlots
          }
          hasExtraInformation
          totalAvailableSlots
          isFull
        }
      }
      ok
    }
  }
`;

export const EVENT_SIGN_UP = gql`
  mutation EventSignUp($eventId: ID!, $extraInformation: String) {
    eventSignUp(eventId: $eventId, data: { extraInformation: $extraInformation }) {
      isFull
    }
  }
`;

export const EVENT_SIGN_OFF = gql`
  mutation EventSignOff($eventId: ID!) {
    eventSignOff(eventId: $eventId) {
      isFull
    }
  }
`;

export const ADMIN_EVENT_SIGN_OFF = gql`
  mutation AdminEventSignOff($eventId: ID!, $userId: ID!) {
    adminEventSignOff(eventId: $eventId, userId: $userId) {
      event {
        id
      }
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

export const SEND_EVENT_EMAILS = gql`
  mutation SendEventMails($eventId: ID!, $receiverEmails: [String], $content: String, $subject: String) {
    sendEventMails(eventId: $eventId, receiverEmails: $receiverEmails, content: $content, subject: $subject) {
      ok
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      ok
    }
  }
`;
