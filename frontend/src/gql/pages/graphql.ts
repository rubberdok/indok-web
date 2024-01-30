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
  cabin: Cabin;
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
  /**
   * The organization that is hosting the event. Events must be hosted by an organization, and the user
   * creating the event must be a member of the organization.
   */
  organizationId: Scalars['ID']['input'];
  signUpDetails: InputMaybe<SignUpData>;
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
  /** signUpAvailability describes the availability of sign ups for the event for the current user. */
  signUpAvailability: SignUpAvailability;
  signUpDetails: Maybe<EventSignUpDetails>;
  signUpsEnabled: Scalars['Boolean']['output'];
  /** The start time of the event. */
  startAt: Scalars['DateTime']['output'];
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

export type EventData = {
  /** categories is a list of cateogry IDs to which the event belongs */
  categories: InputMaybe<Array<Scalars['ID']['input']>>;
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
  /** The start time of the event. Events must have a start time. */
  startAt: Scalars['DateTime']['input'];
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

export type InitiatePaymentAttemptInput = {
  /** The ID of the order to initiate a payment attempt for. */
  orderId: Scalars['ID']['input'];
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

export type Mutation = {
  __typename?: 'Mutation';
  /** Add a member to the organization */
  addMember: AddMemberResponse;
  /** Create an event, requires that the user is logged in, and is a member of the organization that is hosting the event */
  createEvent: CreateEventResponse;
  /** Create a new event category, requires super user status */
  createEventCategory: CreateEventCategoryResponse;
  createListing: CreateListingResponse;
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

export type NewBookingInput = {
  cabinId: Scalars['ID']['input'];
  email: Scalars['String']['input'];
  endDate: Scalars['DateTime']['input'];
  firstName: Scalars['String']['input'];
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
  id: Scalars['ID']['output'];
};

export type Organization = {
  __typename?: 'Organization';
  description: Scalars['String']['output'];
  /**
   * The features that are enabled for the organization.
   * Changing these fields requires super user permissions.
   */
  featurePermissions: Array<FeaturePermission>;
  id: Scalars['ID']['output'];
  /** The members of the organization */
  members: Array<Member>;
  name: Scalars['String']['output'];
};

export type OrganizationsResponse = {
  __typename?: 'OrganizationsResponse';
  organizations: Array<Organization>;
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

export type Price = {
  __typename?: 'Price';
  /** The unit of the price, e.g. NOK, USD, EUR, etc. */
  unit: Scalars['String']['output'];
  /** The value of the price, in the given unit. */
  value: Scalars['Int']['output'];
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
  /** The users' study program */
  studyProgram: Maybe<StudyProgram>;
  username: Scalars['String']['output'];
};

export type Product = {
  __typename?: 'Product';
  id: Scalars['ID']['output'];
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
  listing: ListingResponse;
  listings: ListingsResponse;
  /** Get all organizations */
  organizations: Maybe<OrganizationsResponse>;
  products: ProductResponse;
  serverTime: ServerTimeResponse;
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


export type QueryListingArgs = {
  data: ListingInput;
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
  /** The event the user signed up for */
  event: Event;
  id: Scalars['ID']['output'];
  /** The status of the user's participation in the event */
  participationStatus: ParticipationStatus;
  /** The user that signed up for the event */
  user: PublicUser;
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
  /** If true, users can sign up for the event. If false, users cannot sign up for the event. */
  enabled: Scalars['Boolean']['input'];
  /** The time that sign ups close for the event. This must be after signUpsOpenAt. */
  signUpsEndAt: Scalars['DateTime']['input'];
  /** The time that sign ups open for the event. This must be before the start time of the event. */
  signUpsStartAt: Scalars['DateTime']['input'];
  /** The slots for the event. If this is not provided, but capacity is, then all users can attend the event. */
  slots: Array<CreateEventSlot>;
};

export type SignUpInput = {
  /** The event to sign up for */
  eventId: Scalars['ID']['input'];
};

export type SignUpResponse = {
  __typename?: 'SignUpResponse';
  signUp: SignUp;
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
  categories: InputMaybe<Array<Scalars['ID']['input']>>;
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

export type UsersResponse = {
  __typename?: 'UsersResponse';
  super: Array<PrivateUser>;
  total: Scalars['Int']['output'];
  users: Array<PublicUser>;
};

export type CabinsBookNowQueryVariables = Exact<{ [key: string]: never; }>;


export type CabinsBookNowQuery = { __typename?: 'Query', cabins: { __typename?: 'CabinsResponse', cabins: Array<{ __typename?: 'Cabin', id: string, name: string, internalPrice: number, externalPrice: number }> } };

export type BookingContactQueryVariables = Exact<{ [key: string]: never; }>;


export type BookingContactQuery = { __typename?: 'Query', bookingContact: { __typename?: 'BookingContactResponse', bookingContact: { __typename?: 'BookingContact', id: string, name: string, email: string } } };

export type ListingsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListingsQuery = { __typename?: 'Query', listings: { __typename?: 'ListingsResponse', listings: Array<{ __typename?: 'Listing', id: string, name: string, description: string, closesAt: string, organization: { __typename?: 'Organization', id: string, name: string } }> } };

export type UserFormUserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserFormUserQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user: { __typename?: 'PrivateUser', id: string, firstName: string, lastName: string, graduationYearUpdatedAt: string | null, canUpdateYear: boolean, gradeYear: number | null, graduationYear: number | null, allergies: string | null, phoneNumber: string | null, email: string, isSuperUser: boolean } | null } };

export type UserFormUpdateUserMutationVariables = Exact<{
  data: UpdateUserInput;
}>;


export type UserFormUpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UpdateUserResponse', user: { __typename?: 'PrivateUser', id: string, firstName: string, lastName: string, graduationYearUpdatedAt: string | null, canUpdateYear: boolean, gradeYear: number | null, graduationYear: number | null, allergies: string | null, phoneNumber: string | null, email: string, isSuperUser: boolean } } };

export type LoginButtonUserQueryVariables = Exact<{ [key: string]: never; }>;


export type LoginButtonUserQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user: { __typename?: 'PrivateUser', id: string, firstName: string } | null } };

export type ListingsPageQueryVariables = Exact<{
  data: ListingInput;
}>;


export type ListingsPageQuery = { __typename?: 'Query', listing: { __typename?: 'ListingResponse', listing: { __typename?: 'Listing', id: string, name: string, description: string, applicationUrl: string, closesAt: string, organization: { __typename?: 'Organization', id: string, name: string } } } };

export type OrganizationPageUserQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationPageUserQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user: { __typename?: 'PrivateUser', id: string, organizations: Array<{ __typename?: 'Organization', id: string, name: string }> } | null } };


export const CabinsBookNowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CabinsBookNow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"internalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"externalPrice"}}]}}]}}]}}]} as unknown as DocumentNode<CabinsBookNowQuery, CabinsBookNowQueryVariables>;
export const BookingContactDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<BookingContactQuery, BookingContactQueryVariables>;
export const ListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"closesAt"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListingsQuery, ListingsQueryVariables>;
export const UserFormUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserFormUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"isSuperUser"}}]}}]}}]}}]} as unknown as DocumentNode<UserFormUserQuery, UserFormUserQueryVariables>;
export const UserFormUpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserFormUpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"isSuperUser"}}]}}]}}]}}]} as unknown as DocumentNode<UserFormUpdateUserMutation, UserFormUpdateUserMutationVariables>;
export const LoginButtonUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoginButtonUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]}}]} as unknown as DocumentNode<LoginButtonUserQuery, LoginButtonUserQueryVariables>;
export const ListingsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListingsPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"closesAt"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListingsPageQuery, ListingsPageQueryVariables>;
export const OrganizationPageUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationPageUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OrganizationPageUserQuery, OrganizationPageUserQueryVariables>;