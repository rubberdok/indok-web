/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: string; output: string; }
};

export type AddMemberInput = {
  /** The ID of the organization to add the user to */
  organizationId: Scalars['ID']['input'];
  /** The role of the user in the organization, defaults to Role.MEMBER */
  role: InputMaybe<Role>;
  /** The ID of the user to add to the organization */
  userId: Scalars['ID']['input'];
};

export type AddMemberResponse = {
  __typename?: 'AddMemberResponse';
  member: Member;
};

export type Booking = {
  __typename?: 'Booking';
  cabins: Array<Maybe<Cabin>>;
  email: Scalars['String']['output'];
  endDate: Scalars['DateTime']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  status: Status;
};

export type BookingContact = {
  __typename?: 'BookingContact';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
};

export type BookingContactResponse = {
  __typename?: 'BookingContactResponse';
  bookingContact: BookingContact;
};

export type BookingSemester = {
  __typename?: 'BookingSemester';
  bookingsEnabled: Scalars['Boolean']['output'];
  endAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  semester: Semester;
  startAt: Scalars['DateTime']['output'];
};

export type BookingSemestersResponse = {
  __typename?: 'BookingSemestersResponse';
  fall: Maybe<BookingSemester>;
  spring: Maybe<BookingSemester>;
};

export type Cabin = {
  __typename?: 'Cabin';
  capacity: Scalars['Int']['output'];
  externalPrice: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  internalPrice: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type CabinInput = {
  id: Scalars['ID']['input'];
};

export type CabinsResponse = {
  __typename?: 'CabinsResponse';
  cabins: Array<Cabin>;
};

export type CreateEventCategoryInput = {
  name: Scalars['String']['input'];
};

export type CreateEventCategoryResponse = {
  __typename?: 'CreateEventCategoryResponse';
  category: EventCategory;
};

export type CreateEventInput = {
  event: EventData;
};

export type CreateEventResponse = {
  __typename?: 'CreateEventResponse';
  event: Event;
};

export type CreateEventSlot = {
  capacity: Scalars['Int']['input'];
  gradeYears: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type CreateListingInput = {
  /** An optional URL to the application form for the listing. */
  applicationUrl: InputMaybe<Scalars['String']['input']>;
  /** At what time the listing will close, will show as a deadline to users, and the listing will be hidden afterwards */
  closesAt: Scalars['DateTime']['input'];
  /** The description of the listing, can be markdown. */
  description: InputMaybe<Scalars['String']['input']>;
  /** The name of the listing, will be visible to users. */
  name: Scalars['String']['input'];
  /** The ID of the organization that the listing belongs to. */
  organizationId: Scalars['ID']['input'];
};

export type CreateListingResponse = {
  __typename?: 'CreateListingResponse';
  listing: Listing;
};

export type CreateMerchantInput = {
  /** Client ID for the merchant, retrieved from the payment provider. */
  clientId: Scalars['String']['input'];
  /** Client secret for the merchant, retrieved from the payment provider. */
  clientSecret: Scalars['String']['input'];
  /** The name of the merchant to create. */
  name: Scalars['String']['input'];
  /** Merchant serial number for the merchant, retrieved from the payment provider. */
  serialNumber: Scalars['String']['input'];
  /** Subscription key for the merchant, retrieved from the payment provider. */
  subscriptionKey: Scalars['String']['input'];
};

export type CreateMerchantResponse = {
  __typename?: 'CreateMerchantResponse';
  /** The merchant that was created. */
  merchant: Merchant;
};

export type CreateOrderInput = {
  /** The ID of the product to create an order for. */
  productId: Scalars['ID']['input'];
};

export type CreateOrderResponse = {
  __typename?: 'CreateOrderResponse';
  order: Order;
};

export type CreateOrganizationInput = {
  /** The description of the organization, cannot exceed 10 000 characters */
  description: InputMaybe<Scalars['String']['input']>;
  /**
   * Features to enable for the organization. Defaults to an empty list.
   * Requires that the current user is a super user, otherwise, this field is ignored.
   */
  featurePermissions: InputMaybe<Array<FeaturePermission>>;
  /** The name of the organization, must be unique and between 1 and 100 characters */
  name: Scalars['String']['input'];
};

export type CreateOrganizationResponse = {
  __typename?: 'CreateOrganizationResponse';
  organization: Organization;
};

export type CreateSlotInput = {
  capacity: Scalars['Int']['input'];
  gradeYears: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type DeleteEventCategoryInput = {
  id: Scalars['ID']['input'];
};

export type DeleteEventCategoryResponse = {
  __typename?: 'DeleteEventCategoryResponse';
  category: EventCategory;
};

export type DeleteListingInput = {
  id: Scalars['ID']['input'];
};

export type DeleteListingResponse = {
  __typename?: 'DeleteListingResponse';
  listing: Listing;
};

export type DeleteSlotInput = {
  id: Scalars['ID']['input'];
};

export type Event = {
  __typename?: 'Event';
  /**
   * canSignUp is true if the current user can sign up for the event, false otherwise.
   * If the user is not logged in, this will be always be false.
   */
  canSignUp: Scalars['Boolean']['output'];
  /** categories describes the categories that the event belongs to. */
  categories: Maybe<Array<EventCategory>>;
  /** The contact email for the event organizer. */
  contactEmail: Scalars['String']['output'];
  /** The description of the event. We support markdown on the client, so this can be markdown. */
  description: Scalars['String']['output'];
  /** The end time of the event. */
  endAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** The location of the event */
  location: Scalars['String']['output'];
  /** The name of the event. */
  name: Scalars['String']['output'];
  /** The organization that is hosting the event. */
  organization: Maybe<Organization>;
  /** The current user's sign up for the event, if the user is signed up for the event. */
  signUp: Maybe<SignUp>;
  /** signUpAvailability describes the availability of sign ups for the event for the current user. */
  signUpAvailability: SignUpAvailability;
  signUpDetails: Maybe<EventSignUpDetails>;
  signUps: Maybe<SignUps>;
  signUpsEnabled: Scalars['Boolean']['output'];
  /** If true, signing up for the event requires that the user submits additional information. */
  signUpsRequireUserProvidedInformation: Scalars['Boolean']['output'];
  /** If true, sign ups can be retracted for the event. Otherwise, sign ups are final. */
  signUpsRetractable: Scalars['Boolean']['output'];
  /** The start time of the event. */
  startAt: Scalars['DateTime']['output'];
  /** The ticket information for the event, if the event is a TICKETS event. */
  ticketInformation: Maybe<EventTicketInformation>;
  type: EventType;
  user: Maybe<EventUser>;
};

export type EventCategoriesResponse = {
  __typename?: 'EventCategoriesResponse';
  categories: Array<EventCategory>;
};

export type EventCategory = {
  __typename?: 'EventCategory';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type EventCategoryInput = {
  id: Scalars['ID']['input'];
};

export type EventData = {
  /** categories is a list of cateogry IDs to which the event belongs */
  categories: InputMaybe<Array<EventCategoryInput>>;
  /**
   * The description of the event, defaults to "". We support markdown on the client, so this can be markdown.
   * This will be displayed to users.
   */
  description: InputMaybe<Scalars['String']['input']>;
  /**
   * The end time of the event. If this is not provided, the event will be assumed to be two hours long.
   * This will be displayed to users.
   */
  endAt: InputMaybe<Scalars['DateTime']['input']>;
  /** The name of the event, this will be displayed to users */
  name: Scalars['String']['input'];
  /**
   * The ID of the organization that is hosting the event. Events must be hosted by an organization, and the user
   * creating the event must be a member of the organization.
   */
  organizationId: Scalars['ID']['input'];
  /** If the event is a sign up event, this will be the sign up details. */
  signUpDetails: InputMaybe<SignUpData>;
  /**
   * If sign ups are currently enabled for the event. If this is false, users cannot sign up for the event. Defaults to
   * false
   */
  signUpsEnabled: InputMaybe<Scalars['Boolean']['input']>;
  /** If true, signing up requires that the user submits additional information. Defaults to false */
  signUpsRequireUserProvidedInformation: InputMaybe<Scalars['Boolean']['input']>;
  /** If true, users can retract their sign up for the event. Defaults to false */
  signUpsRetractable: InputMaybe<Scalars['Boolean']['input']>;
  /** The start time of the event. Events must have a start time. */
  startAt: Scalars['DateTime']['input'];
  /**
   * The event type
   * - BASIC has no sign ups, and no tickets
   * - SIGN_UPS has sign ups, but no tickets (free event)
   * - TICKETS has tickets and sign ups (paid event)
   */
  type: EventType;
};

export type EventInput = {
  id: Scalars['ID']['input'];
};

export type EventResponse = {
  __typename?: 'EventResponse';
  event: Event;
};

export type EventSignUpDetails = {
  __typename?: 'EventSignUpDetails';
  capacity: Scalars['Int']['output'];
  signUpsEndAt: Scalars['DateTime']['output'];
  signUpsStartAt: Scalars['DateTime']['output'];
};

export type EventTicketData = {
  /** MerchantID is the ID for the merchant, this will be the recipient of the payments. */
  merchantId: Scalars['ID']['input'];
  /** Price in øre, i.e. 100 = 1 NOK */
  price: Scalars['Int']['input'];
};

export type EventTicketInformation = {
  __typename?: 'EventTicketInformation';
  product: Maybe<Product>;
};

export enum EventTicketStatus {
  Bought = 'BOUGHT',
  NotBought = 'NOT_BOUGHT'
}

export enum EventType {
  /** Basic event has no sign ups, and no tickets */
  Basic = 'BASIC',
  /** Sign up event has sign ups, but no tickets */
  SignUps = 'SIGN_UPS',
  /** Ticketed event has tickets and sign ups */
  Tickets = 'TICKETS'
}

export type EventUser = {
  __typename?: 'EventUser';
  /** The ID of the user */
  id: Scalars['ID']['output'];
  signUp: Maybe<SignUp>;
  ticket: Maybe<Order>;
  /** The ticket status for the user on the event, null if it's not a ticket event */
  ticketStatus: Maybe<EventTicketStatus>;
};

export type EventsInput = {
  /**
   * If true, only return events that are currently happening, or will happen in the future
   * i.e. events where endAt is in the future.
   */
  futureEventsOnly: InputMaybe<Scalars['Boolean']['input']>;
};

export type EventsResponse = {
  __typename?: 'EventsResponse';
  /** All events, if futureEventsOnly is false, otherwise only future events */
  events: Array<Event>;
  /** The events that start next week, by week number */
  nextWeek: Array<Event>;
  /** The events that start this week, by week number */
  thisWeek: Array<Event>;
  /** The total number of events returned by this query (for now) */
  total: Scalars['Int']['output'];
  /** The events that start in two weeks or later, by week number */
  twoWeeksOrLater: Array<Event>;
};

export enum FeaturePermission {
  ArchiveViewDocuments = 'ARCHIVE_VIEW_DOCUMENTS',
  ArchiveWriteDocuments = 'ARCHIVE_WRITE_DOCUMENTS',
  CabinAdmin = 'CABIN_ADMIN',
  EventWriteSignUps = 'EVENT_WRITE_SIGN_UPS'
}

export type HasFeaturePermissionInput = {
  featurePermission: FeaturePermission;
};

export type HasFeaturePermissionResponse = {
  __typename?: 'HasFeaturePermissionResponse';
  hasFeaturePermission: Scalars['Boolean']['output'];
  id: FeaturePermission;
};

export type HasRoleInput = {
  organizationId: Scalars['ID']['input'];
  role: Role;
};

export type HasRoleResponse = {
  __typename?: 'HasRoleResponse';
  hasRole: Scalars['Boolean']['output'];
};

export type InitiatePaymentAttemptInput = {
  /** The ID of the order to initiate a payment attempt for. */
  orderId: Scalars['ID']['input'];
  /** The return URL to redirect the user to after the payment attempt has been completed. */
  returnUrl: Scalars['String']['input'];
};

export type InitiatePaymentAttemptResponse = {
  __typename?: 'InitiatePaymentAttemptResponse';
  /** The URL to redirect the user to in order to complete the payment. */
  redirectUrl: Scalars['String']['output'];
};

export type Listing = {
  __typename?: 'Listing';
  /** An optional URL to the application form for the listing, defaults to "" */
  applicationUrl: Scalars['String']['output'];
  /** When the listing closes, i.e. deadline, or when the listing is hidden from view. */
  closesAt: Scalars['DateTime']['output'];
  /** The description of the listing, can be markdown. */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The name/title of the listing, will be visible to users. */
  name: Scalars['String']['output'];
  /** The organization that the listing belongs to. */
  organization: Organization;
};

export type ListingInput = {
  id: Scalars['ID']['input'];
};

export type ListingResponse = {
  __typename?: 'ListingResponse';
  listing: Listing;
};

export type ListingsResponse = {
  __typename?: 'ListingsResponse';
  listings: Array<Listing>;
};

export type Member = {
  __typename?: 'Member';
  id: Scalars['ID']['output'];
  /** The organization the member is a member of */
  organization: Organization;
  /** The role of the member in the organization */
  role: Role;
  /** The user that is a member of the organization */
  user: PublicUser;
};

export type Merchant = {
  __typename?: 'Merchant';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Add a member to the organization */
  addMember: AddMemberResponse;
  /** Create an event, requires that the user is logged in, and is a member of the organization that is hosting the event */
  createEvent: CreateEventResponse;
  /** Create a new event category, requires super user status */
  createEventCategory: CreateEventCategoryResponse;
  createListing: CreateListingResponse;
  /**
   * Create a new Vipps merchant, and return the created merchant.
   * Requires super user status.
   */
  createMerchant: CreateMerchantResponse;
  /** Creates an order for the given product. */
  createOrder: CreateOrderResponse;
  /** Create a new organization, and add the current user as an admin of the organization. */
  createOrganization: CreateOrganizationResponse;
  /** Delete an event category, requires super user status */
  deleteEventCategory: DeleteEventCategoryResponse;
  deleteListing: DeleteListingResponse;
  /** Initiates a payment attempt for the given order. */
  initiatePaymentAttempt: InitiatePaymentAttemptResponse;
  newBooking: NewBookingResponse;
  /** Remove a member from the organization by the ID of the membership. */
  removeMember: RemoveMemberResponse;
  /** Retract an active sign up for an event, requires that the user is logged in */
  retractSignUp: RetractSignUpResponse;
  /** Sign up for an event, requires that the user is logged in */
  signUp: SignUpResponse;
  /**
   * Update the user with the given ID with super user privileges, requires that
   * the caller is an authenticated super user. Otherwise, use updateUser.
   */
  superUpdateUser: SuperUpdateUserResponse;
  /** Updates the booking contact, requires that the user is in an organization with the CABIN_ADMIN permission. */
  updateBookingContact: UpdateBookingContactResponse;
  /**
   * Updates the booking semester for the given semester, requires that the user is in an organization with
   * the CABIN_ADMIN permission.
   */
  updateBookingSemester: UpdateBookingSemesterResponse;
  updateBookingStatus: UpdateBookingResponse;
  updateEvent: UpdateEventResponse;
  /** Update an event category, requires super user status */
  updateEventCategory: UpdateEventCategoryResponse;
  updateListing: UpdateListingResponse;
  /**
   * Update an organization with the given name and description.
   * Passing null or omitting a value will leave the value unchanged.
   */
  updateOrganization: UpdateOrganizationResponse;
  updateUser: UpdateUserResponse;
};


export type MutationAddMemberArgs = {
  data: AddMemberInput;
};


export type MutationCreateEventArgs = {
  data: CreateEventInput;
};


export type MutationCreateEventCategoryArgs = {
  data: CreateEventCategoryInput;
};


export type MutationCreateListingArgs = {
  data: CreateListingInput;
};


export type MutationCreateMerchantArgs = {
  data: CreateMerchantInput;
};


export type MutationCreateOrderArgs = {
  data: CreateOrderInput;
};


export type MutationCreateOrganizationArgs = {
  data: CreateOrganizationInput;
};


export type MutationDeleteEventCategoryArgs = {
  data: DeleteEventCategoryInput;
};


export type MutationDeleteListingArgs = {
  data: DeleteListingInput;
};


export type MutationInitiatePaymentAttemptArgs = {
  data: InitiatePaymentAttemptInput;
};


export type MutationNewBookingArgs = {
  data: NewBookingInput;
};


export type MutationRemoveMemberArgs = {
  data: RemoveMemberInput;
};


export type MutationRetractSignUpArgs = {
  data: RetractSignUpInput;
};


export type MutationSignUpArgs = {
  data: SignUpInput;
};


export type MutationSuperUpdateUserArgs = {
  data: SuperUpdateUserInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateBookingContactArgs = {
  data: UpdateBookingContactInput;
};


export type MutationUpdateBookingSemesterArgs = {
  data: UpdateBookingSemesterInput;
};


export type MutationUpdateBookingStatusArgs = {
  data: UpdateBookingStatusInput;
};


export type MutationUpdateEventArgs = {
  data: UpdateEventInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateEventCategoryArgs = {
  data: UpdateEventCategoryInput;
};


export type MutationUpdateListingArgs = {
  data: UpdateListingInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateOrganizationArgs = {
  data: UpdateOrganizationInput;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};

export type NewBookingCabinInput = {
  id: Scalars['ID']['input'];
};

export type NewBookingInput = {
  cabins: Array<NewBookingCabinInput>;
  email: Scalars['String']['input'];
  endDate: Scalars['DateTime']['input'];
  externalParticipantsCount: Scalars['Int']['input'];
  firstName: Scalars['String']['input'];
  internalParticipantsCount: Scalars['Int']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  startDate: Scalars['DateTime']['input'];
};

export type NewBookingResponse = {
  __typename?: 'NewBookingResponse';
  booking: Booking;
};

export type Order = {
  __typename?: 'Order';
  /** Number of attempts to pay for the order. */
  attempt: Scalars['Int']['output'];
  capturedPaymentAttempt: Maybe<PaymentAttempt>;
  /** The date and time the order was created. */
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isFinalState: Scalars['Boolean']['output'];
  paymentAttempt: Maybe<PaymentAttempt>;
  paymentAttempts: PaymentAttemptsResponse;
  /**
   * The current payment status of the order. This is updated asynchronously, so if the payment status is PENDING or CREATED,
   * it is recommended to poll the order to get the current status.
   */
  paymentStatus: OrderPaymentStatus;
  /** The product that the order is for. */
  product: Product;
  purchasedAt: Maybe<Scalars['DateTime']['output']>;
  totalPrice: Price;
  user: Maybe<PrivateUser>;
};


export type OrderPaymentAttemptArgs = {
  reference: InputMaybe<Scalars['String']['input']>;
};

export enum OrderBy {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type OrderInput = {
  id: Scalars['ID']['input'];
};

export enum OrderPaymentStatus {
  /** The order has been cancelled. This is a final state. */
  Cancelled = 'CANCELLED',
  /** The payment attempt has been authorized, but and the payment has been captured. This is a final state. */
  Captured = 'CAPTURED',
  /** The order has been created, and a payment attempt has been made. */
  Created = 'CREATED',
  /** The order has been created, but no payment attempt has been made. */
  Pending = 'PENDING',
  /** The payment attempt has been authorized, but the payment has been refunded. This is a final state. */
  Refunded = 'REFUNDED',
  /** The payment attempt has been authorized, but the payment has been reserved, but not captured. */
  Reserved = 'RESERVED'
}

export type OrderResponse = {
  __typename?: 'OrderResponse';
  order: Order;
};

export type OrdersInput = {
  /** Only get orders for the given product ID. */
  productId: InputMaybe<Scalars['ID']['input']>;
  /**
   * Only get orders for the given user ID. Requires super user status,
   * or the user ID to match the user ID of the order. Omit to default to
   * the current user.
   */
  userId: InputMaybe<Scalars['ID']['input']>;
};

export type OrdersResponse = {
  __typename?: 'OrdersResponse';
  orders: Array<Order>;
  total: Scalars['Int']['output'];
};

export type Organization = {
  __typename?: 'Organization';
  description: Scalars['String']['output'];
  events: Array<Event>;
  /**
   * The features that are enabled for the organization.
   * Changing these fields requires super user permissions.
   */
  featurePermissions: Array<FeaturePermission>;
  id: Scalars['ID']['output'];
  listings: Array<Listing>;
  /** The members of the organization */
  members: Maybe<Array<Member>>;
  name: Scalars['String']['output'];
};

export type OrganizationInput = {
  id: Scalars['ID']['input'];
};

export type OrganizationReseponse = {
  __typename?: 'OrganizationReseponse';
  organization: Organization;
};

export type OrganizationsResponse = {
  __typename?: 'OrganizationsResponse';
  organizations: Array<Organization>;
};

export type ParticipantsInput = {
  external: Scalars['Int']['input'];
  internal: Scalars['Int']['input'];
};

export enum ParticipationStatus {
  /** The user is confirmed to be attending the event */
  Confirmed = 'CONFIRMED',
  /** The user is on the wait list for the event */
  OnWaitlist = 'ON_WAITLIST',
  /** The user has signed up for the event, and had their sign up removed by an admin */
  Removed = 'REMOVED',
  /** The user has signed up for the event, and then retracted their sign up */
  Retracted = 'RETRACTED'
}

export type PaymentAttempt = {
  __typename?: 'PaymentAttempt';
  id: Scalars['ID']['output'];
  isFinalState: Scalars['Boolean']['output'];
  /** The order that the payment attempt is for. */
  order: Order;
  /** The reference for the payment attempt with the payment provider. */
  reference: Scalars['String']['output'];
  /**
   * The current state of the payment attempt. If the payment attempt is CREATED, it is recommended to poll
   * to get the most current state, as it can change asynchronously.
   */
  state: PaymentAttemptState;
};

export enum PaymentAttemptState {
  /** The payment attempt was aborted by the user. This is a final state. */
  Aborted = 'ABORTED',
  /** The payment attempt was successful, and the user has authorized the payment. This is a final state. */
  Authorized = 'AUTHORIZED',
  /** The payment attempt has been started, but not completed. */
  Created = 'CREATED',
  /** The payment attempt expired. This is a final state. */
  Expired = 'EXPIRED',
  /** The payment attempt failed. This is a final state. */
  Failed = 'FAILED',
  /** The payment attempt was terminated (typically by us). This is a final state. */
  Terminated = 'TERMINATED'
}

export type PaymentAttemptsInput = {
  /** Only get payment atttempts for the given order ID. */
  orderId: InputMaybe<Scalars['ID']['input']>;
  /** Only get payment attempts for the given product ID. */
  productId: InputMaybe<Scalars['ID']['input']>;
  /**
   * Only get payment attempts for the given user ID. Requires super user status,
   * or the user ID to match the user ID of the payment attempt. Omit to default to
   * the current user.
   */
  userId: InputMaybe<Scalars['ID']['input']>;
};

export type PaymentAttemptsResponse = {
  __typename?: 'PaymentAttemptsResponse';
  paymentAttempts: Array<PaymentAttempt>;
  total: Scalars['Int']['output'];
};

export type Price = {
  __typename?: 'Price';
  /** The unit of the price, e.g. NOK, USD, EUR, etc. */
  unit: Scalars['String']['output'];
  /** The value of the price, in the given unit. */
  value: Scalars['Int']['output'];
  valueInNok: Scalars['Float']['output'];
};

/**
 * PrivateUser should only be used when accessed by the authenticated user themselves
 * as it contains sensitive information.
 */
export type PrivateUser = {
  __typename?: 'PrivateUser';
  allergies: Maybe<Scalars['String']['output']>;
  /** If the user is permitted to update their graduation year */
  canUpdateYear: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Student email */
  email: Scalars['String']['output'];
  firstLogin: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  /** The users grade year, from 1 - 6(+) */
  gradeYear: Maybe<Scalars['Int']['output']>;
  /** Expected graduation year for the user */
  graduationYear: Maybe<Scalars['Int']['output']>;
  /** The last time the users graduation year was updated */
  graduationYearUpdatedAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  /** true if the user is a super user, false otherwise */
  isSuperUser: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  /** All organizations the user is a member of */
  organizations: Array<Organization>;
  phoneNumber: Maybe<Scalars['String']['output']>;
  /** The users' sign ups */
  signUps: UserSignUps;
  /** The users' study program */
  studyProgram: Maybe<StudyProgram>;
  username: Scalars['String']['output'];
};


/**
 * PrivateUser should only be used when accessed by the authenticated user themselves
 * as it contains sensitive information.
 */
export type PrivateUserSignUpsArgs = {
  data: InputMaybe<UserSignUpsInput>;
};

export type Product = {
  __typename?: 'Product';
  /** The description of the product. */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The name of the product */
  name: Scalars['String']['output'];
  /** price in øre, i.e. 100 = 1 NOK */
  price: Price;
};

export type ProductResponse = {
  __typename?: 'ProductResponse';
  products: Array<Product>;
  total: Scalars['Int']['output'];
};

/**
 * The public facing user type, with limited information.
 * This type is is available to other users, and should therefore not contain sensitive information,
 * unless the information is restricted by access control.
 */
export type PublicUser = {
  __typename?: 'PublicUser';
  /** The users' given/first name */
  firstName: Scalars['String']['output'];
  /** The users' grade year */
  gradeYear: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  /** The users' family/last name */
  lastName: Scalars['String']['output'];
  /** The users' username */
  username: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  bookingContact: BookingContactResponse;
  bookingSemesters: BookingSemestersResponse;
  cabins: CabinsResponse;
  categories: EventCategoriesResponse;
  event: EventResponse;
  events: EventsResponse;
  hasFeaturePermission: HasFeaturePermissionResponse;
  hasRole: HasRoleResponse;
  listing: ListingResponse;
  listings: ListingsResponse;
  /** Get an order by its ID. */
  order: OrderResponse;
  /**
   * Get orders, filtered by the given input. Unless the user is a super user, only
   * orders for the current user will be returned.
   */
  orders: OrdersResponse;
  /** Get an organization by its ID */
  organization: OrganizationReseponse;
  /** Get all organizations */
  organizations: OrganizationsResponse;
  /**
   * Get payment attempts, filtered by the given input. Unless the user is a super user, only
   * payment attempts for the current user will be returned.
   */
  paymentAttempts: PaymentAttemptsResponse;
  products: ProductResponse;
  serverTime: ServerTimeResponse;
  totalCost: TotalCostResponse;
  user: UserResponse;
  users: UsersResponse;
};


export type QueryEventArgs = {
  data: EventInput;
};


export type QueryEventsArgs = {
  data: InputMaybe<EventsInput>;
};


export type QueryHasFeaturePermissionArgs = {
  data: HasFeaturePermissionInput;
};


export type QueryHasRoleArgs = {
  data: HasRoleInput;
};


export type QueryListingArgs = {
  data: ListingInput;
};


export type QueryOrderArgs = {
  data: OrderInput;
};


export type QueryOrdersArgs = {
  data: InputMaybe<OrdersInput>;
};


export type QueryOrganizationArgs = {
  data: OrganizationInput;
};


export type QueryPaymentAttemptsArgs = {
  data: InputMaybe<PaymentAttemptsInput>;
};


export type QueryTotalCostArgs = {
  data: TotalCostInput;
};

export type RemoveMemberInput = {
  id: Scalars['ID']['input'];
};

export type RemoveMemberResponse = {
  __typename?: 'RemoveMemberResponse';
  member: Member;
};

export type RetractSignUpInput = {
  /** The event to retract the sign up for */
  eventId: Scalars['ID']['input'];
};

export type RetractSignUpResponse = {
  __typename?: 'RetractSignUpResponse';
  signUp: SignUp;
};

export enum Role {
  /**
   * An admin of the organization, can do everything a member can,
   * # and can also manage members in the organization and delete the organization.
   */
  Admin = 'ADMIN',
  /**
   * A member of the organization, can do everything except
   * manage members in the organization and delete the organization.
   */
  Member = 'MEMBER'
}

export enum Semester {
  Fall = 'FALL',
  Spring = 'SPRING'
}

export type ServerTimeResponse = {
  __typename?: 'ServerTimeResponse';
  serverTime: Scalars['DateTime']['output'];
};

export type SignUp = {
  __typename?: 'SignUp';
  /**
   * If the user is on the wait list, this field will be set to the approximate position on the wait list.
   * Since the actual position on the wait list depends on which slots the user can attend, and various other
   * factors, this is a naive approximation and should not be relied upon for anything other than a rough estimate.
   */
  approximatePositionOnWaitList: Maybe<Scalars['Int']['output']>;
  /** The time the user signed up for the event */
  createdAt: Scalars['DateTime']['output'];
  /** The event the user signed up for */
  event: Event;
  id: Scalars['ID']['output'];
  order: Maybe<Order>;
  /** The status of the user's participation in the event */
  participationStatus: ParticipationStatus;
  /** The user that signed up for the event */
  user: PublicUser;
  userProvidedInformation: Maybe<Scalars['String']['output']>;
};

export enum SignUpAvailability {
  /** Sign ups are open, enabled, and there is at least one slot available for the user to sign up for. */
  Available = 'AVAILABLE',
  /** The user is not signed up for the event, and sign ups are closed */
  Closed = 'CLOSED',
  Confirmed = 'CONFIRMED',
  /** Sign ups are not enabled for the event */
  Disabled = 'DISABLED',
  /** Sign ups have not opened yet */
  NotOpen = 'NOT_OPEN',
  OnWaitlist = 'ON_WAITLIST',
  /**
   * There are no slots for the event for the user to sign up for, regardless of their current capacity.
   * If the user is not logged in, the status will always be UNAVAILABLE.
   */
  Unavailable = 'UNAVAILABLE',
  /** All slots are full, and the user is not signed up for the event. The user can sign up for the wait list. */
  WaitlistAvailable = 'WAITLIST_AVAILABLE'
}

export type SignUpData = {
  /**
   * Total capacity for the event, regardless of the capacity in each slot.
   * This number takes precedence over the capacity in each slot, so if the remaining capacity on the event is 0
   * no more users can be registered as attending.
   */
  capacity: Scalars['Int']['input'];
  /** The time that sign ups close for the event. This must be after signUpsOpenAt. */
  signUpsEndAt: Scalars['DateTime']['input'];
  /** The time that sign ups open for the event. This must be before the start time of the event. */
  signUpsStartAt: Scalars['DateTime']['input'];
  /** The slots for the event. If this is not provided, but capacity is, then all users can attend the event. */
  slots: Array<CreateEventSlot>;
  /** Ticket purchase details for the event. If this is not provided, then the event is free. */
  tickets: InputMaybe<EventTicketData>;
};

export type SignUpInput = {
  /** The event to sign up for */
  eventId: Scalars['ID']['input'];
  /** If the event requires user provided information, this field must be set */
  userProvidedInformation: InputMaybe<Scalars['String']['input']>;
};

export type SignUpResponse = {
  __typename?: 'SignUpResponse';
  signUp: SignUp;
};

export type SignUps = {
  __typename?: 'SignUps';
  confirmed: SignUpsWithTotalCount;
  retracted: SignUpsWithTotalCount;
  waitList: SignUpsWithTotalCount;
};

export type SignUpsWithTotalCount = {
  __typename?: 'SignUpsWithTotalCount';
  signUps: Array<SignUp>;
  total: Scalars['Int']['output'];
};

export enum Status {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type StudyProgram = {
  __typename?: 'StudyProgram';
  externalId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type SuperUpdateUserInput = {
  allergies: InputMaybe<Scalars['String']['input']>;
  firstName: InputMaybe<Scalars['String']['input']>;
  graduationYear: InputMaybe<Scalars['Int']['input']>;
  isSuperUser: InputMaybe<Scalars['Boolean']['input']>;
  lastName: InputMaybe<Scalars['String']['input']>;
  phoneNumber: InputMaybe<Scalars['String']['input']>;
};

export type SuperUpdateUserResponse = {
  __typename?: 'SuperUpdateUserResponse';
  user: PrivateUser;
};

export type TotalCostInput = {
  cabins: Array<CabinInput>;
  endDate: Scalars['DateTime']['input'];
  participants: ParticipantsInput;
  startDate: Scalars['DateTime']['input'];
};

export type TotalCostResponse = {
  __typename?: 'TotalCostResponse';
  totalCost: Scalars['Int']['output'];
};

export type UpdateBookingContactInput = {
  /** The email address of the booking contact, will be publicly available, pass the empty string to remove the email address */
  email: InputMaybe<Scalars['String']['input']>;
  /** The full name of the booking contact, will be publicly available, pass the empty string to remove the name */
  name: InputMaybe<Scalars['String']['input']>;
  /** The phone number of the booking contact, will be publicly available, pass the empty string to remove the phone number */
  phoneNumber: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBookingContactResponse = {
  __typename?: 'UpdateBookingContactResponse';
  bookingContact: BookingContact;
};

export type UpdateBookingResponse = {
  __typename?: 'UpdateBookingResponse';
  booking: Booking;
};

export type UpdateBookingSemesterInput = {
  /** Whether or not bookings are enabled for this semester */
  bookingsEnabled: InputMaybe<Scalars['Boolean']['input']>;
  /** The end date for the booking period */
  endAt: InputMaybe<Scalars['DateTime']['input']>;
  /** There are only ever two semesters, so this is the ID of the semester to update. */
  semester: Semester;
  /** The start date for the booking period */
  startAt: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateBookingSemesterResponse = {
  __typename?: 'UpdateBookingSemesterResponse';
  bookingSemester: BookingSemester;
};

export type UpdateBookingStatusInput = {
  id: Scalars['ID']['input'];
  status: Status;
};

export type UpdateCategoriesInput = {
  id: Scalars['ID']['input'];
};

export type UpdateEventCategoryInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type UpdateEventCategoryResponse = {
  __typename?: 'UpdateEventCategoryResponse';
  category: EventCategory;
};

export type UpdateEventInput = {
  /**
   * Total capacity for the event, regardless of the capacity in each slot.
   * This number takes precedence over the capacity in each slot, so if the remaining capacity on the event is 0
   * no more users can be registered as attending. Cannot be less than the number of users currently signed up for the event.
   */
  capacity: InputMaybe<Scalars['Int']['input']>;
  /** categories is a list of cateogry IDs to which the event belongs */
  categories: InputMaybe<Array<UpdateCategoriesInput>>;
  /**
   * The description of the event, defaults to "". We support markdown on the client, so this can be markdown.
   * This will be displayed to users.
   */
  description: InputMaybe<Scalars['String']['input']>;
  /** The end time of the event, must be after startAt. */
  endAt: InputMaybe<Scalars['DateTime']['input']>;
  /** location of the event */
  location: InputMaybe<Scalars['String']['input']>;
  /** The name of the event, this will be displayed to users */
  name: InputMaybe<Scalars['String']['input']>;
  /** If true, sign ups require user provided information */
  signUpsRequireUserProvidedInformation: InputMaybe<Scalars['Boolean']['input']>;
  /** If true, sign ups are retractable for the event */
  signUpsRetractable: InputMaybe<Scalars['Boolean']['input']>;
  slots: InputMaybe<UpdateSlotsInput>;
  /** The start time of the event. Must be before endAt and after the current time. */
  startAt: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateEventResponse = {
  __typename?: 'UpdateEventResponse';
  event: Event;
};

export type UpdateListingInput = {
  /** An optional URL to the application form for the listing. */
  applicationUrl: InputMaybe<Scalars['String']['input']>;
  /** At what time the listing will close, will show as a deadline to users, and the listing will be hidden afterwards */
  closesAt: InputMaybe<Scalars['DateTime']['input']>;
  /** The description of the listing, can be markdown. */
  description: InputMaybe<Scalars['String']['input']>;
  /** The name of the listing, will be visible to users. */
  name: InputMaybe<Scalars['String']['input']>;
};

export type UpdateListingResponse = {
  __typename?: 'UpdateListingResponse';
  listing: Listing;
};

export type UpdateOrganizationInput = {
  /**
   * The new description of the organization, cannot exceed 10 000 characters
   * Omitting the value or passing null will leave the description unchanged
   */
  description: InputMaybe<Scalars['String']['input']>;
  /**
   * Features to enable for the organization.
   * Requires that the current user is a super user, otherwise, this field is ignored.
   */
  featurePermissions: InputMaybe<Array<FeaturePermission>>;
  /** The ID of the organization to update */
  id: Scalars['ID']['input'];
  /**
   * The new name of the organization
   * Omitting the value or passing null will leave the name unchanged
   */
  name: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOrganizationResponse = {
  __typename?: 'UpdateOrganizationResponse';
  organization: Organization;
};

export type UpdateSlotInput = {
  capacity: InputMaybe<Scalars['Int']['input']>;
  gradeYears: InputMaybe<Array<Scalars['Int']['input']>>;
  id: Scalars['ID']['input'];
};

export type UpdateSlotsInput = {
  create: InputMaybe<Array<CreateSlotInput>>;
  delete: InputMaybe<Array<DeleteSlotInput>>;
  update: InputMaybe<Array<UpdateSlotInput>>;
};

export type UpdateUserInput = {
  allergies: InputMaybe<Scalars['String']['input']>;
  firstName: InputMaybe<Scalars['String']['input']>;
  graduationYear: InputMaybe<Scalars['Int']['input']>;
  lastName: InputMaybe<Scalars['String']['input']>;
  phoneNumber: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserResponse = {
  __typename?: 'UpdateUserResponse';
  user: PrivateUser;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  user: Maybe<PrivateUser>;
};

export type UserSignUps = {
  __typename?: 'UserSignUps';
  signUps: Array<SignUp>;
  total: Scalars['Int']['output'];
};

export type UserSignUpsInput = {
  orderBy: InputMaybe<OrderBy>;
  participationStatus: InputMaybe<ParticipationStatus>;
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  super: Array<PrivateUser>;
  total: Scalars['Int']['output'];
  users: Array<PublicUser>;
};

export type BookNow_QueryFragment = { __typename?: 'Query', cabins: { __typename?: 'CabinsResponse', cabins: Array<{ __typename?: 'Cabin', id: string, name: string, internalPrice: number, externalPrice: number }> } } & { ' $fragmentName'?: 'BookNow_QueryFragment' };

export type CabinsInfoSection_QueryFragment = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'BookNow_QueryFragment': BookNow_QueryFragment } }
) & { ' $fragmentName'?: 'CabinsInfoSection_QueryFragment' };

export type ContactCabinBoard_QueryFragment = { __typename?: 'Query', bookingContact: { __typename?: 'BookingContactResponse', bookingContact: { __typename?: 'BookingContact', id: string, name: string, email: string, phoneNumber: string } } } & { ' $fragmentName'?: 'ContactCabinBoard_QueryFragment' };

export type BookingDetails_TotalCostQueryVariables = Exact<{
  data: TotalCostInput;
}>;


export type BookingDetails_TotalCostQuery = { __typename?: 'Query', totalCost: { __typename?: 'TotalCostResponse', totalCost: number } };

export type Contract_QueryFragment = { __typename?: 'Query', bookingContact: { __typename?: 'BookingContactResponse', bookingContact: { __typename?: 'BookingContact', name: string, email: string, phoneNumber: string, id: string } } } & { ' $fragmentName'?: 'Contract_QueryFragment' };

export type PickDates_CabinFragment = { __typename?: 'Cabin', id: string, name: string } & { ' $fragmentName'?: 'PickDates_CabinFragment' };

export type CabinsBookPageQueryVariables = Exact<{ [key: string]: never; }>;


export type CabinsBookPageQuery = (
  { __typename?: 'Query', cabins: { __typename?: 'CabinsResponse', cabins: Array<(
      { __typename?: 'Cabin', id: string, name: string, capacity: number }
      & { ' $fragmentRefs'?: { 'PickDates_CabinFragment': PickDates_CabinFragment } }
    )> }, user: { __typename?: 'UserResponse', user: { __typename?: 'PrivateUser', id: string, firstName: string, lastName: string, phoneNumber: string | null, email: string } | null } }
  & { ' $fragmentRefs'?: { 'Contract_QueryFragment': Contract_QueryFragment } }
);

export type CabinsBookPageTotalCostQueryVariables = Exact<{
  data: TotalCostInput;
}>;


export type CabinsBookPageTotalCostQuery = { __typename?: 'Query', totalCost: { __typename?: 'TotalCostResponse', totalCost: number } };

export type CabinsBookPageCreateBookingMutationVariables = Exact<{
  data: NewBookingInput;
}>;


export type CabinsBookPageCreateBookingMutation = { __typename?: 'Mutation', newBooking: { __typename?: 'NewBookingResponse', booking: { __typename?: 'Booking', id: string, startDate: string, endDate: string, firstName: string, lastName: string, email: string, phoneNumber: string, status: Status, cabins: Array<{ __typename?: 'Cabin', id: string, name: string } | null> } } };

export type CabinsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type CabinsPageQuery = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'CabinsInfoSection_QueryFragment': CabinsInfoSection_QueryFragment;'ContactCabinBoard_QueryFragment': ContactCabinBoard_QueryFragment } }
);

export type OrderQueryVariables = Exact<{
  data: OrderInput;
}>;


export type OrderQuery = { __typename?: 'Query', order: { __typename?: 'OrderResponse', order: { __typename?: 'Order', id: string, paymentStatus: OrderPaymentStatus, isFinalState: boolean, product: { __typename?: 'Product', id: string, name: string }, totalPrice: { __typename?: 'Price', value: number, unit: string, valueInNok: number } } } };

export type InitiatePaymentAttemptMutationVariables = Exact<{
  data: InitiatePaymentAttemptInput;
}>;


export type InitiatePaymentAttemptMutation = { __typename?: 'Mutation', initiatePaymentAttempt: { __typename?: 'InitiatePaymentAttemptResponse', redirectUrl: string } };

export type AppLoginButtonUserQueryVariables = Exact<{ [key: string]: never; }>;


export type AppLoginButtonUserQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user: { __typename?: 'PrivateUser', id: string, firstName: string } | null } };

export type AppLoginRequiredUserQueryVariables = Exact<{ [key: string]: never; }>;


export type AppLoginRequiredUserQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user: { __typename?: 'PrivateUser', id: string, firstName: string } | null } };

export type HasFeaturePermissionQueryVariables = Exact<{
  data: HasFeaturePermissionInput;
}>;


export type HasFeaturePermissionQuery = { __typename?: 'Query', hasFeaturePermission: { __typename?: 'HasFeaturePermissionResponse', id: FeaturePermission, hasFeaturePermission: boolean } };

export type ListingItem_ListingFragment = { __typename?: 'Listing', id: string, name: string, closesAt: string } & { ' $fragmentName'?: 'ListingItem_ListingFragment' };

export type Listings_QueryFragment = { __typename?: 'Query', listings: { __typename?: 'ListingsResponse', listings: Array<(
      { __typename?: 'Listing', id: string, organization: { __typename?: 'Organization', id: string, name: string } }
      & { ' $fragmentRefs'?: { 'ListingItem_ListingFragment': ListingItem_ListingFragment } }
    )> } } & { ' $fragmentName'?: 'Listings_QueryFragment' };

export type ListingsPage_QueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ListingsPage_QueryQuery = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'Listings_QueryFragment': Listings_QueryFragment } }
);

export type ListingPage_QueryQueryVariables = Exact<{
  data: ListingInput;
}>;


export type ListingPage_QueryQuery = { __typename?: 'Query', listing: { __typename?: 'ListingResponse', listing: (
      { __typename?: 'Listing', id: string, description: string }
      & { ' $fragmentRefs'?: { 'TitleCard_ListingFragment': TitleCard_ListingFragment } }
    ) } };

export type TitleCard_ListingFragment = { __typename?: 'Listing', name: string, applicationUrl: string, closesAt: string, organization: { __typename?: 'Organization', id: string, name: string } } & { ' $fragmentName'?: 'TitleCard_ListingFragment' };

export type ListingLayout_QueryQueryVariables = Exact<{
  data: ListingInput;
}>;


export type ListingLayout_QueryQuery = { __typename?: 'Query', listing: { __typename?: 'ListingResponse', listing: { __typename?: 'Listing', id: string, name: string, organization: { __typename?: 'Organization', id: string, name: string } } } };

export type ListingMetadataQueryVariables = Exact<{
  data: ListingInput;
}>;


export type ListingMetadataQuery = { __typename?: 'Query', listing: { __typename?: 'ListingResponse', listing: { __typename?: 'Listing', id: string, name: string, description: string } } };

export type NewListing_QueryQueryVariables = Exact<{ [key: string]: never; }>;


export type NewListing_QueryQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user: { __typename?: 'PrivateUser', id: string, organizations: Array<{ __typename?: 'Organization', id: string, name: string }> } | null } };

export type NewListing_CreateListingMutationMutationVariables = Exact<{
  data: CreateListingInput;
}>;


export type NewListing_CreateListingMutationMutation = { __typename?: 'Mutation', createListing: { __typename?: 'CreateListingResponse', listing: { __typename?: 'Listing', id: string, name: string, description: string, closesAt: string, applicationUrl: string, organization: { __typename?: 'Organization', id: string, name: string } } } };

export type OrganizationsAdminEventsAboutPage_EventQueryQueryVariables = Exact<{
  data: EventInput;
}>;


export type OrganizationsAdminEventsAboutPage_EventQueryQuery = { __typename?: 'Query', event: { __typename?: 'EventResponse', event: { __typename?: 'Event', id: string, name: string, startAt: string, endAt: string, type: EventType, location: string, contactEmail: string, ticketInformation: { __typename?: 'EventTicketInformation', product: { __typename?: 'Product', id: string, price: { __typename?: 'Price', valueInNok: number } } | null } | null, organization: { __typename?: 'Organization', id: string, name: string } | null, signUps: { __typename?: 'SignUps', confirmed: { __typename?: 'SignUpsWithTotalCount', total: number }, waitList: { __typename?: 'SignUpsWithTotalCount', total: number } } | null } } };

export type EventAdminLayout_EventQueryVariables = Exact<{
  data: EventInput;
}>;


export type EventAdminLayout_EventQuery = { __typename?: 'Query', event: { __typename?: 'EventResponse', event: { __typename?: 'Event', id: string, name: string, organization: { __typename?: 'Organization', id: string, name: string } | null } } };

export type OrganizationsAdminEventsSignUpsPage_SignUpFragment = { __typename?: 'SignUp', id: string, createdAt: string, userProvidedInformation: string | null, order: { __typename?: 'Order', id: string, paymentStatus: OrderPaymentStatus } | null, user: { __typename?: 'PublicUser', id: string, firstName: string, lastName: string, gradeYear: number | null, username: string } } & { ' $fragmentName'?: 'OrganizationsAdminEventsSignUpsPage_SignUpFragment' };

export type OrganizationsAdminEventsSignUpsPage_EventQueryQueryVariables = Exact<{
  data: EventInput;
}>;


export type OrganizationsAdminEventsSignUpsPage_EventQueryQuery = { __typename?: 'Query', event: { __typename?: 'EventResponse', event: { __typename?: 'Event', id: string, type: EventType, signUpsRequireUserProvidedInformation: boolean, signUps: { __typename?: 'SignUps', confirmed: { __typename?: 'SignUpsWithTotalCount', total: number, signUps: Array<(
            { __typename?: 'SignUp' }
            & { ' $fragmentRefs'?: { 'OrganizationsAdminEventsSignUpsPage_SignUpFragment': OrganizationsAdminEventsSignUpsPage_SignUpFragment } }
          )> }, waitList: { __typename?: 'SignUpsWithTotalCount', total: number, signUps: Array<(
            { __typename?: 'SignUp' }
            & { ' $fragmentRefs'?: { 'OrganizationsAdminEventsSignUpsPage_SignUpFragment': OrganizationsAdminEventsSignUpsPage_SignUpFragment } }
          )> }, retracted: { __typename?: 'SignUpsWithTotalCount', total: number, signUps: Array<(
            { __typename?: 'SignUp' }
            & { ' $fragmentRefs'?: { 'OrganizationsAdminEventsSignUpsPage_SignUpFragment': OrganizationsAdminEventsSignUpsPage_SignUpFragment } }
          )> } } | null } } };

export type AdminOrganizationsEventsPageQueryVariables = Exact<{
  data: OrganizationInput;
}>;


export type AdminOrganizationsEventsPageQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationReseponse', organization: { __typename?: 'Organization', id: string, events: Array<{ __typename?: 'Event', type: EventType, id: string, name: string, startAt: string, signUps: { __typename?: 'SignUps', confirmed: { __typename?: 'SignUpsWithTotalCount', total: number } } | null, signUpDetails: { __typename?: 'EventSignUpDetails', capacity: number } | null }> } } };

export type OrganizationPageLayoutQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type OrganizationPageLayoutQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationReseponse', organization: { __typename?: 'Organization', id: string, name: string } } };

export type AdminOrganizationsPageListingsQueryVariables = Exact<{
  data: OrganizationInput;
}>;


export type AdminOrganizationsPageListingsQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationReseponse', organization: { __typename?: 'Organization', id: string, listings: Array<{ __typename?: 'Listing', id: string, name: string, closesAt: string }> } } };

export type AdminOrganizationsPageMembersQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type AdminOrganizationsPageMembersQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationReseponse', organization: { __typename?: 'Organization', id: string, members: Array<{ __typename?: 'Member', id: string, role: Role, user: { __typename?: 'PublicUser', id: string, firstName: string, lastName: string } }> | null } }, user: { __typename?: 'UserResponse', user: { __typename?: 'PrivateUser', id: string } | null }, hasRole: { __typename?: 'HasRoleResponse', hasRole: boolean } };

export type OrganizationsAdminMembersPage_RemoveMemberMutationVariables = Exact<{
  data: RemoveMemberInput;
}>;


export type OrganizationsAdminMembersPage_RemoveMemberMutation = { __typename?: 'Mutation', removeMember: { __typename?: 'RemoveMemberResponse', member: { __typename?: 'Member', id: string } } };

export type OrganizationAdminLayout_HasRoleQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type OrganizationAdminLayout_HasRoleQuery = { __typename?: 'Query', hasRole: { __typename?: 'HasRoleResponse', hasRole: boolean } };

export type UserForm_UserFragment = { __typename?: 'PrivateUser', firstName: string, lastName: string, phoneNumber: string | null, graduationYear: number | null, allergies: string | null, graduationYearUpdatedAt: string | null, canUpdateYear: boolean, gradeYear: number | null, email: string, studyProgram: { __typename?: 'StudyProgram', id: string, name: string } | null } & { ' $fragmentName'?: 'UserForm_UserFragment' };

export type ProfileEditPage_UserQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileEditPage_UserQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user: (
      { __typename?: 'PrivateUser', id: string }
      & { ' $fragmentRefs'?: { 'UserForm_UserFragment': UserForm_UserFragment } }
    ) | null } };

export type ProfileEditPage_UpdateUserMutationVariables = Exact<{
  data: UpdateUserInput;
}>;


export type ProfileEditPage_UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UpdateUserResponse', user: (
      { __typename?: 'PrivateUser', id: string }
      & { ' $fragmentRefs'?: { 'UserForm_UserFragment': UserForm_UserFragment } }
    ) } };

export type OrderStatus_SignUpFragment = { __typename?: 'SignUp', order: { __typename?: 'Order', id: string, paymentStatus: OrderPaymentStatus, totalPrice: { __typename?: 'Price', valueInNok: number } } | null } & { ' $fragmentName'?: 'OrderStatus_SignUpFragment' };

export type ParticipationStatus_SignUpFragment = { __typename?: 'SignUp', participationStatus: ParticipationStatus, approximatePositionOnWaitList: number | null } & { ' $fragmentName'?: 'ParticipationStatus_SignUpFragment' };

export type ProfileEventsPageQueryVariables = Exact<{
  data: InputMaybe<UserSignUpsInput>;
}>;


export type ProfileEventsPageQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user: { __typename?: 'PrivateUser', id: string, all: { __typename?: 'UserSignUps', total: number }, confirmed: { __typename?: 'UserSignUps', total: number }, onWaitlist: { __typename?: 'UserSignUps', total: number }, retracted: { __typename?: 'UserSignUps', total: number }, removed: { __typename?: 'UserSignUps', total: number }, signUps: { __typename?: 'UserSignUps', signUps: Array<(
          { __typename?: 'SignUp', id: string, createdAt: string, event: { __typename?: 'Event', id: string, name: string, startAt: string, type: EventType } }
          & { ' $fragmentRefs'?: { 'OrderStatus_SignUpFragment': OrderStatus_SignUpFragment;'ParticipationStatus_SignUpFragment': ParticipationStatus_SignUpFragment } }
        )> } } | null } };

export type ProfileLayout_UserQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileLayout_UserQueryQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user: { __typename?: 'PrivateUser', id: string } | null } };

export type ProfileOrdersPageQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileOrdersPageQuery = { __typename?: 'Query', orders: { __typename?: 'OrdersResponse', orders: Array<{ __typename?: 'Order', id: string, createdAt: string, purchasedAt: string | null, paymentStatus: OrderPaymentStatus, isFinalState: boolean, capturedPaymentAttempt: { __typename?: 'PaymentAttempt', id: string, reference: string, state: PaymentAttemptState } | null, product: { __typename?: 'Product', id: string, name: string }, totalPrice: { __typename?: 'Price', valueInNok: number } }> } };

export type UserOrganizationsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type UserOrganizationsPageQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user: { __typename?: 'PrivateUser', id: string, organizations: Array<{ __typename?: 'Organization', id: string, name: string }> } | null } };

export type AppProfileUserQueryVariables = Exact<{ [key: string]: never; }>;


export type AppProfileUserQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user: { __typename?: 'PrivateUser', id: string, firstName: string, lastName: string, gradeYear: number | null, studyProgram: { __typename?: 'StudyProgram', id: string, name: string } | null } | null } };

export type AppProfileCabinPermissionQueryVariables = Exact<{ [key: string]: never; }>;


export type AppProfileCabinPermissionQuery = { __typename?: 'Query', hasFeaturePermission: { __typename?: 'HasFeaturePermissionResponse', id: FeaturePermission, hasFeaturePermission: boolean } };

export type ReceiptPage_OrderQueryVariables = Exact<{
  data: OrderInput;
  reference: InputMaybe<Scalars['String']['input']>;
}>;


export type ReceiptPage_OrderQuery = { __typename?: 'Query', order: { __typename?: 'OrderResponse', order: { __typename?: 'Order', id: string, isFinalState: boolean, purchasedAt: string | null, paymentStatus: OrderPaymentStatus, product: { __typename?: 'Product', id: string, name: string }, paymentAttempt: { __typename?: 'PaymentAttempt', id: string, state: PaymentAttemptState, reference: string, isFinalState: boolean } | null, capturedPaymentAttempt: { __typename?: 'PaymentAttempt', id: string, state: PaymentAttemptState, reference: string } | null, totalPrice: { __typename?: 'Price', value: number, unit: string, valueInNok: number } } } };

export const BookNow_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookNow_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"internalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"externalPrice"}}]}}]}}]}}]} as unknown as DocumentNode<BookNow_QueryFragment, unknown>;
export const CabinsInfoSection_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CabinsInfoSection_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookNow_Query"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookNow_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"internalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"externalPrice"}}]}}]}}]}}]} as unknown as DocumentNode<CabinsInfoSection_QueryFragment, unknown>;
export const ContactCabinBoard_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ContactCabinBoard_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}}]}}]}}]} as unknown as DocumentNode<ContactCabinBoard_QueryFragment, unknown>;
export const Contract_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Contract_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<Contract_QueryFragment, unknown>;
export const PickDates_CabinFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PickDates_Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cabin"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<PickDates_CabinFragment, unknown>;
export const ListingItem_ListingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingItem_Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"closesAt"}}]}}]} as unknown as DocumentNode<ListingItem_ListingFragment, unknown>;
export const Listings_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listings_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingItem_Listing"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingItem_Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"closesAt"}}]}}]} as unknown as DocumentNode<Listings_QueryFragment, unknown>;
export const TitleCard_ListingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TitleCard_Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"closesAt"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TitleCard_ListingFragment, unknown>;
export const OrganizationsAdminEventsSignUpsPage_SignUpFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationsAdminEventsSignUpsPage_SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUp"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"userProvidedInformation"}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<OrganizationsAdminEventsSignUpsPage_SignUpFragment, unknown>;
export const UserForm_UserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserForm_User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PrivateUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"studyProgram"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UserForm_UserFragment, unknown>;
export const OrderStatus_SignUpFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderStatus_SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUp"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueInNok"}}]}}]}}]}}]} as unknown as DocumentNode<OrderStatus_SignUpFragment, unknown>;
export const ParticipationStatus_SignUpFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ParticipationStatus_SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUp"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"participationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"approximatePositionOnWaitList"}}]}}]} as unknown as DocumentNode<ParticipationStatus_SignUpFragment, unknown>;
export const BookingDetails_TotalCostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BookingDetails_TotalCost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TotalCostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCost"}}]}}]}}]} as unknown as DocumentNode<BookingDetails_TotalCostQuery, BookingDetails_TotalCostQueryVariables>;
export const CabinsBookPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CabinsBookPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PickDates_Cabin"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Contract_Query"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PickDates_Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cabin"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Contract_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CabinsBookPageQuery, CabinsBookPageQueryVariables>;
export const CabinsBookPageTotalCostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CabinsBookPageTotalCost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TotalCostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCost"}}]}}]}}]} as unknown as DocumentNode<CabinsBookPageTotalCostQuery, CabinsBookPageTotalCostQueryVariables>;
export const CabinsBookPageCreateBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CabinsBookPageCreateBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<CabinsBookPageCreateBookingMutation, CabinsBookPageCreateBookingMutationVariables>;
export const CabinsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CabinsPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CabinsInfoSection_Query"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ContactCabinBoard_Query"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookNow_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"internalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"externalPrice"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CabinsInfoSection_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookNow_Query"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ContactCabinBoard_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}}]}}]}}]} as unknown as DocumentNode<CabinsPageQuery, CabinsPageQueryVariables>;
export const OrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"order"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"isFinalState"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"valueInNok"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OrderQuery, OrderQueryVariables>;
export const InitiatePaymentAttemptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"initiatePaymentAttempt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InitiatePaymentAttemptInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initiatePaymentAttempt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"redirectUrl"}}]}}]}}]} as unknown as DocumentNode<InitiatePaymentAttemptMutation, InitiatePaymentAttemptMutationVariables>;
export const AppLoginButtonUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppLoginButtonUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]}}]} as unknown as DocumentNode<AppLoginButtonUserQuery, AppLoginButtonUserQueryVariables>;
export const AppLoginRequiredUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppLoginRequiredUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]}}]} as unknown as DocumentNode<AppLoginRequiredUserQuery, AppLoginRequiredUserQueryVariables>;
export const HasFeaturePermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HasFeaturePermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HasFeaturePermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasFeaturePermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hasFeaturePermission"}}]}}]}}]} as unknown as DocumentNode<HasFeaturePermissionQuery, HasFeaturePermissionQueryVariables>;
export const ListingsPage_QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListingsPage_Query"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Listings_Query"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingItem_Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"closesAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listings_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingItem_Listing"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListingsPage_QueryQuery, ListingsPage_QueryQueryVariables>;
export const ListingPage_QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListingPage_Query"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TitleCard_Listing"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TitleCard_Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"closesAt"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ListingPage_QueryQuery, ListingPage_QueryQueryVariables>;
export const ListingLayout_QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListingLayout_Query"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListingLayout_QueryQuery, ListingLayout_QueryQueryVariables>;
export const ListingMetadataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListingMetadata"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<ListingMetadataQuery, ListingMetadataQueryVariables>;
export const NewListing_QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NewListing_Query"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<NewListing_QueryQuery, NewListing_QueryQueryVariables>;
export const NewListing_CreateListingMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"NewListing_CreateListingMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateListingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createListing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"closesAt"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}}]}}]}}]}}]} as unknown as DocumentNode<NewListing_CreateListingMutationMutation, NewListing_CreateListingMutationMutationVariables>;
export const OrganizationsAdminEventsAboutPage_EventQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationsAdminEventsAboutPage_EventQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"ticketInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueInNok"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"signUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"waitList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<OrganizationsAdminEventsAboutPage_EventQueryQuery, OrganizationsAdminEventsAboutPage_EventQueryQueryVariables>;
export const EventAdminLayout_EventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventAdminLayout_Event"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<EventAdminLayout_EventQuery, EventAdminLayout_EventQueryVariables>;
export const OrganizationsAdminEventsSignUpsPage_EventQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationsAdminEventsSignUpsPage_EventQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"signUpsRequireUserProvidedInformation"}},{"kind":"Field","name":{"kind":"Name","value":"signUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"signUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationsAdminEventsSignUpsPage_SignUp"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"waitList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"signUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationsAdminEventsSignUpsPage_SignUp"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"retracted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"signUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationsAdminEventsSignUpsPage_SignUp"}}]}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationsAdminEventsSignUpsPage_SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUp"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"userProvidedInformation"}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<OrganizationsAdminEventsSignUpsPage_EventQueryQuery, OrganizationsAdminEventsSignUpsPage_EventQueryQueryVariables>;
export const AdminOrganizationsEventsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminOrganizationsEventsPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"signUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"signUpDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AdminOrganizationsEventsPageQuery, AdminOrganizationsEventsPageQueryVariables>;
export const OrganizationPageLayoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationPageLayout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<OrganizationPageLayoutQuery, OrganizationPageLayoutQueryVariables>;
export const AdminOrganizationsPageListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminOrganizationsPageListings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"closesAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AdminOrganizationsPageListingsQuery, AdminOrganizationsPageListingsQueryVariables>;
export const AdminOrganizationsPageMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminOrganizationsPageMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"role"},"value":{"kind":"EnumValue","value":"ADMIN"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasRole"}}]}}]}}]} as unknown as DocumentNode<AdminOrganizationsPageMembersQuery, AdminOrganizationsPageMembersQueryVariables>;
export const OrganizationsAdminMembersPage_RemoveMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OrganizationsAdminMembersPage_RemoveMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<OrganizationsAdminMembersPage_RemoveMemberMutation, OrganizationsAdminMembersPage_RemoveMemberMutationVariables>;
export const OrganizationAdminLayout_HasRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationAdminLayout_HasRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"role"},"value":{"kind":"EnumValue","value":"MEMBER"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasRole"}}]}}]}}]} as unknown as DocumentNode<OrganizationAdminLayout_HasRoleQuery, OrganizationAdminLayout_HasRoleQueryVariables>;
export const ProfileEditPage_UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProfileEditPage_User"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserForm_User"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserForm_User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PrivateUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"studyProgram"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ProfileEditPage_UserQuery, ProfileEditPage_UserQueryVariables>;
export const ProfileEditPage_UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ProfileEditPage_UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserForm_User"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserForm_User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PrivateUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"studyProgram"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ProfileEditPage_UpdateUserMutation, ProfileEditPage_UpdateUserMutationVariables>;
export const ProfileEventsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProfileEventsPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserSignUpsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"all"},"name":{"kind":"Name","value":"signUps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"participationStatus"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"confirmed"},"name":{"kind":"Name","value":"signUps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"participationStatus"},"value":{"kind":"EnumValue","value":"CONFIRMED"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"onWaitlist"},"name":{"kind":"Name","value":"signUps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"participationStatus"},"value":{"kind":"EnumValue","value":"ON_WAITLIST"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"retracted"},"name":{"kind":"Name","value":"signUps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"participationStatus"},"value":{"kind":"EnumValue","value":"RETRACTED"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"removed"},"name":{"kind":"Name","value":"signUps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"participationStatus"},"value":{"kind":"EnumValue","value":"REMOVED"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"signUps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderStatus_SignUp"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipationStatus_SignUp"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderStatus_SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUp"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueInNok"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ParticipationStatus_SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUp"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"participationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"approximatePositionOnWaitList"}}]}}]} as unknown as DocumentNode<ProfileEventsPageQuery, ProfileEventsPageQueryVariables>;
export const ProfileLayout_UserQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProfileLayout_UserQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<ProfileLayout_UserQueryQuery, ProfileLayout_UserQueryQueryVariables>;
export const ProfileOrdersPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProfileOrdersPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"capturedPaymentAttempt"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueInNok"}}]}},{"kind":"Field","name":{"kind":"Name","value":"purchasedAt"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"isFinalState"}}]}}]}}]}}]} as unknown as DocumentNode<ProfileOrdersPageQuery, ProfileOrdersPageQueryVariables>;
export const UserOrganizationsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserOrganizationsPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserOrganizationsPageQuery, UserOrganizationsPageQueryVariables>;
export const AppProfileUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppProfileUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"studyProgram"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AppProfileUserQuery, AppProfileUserQueryVariables>;
export const AppProfileCabinPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppProfileCabinPermission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasFeaturePermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"featurePermission"},"value":{"kind":"EnumValue","value":"CABIN_ADMIN"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hasFeaturePermission"}}]}}]}}]} as unknown as DocumentNode<AppProfileCabinPermissionQuery, AppProfileCabinPermissionQueryVariables>;
export const ReceiptPage_OrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ReceiptPage_Order"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reference"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isFinalState"}},{"kind":"Field","name":{"kind":"Name","value":"purchasedAt"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentAttempt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"reference"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reference"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"isFinalState"}}]}},{"kind":"Field","name":{"kind":"Name","value":"capturedPaymentAttempt"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"valueInNok"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ReceiptPage_OrderQuery, ReceiptPage_OrderQueryVariables>;