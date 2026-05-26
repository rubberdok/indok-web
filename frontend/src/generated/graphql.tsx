/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: string; output: string; }
  DateTime: { input: string; output: string; }
  Decimal: { input: number; output: number; }
  JSONString: { input: unknown; output: unknown; }
  UUID: { input: string; output: string; }
};

/** Booking type for admin users */
export type AdminBookingType = {
  __typename?: 'AdminBookingType';
  cabins: Array<CabinType>;
  checkIn: Scalars['Date']['output'];
  checkOut: Scalars['Date']['output'];
  declineReason: Scalars['String']['output'];
  externalParticipants: Scalars['Int']['output'];
  extraInfo: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  internalParticipants: Scalars['Int']['output'];
  isDeclined: Scalars['Boolean']['output'];
  isInternalPrice?: Maybe<Scalars['Int']['output']>;
  isTentative: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  nfcAccessGrants: Array<NfcAccessGrantType>;
  numberOfNights?: Maybe<Scalars['Int']['output']>;
  phone: Scalars['String']['output'];
  price?: Maybe<Scalars['Int']['output']>;
  receiverEmail: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
};

/**
 * Sets the field is_attending to False in the Sign Up for the user with the
 * given ID, for the event with the given ID
 * NOTE: The sign up still exists, it is not deleted from the database
 *       when a user signs off an event
 */
export type AdminEventSignOff = {
  __typename?: 'AdminEventSignOff';
  event?: Maybe<EventType>;
};

export type AdminUpdateUser = {
  __typename?: 'AdminUpdateUser';
  user?: Maybe<UserType>;
};

export type AdminUpdateUserNfc = {
  __typename?: 'AdminUpdateUserNfc';
  user?: Maybe<UserType>;
};

export type AdminUserInput = {
  allergies?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  graduationYear?: InputMaybe<Scalars['Int']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type AdminUserNfcInput = {
  permanentAccess?: InputMaybe<Scalars['Boolean']['input']>;
  pinCode?: InputMaybe<Scalars['String']['input']>;
  uidHex?: InputMaybe<Scalars['String']['input']>;
};

/** Booking type for fields available for not logged in users */
export type AllBookingsType = {
  __typename?: 'AllBookingsType';
  cabins: Array<CabinType>;
  checkIn: Scalars['Date']['output'];
  checkOut: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
};

export type AnswerInput = {
  answer: Scalars['String']['input'];
  questionId: Scalars['ID']['input'];
};

/** A user's answer to a question. */
export type AnswerType = {
  __typename?: 'AnswerType';
  answer: Scalars['String']['output'];
  id?: Maybe<Scalars['UUID']['output']>;
  question: QuestionType;
  uuid: Scalars['UUID']['output'];
};

/** An enumeration. */
export enum ArchiveArchiveDocumentTypeDocChoices {
  /** Annet */
  Annet = 'ANNET',
  /** Årbøker */
  Arboker = 'ARBOKER',
  /** Budsjett og Regnskap */
  BudsjettOgRegnskap = 'BUDSJETT_OG_REGNSKAP',
  /** Foreningens lover */
  ForeningensLover = 'FORENINGENS_LOVER',
  /** Generalforsamling */
  Generalforsamling = 'GENERALFORSAMLING',
  /** Januscript */
  Januscript = 'JANUSCRIPT',
  /** Støtte fra HS */
  StotteFraHs = 'STOTTE_FRA_HS',
  /** Utveksling */
  Utveksling = 'UTVEKSLING'
}

export type ArchiveDocumentType = {
  __typename?: 'ArchiveDocumentType';
  featured: Scalars['Boolean']['output'];
  fileLocation: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  typeDoc: ArchiveArchiveDocumentTypeDocChoices;
  webLink?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type AssignMembership = {
  __typename?: 'AssignMembership';
  membership?: Maybe<MembershipType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type AssignNfcCard = {
  __typename?: 'AssignNfcCard';
  assignment?: Maybe<NfcCardAssignmentType>;
  ok: Scalars['Boolean']['output'];
};

export type AssignNfcCardInput = {
  accessEnd?: InputMaybe<Scalars['DateTime']['input']>;
  accessStart?: InputMaybe<Scalars['DateTime']['input']>;
  externalHolderName?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSONString']['input']>;
  permanentAccess?: InputMaybe<Scalars['Boolean']['input']>;
  uidHex: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type AttemptCapturePayment = {
  __typename?: 'AttemptCapturePayment';
  order?: Maybe<OrderType>;
  status?: Maybe<PaymentStatus>;
};

export type AuthUser = {
  __typename?: 'AuthUser';
  user: UserType;
};

export type BaseFormInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['ID']['input']>;
};

export type BaseListingInput = {
  application?: InputMaybe<Scalars['Boolean']['input']>;
  applicationUrl?: InputMaybe<Scalars['String']['input']>;
  case?: InputMaybe<Scalars['Boolean']['input']>;
  deadline?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDatetime?: InputMaybe<Scalars['DateTime']['input']>;
  formId?: InputMaybe<Scalars['ID']['input']>;
  interview?: InputMaybe<Scalars['Boolean']['input']>;
  readMoreUrl?: InputMaybe<Scalars['String']['input']>;
  startDatetime?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type BaseQuestionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  mandatory?: InputMaybe<Scalars['Boolean']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
  questionType?: InputMaybe<QuestionTypeEnum>;
};

export type BlogPostType = {
  __typename?: 'BlogPostType';
  author?: Maybe<UserType>;
  blog?: Maybe<BlogType>;
  id: Scalars['ID']['output'];
  publishDate: Scalars['DateTime']['output'];
  text: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type BlogType = {
  __typename?: 'BlogType';
  blogPosts: Array<BlogPostType>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organization?: Maybe<OrganizationType>;
};

/** Basic booking object type used as a base for other types and as a standalone */
export type BookingInput = {
  cabins?: InputMaybe<Array<Scalars['Int']['input']>>;
  checkIn?: InputMaybe<Scalars['Date']['input']>;
  checkOut?: InputMaybe<Scalars['Date']['input']>;
  externalParticipants?: InputMaybe<Scalars['Int']['input']>;
  extraInfo?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  internalParticipants?: InputMaybe<Scalars['Int']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  receiverEmail?: InputMaybe<Scalars['String']['input']>;
};

export type BookingResponsibleType = {
  __typename?: 'BookingResponsibleType';
  active?: Maybe<Scalars['Boolean']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['Int']['output']>;
};

export type CabinType = {
  __typename?: 'CabinType';
  externalPrice: Scalars['Int']['output'];
  externalPriceWeekend: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  internalPrice: Scalars['Int']['output'];
  internalPriceWeekend: Scalars['Int']['output'];
  maxGuests: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type CategoryInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryType = {
  __typename?: 'CategoryType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CreateArchiveDocument = {
  __typename?: 'CreateArchiveDocument';
  arhiveDocument?: Maybe<ArchiveDocumentType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateBlog = {
  __typename?: 'CreateBlog';
  blog?: Maybe<BlogType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateBlogPost = {
  __typename?: 'CreateBlogPost';
  blogPost?: Maybe<BlogPostType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Add a new booking to the database */
export type CreateBooking = {
  __typename?: 'CreateBooking';
  booking?: Maybe<AllBookingsType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Create a new event category */
export type CreateCategory = {
  __typename?: 'CreateCategory';
  category?: Maybe<CategoryType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Create a new event */
export type CreateEvent = {
  __typename?: 'CreateEvent';
  event?: Maybe<EventType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateEventInput = {
  allowedGradeYears?: InputMaybe<Array<Scalars['Int']['input']>>;
  availableSlots?: InputMaybe<Scalars['Int']['input']>;
  bindingSignup?: InputMaybe<Scalars['Boolean']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  deadline?: InputMaybe<Scalars['DateTime']['input']>;
  description: Scalars['String']['input'];
  endTime?: InputMaybe<Scalars['DateTime']['input']>;
  hasExtraInformation?: InputMaybe<Scalars['Boolean']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  isAttendable: Scalars['Boolean']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  price?: InputMaybe<Scalars['Float']['input']>;
  shortDescription?: InputMaybe<Scalars['String']['input']>;
  signupOpenDate?: InputMaybe<Scalars['DateTime']['input']>;
  startTime: Scalars['DateTime']['input'];
  title: Scalars['String']['input'];
};

export type CreateForm = {
  __typename?: 'CreateForm';
  form?: Maybe<FormType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateFormInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
};

export type CreateJanHusBooking = {
  __typename?: 'CreateJanHusBooking';
  booking?: Maybe<JanHusBookingType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateJanHusBookingRequest = {
  __typename?: 'CreateJanHusBookingRequest';
  bookingRequest?: Maybe<JanHusBookingRequestType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateJanHusPaymentProduct = {
  __typename?: 'CreateJanHusPaymentProduct';
  booking?: Maybe<JanHusBookingType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
  productId?: Maybe<Scalars['ID']['output']>;
};

/** Creates a new listing */
export type CreateListing = {
  __typename?: 'CreateListing';
  listing?: Maybe<ListingType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateListingInput = {
  application?: InputMaybe<Scalars['Boolean']['input']>;
  applicationUrl?: InputMaybe<Scalars['String']['input']>;
  case?: InputMaybe<Scalars['Boolean']['input']>;
  deadline: Scalars['DateTime']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  endDatetime?: InputMaybe<Scalars['DateTime']['input']>;
  formId?: InputMaybe<Scalars['ID']['input']>;
  interview?: InputMaybe<Scalars['Boolean']['input']>;
  organizationId: Scalars['ID']['input'];
  readMoreUrl?: InputMaybe<Scalars['String']['input']>;
  startDatetime?: InputMaybe<Scalars['DateTime']['input']>;
  title: Scalars['String']['input'];
};

export type CreateNfcAccessGrant = {
  __typename?: 'CreateNfcAccessGrant';
  accessGrant?: Maybe<NfcAccessGrantType>;
  ok: Scalars['Boolean']['output'];
};

export type CreateNfcAccessGrantInput = {
  accessEnd?: InputMaybe<Scalars['DateTime']['input']>;
  accessStart?: InputMaybe<Scalars['DateTime']['input']>;
  bookingId?: InputMaybe<Scalars['ID']['input']>;
  grantedToUidHex?: InputMaybe<Scalars['String']['input']>;
  grantedToUserId?: InputMaybe<Scalars['ID']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  participantPolicy?: InputMaybe<Scalars['String']['input']>;
  permanentAccess?: InputMaybe<Scalars['Boolean']['input']>;
  scope: Scalars['String']['input'];
};

export type CreateOrganization = {
  __typename?: 'CreateOrganization';
  ok?: Maybe<Scalars['Boolean']['output']>;
  organization?: Maybe<OrganizationType>;
};

export type CreateProduct = {
  __typename?: 'CreateProduct';
  ok?: Maybe<Scalars['Boolean']['output']>;
  product?: Maybe<ProductType>;
};

export type CreateProductInput = {
  description: Scalars['String']['input'];
  maxBuyableQuantity: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  price: Scalars['Decimal']['input'];
  totalQuantity: Scalars['Int']['input'];
};

export type CreateQuestion = {
  __typename?: 'CreateQuestion';
  ok?: Maybe<Scalars['Boolean']['output']>;
  question?: Maybe<QuestionType>;
};

export type CreateQuestionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  mandatory?: InputMaybe<Scalars['Boolean']['input']>;
  question: Scalars['String']['input'];
  questionType?: InputMaybe<QuestionTypeEnum>;
};

export type CreateUpdateAndDeleteOptions = {
  __typename?: 'CreateUpdateAndDeleteOptions';
  ok?: Maybe<Scalars['Boolean']['output']>;
  options?: Maybe<Array<OptionType>>;
};

export type DeleteAnswer = {
  __typename?: 'DeleteAnswer';
  deletedUuid?: Maybe<Scalars['ID']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteAnswersToForm = {
  __typename?: 'DeleteAnswersToForm';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteArchiveDocument = {
  __typename?: 'DeleteArchiveDocument';
  archiveDocument?: Maybe<ArchiveDocumentType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteBlog = {
  __typename?: 'DeleteBlog';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteBlogPost = {
  __typename?: 'DeleteBlogPost';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Deletes the booking with the given ID */
export type DeleteBooking = {
  __typename?: 'DeleteBooking';
  bookingId?: Maybe<Scalars['ID']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Deletes the category with a given ID */
export type DeleteCategory = {
  __typename?: 'DeleteCategory';
  category?: Maybe<CategoryType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Deletes the event with the given ID */
export type DeleteEvent = {
  __typename?: 'DeleteEvent';
  event?: Maybe<EventType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteForm = {
  __typename?: 'DeleteForm';
  deletedId?: Maybe<Scalars['ID']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteJanHusBooking = {
  __typename?: 'DeleteJanHusBooking';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteJanHusBookingRequest = {
  __typename?: 'DeleteJanHusBookingRequest';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Deletes the listing with the given ID */
export type DeleteListing = {
  __typename?: 'DeleteListing';
  listingId?: Maybe<Scalars['ID']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteOrganization = {
  __typename?: 'DeleteOrganization';
  ok?: Maybe<Scalars['Boolean']['output']>;
  organization?: Maybe<OrganizationType>;
};

export type DeleteQuestion = {
  __typename?: 'DeleteQuestion';
  deletedId?: Maybe<Scalars['ID']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeliveredProduct = {
  __typename?: 'DeliveredProduct';
  ok?: Maybe<Scalars['Boolean']['output']>;
  order?: Maybe<OrderType>;
};

export type EmailInput = {
  cabins?: InputMaybe<Array<Scalars['Int']['input']>>;
  checkIn?: InputMaybe<Scalars['Date']['input']>;
  checkOut?: InputMaybe<Scalars['Date']['input']>;
  emailType?: InputMaybe<Scalars['String']['input']>;
  externalParticipants?: InputMaybe<Scalars['Int']['input']>;
  extraInfo?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  internalParticipants?: InputMaybe<Scalars['Int']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  receiverEmail?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Sets the field is_attending to False in the Sign Up for the user that
 * sent the request, for the event with the given ID
 * NOTE: The sign up still exists, it is not deleted from the database
 *       when a user signs off an event
 */
export type EventSignOff = {
  __typename?: 'EventSignOff';
  event?: Maybe<EventType>;
  isFull?: Maybe<Scalars['Boolean']['output']>;
};

/**
 * Creates a new Sign Up for the user that sent the request, for the event
 * with the given ID
 */
export type EventSignUp = {
  __typename?: 'EventSignUp';
  event?: Maybe<EventType>;
  isFull?: Maybe<Scalars['Boolean']['output']>;
};

export type EventSignUpInput = {
  extraInformation?: InputMaybe<Scalars['String']['input']>;
};

export type EventType = {
  __typename?: 'EventType';
  allowedGradeYears?: Maybe<Array<Scalars['Int']['output']>>;
  availableSlots?: Maybe<Scalars['Int']['output']>;
  bindingSignup: Scalars['Boolean']['output'];
  category?: Maybe<CategoryType>;
  contactEmail: Scalars['String']['output'];
  deadline?: Maybe<Scalars['DateTime']['output']>;
  description: Scalars['String']['output'];
  endTime?: Maybe<Scalars['DateTime']['output']>;
  hasExtraInformation: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isAttendable: Scalars['Boolean']['output'];
  isFull?: Maybe<Scalars['Boolean']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  organization: OrganizationType;
  price?: Maybe<Scalars['Float']['output']>;
  product?: Maybe<ProductType>;
  publisher?: Maybe<UserType>;
  shortDescription?: Maybe<Scalars['String']['output']>;
  signupOpenDate?: Maybe<Scalars['DateTime']['output']>;
  startTime: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
  userAttendance?: Maybe<UserAttendingType>;
  usersAttending?: Maybe<Array<SignUpType>>;
  usersOnWaitingList?: Maybe<Array<SignUpType>>;
};

/** A form containing questions, optionally linked to a listing. */
export type FormType = {
  __typename?: 'FormType';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organization?: Maybe<OrganizationType>;
  questions: Array<QuestionType>;
  responder?: Maybe<UserType>;
  responders?: Maybe<Array<UserType>>;
  response?: Maybe<ResponseType>;
  responses?: Maybe<Array<ResponseType>>;
};


/** A form containing questions, optionally linked to a listing. */
export type FormTypeResponderArgs = {
  userId: Scalars['ID']['input'];
};


/** A form containing questions, optionally linked to a listing. */
export type FormTypeRespondersArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
};


/** A form containing questions, optionally linked to a listing. */
export type FormTypeResponseArgs = {
  responsePk?: InputMaybe<Scalars['UUID']['input']>;
};

/** An enumeration. */
export enum FormsResponseStatusChoices {
  /** Red */
  A_0 = 'A_0',
  /** Yellow */
  A_1 = 'A_1',
  /** Green */
  A_2 = 'A_2',
  /** Unknown */
  None = 'NONE'
}

export type InitiateOrder = {
  __typename?: 'InitiateOrder';
  orderId?: Maybe<Scalars['UUID']['output']>;
  redirect?: Maybe<Scalars['String']['output']>;
};

export type JanHusAreaConfigurationInput = {
  area: Scalars['String']['input'];
  cleaningFee?: InputMaybe<Scalars['Decimal']['input']>;
  defaultDepositAmount?: InputMaybe<Scalars['Decimal']['input']>;
  externalPricePerHour?: InputMaybe<Scalars['Decimal']['input']>;
  internalPricePerHour?: InputMaybe<Scalars['Decimal']['input']>;
};

export type JanHusAreaConfigurationType = {
  __typename?: 'JanHusAreaConfigurationType';
  area: JanhusJanHusAreaConfigurationAreaChoices;
  cleaningFee: Scalars['Decimal']['output'];
  defaultDepositAmount: Scalars['Decimal']['output'];
  externalPricePerHour: Scalars['Decimal']['output'];
  id: Scalars['ID']['output'];
  internalPricePerHour: Scalars['Decimal']['output'];
};

export type JanHusBookingInput = {
  area: Scalars['String']['input'];
  bookerEmail?: InputMaybe<Scalars['String']['input']>;
  bookerName?: InputMaybe<Scalars['String']['input']>;
  bookerPhone?: InputMaybe<Scalars['String']['input']>;
  cleaningRequested?: InputMaybe<Scalars['Boolean']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  depositAmount?: InputMaybe<Scalars['Decimal']['input']>;
  depositStatus?: InputMaybe<Scalars['String']['input']>;
  endsAt: Scalars['DateTime']['input'];
  eventType?: InputMaybe<Scalars['String']['input']>;
  isExternalBooking?: InputMaybe<Scalars['Boolean']['input']>;
  ownerOrganizationId?: InputMaybe<Scalars['ID']['input']>;
  ownerUserId?: InputMaybe<Scalars['ID']['input']>;
  responsibleEmail: Scalars['String']['input'];
  responsibleName: Scalars['String']['input'];
  responsiblePhone: Scalars['String']['input'];
  startsAt: Scalars['DateTime']['input'];
};

export type JanHusBookingLevelType = {
  __typename?: 'JanHusBookingLevelType';
  /** If empty, the level can create bookings all year according to its flags. */
  bookingOpensWeeksBefore?: Maybe<Scalars['Int']['output']>;
  bookings: Array<JanHusBookingType>;
  canBookAnytime: Scalars['Boolean']['output'];
  canCreateConfirmed: Scalars['Boolean']['output'];
  canCreateProvisional: Scalars['Boolean']['output'];
  canEditAllBookings: Scalars['Boolean']['output'];
  canEditOwnBookingsOnly: Scalars['Boolean']['output'];
  canOverrideLowerLevels: Scalars['Boolean']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationAssignments: Array<JanHusOrganizationBookingLevelType>;
  priority: Scalars['Int']['output'];
  userAssignments: Array<JanHusUserBookingLevelType>;
};

export type JanHusBookingRequestInput = {
  area: Scalars['String']['input'];
  cleaningRequested?: InputMaybe<Scalars['Boolean']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  endsAt: Scalars['DateTime']['input'];
  eventType?: InputMaybe<Scalars['String']['input']>;
  guestList?: InputMaybe<Scalars['String']['input']>;
  ownerOrganizationId?: InputMaybe<Scalars['ID']['input']>;
  requesterEmail?: InputMaybe<Scalars['String']['input']>;
  requesterName?: InputMaybe<Scalars['String']['input']>;
  requesterPhone?: InputMaybe<Scalars['String']['input']>;
  responsibleEmail: Scalars['String']['input'];
  responsibleName: Scalars['String']['input'];
  responsiblePhone: Scalars['String']['input'];
  startsAt: Scalars['DateTime']['input'];
};

export type JanHusBookingRequestType = {
  __typename?: 'JanHusBookingRequestType';
  adminComment: Scalars['String']['output'];
  area: JanhusJanHusBookingRequestAreaChoices;
  cleaningRequested: Scalars['Boolean']['output'];
  comment: Scalars['String']['output'];
  convertedBooking?: Maybe<JanHusBookingType>;
  createdAt: Scalars['DateTime']['output'];
  endsAt: Scalars['DateTime']['output'];
  eventType: JanhusJanHusBookingRequestEventTypeChoices;
  guestList: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  ownerOrganization?: Maybe<OrganizationType>;
  requesterEmail: Scalars['String']['output'];
  requesterName: Scalars['String']['output'];
  requesterPhone: Scalars['String']['output'];
  requesterUser?: Maybe<UserType>;
  responsibleEmail: Scalars['String']['output'];
  responsibleName: Scalars['String']['output'];
  responsiblePhone: Scalars['String']['output'];
  startsAt: Scalars['DateTime']['output'];
  status: JanhusJanHusBookingRequestStatusChoices;
  updatedAt: Scalars['DateTime']['output'];
};

export type JanHusBookingSettingsInput = {
  bufferMinutes?: InputMaybe<Scalars['Int']['input']>;
  closingHour?: InputMaybe<Scalars['Int']['input']>;
  externalBookingsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  fallEndDate?: InputMaybe<Scalars['Date']['input']>;
  fallSemesterActive?: InputMaybe<Scalars['Boolean']['input']>;
  fallStartDate?: InputMaybe<Scalars['Date']['input']>;
  generalBookingOpensWeeksBefore?: InputMaybe<Scalars['Int']['input']>;
  minDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
  openingHour?: InputMaybe<Scalars['Int']['input']>;
  organizationBookingOpensWeeksBefore?: InputMaybe<Scalars['Int']['input']>;
  slotGranularityMinutes?: InputMaybe<Scalars['Int']['input']>;
  springEndDate?: InputMaybe<Scalars['Date']['input']>;
  springSemesterActive?: InputMaybe<Scalars['Boolean']['input']>;
  springStartDate?: InputMaybe<Scalars['Date']['input']>;
};

export type JanHusBookingSettingsType = {
  __typename?: 'JanHusBookingSettingsType';
  bufferMinutes: Scalars['Int']['output'];
  closingHour: Scalars['Int']['output'];
  externalBookingsEnabled: Scalars['Boolean']['output'];
  fallEndDate: Scalars['Date']['output'];
  fallSemesterActive: Scalars['Boolean']['output'];
  fallStartDate: Scalars['Date']['output'];
  generalBookingOpensWeeksBefore: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  minDurationMinutes: Scalars['Int']['output'];
  openingHour: Scalars['Int']['output'];
  organizationBookingOpensWeeksBefore: Scalars['Int']['output'];
  slotGranularityMinutes: Scalars['Int']['output'];
  springEndDate: Scalars['Date']['output'];
  springSemesterActive: Scalars['Boolean']['output'];
  springStartDate: Scalars['Date']['output'];
};

export type JanHusBookingType = {
  __typename?: 'JanHusBookingType';
  adminComment: Scalars['String']['output'];
  area: JanhusJanHusBookingAreaChoices;
  bookerEmail: Scalars['String']['output'];
  bookerName: Scalars['String']['output'];
  bookerPhone: Scalars['String']['output'];
  bookingLevel?: Maybe<JanHusBookingLevelType>;
  cleaningRequested: Scalars['Boolean']['output'];
  comment: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdByUser?: Maybe<UserType>;
  depositAmount: Scalars['Decimal']['output'];
  depositStatus: JanhusJanHusBookingDepositStatusChoices;
  doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices;
  durationMinutes?: Maybe<Scalars['Int']['output']>;
  endsAt: Scalars['DateTime']['output'];
  eventType: JanhusJanHusBookingEventTypeChoices;
  guestList: Scalars['String']['output'];
  guestListEntries?: Maybe<Array<JanHusGuestListEntryType>>;
  id: Scalars['ID']['output'];
  isExternalBooking: Scalars['Boolean']['output'];
  outstandingDepositAmount?: Maybe<Scalars['Decimal']['output']>;
  ownerOrganization?: Maybe<OrganizationType>;
  ownerUser?: Maybe<UserType>;
  responsibleEmail: Scalars['String']['output'];
  responsibleName: Scalars['String']['output'];
  responsiblePhone: Scalars['String']['output'];
  sourceRequests: Array<JanHusBookingRequestType>;
  startsAt: Scalars['DateTime']['output'];
  status: JanhusJanHusBookingStatusChoices;
  totalPrice?: Maybe<Scalars['Decimal']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  vippsOrder?: Maybe<OrderType>;
  vippsProduct?: Maybe<ProductType>;
};

export type JanHusGuestListEntryType = {
  __typename?: 'JanHusGuestListEntryType';
  displayName: Scalars['String']['output'];
  feideUserid: Scalars['String']['output'];
};

export type JanHusOrganizationBookingLevelType = {
  __typename?: 'JanHusOrganizationBookingLevelType';
  id: Scalars['ID']['output'];
  level: JanHusBookingLevelType;
  organization: OrganizationType;
};

export type JanHusUserBookingLevelType = {
  __typename?: 'JanHusUserBookingLevelType';
  id: Scalars['ID']['output'];
  level: JanHusBookingLevelType;
  user: UserType;
};

/** An enumeration. */
export enum JanhusJanHusAreaConfigurationAreaChoices {
  /** Entire house */
  EntireHouse = 'ENTIRE_HOUSE',
  /** 1st floor */
  FirstFloor = 'FIRST_FLOOR',
  /** 2nd floor */
  SecondFloor = 'SECOND_FLOOR'
}

/** An enumeration. */
export enum JanhusJanHusBookingAreaChoices {
  /** Entire house */
  EntireHouse = 'ENTIRE_HOUSE',
  /** 1st floor */
  FirstFloor = 'FIRST_FLOOR',
  /** 2nd floor */
  SecondFloor = 'SECOND_FLOOR'
}

/** An enumeration. */
export enum JanhusJanHusBookingDepositStatusChoices {
  /** Not required */
  NotRequired = 'NOT_REQUIRED',
  /** Paid */
  Paid = 'PAID',
  /** Refunded */
  Refunded = 'REFUNDED',
  /** Requested */
  Requested = 'REQUESTED',
  /** Required */
  Required = 'REQUIRED',
  /** Withheld */
  Withheld = 'WITHHELD'
}

/** An enumeration. */
export enum JanhusJanHusBookingDoorAccessPolicyChoices {
  /** Booker and guest list */
  AllParticipants = 'ALL_PARTICIPANTS',
  /** Booker only */
  BookerOnly = 'BOOKER_ONLY'
}

/** An enumeration. */
export enum JanhusJanHusBookingEventTypeChoices {
  /** External */
  External = 'EXTERNAL',
  /** Internal */
  Internal = 'INTERNAL',
  /** Open to all Indøk students */
  OpenForIndok = 'OPEN_FOR_INDOK',
  /** Private */
  Private = 'PRIVATE'
}

/** An enumeration. */
export enum JanhusJanHusBookingRequestAreaChoices {
  /** Entire house */
  EntireHouse = 'ENTIRE_HOUSE',
  /** 1st floor */
  FirstFloor = 'FIRST_FLOOR',
  /** 2nd floor */
  SecondFloor = 'SECOND_FLOOR'
}

/** An enumeration. */
export enum JanhusJanHusBookingRequestEventTypeChoices {
  /** External */
  External = 'EXTERNAL',
  /** Internal */
  Internal = 'INTERNAL',
  /** Open to all Indøk students */
  OpenForIndok = 'OPEN_FOR_INDOK',
  /** Private */
  Private = 'PRIVATE'
}

/** An enumeration. */
export enum JanhusJanHusBookingRequestStatusChoices {
  /** Approved */
  Approved = 'APPROVED',
  /** Pending */
  Pending = 'PENDING',
  /** Rejected */
  Rejected = 'REJECTED'
}

/** An enumeration. */
export enum JanhusJanHusBookingStatusChoices {
  /** Blocked */
  Blocked = 'BLOCKED',
  /** Cancelled */
  Cancelled = 'CANCELLED',
  /** Confirmed */
  Confirmed = 'CONFIRMED',
  /** Declined */
  Declined = 'DECLINED',
  /** Pending admin review */
  PendingAdminReview = 'PENDING_ADMIN_REVIEW',
  /** Provisional */
  Provisional = 'PROVISIONAL'
}

export type ListingType = {
  __typename?: 'ListingType';
  applicationUrl?: Maybe<Scalars['String']['output']>;
  chips: Array<Scalars['String']['output']>;
  deadline: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  endDatetime: Scalars['DateTime']['output'];
  form?: Maybe<FormType>;
  heroImageUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  organization: OrganizationType;
  readMoreUrl?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  startDatetime: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
  viewCount: Scalars['Int']['output'];
};

export type LogNfcAccessEvent = {
  __typename?: 'LogNfcAccessEvent';
  event?: Maybe<NfcAccessEventType>;
  ok: Scalars['Boolean']['output'];
};

export type LogNfcAccessEventInput = {
  doorIdentifier?: InputMaybe<Scalars['String']['input']>;
  eventType: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  rawPayload?: InputMaybe<Scalars['JSONString']['input']>;
  resolvedUserId?: InputMaybe<Scalars['ID']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  uidHexReported?: InputMaybe<Scalars['String']['input']>;
};

export type Logout = {
  __typename?: 'Logout';
  idToken?: Maybe<Scalars['String']['output']>;
};

export type MembershipInput = {
  groupId: Scalars['ID']['input'];
  organizationId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type MembershipType = {
  __typename?: 'MembershipType';
  group?: Maybe<ResponsibleGroupType>;
  id: Scalars['ID']['output'];
  organization: OrganizationType;
  user: UserType;
};

export type Mutations = {
  __typename?: 'Mutations';
  /**
   * Sets the field is_attending to False in the Sign Up for the user with the
   * given ID, for the event with the given ID
   * NOTE: The sign up still exists, it is not deleted from the database
   *       when a user signs off an event
   */
  adminEventSignOff?: Maybe<AdminEventSignOff>;
  adminUpdateUser?: Maybe<AdminUpdateUser>;
  adminUpdateUserNfc?: Maybe<AdminUpdateUserNfc>;
  assignMembership?: Maybe<AssignMembership>;
  assignNfcCard?: Maybe<AssignNfcCard>;
  attemptCapturePayment?: Maybe<AttemptCapturePayment>;
  authUser: AuthUser;
  createArchivedocument?: Maybe<CreateArchiveDocument>;
  createBlog?: Maybe<CreateBlog>;
  createBlogPost?: Maybe<CreateBlogPost>;
  /** Add a new booking to the database */
  createBooking?: Maybe<CreateBooking>;
  /** Create a new event category */
  createCategory?: Maybe<CreateCategory>;
  /** Create a new event */
  createEvent?: Maybe<CreateEvent>;
  createForm?: Maybe<CreateForm>;
  createJanhusBooking?: Maybe<CreateJanHusBooking>;
  createJanhusBookingRequest?: Maybe<CreateJanHusBookingRequest>;
  createJanhusPaymentProduct?: Maybe<CreateJanHusPaymentProduct>;
  /** Creates a new listing */
  createListing?: Maybe<CreateListing>;
  createNfcAccessGrant?: Maybe<CreateNfcAccessGrant>;
  createOrganization?: Maybe<CreateOrganization>;
  createProduct?: Maybe<CreateProduct>;
  createQuestion?: Maybe<CreateQuestion>;
  createUpdateAndDeleteOptions?: Maybe<CreateUpdateAndDeleteOptions>;
  deleteAnswer?: Maybe<DeleteAnswer>;
  deleteAnswers?: Maybe<DeleteAnswersToForm>;
  deleteArchivedocument?: Maybe<DeleteArchiveDocument>;
  deleteBlog?: Maybe<DeleteBlog>;
  deleteBlogPost?: Maybe<DeleteBlogPost>;
  /** Deletes the booking with the given ID */
  deleteBooking?: Maybe<DeleteBooking>;
  /** Deletes the category with a given ID */
  deleteCategory?: Maybe<DeleteCategory>;
  /** Deletes the event with the given ID */
  deleteEvent?: Maybe<DeleteEvent>;
  deleteForm?: Maybe<DeleteForm>;
  deleteJanhusBooking?: Maybe<DeleteJanHusBooking>;
  deleteJanhusBookingRequest?: Maybe<DeleteJanHusBookingRequest>;
  /** Deletes the listing with the given ID */
  deleteListing?: Maybe<DeleteListing>;
  deleteOrganization?: Maybe<DeleteOrganization>;
  deleteQuestion?: Maybe<DeleteQuestion>;
  deliveredProduct?: Maybe<DeliveredProduct>;
  /**
   * Sets the field is_attending to False in the Sign Up for the user that
   * sent the request, for the event with the given ID
   * NOTE: The sign up still exists, it is not deleted from the database
   *       when a user signs off an event
   */
  eventSignOff?: Maybe<EventSignOff>;
  /**
   * Creates a new Sign Up for the user that sent the request, for the event
   * with the given ID
   */
  eventSignUp?: Maybe<EventSignUp>;
  initiateOrder?: Maybe<InitiateOrder>;
  logNfcAccessEvent?: Maybe<LogNfcAccessEvent>;
  logout?: Maybe<Logout>;
  removeMembership?: Maybe<RemoveMembership>;
  reviewJanhusBooking?: Maybe<ReviewJanHusBooking>;
  reviewJanhusBookingRequest?: Maybe<ReviewJanHusBookingRequest>;
  revokeNfcAccessGrant?: Maybe<RevokeNfcAccessGrant>;
  revokeNfcAssignment?: Maybe<RevokeNfcAssignment>;
  /** Sends email to the user or an admin (or both) */
  sendEmail?: Maybe<SendEmail>;
  /** Send an email to all users signed up to an event */
  sendEventMails?: Maybe<SendEventEmails>;
  submitAnswers?: Maybe<SubmitOrUpdateAnswers>;
  updateArchivedocument?: Maybe<UpdateArchiveDocument>;
  updateBlog?: Maybe<UpdateBlog>;
  updateBlogPost?: Maybe<UpdateBlogPost>;
  /** Change the given booking */
  updateBooking?: Maybe<UpdateBooking>;
  /** Update the booking semester */
  updateBookingSemester?: Maybe<UpdateBookingSemester>;
  /** Change the given cabin */
  updateCabin?: Maybe<UpdateCabin>;
  /** Updates the category with a given ID with the data in category_data */
  updateCategory?: Maybe<UpdateCategory>;
  /** Updates the event with a given ID with the data in event_data */
  updateEvent?: Maybe<UpdateEvent>;
  updateForm?: Maybe<UpdateForm>;
  updateJanhusAreaConfiguration?: Maybe<UpdateJanHusAreaConfiguration>;
  updateJanhusBooking?: Maybe<UpdateJanHusBooking>;
  updateJanhusBookingSettings?: Maybe<UpdateJanHusBookingSettings>;
  updateListing?: Maybe<UpdateListing>;
  updateOrganization?: Maybe<UpdateOrganization>;
  updateQuestion?: Maybe<UpdateQuestion>;
  updateUser?: Maybe<UpdateUser>;
  upsertMembership?: Maybe<UpsertMembership>;
  upsertNfcCard?: Maybe<UpsertNfcCard>;
};


export type MutationsAdminEventSignOffArgs = {
  eventId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationsAdminUpdateUserArgs = {
  userData: AdminUserInput;
  userId: Scalars['ID']['input'];
};


export type MutationsAdminUpdateUserNfcArgs = {
  nfcData: AdminUserNfcInput;
  userId: Scalars['ID']['input'];
};


export type MutationsAssignMembershipArgs = {
  membershipData: MembershipInput;
};


export type MutationsAssignNfcCardArgs = {
  assignmentData: AssignNfcCardInput;
};


export type MutationsAttemptCapturePaymentArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationsAuthUserArgs = {
  code: Scalars['String']['input'];
};


export type MutationsCreateArchivedocumentArgs = {
  date?: InputMaybe<Scalars['DateTime']['input']>;
  fileLocation?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  typeDoc?: InputMaybe<Scalars['String']['input']>;
  webLink?: InputMaybe<Scalars['String']['input']>;
};


export type MutationsCreateBlogArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsCreateBlogPostArgs = {
  authorId?: InputMaybe<Scalars['ID']['input']>;
  blogId?: InputMaybe<Scalars['ID']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationsCreateBookingArgs = {
  bookingData?: InputMaybe<BookingInput>;
};


export type MutationsCreateCategoryArgs = {
  categoryData: CategoryInput;
};


export type MutationsCreateEventArgs = {
  eventData: CreateEventInput;
};


export type MutationsCreateFormArgs = {
  formData: CreateFormInput;
  listingId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsCreateJanhusBookingArgs = {
  bookingData: JanHusBookingInput;
};


export type MutationsCreateJanhusBookingRequestArgs = {
  requestData: JanHusBookingRequestInput;
};


export type MutationsCreateJanhusPaymentProductArgs = {
  bookingId: Scalars['ID']['input'];
  organizationId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsCreateListingArgs = {
  listingData: CreateListingInput;
};


export type MutationsCreateNfcAccessGrantArgs = {
  grantData: CreateNfcAccessGrantInput;
};


export type MutationsCreateOrganizationArgs = {
  organizationData: OrganizationInput;
};


export type MutationsCreateProductArgs = {
  productData: CreateProductInput;
};


export type MutationsCreateQuestionArgs = {
  formId?: InputMaybe<Scalars['ID']['input']>;
  questionData: CreateQuestionInput;
};


export type MutationsCreateUpdateAndDeleteOptionsArgs = {
  optionData?: InputMaybe<Array<OptionInput>>;
  questionId: Scalars['ID']['input'];
};


export type MutationsDeleteAnswerArgs = {
  uuid: Scalars['ID']['input'];
};


export type MutationsDeleteAnswersArgs = {
  formId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteArchivedocumentArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteBlogArgs = {
  blogId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteBlogPostArgs = {
  blogPostId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteBookingArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteCategoryArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteEventArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteFormArgs = {
  id: Scalars['ID']['input'];
};


export type MutationsDeleteJanhusBookingArgs = {
  bookingId: Scalars['ID']['input'];
};


export type MutationsDeleteJanhusBookingRequestArgs = {
  requestId: Scalars['ID']['input'];
};


export type MutationsDeleteListingArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationsDeleteQuestionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationsDeliveredProductArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationsEventSignOffArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationsEventSignUpArgs = {
  data?: InputMaybe<EventSignUpInput>;
  eventId: Scalars['ID']['input'];
};


export type MutationsInitiateOrderArgs = {
  fallbackRedirect?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['ID']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationsLogNfcAccessEventArgs = {
  eventData: LogNfcAccessEventInput;
};


export type MutationsRemoveMembershipArgs = {
  membershipId: Scalars['ID']['input'];
};


export type MutationsReviewJanhusBookingArgs = {
  reviewData: ReviewJanHusBookingInput;
};


export type MutationsReviewJanhusBookingRequestArgs = {
  reviewData: ReviewJanHusBookingRequestInput;
};


export type MutationsRevokeNfcAccessGrantArgs = {
  revokeData: RevokeNfcAccessGrantInput;
};


export type MutationsRevokeNfcAssignmentArgs = {
  revokeData: RevokeNfcAssignmentInput;
};


export type MutationsSendEmailArgs = {
  emailInput?: InputMaybe<EmailInput>;
};


export type MutationsSendEventMailsArgs = {
  content?: InputMaybe<Scalars['String']['input']>;
  eventId: Scalars['ID']['input'];
  receiverEmails?: InputMaybe<Array<Scalars['String']['input']>>;
  subject: Scalars['String']['input'];
};


export type MutationsSubmitAnswersArgs = {
  answersData?: InputMaybe<Array<AnswerInput>>;
  formId: Scalars['ID']['input'];
};


export type MutationsUpdateArchivedocumentArgs = {
  date?: InputMaybe<Scalars['DateTime']['input']>;
  fileLocation?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  typeDoc?: InputMaybe<Scalars['String']['input']>;
  webLink?: InputMaybe<Scalars['String']['input']>;
};


export type MutationsUpdateBlogArgs = {
  blogData?: InputMaybe<UpdateBlogInput>;
};


export type MutationsUpdateBlogPostArgs = {
  blogPostData?: InputMaybe<UpdateBlogPostInput>;
};


export type MutationsUpdateBookingArgs = {
  bookingData?: InputMaybe<UpdateBookingInput>;
};


export type MutationsUpdateBookingSemesterArgs = {
  semesterData?: InputMaybe<UpdateBookingSemesterInput>;
};


export type MutationsUpdateCabinArgs = {
  cabinData?: InputMaybe<UpdateCabinInput>;
};


export type MutationsUpdateCategoryArgs = {
  categoryData?: InputMaybe<CategoryInput>;
  id: Scalars['ID']['input'];
};


export type MutationsUpdateEventArgs = {
  eventData?: InputMaybe<UpdateEventInput>;
  id: Scalars['ID']['input'];
};


export type MutationsUpdateFormArgs = {
  formData: BaseFormInput;
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsUpdateJanhusAreaConfigurationArgs = {
  areaData: JanHusAreaConfigurationInput;
};


export type MutationsUpdateJanhusBookingArgs = {
  bookingData: UpdateJanHusBookingInput;
};


export type MutationsUpdateJanhusBookingSettingsArgs = {
  settingsData: JanHusBookingSettingsInput;
};


export type MutationsUpdateListingArgs = {
  id: Scalars['ID']['input'];
  listingData?: InputMaybe<BaseListingInput>;
};


export type MutationsUpdateOrganizationArgs = {
  id: Scalars['ID']['input'];
  organizationData?: InputMaybe<OrganizationInput>;
};


export type MutationsUpdateQuestionArgs = {
  id: Scalars['ID']['input'];
  questionData: BaseQuestionInput;
};


export type MutationsUpdateUserArgs = {
  userData?: InputMaybe<UserInput>;
};


export type MutationsUpsertMembershipArgs = {
  membershipData: MembershipInput;
};


export type MutationsUpsertNfcCardArgs = {
  cardData: NfcCardInput;
};

export type NfcAccessEventType = {
  __typename?: 'NfcAccessEventType';
  card?: Maybe<NfcCardType>;
  cardAssignment?: Maybe<NfcCardAssignmentType>;
  doorIdentifier: Scalars['String']['output'];
  eventType: NfcNfcAccessEventEventTypeChoices;
  id: Scalars['ID']['output'];
  notes: Scalars['String']['output'];
  occurredAt: Scalars['DateTime']['output'];
  rawPayload: Scalars['JSONString']['output'];
  resolvedUser?: Maybe<UserType>;
  source: NfcNfcAccessEventSourceChoices;
  uidHexReported: Scalars['String']['output'];
};

export type NfcAccessGrantType = {
  __typename?: 'NfcAccessGrantType';
  accessEnd?: Maybe<Scalars['DateTime']['output']>;
  accessStart?: Maybe<Scalars['DateTime']['output']>;
  booking?: Maybe<AdminBookingType>;
  createdAt: Scalars['DateTime']['output'];
  grantedBy?: Maybe<UserType>;
  grantedToCard?: Maybe<NfcCardType>;
  grantedToUser?: Maybe<UserType>;
  hasAccessNow?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  notes: Scalars['String']['output'];
  participantPolicy: NfcNfcAccessGrantParticipantPolicyChoices;
  permanentAccess: Scalars['Boolean']['output'];
  revokedAt?: Maybe<Scalars['DateTime']['output']>;
  revokedBy?: Maybe<UserType>;
  scope: NfcNfcAccessGrantScopeChoices;
  updatedAt: Scalars['DateTime']['output'];
};

export type NfcCardAssignmentType = {
  __typename?: 'NfcCardAssignmentType';
  accessEnd?: Maybe<Scalars['DateTime']['output']>;
  accessStart?: Maybe<Scalars['DateTime']['output']>;
  assignedAt: Scalars['DateTime']['output'];
  assignedBy?: Maybe<UserType>;
  card: NfcCardType;
  externalHolderName: Scalars['String']['output'];
  hasAccessNow?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  metadata: Scalars['JSONString']['output'];
  permanentAccess: Scalars['Boolean']['output'];
  revocationReason: Scalars['String']['output'];
  revokedAt?: Maybe<Scalars['DateTime']['output']>;
  revokedBy?: Maybe<UserType>;
  user?: Maybe<UserType>;
};

export type NfcCardInput = {
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  uidHex: Scalars['String']['input'];
};

export type NfcCardType = {
  __typename?: 'NfcCardType';
  activeAssignment?: Maybe<NfcCardAssignmentType>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isEnabled: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  notes: Scalars['String']['output'];
  uidHex: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** An enumeration. */
export enum NfcNfcAccessEventEventTypeChoices {
  /** Access denied */
  AccessDenied = 'ACCESS_DENIED',
  /** Access granted */
  AccessGranted = 'ACCESS_GRANTED',
  /** Door opened */
  DoorOpened = 'DOOR_OPENED'
}

/** An enumeration. */
export enum NfcNfcAccessEventSourceChoices {
  /** Backend */
  Backend = 'BACKEND',
  /** Manual key */
  ManualKey = 'MANUAL_KEY',
  /** NFC reader */
  NfcReader = 'NFC_READER',
  /** Unknown */
  Unknown = 'UNKNOWN'
}

/** An enumeration. */
export enum NfcNfcAccessGrantParticipantPolicyChoices {
  /** All participants */
  AllParticipants = 'ALL_PARTICIPANTS',
  /** Booker only */
  BookerOnly = 'BOOKER_ONLY'
}

/** An enumeration. */
export enum NfcNfcAccessGrantScopeChoices {
  /** Booking */
  Booking = 'BOOKING',
  /** Manual */
  Manual = 'MANUAL'
}

export type OptionInput = {
  answer: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Option for multiple choice questions */
export type OptionType = {
  __typename?: 'OptionType';
  answer: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  question: QuestionType;
};

export type OrderType = {
  __typename?: 'OrderType';
  deliveredProduct: Scalars['Boolean']['output'];
  id: Scalars['UUID']['output'];
  paymentStatus: PaymentStatus;
  product: ProductType;
  quantity: Scalars['Int']['output'];
  timestamp: Scalars['DateTime']['output'];
  totalPrice: Scalars['Decimal']['output'];
  user: UserType;
};

export type OrdersByStatusType = {
  __typename?: 'OrdersByStatusType';
  length?: Maybe<Scalars['Int']['output']>;
  orders?: Maybe<Array<OrderType>>;
};

export type OrganizationInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type OrganizationType = {
  __typename?: 'OrganizationType';
  absoluteSlug?: Maybe<Scalars['String']['output']>;
  children: Array<OrganizationType>;
  color?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  events: Array<EventType>;
  hrGroup?: Maybe<ResponsibleGroupType>;
  id: Scalars['ID']['output'];
  listings?: Maybe<Array<ListingType>>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  parent?: Maybe<OrganizationType>;
  permissionGroups?: Maybe<Array<ResponsibleGroupType>>;
  primaryGroup?: Maybe<ResponsibleGroupType>;
  slug: Scalars['String']['output'];
  users: Array<UserType>;
};

/** An enumeration. */
export enum PaymentStatus {
  Cancelled = 'CANCELLED',
  Captured = 'CAPTURED',
  Failed = 'FAILED',
  Initiated = 'INITIATED',
  Refunded = 'REFUNDED',
  Rejected = 'REJECTED',
  Reserved = 'RESERVED'
}

export type ProductType = {
  __typename?: 'ProductType';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  maxBuyableQuantity: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Decimal']['output'];
  shopItem: Scalars['Boolean']['output'];
};

export type Queries = {
  __typename?: 'Queries';
  activeBookingResponsible?: Maybe<BookingResponsibleType>;
  adminAllBookings?: Maybe<Array<AdminBookingType>>;
  adminJanhusBookings?: Maybe<Array<JanHusBookingType>>;
  allBlogPosts?: Maybe<Array<BlogPostType>>;
  allBlogs?: Maybe<Array<BlogType>>;
  allBookings?: Maybe<Array<AllBookingsType>>;
  allCategories?: Maybe<Array<CategoryType>>;
  allEvents?: Maybe<Array<EventType>>;
  allOrganizations?: Maybe<Array<OrganizationType>>;
  allUserOrders?: Maybe<Array<OrderType>>;
  allUsers?: Maybe<Array<UserType>>;
  archiveByTypes: Array<ArchiveDocumentType>;
  attendeeReport?: Maybe<Scalars['String']['output']>;
  attendeeReportOrg?: Maybe<Scalars['String']['output']>;
  attendeeReports?: Maybe<Scalars['String']['output']>;
  availableYears: Array<Scalars['String']['output']>;
  blog?: Maybe<BlogType>;
  blogPost?: Maybe<BlogPostType>;
  bookingSemester?: Maybe<UpdateBookingSemesterType>;
  cabins?: Maybe<Array<CabinType>>;
  canManageUserNfc: Scalars['Boolean']['output'];
  canManageUserProfiles: Scalars['Boolean']['output'];
  category?: Maybe<CategoryType>;
  defaultEvents?: Maybe<Array<EventType>>;
  event?: Maybe<EventType>;
  eventFilteredOrganizations?: Maybe<Array<OrganizationType>>;
  featuredArchive: Array<ArchiveDocumentType>;
  form?: Maybe<FormType>;
  forms?: Maybe<Array<FormType>>;
  hasPermission?: Maybe<Scalars['Boolean']['output']>;
  janhusAreaConfigurations?: Maybe<Array<JanHusAreaConfigurationType>>;
  janhusBookingLevels?: Maybe<Array<JanHusBookingLevelType>>;
  janhusBookingRequests?: Maybe<Array<JanHusBookingRequestType>>;
  janhusBookingSettings?: Maybe<JanHusBookingSettingsType>;
  janhusBookings?: Maybe<Array<JanHusBookingType>>;
  janhusGuestSearch?: Maybe<Array<JanHusGuestListEntryType>>;
  janhusGuestSearchForRequest?: Maybe<Array<JanHusGuestListEntryType>>;
  janhusMyBookingLevel?: Maybe<JanHusBookingLevelType>;
  janhusMyBookings?: Maybe<Array<JanHusBookingType>>;
  listing?: Maybe<ListingType>;
  listings?: Maybe<Array<ListingType>>;
  logout: Scalars['String']['output'];
  memberships?: Maybe<Array<MembershipType>>;
  myCabinBookings?: Maybe<Array<AdminBookingType>>;
  myNfcCardAssignment?: Maybe<NfcCardAssignmentType>;
  nfcAccepts4ByteUid: Scalars['Boolean']['output'];
  nfcAccepts7ByteUid: Scalars['Boolean']['output'];
  nfcAccessEvents?: Maybe<Array<NfcAccessEventType>>;
  nfcAccessGrants?: Maybe<Array<NfcAccessGrantType>>;
  nfcCard?: Maybe<NfcCardType>;
  nfcCardAssignments?: Maybe<Array<NfcCardAssignmentType>>;
  nfcCards?: Maybe<Array<NfcCardType>>;
  nfcSelfServiceEnabled: Scalars['Boolean']['output'];
  nfcUserSearch?: Maybe<Array<UserType>>;
  order?: Maybe<OrderType>;
  ordersByStatus?: Maybe<OrdersByStatusType>;
  organization?: Maybe<OrganizationType>;
  paginatedShopOrders?: Maybe<Array<OrderType>>;
  product?: Maybe<ProductType>;
  products?: Maybe<Array<ProductType>>;
  response?: Maybe<ResponseType>;
  responses?: Maybe<Array<ResponseType>>;
  serverTime?: Maybe<Scalars['DateTime']['output']>;
  signUps?: Maybe<SignUpType>;
  user?: Maybe<UserType>;
  userOrders?: Maybe<Array<OrderType>>;
  userSearch?: Maybe<Array<UserType>>;
};


export type QueriesAdminAllBookingsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
};


export type QueriesAdminJanhusBookingsArgs = {
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueriesAllEventsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  endTime?: InputMaybe<Scalars['DateTime']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  startTime?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueriesAllOrganizationsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueriesArchiveByTypesArgs = {
  names?: InputMaybe<Scalars['String']['input']>;
  typeDoc: Array<InputMaybe<Scalars['String']['input']>>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueriesAttendeeReportArgs = {
  eventId: Scalars['ID']['input'];
  fields?: InputMaybe<Array<Scalars['String']['input']>>;
  filetype?: InputMaybe<Scalars['String']['input']>;
};


export type QueriesAttendeeReportOrgArgs = {
  fields?: InputMaybe<Array<Scalars['String']['input']>>;
  filetype?: InputMaybe<Scalars['String']['input']>;
  orgId: Scalars['ID']['input'];
};


export type QueriesAttendeeReportsArgs = {
  eventIds: Array<Scalars['ID']['input']>;
  fields?: InputMaybe<Array<Scalars['String']['input']>>;
  filetype?: InputMaybe<Scalars['String']['input']>;
};


export type QueriesBlogArgs = {
  blogId: Scalars['ID']['input'];
};


export type QueriesBlogPostArgs = {
  blogPostId: Scalars['ID']['input'];
};


export type QueriesCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueriesEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueriesFormArgs = {
  formId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueriesHasPermissionArgs = {
  permission: Scalars['String']['input'];
};


export type QueriesJanhusBookingRequestsArgs = {
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueriesJanhusBookingsArgs = {
  area?: InputMaybe<Scalars['String']['input']>;
  endsAt?: InputMaybe<Scalars['DateTime']['input']>;
  startsAt?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueriesJanhusGuestSearchArgs = {
  bookingId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QueriesJanhusGuestSearchForRequestArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QueriesListingArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueriesListingsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueriesMembershipsArgs = {
  organizationId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueriesNfcAccessEventsArgs = {
  doorIdentifier?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueriesNfcAccessGrantsArgs = {
  activeOnly?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueriesNfcCardArgs = {
  uidHex: Scalars['String']['input'];
};


export type QueriesNfcCardAssignmentsArgs = {
  activeOnly?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueriesNfcUserSearchArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QueriesOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type QueriesOrdersByStatusArgs = {
  productId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type QueriesOrganizationArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueriesPaginatedShopOrdersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueriesProductArgs = {
  productId: Scalars['ID']['input'];
};


export type QueriesResponseArgs = {
  formId: Scalars['ID']['input'];
  responseId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueriesResponsesArgs = {
  formId: Scalars['ID']['input'];
};


export type QueriesSignUpsArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueriesUserSearchArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};

/** A question on a form. */
export type QuestionType = {
  __typename?: 'QuestionType';
  answer?: Maybe<AnswerType>;
  answers?: Maybe<Array<AnswerType>>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mandatory: Scalars['Boolean']['output'];
  options?: Maybe<Array<OptionType>>;
  question: Scalars['String']['output'];
  questionType?: Maybe<QuestionTypeEnum>;
};


/** A question on a form. */
export type QuestionTypeAnswersArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export enum QuestionTypeEnum {
  Checkboxes = 'CHECKBOXES',
  Dropdown = 'DROPDOWN',
  FileUpload = 'FILE_UPLOAD',
  MultipleChoice = 'MULTIPLE_CHOICE',
  Paragraph = 'PARAGRAPH',
  ShortAnswer = 'SHORT_ANSWER',
  Slider = 'SLIDER'
}

export type RemoveMembership = {
  __typename?: 'RemoveMembership';
  ok?: Maybe<Scalars['Boolean']['output']>;
  removedMember?: Maybe<UserType>;
};

/** A response instance that contains information about a user's response to a form. */
export type ResponseType = {
  __typename?: 'ResponseType';
  answers: Array<AnswerType>;
  form: FormType;
  id?: Maybe<Scalars['UUID']['output']>;
  questions?: Maybe<Array<QuestionType>>;
  respondent: UserType;
  status?: Maybe<FormsResponseStatusChoices>;
  uuid: Scalars['UUID']['output'];
};

export type ResponsibleGroupType = {
  __typename?: 'ResponsibleGroupType';
  description?: Maybe<Scalars['String']['output']>;
  groupType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organization: OrganizationType;
  uuid: Scalars['UUID']['output'];
};

export type ReviewJanHusBooking = {
  __typename?: 'ReviewJanHusBooking';
  booking?: Maybe<JanHusBookingType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type ReviewJanHusBookingInput = {
  adminComment?: InputMaybe<Scalars['String']['input']>;
  depositAmount?: InputMaybe<Scalars['Decimal']['input']>;
  depositStatus?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type ReviewJanHusBookingRequest = {
  __typename?: 'ReviewJanHusBookingRequest';
  booking?: Maybe<JanHusBookingType>;
  bookingRequest?: Maybe<JanHusBookingRequestType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type ReviewJanHusBookingRequestInput = {
  adminComment?: InputMaybe<Scalars['String']['input']>;
  convertToBooking?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};

export type RevokeNfcAccessGrant = {
  __typename?: 'RevokeNfcAccessGrant';
  accessGrant?: Maybe<NfcAccessGrantType>;
  ok: Scalars['Boolean']['output'];
};

export type RevokeNfcAccessGrantInput = {
  accessGrantId: Scalars['ID']['input'];
};

export type RevokeNfcAssignment = {
  __typename?: 'RevokeNfcAssignment';
  assignment?: Maybe<NfcCardAssignmentType>;
  ok: Scalars['Boolean']['output'];
};

export type RevokeNfcAssignmentInput = {
  assignmentId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};

/** Sends email to the user or an admin (or both) */
export type SendEmail = {
  __typename?: 'SendEmail';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Send an email to all users signed up to an event */
export type SendEventEmails = {
  __typename?: 'SendEventEmails';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type SignUpType = {
  __typename?: 'SignUpType';
  event: EventType;
  extraInformation: Scalars['String']['output'];
  hasBoughtTicket?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  isAttending: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTime']['output'];
  user: UserType;
  userAllergies?: Maybe<Scalars['String']['output']>;
  userEmail: Scalars['String']['output'];
  userGradeYear: Scalars['Int']['output'];
  userPhoneNumber: Scalars['String']['output'];
};

export type SubmitOrUpdateAnswers = {
  __typename?: 'SubmitOrUpdateAnswers';
  message?: Maybe<Scalars['String']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateArchiveDocument = {
  __typename?: 'UpdateArchiveDocument';
  event?: Maybe<ArchiveDocumentType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateBlog = {
  __typename?: 'UpdateBlog';
  blog?: Maybe<BlogType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateBlogInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateBlogPost = {
  __typename?: 'UpdateBlogPost';
  blogPost?: Maybe<BlogPostType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateBlogPostInput = {
  blogId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** Change the given booking */
export type UpdateBooking = {
  __typename?: 'UpdateBooking';
  booking?: Maybe<AllBookingsType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateBookingInput = {
  cabins?: InputMaybe<Array<Scalars['Int']['input']>>;
  checkIn?: InputMaybe<Scalars['Date']['input']>;
  checkOut?: InputMaybe<Scalars['Date']['input']>;
  declineReason?: InputMaybe<Scalars['String']['input']>;
  externalParticipants?: InputMaybe<Scalars['Int']['input']>;
  extraInfo?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  internalParticipants?: InputMaybe<Scalars['Int']['input']>;
  isDeclined?: InputMaybe<Scalars['Boolean']['input']>;
  isTentative?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  receiverEmail?: InputMaybe<Scalars['String']['input']>;
};

/** Update the booking semester */
export type UpdateBookingSemester = {
  __typename?: 'UpdateBookingSemester';
  bookingSemester?: Maybe<UpdateBookingSemesterType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateBookingSemesterInput = {
  fallEndDate?: InputMaybe<Scalars['Date']['input']>;
  fallSemesterActive?: InputMaybe<Scalars['Boolean']['input']>;
  fallStartDate?: InputMaybe<Scalars['Date']['input']>;
  springEndDate?: InputMaybe<Scalars['Date']['input']>;
  springSemesterActive?: InputMaybe<Scalars['Boolean']['input']>;
  springStartDate?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateBookingSemesterType = {
  __typename?: 'UpdateBookingSemesterType';
  fallEndDate: Scalars['Date']['output'];
  fallSemesterActive: Scalars['Boolean']['output'];
  fallStartDate: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  springEndDate: Scalars['Date']['output'];
  springSemesterActive: Scalars['Boolean']['output'];
  springStartDate: Scalars['Date']['output'];
};

/** Change the given cabin */
export type UpdateCabin = {
  __typename?: 'UpdateCabin';
  cabin?: Maybe<CabinType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateCabinInput = {
  externalPrice?: InputMaybe<Scalars['Int']['input']>;
  externalPriceWeekend?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  internalPrice?: InputMaybe<Scalars['Int']['input']>;
  internalPriceWeekend?: InputMaybe<Scalars['Int']['input']>;
  maxGuests?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Updates the category with a given ID with the data in category_data */
export type UpdateCategory = {
  __typename?: 'UpdateCategory';
  category?: Maybe<CategoryType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Updates the event with a given ID with the data in event_data */
export type UpdateEvent = {
  __typename?: 'UpdateEvent';
  event?: Maybe<EventType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateEventInput = {
  allowedGradeYears?: InputMaybe<Array<Scalars['Int']['input']>>;
  availableSlots?: InputMaybe<Scalars['Int']['input']>;
  bindingSignup?: InputMaybe<Scalars['Boolean']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  deadline?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endTime?: InputMaybe<Scalars['DateTime']['input']>;
  hasExtraInformation?: InputMaybe<Scalars['Boolean']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  isAttendable?: InputMaybe<Scalars['Boolean']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['ID']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  shortDescription?: InputMaybe<Scalars['String']['input']>;
  signupOpenDate?: InputMaybe<Scalars['DateTime']['input']>;
  startTime?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateForm = {
  __typename?: 'UpdateForm';
  form?: Maybe<FormType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateJanHusAreaConfiguration = {
  __typename?: 'UpdateJanHusAreaConfiguration';
  areaConfiguration?: Maybe<JanHusAreaConfigurationType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateJanHusBooking = {
  __typename?: 'UpdateJanHusBooking';
  booking?: Maybe<JanHusBookingType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateJanHusBookingInput = {
  adminComment?: InputMaybe<Scalars['String']['input']>;
  area?: InputMaybe<Scalars['String']['input']>;
  bookerEmail?: InputMaybe<Scalars['String']['input']>;
  bookerName?: InputMaybe<Scalars['String']['input']>;
  bookerPhone?: InputMaybe<Scalars['String']['input']>;
  cleaningRequested?: InputMaybe<Scalars['Boolean']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  depositAmount?: InputMaybe<Scalars['Decimal']['input']>;
  depositStatus?: InputMaybe<Scalars['String']['input']>;
  doorAccessPolicy?: InputMaybe<Scalars['String']['input']>;
  endsAt?: InputMaybe<Scalars['DateTime']['input']>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  guestList?: InputMaybe<Scalars['String']['input']>;
  guestListUserFeideIds?: InputMaybe<Array<Scalars['String']['input']>>;
  id: Scalars['ID']['input'];
  responsibleEmail?: InputMaybe<Scalars['String']['input']>;
  responsibleName?: InputMaybe<Scalars['String']['input']>;
  responsiblePhone?: InputMaybe<Scalars['String']['input']>;
  startsAt?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateJanHusBookingSettings = {
  __typename?: 'UpdateJanHusBookingSettings';
  bookingSettings?: Maybe<JanHusBookingSettingsType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateListing = {
  __typename?: 'UpdateListing';
  listing?: Maybe<ListingType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateOrganization = {
  __typename?: 'UpdateOrganization';
  ok?: Maybe<Scalars['Boolean']['output']>;
  organization?: Maybe<OrganizationType>;
};

export type UpdateQuestion = {
  __typename?: 'UpdateQuestion';
  ok?: Maybe<Scalars['Boolean']['output']>;
  question?: Maybe<QuestionType>;
};

export type UpdateUser = {
  __typename?: 'UpdateUser';
  user?: Maybe<UserType>;
};

export type UpsertMembership = {
  __typename?: 'UpsertMembership';
  membership?: Maybe<MembershipType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpsertNfcCard = {
  __typename?: 'UpsertNfcCard';
  card?: Maybe<NfcCardType>;
  ok: Scalars['Boolean']['output'];
};

export type UserAttendingType = {
  __typename?: 'UserAttendingType';
  hasBoughtTicket?: Maybe<Scalars['Boolean']['output']>;
  isOnWaitingList?: Maybe<Scalars['Boolean']['output']>;
  isSignedUp?: Maybe<Scalars['Boolean']['output']>;
  positionOnWaitingList?: Maybe<Scalars['Int']['output']>;
};

export type UserInput = {
  allergies?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  graduationYear?: InputMaybe<Scalars['Int']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  nfcPinCode?: InputMaybe<Scalars['String']['input']>;
  nfcUidHex?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UserType = {
  __typename?: 'UserType';
  allergies?: Maybe<Scalars['String']['output']>;
  canUpdateYear?: Maybe<Scalars['Boolean']['output']>;
  dateJoined: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  events?: Maybe<Array<EventType>>;
  feideEmail: Scalars['String']['output'];
  feideUserid: Scalars['String']['output'];
  firstLogin: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  gradeYear?: Maybe<Scalars['Int']['output']>;
  graduationYear?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  idToken: Scalars['String']['output'];
  isIndok: Scalars['Boolean']['output'];
  lastLogin?: Maybe<Scalars['DateTime']['output']>;
  lastName: Scalars['String']['output'];
  memberships: Array<MembershipType>;
  nfcPermanentAccess?: Maybe<Scalars['Boolean']['output']>;
  nfcPinCode?: Maybe<Scalars['String']['output']>;
  nfcUidHex?: Maybe<Scalars['String']['output']>;
  organizations: Array<OrganizationType>;
  phoneNumber: Scalars['String']['output'];
  responses: Array<ResponseType>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']['output'];
  yearUpdatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AdminUserInput = {
  allergies?: string | null | undefined;
  email?: string | null | undefined;
  firstName?: string | null | undefined;
  graduationYear?: number | null | undefined;
  lastName?: string | null | undefined;
  phoneNumber?: string | null | undefined;
  username?: string | null | undefined;
};

export type AdminUserNfcInput = {
  permanentAccess?: boolean | null | undefined;
  pinCode?: string | null | undefined;
  uidHex?: string | null | undefined;
};

export type AnswerInput = {
  answer: string;
  questionId: string | number;
};

/** An enumeration. */
export type ArchiveArchiveDocumentTypeDocChoices =
  /** Annet */
  | 'ANNET'
  /** Årbøker */
  | 'ARBOKER'
  /** Budsjett og Regnskap */
  | 'BUDSJETT_OG_REGNSKAP'
  /** Foreningens lover */
  | 'FORENINGENS_LOVER'
  /** Generalforsamling */
  | 'GENERALFORSAMLING'
  /** Januscript */
  | 'JANUSCRIPT'
  /** Støtte fra HS */
  | 'STOTTE_FRA_HS'
  /** Utveksling */
  | 'UTVEKSLING';

export type AssignNfcCardInput = {
  accessEnd?: string | null | undefined;
  accessStart?: string | null | undefined;
  externalHolderName?: string | null | undefined;
  metadata?: unknown;
  permanentAccess?: boolean | null | undefined;
  uidHex: string;
  userId?: string | number | null | undefined;
};

export type BaseFormInput = {
  description?: string | null | undefined;
  name?: string | null | undefined;
  organizationId?: string | number | null | undefined;
};

export type BaseListingInput = {
  application?: boolean | null | undefined;
  applicationUrl?: string | null | undefined;
  case?: boolean | null | undefined;
  deadline?: string | null | undefined;
  description?: string | null | undefined;
  endDatetime?: string | null | undefined;
  formId?: string | number | null | undefined;
  interview?: boolean | null | undefined;
  readMoreUrl?: string | null | undefined;
  startDatetime?: string | null | undefined;
  title?: string | null | undefined;
};

export type BaseQuestionInput = {
  description?: string | null | undefined;
  mandatory?: boolean | null | undefined;
  question?: string | null | undefined;
  questionType?: QuestionTypeEnum | null | undefined;
};

/** Basic booking object type used as a base for other types and as a standalone */
export type BookingInput = {
  cabins?: Array<number> | null | undefined;
  checkIn?: string | null | undefined;
  checkOut?: string | null | undefined;
  externalParticipants?: number | null | undefined;
  extraInfo?: string | null | undefined;
  firstName?: string | null | undefined;
  internalParticipants?: number | null | undefined;
  lastName?: string | null | undefined;
  phone?: string | null | undefined;
  receiverEmail?: string | null | undefined;
};

export type CreateEventInput = {
  allowedGradeYears?: Array<number> | null | undefined;
  availableSlots?: number | null | undefined;
  bindingSignup?: boolean | null | undefined;
  categoryId?: string | number | null | undefined;
  contactEmail?: string | null | undefined;
  deadline?: string | null | undefined;
  description: string;
  endTime?: string | null | undefined;
  hasExtraInformation?: boolean | null | undefined;
  image?: string | null | undefined;
  isAttendable: boolean;
  location?: string | null | undefined;
  organizationId: string | number;
  price?: number | null | undefined;
  shortDescription?: string | null | undefined;
  signupOpenDate?: string | null | undefined;
  startTime: string;
  title: string;
};

export type CreateFormInput = {
  description?: string | null | undefined;
  name: string;
  organizationId: string | number;
};

export type CreateListingInput = {
  application?: boolean | null | undefined;
  applicationUrl?: string | null | undefined;
  case?: boolean | null | undefined;
  deadline: string;
  description?: string | null | undefined;
  endDatetime?: string | null | undefined;
  formId?: string | number | null | undefined;
  interview?: boolean | null | undefined;
  organizationId: string | number;
  readMoreUrl?: string | null | undefined;
  startDatetime?: string | null | undefined;
  title: string;
};

export type CreateNfcAccessGrantInput = {
  accessEnd?: string | null | undefined;
  accessStart?: string | null | undefined;
  bookingId?: string | number | null | undefined;
  grantedToUidHex?: string | null | undefined;
  grantedToUserId?: string | number | null | undefined;
  notes?: string | null | undefined;
  participantPolicy?: string | null | undefined;
  permanentAccess?: boolean | null | undefined;
  scope: string;
};

export type CreateQuestionInput = {
  description?: string | null | undefined;
  mandatory?: boolean | null | undefined;
  question: string;
  questionType?: QuestionTypeEnum | null | undefined;
};

export type EmailInput = {
  cabins?: Array<number> | null | undefined;
  checkIn?: string | null | undefined;
  checkOut?: string | null | undefined;
  emailType?: string | null | undefined;
  externalParticipants?: number | null | undefined;
  extraInfo?: string | null | undefined;
  firstName?: string | null | undefined;
  internalParticipants?: number | null | undefined;
  lastName?: string | null | undefined;
  phone?: string | null | undefined;
  receiverEmail?: string | null | undefined;
};

export type JanHusAreaConfigurationInput = {
  area: string;
  cleaningFee?: number | null | undefined;
  defaultDepositAmount?: number | null | undefined;
  externalPricePerHour?: number | null | undefined;
  internalPricePerHour?: number | null | undefined;
};

export type JanHusBookingInput = {
  area: string;
  bookerEmail?: string | null | undefined;
  bookerName?: string | null | undefined;
  bookerPhone?: string | null | undefined;
  cleaningRequested?: boolean | null | undefined;
  comment?: string | null | undefined;
  depositAmount?: number | null | undefined;
  depositStatus?: string | null | undefined;
  endsAt: string;
  eventType?: string | null | undefined;
  isExternalBooking?: boolean | null | undefined;
  ownerOrganizationId?: string | number | null | undefined;
  ownerUserId?: string | number | null | undefined;
  responsibleEmail: string;
  responsibleName: string;
  responsiblePhone: string;
  startsAt: string;
};

export type JanHusBookingRequestInput = {
  area: string;
  cleaningRequested?: boolean | null | undefined;
  comment?: string | null | undefined;
  endsAt: string;
  eventType?: string | null | undefined;
  guestList?: string | null | undefined;
  ownerOrganizationId?: string | number | null | undefined;
  requesterEmail?: string | null | undefined;
  requesterName?: string | null | undefined;
  requesterPhone?: string | null | undefined;
  responsibleEmail: string;
  responsibleName: string;
  responsiblePhone: string;
  startsAt: string;
};

export type JanHusBookingSettingsInput = {
  bufferMinutes?: number | null | undefined;
  closingHour?: number | null | undefined;
  externalBookingsEnabled?: boolean | null | undefined;
  fallEndDate?: string | null | undefined;
  fallSemesterActive?: boolean | null | undefined;
  fallStartDate?: string | null | undefined;
  generalBookingOpensWeeksBefore?: number | null | undefined;
  minDurationMinutes?: number | null | undefined;
  openingHour?: number | null | undefined;
  organizationBookingOpensWeeksBefore?: number | null | undefined;
  slotGranularityMinutes?: number | null | undefined;
  springEndDate?: string | null | undefined;
  springSemesterActive?: boolean | null | undefined;
  springStartDate?: string | null | undefined;
};

/** An enumeration. */
export type JanhusJanHusAreaConfigurationAreaChoices =
  /** Entire house */
  | 'ENTIRE_HOUSE'
  /** 1st floor */
  | 'FIRST_FLOOR'
  /** 2nd floor */
  | 'SECOND_FLOOR';

/** An enumeration. */
export type JanhusJanHusBookingAreaChoices =
  /** Entire house */
  | 'ENTIRE_HOUSE'
  /** 1st floor */
  | 'FIRST_FLOOR'
  /** 2nd floor */
  | 'SECOND_FLOOR';

/** An enumeration. */
export type JanhusJanHusBookingDepositStatusChoices =
  /** Not required */
  | 'NOT_REQUIRED'
  /** Paid */
  | 'PAID'
  /** Refunded */
  | 'REFUNDED'
  /** Requested */
  | 'REQUESTED'
  /** Required */
  | 'REQUIRED'
  /** Withheld */
  | 'WITHHELD';

/** An enumeration. */
export type JanhusJanHusBookingDoorAccessPolicyChoices =
  /** Booker and guest list */
  | 'ALL_PARTICIPANTS'
  /** Booker only */
  | 'BOOKER_ONLY';

/** An enumeration. */
export type JanhusJanHusBookingEventTypeChoices =
  /** External */
  | 'EXTERNAL'
  /** Internal */
  | 'INTERNAL'
  /** Open to all Indøk students */
  | 'OPEN_FOR_INDOK'
  /** Private */
  | 'PRIVATE';

/** An enumeration. */
export type JanhusJanHusBookingRequestAreaChoices =
  /** Entire house */
  | 'ENTIRE_HOUSE'
  /** 1st floor */
  | 'FIRST_FLOOR'
  /** 2nd floor */
  | 'SECOND_FLOOR';

/** An enumeration. */
export type JanhusJanHusBookingRequestEventTypeChoices =
  /** External */
  | 'EXTERNAL'
  /** Internal */
  | 'INTERNAL'
  /** Open to all Indøk students */
  | 'OPEN_FOR_INDOK'
  /** Private */
  | 'PRIVATE';

/** An enumeration. */
export type JanhusJanHusBookingRequestStatusChoices =
  /** Approved */
  | 'APPROVED'
  /** Pending */
  | 'PENDING'
  /** Rejected */
  | 'REJECTED';

/** An enumeration. */
export type JanhusJanHusBookingStatusChoices =
  /** Blocked */
  | 'BLOCKED'
  /** Cancelled */
  | 'CANCELLED'
  /** Confirmed */
  | 'CONFIRMED'
  /** Declined */
  | 'DECLINED'
  /** Pending admin review */
  | 'PENDING_ADMIN_REVIEW'
  /** Provisional */
  | 'PROVISIONAL';

export type LogNfcAccessEventInput = {
  doorIdentifier?: string | null | undefined;
  eventType: string;
  notes?: string | null | undefined;
  rawPayload?: unknown;
  resolvedUserId?: string | number | null | undefined;
  source?: string | null | undefined;
  uidHexReported?: string | null | undefined;
};

export type MembershipInput = {
  groupId: string | number;
  organizationId: string | number;
  userId: string | number;
};

export type NfcCardInput = {
  isEnabled?: boolean | null | undefined;
  label?: string | null | undefined;
  notes?: string | null | undefined;
  uidHex: string;
};

/** An enumeration. */
export type NfcNfcAccessEventEventTypeChoices =
  /** Access denied */
  | 'ACCESS_DENIED'
  /** Access granted */
  | 'ACCESS_GRANTED'
  /** Door opened */
  | 'DOOR_OPENED';

/** An enumeration. */
export type NfcNfcAccessEventSourceChoices =
  /** Backend */
  | 'BACKEND'
  /** Manual key */
  | 'MANUAL_KEY'
  /** NFC reader */
  | 'NFC_READER'
  /** Unknown */
  | 'UNKNOWN';

/** An enumeration. */
export type NfcNfcAccessGrantParticipantPolicyChoices =
  /** All participants */
  | 'ALL_PARTICIPANTS'
  /** Booker only */
  | 'BOOKER_ONLY';

/** An enumeration. */
export type NfcNfcAccessGrantScopeChoices =
  /** Booking */
  | 'BOOKING'
  /** Manual */
  | 'MANUAL';

export type OptionInput = {
  answer: string;
  id?: string | number | null | undefined;
};

/** An enumeration. */
export type PaymentStatus =
  | 'CANCELLED'
  | 'CAPTURED'
  | 'FAILED'
  | 'INITIATED'
  | 'REFUNDED'
  | 'REJECTED'
  | 'RESERVED';

export type QuestionTypeEnum =
  | 'CHECKBOXES'
  | 'DROPDOWN'
  | 'FILE_UPLOAD'
  | 'MULTIPLE_CHOICE'
  | 'PARAGRAPH'
  | 'SHORT_ANSWER'
  | 'SLIDER';

export type ReviewJanHusBookingInput = {
  adminComment?: string | null | undefined;
  depositAmount?: number | null | undefined;
  depositStatus?: string | null | undefined;
  id: string | number;
  status?: string | null | undefined;
};

export type ReviewJanHusBookingRequestInput = {
  adminComment?: string | null | undefined;
  convertToBooking?: boolean | null | undefined;
  id: string | number;
  status: string;
};

export type RevokeNfcAccessGrantInput = {
  accessGrantId: string | number;
};

export type RevokeNfcAssignmentInput = {
  assignmentId: string | number;
  reason?: string | null | undefined;
};

export type UpdateBookingSemesterInput = {
  fallEndDate?: string | null | undefined;
  fallSemesterActive?: boolean | null | undefined;
  fallStartDate?: string | null | undefined;
  springEndDate?: string | null | undefined;
  springSemesterActive?: boolean | null | undefined;
  springStartDate?: string | null | undefined;
};

export type UpdateCabinInput = {
  externalPrice?: number | null | undefined;
  externalPriceWeekend?: number | null | undefined;
  id?: string | number | null | undefined;
  internalPrice?: number | null | undefined;
  internalPriceWeekend?: number | null | undefined;
  maxGuests?: number | null | undefined;
  name?: string | null | undefined;
};

export type UpdateEventInput = {
  allowedGradeYears?: Array<number> | null | undefined;
  availableSlots?: number | null | undefined;
  bindingSignup?: boolean | null | undefined;
  categoryId?: string | number | null | undefined;
  contactEmail?: string | null | undefined;
  deadline?: string | null | undefined;
  description?: string | null | undefined;
  endTime?: string | null | undefined;
  hasExtraInformation?: boolean | null | undefined;
  image?: string | null | undefined;
  isAttendable?: boolean | null | undefined;
  location?: string | null | undefined;
  organizationId?: string | number | null | undefined;
  price?: number | null | undefined;
  shortDescription?: string | null | undefined;
  signupOpenDate?: string | null | undefined;
  startTime?: string | null | undefined;
  title?: string | null | undefined;
};

export type UpdateJanHusBookingInput = {
  adminComment?: string | null | undefined;
  area?: string | null | undefined;
  bookerEmail?: string | null | undefined;
  bookerName?: string | null | undefined;
  bookerPhone?: string | null | undefined;
  cleaningRequested?: boolean | null | undefined;
  comment?: string | null | undefined;
  depositAmount?: number | null | undefined;
  depositStatus?: string | null | undefined;
  doorAccessPolicy?: string | null | undefined;
  endsAt?: string | null | undefined;
  eventType?: string | null | undefined;
  guestList?: string | null | undefined;
  guestListUserFeideIds?: Array<string> | null | undefined;
  id: string | number;
  responsibleEmail?: string | null | undefined;
  responsibleName?: string | null | undefined;
  responsiblePhone?: string | null | undefined;
  startsAt?: string | null | undefined;
  status?: string | null | undefined;
};

export type UserInput = {
  allergies?: string | null | undefined;
  email?: string | null | undefined;
  firstName?: string | null | undefined;
  graduationYear?: number | null | undefined;
  lastName?: string | null | undefined;
  nfcPinCode?: string | null | undefined;
  nfcUidHex?: string | null | undefined;
  phoneNumber?: string | null | undefined;
};

export type ArchiveByTypesQueryVariables = Exact<{
  documentTypes: Array<string | null | undefined> | string;
  year?: number | null | undefined;
  names?: string | null | undefined;
}>;


export type ArchiveByTypesQuery = { archiveByTypes: Array<{ id: string, title: string, thumbnail: string | null, typeDoc: ArchiveArchiveDocumentTypeDocChoices, year: number | null, webLink: string | null }> };

export type FeaturedArchiveQueryVariables = Exact<{ [key: string]: never; }>;


export type FeaturedArchiveQuery = { featuredArchive: Array<{ id: string, title: string, thumbnail: string | null, typeDoc: ArchiveArchiveDocumentTypeDocChoices, year: number | null, webLink: string | null }> };

export type AvailableYearsQueryVariables = Exact<{ [key: string]: never; }>;


export type AvailableYearsQuery = { availableYears: Array<string> };

export type DocumentFragment = { id: string, title: string, thumbnail: string | null, typeDoc: ArchiveArchiveDocumentTypeDocChoices, year: number | null, webLink: string | null };

export type DocumentsQueryVariables = Exact<{
  documentTypes: Array<string> | string;
  year?: number | null | undefined;
  names?: string | null | undefined;
}>;


export type DocumentsQuery = { availableYears: Array<string>, hasPermission: boolean | null, archiveByTypes: Array<{ id: string, title: string, thumbnail: string | null, typeDoc: ArchiveArchiveDocumentTypeDocChoices, year: number | null, webLink: string | null }>, featuredArchive: Array<{ id: string, title: string, thumbnail: string | null, typeDoc: ArchiveArchiveDocumentTypeDocChoices, year: number | null, webLink: string | null }> };

export type CabinFragment = { id: string, name: string, maxGuests: number, internalPrice: number, externalPrice: number, internalPriceWeekend: number, externalPriceWeekend: number };

export type BookingFragment = { id: string, checkIn: string, checkOut: string, cabins: Array<{ id: string, name: string }> };

export type AdminBookingFragment = { id: string, checkIn: string, checkOut: string, firstName: string, lastName: string, phone: string, receiverEmail: string, externalParticipants: number, internalParticipants: number, price: number | null, isTentative: boolean, isDeclined: boolean, timestamp: string, extraInfo: string, declineReason: string, cabins: Array<{ id: string, name: string }> };

export type BookingResponsibleFragment = { id: string, active: boolean | null, firstName: string | null, lastName: string | null, email: string | null, phone: number | null };

export type BookingSemesterFragment = { fallStartDate: string, fallEndDate: string, springStartDate: string, springEndDate: string, fallSemesterActive: boolean, springSemesterActive: boolean };

export type CreateBookingMutationVariables = Exact<{
  bookingData: BookingInput;
}>;


export type CreateBookingMutation = { createBooking: { ok: boolean | null } | null };

export type ConfirmBookingMutationVariables = Exact<{
  id: string | number;
}>;


export type ConfirmBookingMutation = { updateBooking: { ok: boolean | null } | null };

export type DeclineBookingMutationVariables = Exact<{
  id: string | number;
  declineReason?: string | null | undefined;
}>;


export type DeclineBookingMutation = { updateBooking: { ok: boolean | null } | null };

export type SendEmailMutationVariables = Exact<{
  emailInput: EmailInput;
}>;


export type SendEmailMutation = { sendEmail: { ok: boolean | null } | null };

export type UpdateCabinMutationVariables = Exact<{
  cabinData: UpdateCabinInput;
}>;


export type UpdateCabinMutation = { updateCabin: { cabin: { id: string, name: string, maxGuests: number, internalPrice: number, externalPrice: number, internalPriceWeekend: number, externalPriceWeekend: number } | null } | null };

export type UpdateBookingSemesterMutationVariables = Exact<{
  semesterData: UpdateBookingSemesterInput;
}>;


export type UpdateBookingSemesterMutation = { updateBookingSemester: { bookingSemester: { fallStartDate: string, fallEndDate: string, springStartDate: string, springEndDate: string, fallSemesterActive: boolean, springSemesterActive: boolean } | null } | null };

export type CabinsQueryVariables = Exact<{ [key: string]: never; }>;


export type CabinsQuery = { cabins: Array<{ id: string, name: string, maxGuests: number, internalPrice: number, externalPrice: number, internalPriceWeekend: number, externalPriceWeekend: number }> | null };

export type AllBookingsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllBookingsQuery = { allBookings: Array<{ id: string, checkIn: string, checkOut: string, cabins: Array<{ id: string, name: string }> }> | null };

export type MyCabinBookingsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyCabinBookingsQuery = { myCabinBookings: Array<{ id: string, checkIn: string, checkOut: string, firstName: string, lastName: string, phone: string, receiverEmail: string, externalParticipants: number, internalParticipants: number, price: number | null, isTentative: boolean, isDeclined: boolean, timestamp: string, extraInfo: string, declineReason: string, cabins: Array<{ id: string, name: string }> }> | null };

export type AdminAllBookingsQueryVariables = Exact<{
  after?: string | null | undefined;
}>;


export type AdminAllBookingsQuery = { adminAllBookings: Array<{ id: string, checkIn: string, checkOut: string, firstName: string, lastName: string, phone: string, receiverEmail: string, externalParticipants: number, internalParticipants: number, price: number | null, isTentative: boolean, isDeclined: boolean, timestamp: string, extraInfo: string, declineReason: string, cabins: Array<{ id: string, name: string }> }> | null };

export type ActiveBookingResponsibleQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveBookingResponsibleQuery = { activeBookingResponsible: { id: string, active: boolean | null, firstName: string | null, lastName: string | null, email: string | null, phone: number | null } | null };

export type CabinsAndResponsiblesQueryVariables = Exact<{ [key: string]: never; }>;


export type CabinsAndResponsiblesQuery = { cabins: Array<{ id: string, name: string, maxGuests: number, internalPrice: number, externalPrice: number, internalPriceWeekend: number, externalPriceWeekend: number }> | null, activeBookingResponsible: { id: string, email: string | null } | null };

export type BookingSemesterQueryVariables = Exact<{ [key: string]: never; }>;


export type BookingSemesterQuery = { bookingSemester: { fallStartDate: string, fallEndDate: string, springStartDate: string, springEndDate: string, fallSemesterActive: boolean, springSemesterActive: boolean } | null };

export type ProductFragment = { id: string, name: string, description: string, price: number, maxBuyableQuantity: number, shopItem: boolean };

export type OrderFragment = { id: string, quantity: number, totalPrice: number, paymentStatus: PaymentStatus, timestamp: string, deliveredProduct: boolean, product: { id: string, name: string, description: string, price: number, maxBuyableQuantity: number, shopItem: boolean }, user: { id: string, username: string, firstName: string, lastName: string } };

export type InitiateOrderMutationVariables = Exact<{
  productId: string | number;
  quantity?: number | null | undefined;
  fallbackRedirect?: string | null | undefined;
}>;


export type InitiateOrderMutation = { initiateOrder: { redirect: string | null, orderId: string | null } | null };

export type AttemptCapturePaymentMutationVariables = Exact<{
  orderId: string | number;
}>;


export type AttemptCapturePaymentMutation = { attemptCapturePayment: { status: PaymentStatus | null, order: { id: string, quantity: number, totalPrice: number, paymentStatus: PaymentStatus, timestamp: string, deliveredProduct: boolean, product: { id: string, name: string, description: string, price: number, maxBuyableQuantity: number, shopItem: boolean }, user: { id: string, username: string, firstName: string, lastName: string } } | null } | null };

export type DeliveredProductMutationVariables = Exact<{
  orderId: string | number;
}>;


export type DeliveredProductMutation = { deliveredProduct: { order: { id: string, quantity: number, totalPrice: number, paymentStatus: PaymentStatus, timestamp: string, deliveredProduct: boolean, product: { id: string, name: string, description: string, price: number, maxBuyableQuantity: number, shopItem: boolean }, user: { id: string, username: string, firstName: string, lastName: string } } | null } | null };

export type ProductQueryVariables = Exact<{
  productId: string | number;
}>;


export type ProductQuery = { product: { id: string, name: string, description: string, price: number, maxBuyableQuantity: number, shopItem: boolean } | null };

export type ProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type ProductsQuery = { products: Array<{ id: string, name: string, price: number, description: string, maxBuyableQuantity: number, shopItem: boolean }> | null };

export type UserOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type UserOrdersQuery = { userOrders: Array<{ id: string, quantity: number, totalPrice: number, paymentStatus: PaymentStatus, timestamp: string, deliveredProduct: boolean, product: { id: string, name: string, description: string, price: number, maxBuyableQuantity: number, shopItem: boolean }, user: { id: string, username: string, firstName: string, lastName: string } }> | null };

export type AllUserOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUserOrdersQuery = { allUserOrders: Array<{ id: string, quantity: number, totalPrice: number, paymentStatus: PaymentStatus, timestamp: string, deliveredProduct: boolean, product: { id: string, name: string, description: string, price: number, maxBuyableQuantity: number, shopItem: boolean }, user: { id: string, username: string, firstName: string, lastName: string } }> | null };

export type PaginatedShopOrdersQueryVariables = Exact<{
  limit?: number | null | undefined;
  offset?: number | null | undefined;
}>;


export type PaginatedShopOrdersQuery = { paginatedShopOrders: Array<{ id: string, quantity: number, totalPrice: number, paymentStatus: PaymentStatus, timestamp: string, deliveredProduct: boolean, product: { id: string, name: string, description: string, price: number, maxBuyableQuantity: number, shopItem: boolean }, user: { id: string, username: string, firstName: string, lastName: string } }> | null };

export type EventFieldsFragment = { id: string, title: string, startTime: string, shortDescription: string | null, allowedGradeYears: Array<number> | null, isFull: boolean | null, isAttendable: boolean, signupOpenDate: string | null, userAttendance: { isSignedUp: boolean | null, isOnWaitingList: boolean | null } | null, organization: { id: string, color: string | null } };

export type EventDetailFieldsFragment = { id: string, title: string, description: string, shortDescription: string | null, startTime: string, endTime: string | null, location: string | null, contactEmail: string, allowedGradeYears: Array<number> | null, hasExtraInformation: boolean, isFull: boolean | null, signupOpenDate: string | null, deadline: string | null, isAttendable: boolean, bindingSignup: boolean, price: number | null, product: { id: string } | null, userAttendance: { isSignedUp: boolean | null, isOnWaitingList: boolean | null, positionOnWaitingList: number | null, hasBoughtTicket: boolean | null } | null, category: { id: string, name: string } | null, organization: { id: string, name: string, logoUrl: string | null } };

export type AdminEventFragment = { id: string, title: string, startTime: string, endTime: string | null, location: string | null, description: string, image: string | null, isAttendable: boolean, deadline: string | null, availableSlots: number | null, price: number | null, shortDescription: string | null, signupOpenDate: string | null, isFull: boolean | null, hasExtraInformation: boolean, bindingSignup: boolean, contactEmail: string, allowedGradeYears: Array<number> | null, organization: { id: string, name: string }, category: { id: string, name: string } | null, publisher: { id: string, username: string, email: string, firstName: string, lastName: string, dateJoined: string } | null, usersAttending: Array<{ userEmail: string, userGradeYear: number, userAllergies: string | null, userPhoneNumber: string, extraInformation: string, hasBoughtTicket: boolean | null, user: { id: string, firstName: string, lastName: string } }> | null, usersOnWaitingList: Array<{ userEmail: string, userGradeYear: number, userAllergies: string | null, userPhoneNumber: string, extraInformation: string, user: { id: string, firstName: string, lastName: string } }> | null, userAttendance: { isSignedUp: boolean | null, isOnWaitingList: boolean | null } | null, product: { id: string } | null };

export type SignUpFragment = { userEmail: string, userGradeYear: number, userAllergies: string | null, userPhoneNumber: string, extraInformation: string, user: { id: string, firstName: string, lastName: string } };

export type SignUpWithTicketFragment = { userEmail: string, userGradeYear: number, userAllergies: string | null, userPhoneNumber: string, extraInformation: string, hasBoughtTicket: boolean | null, user: { id: string, firstName: string, lastName: string } };

export type CreateEventMutationVariables = Exact<{
  eventData: CreateEventInput;
}>;


export type CreateEventMutation = { createEvent: { ok: boolean | null, event: { id: string, title: string, startTime: string, shortDescription: string | null, allowedGradeYears: Array<number> | null, isFull: boolean | null, isAttendable: boolean, signupOpenDate: string | null, userAttendance: { isSignedUp: boolean | null, isOnWaitingList: boolean | null } | null, organization: { id: string, color: string | null } } | null } | null };

export type UpdateEventMutationVariables = Exact<{
  id: string | number;
  eventData: UpdateEventInput;
}>;


export type UpdateEventMutation = { updateEvent: { ok: boolean | null, event: { id: string, title: string, description: string, shortDescription: string | null, startTime: string, endTime: string | null, location: string | null, contactEmail: string, allowedGradeYears: Array<number> | null, hasExtraInformation: boolean, isFull: boolean | null, signupOpenDate: string | null, deadline: string | null, isAttendable: boolean, bindingSignup: boolean, price: number | null, product: { id: string } | null, userAttendance: { isSignedUp: boolean | null, isOnWaitingList: boolean | null, positionOnWaitingList: number | null, hasBoughtTicket: boolean | null } | null, category: { id: string, name: string } | null, organization: { id: string, name: string, logoUrl: string | null } } | null } | null };

export type EventSignUpMutationVariables = Exact<{
  eventId: string | number;
  extraInformation?: string | null | undefined;
}>;


export type EventSignUpMutation = { eventSignUp: { isFull: boolean | null, event: { id: string, userAttendance: { isSignedUp: boolean | null, isOnWaitingList: boolean | null, positionOnWaitingList: number | null } | null } | null } | null };

export type EventSignOffMutationVariables = Exact<{
  eventId: string | number;
}>;


export type EventSignOffMutation = { eventSignOff: { isFull: boolean | null, event: { id: string, userAttendance: { isSignedUp: boolean | null, isOnWaitingList: boolean | null, positionOnWaitingList: number | null } | null } | null } | null };

export type AdminEventSignOffMutationVariables = Exact<{
  eventId: string | number;
  userId: string | number;
}>;


export type AdminEventSignOffMutation = { adminEventSignOff: { event: { id: string } | null } | null };

export type SendEventMailsMutationVariables = Exact<{
  eventId: string | number;
  receiverEmails?: Array<string> | string | null | undefined;
  content?: string | null | undefined;
  subject: string;
}>;


export type SendEventMailsMutation = { sendEventMails: { ok: boolean | null } | null };

export type EventsQueryVariables = Exact<{
  organization?: string | null | undefined;
  category?: string | null | undefined;
  startTime?: string | null | undefined;
  endTime?: string | null | undefined;
}>;


export type EventsQuery = { hasPermission: boolean | null, allEvents: Array<{ id: string, title: string, startTime: string, shortDescription: string | null, allowedGradeYears: Array<number> | null, isFull: boolean | null, isAttendable: boolean, signupOpenDate: string | null, userAttendance: { isSignedUp: boolean | null, isOnWaitingList: boolean | null } | null, organization: { id: string, color: string | null } }> | null, defaultEvents: Array<{ id: string, title: string, startTime: string, shortDescription: string | null, allowedGradeYears: Array<number> | null, isFull: boolean | null, isAttendable: boolean, signupOpenDate: string | null, userAttendance: { isSignedUp: boolean | null, isOnWaitingList: boolean | null } | null, organization: { id: string, color: string | null } }> | null, user: { id: string, gradeYear: number | null } | null };

export type EventDetailsQueryVariables = Exact<{
  id: string | number;
}>;


export type EventDetailsQuery = { event: { id: string, title: string, description: string, shortDescription: string | null, startTime: string, endTime: string | null, location: string | null, contactEmail: string, allowedGradeYears: Array<number> | null, hasExtraInformation: boolean, isFull: boolean | null, signupOpenDate: string | null, deadline: string | null, isAttendable: boolean, bindingSignup: boolean, price: number | null, product: { id: string } | null, userAttendance: { isSignedUp: boolean | null, isOnWaitingList: boolean | null, positionOnWaitingList: number | null, hasBoughtTicket: boolean | null } | null, category: { id: string, name: string } | null, organization: { id: string, name: string, logoUrl: string | null } } | null, user: { id: string, gradeYear: number | null, organizations: Array<{ id: string }> } | null };

export type AllCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllCategoriesQuery = { allCategories: Array<{ id: string, name: string }> | null };

export type EventFilteredOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type EventFilteredOrganizationsQuery = { eventFilteredOrganizations: Array<{ id: string, name: string, color: string | null, children: Array<{ id: string, name: string }> }> | null };

export type AdminEventQueryVariables = Exact<{
  id: string | number;
}>;


export type AdminEventQuery = { event: { id: string, title: string, startTime: string, endTime: string | null, location: string | null, description: string, image: string | null, isAttendable: boolean, deadline: string | null, availableSlots: number | null, price: number | null, shortDescription: string | null, signupOpenDate: string | null, isFull: boolean | null, hasExtraInformation: boolean, bindingSignup: boolean, contactEmail: string, allowedGradeYears: Array<number> | null, organization: { id: string, name: string }, category: { id: string, name: string } | null, publisher: { id: string, username: string, email: string, firstName: string, lastName: string, dateJoined: string } | null, usersAttending: Array<{ userEmail: string, userGradeYear: number, userAllergies: string | null, userPhoneNumber: string, extraInformation: string, hasBoughtTicket: boolean | null, user: { id: string, firstName: string, lastName: string } }> | null, usersOnWaitingList: Array<{ userEmail: string, userGradeYear: number, userAllergies: string | null, userPhoneNumber: string, extraInformation: string, user: { id: string, firstName: string, lastName: string } }> | null, userAttendance: { isSignedUp: boolean | null, isOnWaitingList: boolean | null } | null, product: { id: string } | null } | null };

export type EventSignUpsQueryVariables = Exact<{
  id: string | number;
}>;


export type EventSignUpsQuery = { event: { isAttendable: boolean, usersAttending: Array<{ userEmail: string }> | null } | null };

export type AttendeeReportQueryVariables = Exact<{
  eventId: string | number;
  fields?: Array<string> | string | null | undefined;
  filetype?: string | null | undefined;
}>;


export type AttendeeReportQuery = { attendeeReport: string | null };

export type AttendeeReportOrgQueryVariables = Exact<{
  orgId: string | number;
  fields?: Array<string> | string | null | undefined;
  filetype?: string | null | undefined;
}>;


export type AttendeeReportOrgQuery = { attendeeReportOrg: string | null };

export type AttendeeReportsQueryVariables = Exact<{
  eventIds: Array<string | number> | string | number;
  fields?: Array<string> | string | null | undefined;
  filetype?: string | null | undefined;
}>;


export type AttendeeReportsQuery = { attendeeReports: string | null };

export type EventUserOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type EventUserOrganizationsQuery = { user: { id: string, organizations: Array<{ id: string }> } | null };

export type FormFragment = { id: string, name: string, questions: Array<{ id: string, question: string, description: string, questionType: QuestionTypeEnum | null, mandatory: boolean, options: Array<{ id: string, answer: string }> | null }> };

export type FormWithAnswersFragment = { id: string, name: string, description: string, questions: Array<{ id: string, question: string, description: string, questionType: QuestionTypeEnum | null, mandatory: boolean, answer: { id: string | null, answer: string } | null, options: Array<{ id: string, answer: string }> | null }> };

export type FormWithAllResponsesFragment = { id: string, name: string, questions: Array<{ id: string, question: string, description: string, questionType: QuestionTypeEnum | null, mandatory: boolean, answers: Array<{ id: string | null }> | null, options: Array<{ id: string, answer: string }> | null }>, responses: Array<{ id: string | null, respondent: { id: string, firstName: string, lastName: string }, answers: Array<{ id: string | null, answer: string, question: { id: string } }> }> | null };

export type ResponseFragment = { id: string | null, respondent: { id: string, firstName: string, lastName: string }, answers: Array<{ id: string | null, answer: string, question: { id: string } }> };

export type QuestionFragment = { id: string, question: string, description: string, questionType: QuestionTypeEnum | null, mandatory: boolean, options: Array<{ id: string, answer: string }> | null };

export type QuestionWithAnswerFragment = { id: string, question: string, description: string, questionType: QuestionTypeEnum | null, mandatory: boolean, answer: { id: string | null, answer: string } | null, options: Array<{ id: string, answer: string }> | null };

export type QuestionWithAnswerIdsFragment = { id: string, question: string, description: string, questionType: QuestionTypeEnum | null, mandatory: boolean, answers: Array<{ id: string | null }> | null, options: Array<{ id: string, answer: string }> | null };

export type OptionFragment = { id: string, answer: string };

export type AnswerFragment = { id: string | null, answer: string };

export type AnswerWithQuestionIdFragment = { id: string | null, answer: string, question: { id: string } };

export type CreateFormMutationVariables = Exact<{
  formData: CreateFormInput;
  listingId?: string | number | null | undefined;
}>;


export type CreateFormMutation = { createForm: { ok: boolean | null, form: { id: string, name: string, questions: Array<{ id: string, question: string, description: string, questionType: QuestionTypeEnum | null, mandatory: boolean, answers: Array<{ id: string | null }> | null, options: Array<{ id: string, answer: string }> | null }>, responses: Array<{ id: string | null, respondent: { id: string, firstName: string, lastName: string }, answers: Array<{ id: string | null, answer: string, question: { id: string } }> }> | null } | null } | null };

export type UpdateFormMutationVariables = Exact<{
  id: string | number;
  formData: BaseFormInput;
}>;


export type UpdateFormMutation = { updateForm: { ok: boolean | null, form: { id: string, name: string, questions: Array<{ id: string, question: string, description: string, questionType: QuestionTypeEnum | null, mandatory: boolean, answers: Array<{ id: string | null }> | null, options: Array<{ id: string, answer: string }> | null }>, responses: Array<{ id: string | null, respondent: { id: string, firstName: string, lastName: string }, answers: Array<{ id: string | null, answer: string, question: { id: string } }> }> | null } | null } | null };

export type CreateQuestionMutationVariables = Exact<{
  formId: string | number;
  questionData: CreateQuestionInput;
}>;


export type CreateQuestionMutation = { createQuestion: { ok: boolean | null, question: { id: string, question: string, description: string, questionType: QuestionTypeEnum | null, mandatory: boolean, answers: Array<{ id: string | null }> | null, options: Array<{ id: string, answer: string }> | null } | null } | null };

export type UpdateQuestionMutationVariables = Exact<{
  id: string | number;
  questionData: BaseQuestionInput;
  optionData?: Array<OptionInput> | OptionInput | null | undefined;
}>;


export type UpdateQuestionMutation = { createUpdateAndDeleteOptions: { ok: boolean | null } | null, updateQuestion: { ok: boolean | null, question: { id: string, question: string, description: string, questionType: QuestionTypeEnum | null, mandatory: boolean, answers: Array<{ id: string | null }> | null, options: Array<{ id: string, answer: string }> | null } | null } | null };

export type DeleteQuestionMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteQuestionMutation = { deleteQuestion: { deletedId: string | null, ok: boolean | null } | null };

export type SubmitAnswersMutationVariables = Exact<{
  formId: string | number;
  answersData?: Array<AnswerInput> | AnswerInput | null | undefined;
}>;


export type SubmitAnswersMutation = { submitAnswers: { ok: boolean | null, message: string | null } | null };

export type FormWithAllResponsesQueryVariables = Exact<{
  formId: string | number;
}>;


export type FormWithAllResponsesQuery = { form: { id: string, name: string, questions: Array<{ id: string, question: string, description: string, questionType: QuestionTypeEnum | null, mandatory: boolean, answers: Array<{ id: string | null }> | null, options: Array<{ id: string, answer: string }> | null }>, responses: Array<{ id: string | null, respondent: { id: string, firstName: string, lastName: string }, answers: Array<{ id: string | null, answer: string, question: { id: string } }> }> | null } | null };

export type FormWithAnswersQueryVariables = Exact<{
  formId: string | number;
}>;


export type FormWithAnswersQuery = { form: { id: string, name: string, description: string, questions: Array<{ id: string, question: string, description: string, questionType: QuestionTypeEnum | null, mandatory: boolean, answer: { id: string | null, answer: string } | null, options: Array<{ id: string, answer: string }> | null }> } | null };

export type JanHusGuestListEntryFragment = { feideUserid: string, displayName: string };

export type JanHusBookingFragment = { id: string, startsAt: string, endsAt: string, area: JanhusJanHusBookingAreaChoices, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount: number | null, comment: string, adminComment: string, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, totalPrice: number | null, durationMinutes: number | null, createdAt: string, updatedAt: string, ownerUser: { id: string, firstName: string, lastName: string } | null, ownerOrganization: { id: string, name: string } | null, bookingLevel: { id: string, name: string, priority: number } | null, guestListEntries: Array<{ feideUserid: string, displayName: string }> | null, vippsProduct: { id: string, name: string, price: number } | null, vippsOrder: { id: string, paymentStatus: PaymentStatus } | null };

export type JanHusBookingRequestFragment = { id: string, startsAt: string, endsAt: string, area: JanhusJanHusBookingRequestAreaChoices, requesterName: string, requesterEmail: string, requesterPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingRequestEventTypeChoices, cleaningRequested: boolean, comment: string, guestList: string, status: JanhusJanHusBookingRequestStatusChoices, adminComment: string, createdAt: string, updatedAt: string, requesterUser: { id: string, firstName: string, lastName: string } | null, ownerOrganization: { id: string, name: string } | null, convertedBooking: { id: string, status: JanhusJanHusBookingStatusChoices } | null };

export type JanHusBookingSettingsFragment = { id: string, minDurationMinutes: number, slotGranularityMinutes: number, openingHour: number, closingHour: number, bufferMinutes: number, organizationBookingOpensWeeksBefore: number, generalBookingOpensWeeksBefore: number, fallStartDate: string, fallEndDate: string, springStartDate: string, springEndDate: string, fallSemesterActive: boolean, springSemesterActive: boolean, externalBookingsEnabled: boolean };

export type JanHusAreaConfigurationFragment = { id: string, area: JanhusJanHusAreaConfigurationAreaChoices, internalPricePerHour: number, externalPricePerHour: number, cleaningFee: number, defaultDepositAmount: number };

export type JanHusBookingLevelFragment = { id: string, name: string, description: string, priority: number, canBookAnytime: boolean, canCreateProvisional: boolean, canCreateConfirmed: boolean, canOverrideLowerLevels: boolean, canEditOwnBookingsOnly: boolean, canEditAllBookings: boolean, bookingOpensWeeksBefore: number | null };

export type CreateJanhusBookingMutationVariables = Exact<{
  bookingData: JanHusBookingInput;
}>;


export type CreateJanhusBookingMutation = { createJanhusBooking: { ok: boolean | null, booking: { id: string, startsAt: string, endsAt: string, area: JanhusJanHusBookingAreaChoices, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount: number | null, comment: string, adminComment: string, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, totalPrice: number | null, durationMinutes: number | null, createdAt: string, updatedAt: string, ownerUser: { id: string, firstName: string, lastName: string } | null, ownerOrganization: { id: string, name: string } | null, bookingLevel: { id: string, name: string, priority: number } | null, guestListEntries: Array<{ feideUserid: string, displayName: string }> | null, vippsProduct: { id: string, name: string, price: number } | null, vippsOrder: { id: string, paymentStatus: PaymentStatus } | null } | null } | null };

export type UpdateJanhusBookingMutationVariables = Exact<{
  bookingData: UpdateJanHusBookingInput;
}>;


export type UpdateJanhusBookingMutation = { updateJanhusBooking: { ok: boolean | null, booking: { id: string, startsAt: string, endsAt: string, area: JanhusJanHusBookingAreaChoices, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount: number | null, comment: string, adminComment: string, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, totalPrice: number | null, durationMinutes: number | null, createdAt: string, updatedAt: string, ownerUser: { id: string, firstName: string, lastName: string } | null, ownerOrganization: { id: string, name: string } | null, bookingLevel: { id: string, name: string, priority: number } | null, guestListEntries: Array<{ feideUserid: string, displayName: string }> | null, vippsProduct: { id: string, name: string, price: number } | null, vippsOrder: { id: string, paymentStatus: PaymentStatus } | null } | null } | null };

export type ReviewJanhusBookingMutationVariables = Exact<{
  reviewData: ReviewJanHusBookingInput;
}>;


export type ReviewJanhusBookingMutation = { reviewJanhusBooking: { ok: boolean | null, booking: { id: string, startsAt: string, endsAt: string, area: JanhusJanHusBookingAreaChoices, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount: number | null, comment: string, adminComment: string, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, totalPrice: number | null, durationMinutes: number | null, createdAt: string, updatedAt: string, ownerUser: { id: string, firstName: string, lastName: string } | null, ownerOrganization: { id: string, name: string } | null, bookingLevel: { id: string, name: string, priority: number } | null, guestListEntries: Array<{ feideUserid: string, displayName: string }> | null, vippsProduct: { id: string, name: string, price: number } | null, vippsOrder: { id: string, paymentStatus: PaymentStatus } | null } | null } | null };

export type CreateJanhusBookingRequestMutationVariables = Exact<{
  requestData: JanHusBookingRequestInput;
}>;


export type CreateJanhusBookingRequestMutation = { createJanhusBookingRequest: { ok: boolean | null, bookingRequest: { id: string, startsAt: string, endsAt: string, area: JanhusJanHusBookingRequestAreaChoices, requesterName: string, requesterEmail: string, requesterPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingRequestEventTypeChoices, cleaningRequested: boolean, comment: string, guestList: string, status: JanhusJanHusBookingRequestStatusChoices, adminComment: string, createdAt: string, updatedAt: string, requesterUser: { id: string, firstName: string, lastName: string } | null, ownerOrganization: { id: string, name: string } | null, convertedBooking: { id: string, status: JanhusJanHusBookingStatusChoices } | null } | null } | null };

export type ReviewJanhusBookingRequestMutationVariables = Exact<{
  reviewData: ReviewJanHusBookingRequestInput;
}>;


export type ReviewJanhusBookingRequestMutation = { reviewJanhusBookingRequest: { ok: boolean | null, bookingRequest: { id: string, startsAt: string, endsAt: string, area: JanhusJanHusBookingRequestAreaChoices, requesterName: string, requesterEmail: string, requesterPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingRequestEventTypeChoices, cleaningRequested: boolean, comment: string, guestList: string, status: JanhusJanHusBookingRequestStatusChoices, adminComment: string, createdAt: string, updatedAt: string, requesterUser: { id: string, firstName: string, lastName: string } | null, ownerOrganization: { id: string, name: string } | null, convertedBooking: { id: string, status: JanhusJanHusBookingStatusChoices } | null } | null, booking: { id: string, startsAt: string, endsAt: string, area: JanhusJanHusBookingAreaChoices, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount: number | null, comment: string, adminComment: string, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, totalPrice: number | null, durationMinutes: number | null, createdAt: string, updatedAt: string, ownerUser: { id: string, firstName: string, lastName: string } | null, ownerOrganization: { id: string, name: string } | null, bookingLevel: { id: string, name: string, priority: number } | null, guestListEntries: Array<{ feideUserid: string, displayName: string }> | null, vippsProduct: { id: string, name: string, price: number } | null, vippsOrder: { id: string, paymentStatus: PaymentStatus } | null } | null } | null };

export type UpdateJanhusBookingSettingsMutationVariables = Exact<{
  settingsData: JanHusBookingSettingsInput;
}>;


export type UpdateJanhusBookingSettingsMutation = { updateJanhusBookingSettings: { ok: boolean | null, bookingSettings: { id: string, minDurationMinutes: number, slotGranularityMinutes: number, openingHour: number, closingHour: number, bufferMinutes: number, organizationBookingOpensWeeksBefore: number, generalBookingOpensWeeksBefore: number, fallStartDate: string, fallEndDate: string, springStartDate: string, springEndDate: string, fallSemesterActive: boolean, springSemesterActive: boolean, externalBookingsEnabled: boolean } | null } | null };

export type UpdateJanhusAreaConfigurationMutationVariables = Exact<{
  areaData: JanHusAreaConfigurationInput;
}>;


export type UpdateJanhusAreaConfigurationMutation = { updateJanhusAreaConfiguration: { ok: boolean | null, areaConfiguration: { id: string, area: JanhusJanHusAreaConfigurationAreaChoices, internalPricePerHour: number, externalPricePerHour: number, cleaningFee: number, defaultDepositAmount: number } | null } | null };

export type CreateJanhusPaymentProductMutationVariables = Exact<{
  bookingId: string | number;
  organizationId?: string | number | null | undefined;
}>;


export type CreateJanhusPaymentProductMutation = { createJanhusPaymentProduct: { ok: boolean | null, productId: string | null, booking: { id: string, startsAt: string, endsAt: string, area: JanhusJanHusBookingAreaChoices, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount: number | null, comment: string, adminComment: string, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, totalPrice: number | null, durationMinutes: number | null, createdAt: string, updatedAt: string, ownerUser: { id: string, firstName: string, lastName: string } | null, ownerOrganization: { id: string, name: string } | null, bookingLevel: { id: string, name: string, priority: number } | null, guestListEntries: Array<{ feideUserid: string, displayName: string }> | null, vippsProduct: { id: string, name: string, price: number } | null, vippsOrder: { id: string, paymentStatus: PaymentStatus } | null } | null } | null };

export type DeleteJanhusBookingMutationVariables = Exact<{
  bookingId: string | number;
}>;


export type DeleteJanhusBookingMutation = { deleteJanhusBooking: { ok: boolean | null } | null };

export type DeleteJanhusBookingRequestMutationVariables = Exact<{
  requestId: string | number;
}>;


export type DeleteJanhusBookingRequestMutation = { deleteJanhusBookingRequest: { ok: boolean | null } | null };

export type JanHusBookingsQueryVariables = Exact<{
  startsAt?: string | null | undefined;
  endsAt?: string | null | undefined;
  area?: string | null | undefined;
}>;


export type JanHusBookingsQuery = { janhusBookings: Array<{ id: string, startsAt: string, endsAt: string, area: JanhusJanHusBookingAreaChoices, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount: number | null, comment: string, adminComment: string, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, totalPrice: number | null, durationMinutes: number | null, createdAt: string, updatedAt: string, ownerUser: { id: string, firstName: string, lastName: string } | null, ownerOrganization: { id: string, name: string } | null, bookingLevel: { id: string, name: string, priority: number } | null, guestListEntries: Array<{ feideUserid: string, displayName: string }> | null, vippsProduct: { id: string, name: string, price: number } | null, vippsOrder: { id: string, paymentStatus: PaymentStatus } | null }> | null };

export type JanHusMyBookingsQueryVariables = Exact<{ [key: string]: never; }>;


export type JanHusMyBookingsQuery = { janhusMyBookings: Array<{ id: string, startsAt: string, endsAt: string, area: JanhusJanHusBookingAreaChoices, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount: number | null, comment: string, adminComment: string, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, totalPrice: number | null, durationMinutes: number | null, createdAt: string, updatedAt: string, ownerUser: { id: string, firstName: string, lastName: string } | null, ownerOrganization: { id: string, name: string } | null, bookingLevel: { id: string, name: string, priority: number } | null, guestListEntries: Array<{ feideUserid: string, displayName: string }> | null, vippsProduct: { id: string, name: string, price: number } | null, vippsOrder: { id: string, paymentStatus: PaymentStatus } | null }> | null };

export type JanHusGuestSearchQueryVariables = Exact<{
  bookingId: string | number;
  query: string;
  limit?: number | null | undefined;
}>;


export type JanHusGuestSearchQuery = { janhusGuestSearch: Array<{ feideUserid: string, displayName: string }> | null };

export type JanHusGuestSearchForRequestQueryVariables = Exact<{
  query: string;
  limit?: number | null | undefined;
}>;


export type JanHusGuestSearchForRequestQuery = { janhusGuestSearchForRequest: Array<{ feideUserid: string, displayName: string }> | null };

export type AdminJanHusBookingsQueryVariables = Exact<{
  status?: string | null | undefined;
}>;


export type AdminJanHusBookingsQuery = { adminJanhusBookings: Array<{ id: string, startsAt: string, endsAt: string, area: JanhusJanHusBookingAreaChoices, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount: number | null, comment: string, adminComment: string, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, totalPrice: number | null, durationMinutes: number | null, createdAt: string, updatedAt: string, ownerUser: { id: string, firstName: string, lastName: string } | null, ownerOrganization: { id: string, name: string } | null, bookingLevel: { id: string, name: string, priority: number } | null, guestListEntries: Array<{ feideUserid: string, displayName: string }> | null, vippsProduct: { id: string, name: string, price: number } | null, vippsOrder: { id: string, paymentStatus: PaymentStatus } | null }> | null };

export type JanHusBookingSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type JanHusBookingSettingsQuery = { janhusBookingSettings: { id: string, minDurationMinutes: number, slotGranularityMinutes: number, openingHour: number, closingHour: number, bufferMinutes: number, organizationBookingOpensWeeksBefore: number, generalBookingOpensWeeksBefore: number, fallStartDate: string, fallEndDate: string, springStartDate: string, springEndDate: string, fallSemesterActive: boolean, springSemesterActive: boolean, externalBookingsEnabled: boolean } | null };

export type JanHusAreaConfigurationsQueryVariables = Exact<{ [key: string]: never; }>;


export type JanHusAreaConfigurationsQuery = { janhusAreaConfigurations: Array<{ id: string, area: JanhusJanHusAreaConfigurationAreaChoices, internalPricePerHour: number, externalPricePerHour: number, cleaningFee: number, defaultDepositAmount: number }> | null };

export type JanHusBookingLevelsQueryVariables = Exact<{ [key: string]: never; }>;


export type JanHusBookingLevelsQuery = { janhusBookingLevels: Array<{ id: string, name: string, description: string, priority: number, canBookAnytime: boolean, canCreateProvisional: boolean, canCreateConfirmed: boolean, canOverrideLowerLevels: boolean, canEditOwnBookingsOnly: boolean, canEditAllBookings: boolean, bookingOpensWeeksBefore: number | null }> | null };

export type JanHusMyBookingLevelQueryVariables = Exact<{ [key: string]: never; }>;


export type JanHusMyBookingLevelQuery = { janhusMyBookingLevel: { id: string, name: string, description: string, priority: number, canBookAnytime: boolean, canCreateProvisional: boolean, canCreateConfirmed: boolean, canOverrideLowerLevels: boolean, canEditOwnBookingsOnly: boolean, canEditAllBookings: boolean, bookingOpensWeeksBefore: number | null } | null };

export type JanHusBookingRequestsQueryVariables = Exact<{
  status?: string | null | undefined;
}>;


export type JanHusBookingRequestsQuery = { janhusBookingRequests: Array<{ id: string, startsAt: string, endsAt: string, area: JanhusJanHusBookingRequestAreaChoices, requesterName: string, requesterEmail: string, requesterPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingRequestEventTypeChoices, cleaningRequested: boolean, comment: string, guestList: string, status: JanhusJanHusBookingRequestStatusChoices, adminComment: string, createdAt: string, updatedAt: string, requesterUser: { id: string, firstName: string, lastName: string } | null, ownerOrganization: { id: string, name: string } | null, convertedBooking: { id: string, status: JanhusJanHusBookingStatusChoices } | null }> | null };

export type ListingFragment = { id: string, title: string, slug: string, description: string, startDatetime: string, deadline: string, endDatetime: string, applicationUrl: string | null, chips: Array<string>, readMoreUrl: string | null, heroImageUrl: string | null, organization: { id: string, name: string, slug: string, logoUrl: string | null, color: string | null, description: string } };

export type ListingOrganizationFragment = { id: string, name: string, slug: string, logoUrl: string | null, color: string | null, description: string };

export type ListingWithFormIdFragment = { id: string, title: string, slug: string, description: string, startDatetime: string, deadline: string, endDatetime: string, applicationUrl: string | null, chips: Array<string>, readMoreUrl: string | null, heroImageUrl: string | null, form: { id: string } | null, organization: { id: string, name: string, slug: string, logoUrl: string | null, color: string | null, description: string } };

export type ListingWithFormFragment = { id: string, title: string, slug: string, description: string, startDatetime: string, deadline: string, endDatetime: string, applicationUrl: string | null, chips: Array<string>, readMoreUrl: string | null, heroImageUrl: string | null, form: { id: string, name: string, questions: Array<{ id: string, question: string, description: string, questionType: QuestionTypeEnum | null, mandatory: boolean, options: Array<{ id: string, answer: string }> | null }> } | null, organization: { id: string, name: string, slug: string, logoUrl: string | null, color: string | null, description: string } };

export type ListingWithResponsesFragment = { id: string, title: string, slug: string, description: string, startDatetime: string, deadline: string, endDatetime: string, applicationUrl: string | null, chips: Array<string>, readMoreUrl: string | null, heroImageUrl: string | null, form: { id: string, name: string, questions: Array<{ id: string, question: string, description: string, questionType: QuestionTypeEnum | null, mandatory: boolean, answers: Array<{ id: string | null }> | null, options: Array<{ id: string, answer: string }> | null }>, responses: Array<{ id: string | null, respondent: { id: string, firstName: string, lastName: string }, answers: Array<{ id: string | null, answer: string, question: { id: string } }> }> | null } | null, organization: { id: string, name: string, slug: string, logoUrl: string | null, color: string | null, description: string } };

export type CreateListingMutationVariables = Exact<{
  input: CreateListingInput;
}>;


export type CreateListingMutation = { createListing: { ok: boolean | null, listing: { id: string, slug: string } | null } | null };

export type UpdateListingMutationVariables = Exact<{
  id: string | number;
  input?: BaseListingInput | null | undefined;
}>;


export type UpdateListingMutation = { updateListing: { ok: boolean | null, listing: { id: string, slug: string } | null } | null };

export type DeleteListingMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteListingMutation = { deleteListing: { listingId: string | null, ok: boolean | null } | null };

export type ListingQueryVariables = Exact<{
  id: string | number;
}>;


export type ListingQuery = { listing: { id: string, title: string, slug: string, description: string, startDatetime: string, deadline: string, endDatetime: string, applicationUrl: string | null, chips: Array<string>, readMoreUrl: string | null, heroImageUrl: string | null, form: { id: string } | null, organization: { id: string, name: string, slug: string, logoUrl: string | null, color: string | null, description: string } } | null };

export type ListingsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListingsQuery = { listings: Array<{ id: string, title: string, slug: string, description: string, startDatetime: string, deadline: string, endDatetime: string, applicationUrl: string | null, chips: Array<string>, readMoreUrl: string | null, heroImageUrl: string | null, organization: { id: string, name: string, slug: string, logoUrl: string | null, color: string | null, description: string } }> | null };

export type ListingWithFormQueryVariables = Exact<{
  id: string | number;
}>;


export type ListingWithFormQuery = { listing: { id: string, title: string, slug: string, description: string, startDatetime: string, deadline: string, endDatetime: string, applicationUrl: string | null, chips: Array<string>, readMoreUrl: string | null, heroImageUrl: string | null, form: { id: string, name: string, questions: Array<{ id: string, question: string, description: string, questionType: QuestionTypeEnum | null, mandatory: boolean, options: Array<{ id: string, answer: string }> | null }> } | null, organization: { id: string, name: string, slug: string, logoUrl: string | null, color: string | null, description: string } } | null };

export type ListingWithResponsesQueryVariables = Exact<{
  id: string | number;
}>;


export type ListingWithResponsesQuery = { listing: { id: string, title: string, slug: string, description: string, startDatetime: string, deadline: string, endDatetime: string, applicationUrl: string | null, chips: Array<string>, readMoreUrl: string | null, heroImageUrl: string | null, form: { id: string, name: string, questions: Array<{ id: string, question: string, description: string, questionType: QuestionTypeEnum | null, mandatory: boolean, answers: Array<{ id: string | null }> | null, options: Array<{ id: string, answer: string }> | null }>, responses: Array<{ id: string | null, respondent: { id: string, firstName: string, lastName: string }, answers: Array<{ id: string | null, answer: string, question: { id: string } }> }> | null } | null, organization: { id: string, name: string, slug: string, logoUrl: string | null, color: string | null, description: string } } | null };

export type NfcUserLiteFragment = { id: string, username: string, firstName: string, lastName: string };

export type NfcCardLiteFragment = { id: string, uidHex: string, label: string, isEnabled: boolean };

export type NfcCardAssignmentFragment = { id: string, externalHolderName: string, assignedAt: string, accessStart: string | null, accessEnd: string | null, permanentAccess: boolean, revokedAt: string | null, revocationReason: string, hasAccessNow: boolean | null, metadata: unknown, card: { id: string, uidHex: string, label: string, isEnabled: boolean }, user: { id: string, username: string, firstName: string, lastName: string } | null, assignedBy: { id: string, username: string, firstName: string, lastName: string } | null, revokedBy: { id: string, username: string, firstName: string, lastName: string } | null };

export type NfcCardFragment = { id: string, uidHex: string, label: string, notes: string, isEnabled: boolean, createdAt: string, updatedAt: string, activeAssignment: { id: string, externalHolderName: string, assignedAt: string, accessStart: string | null, accessEnd: string | null, permanentAccess: boolean, revokedAt: string | null, revocationReason: string, hasAccessNow: boolean | null, metadata: unknown, card: { id: string, uidHex: string, label: string, isEnabled: boolean }, user: { id: string, username: string, firstName: string, lastName: string } | null, assignedBy: { id: string, username: string, firstName: string, lastName: string } | null, revokedBy: { id: string, username: string, firstName: string, lastName: string } | null } | null };

export type NfcAccessGrantFragment = { id: string, scope: NfcNfcAccessGrantScopeChoices, participantPolicy: NfcNfcAccessGrantParticipantPolicyChoices, accessStart: string | null, accessEnd: string | null, permanentAccess: boolean, revokedAt: string | null, notes: string, hasAccessNow: boolean | null, createdAt: string, updatedAt: string, booking: { id: string, checkIn: string, checkOut: string } | null, grantedToUser: { id: string, username: string, firstName: string, lastName: string } | null, grantedToCard: { id: string, uidHex: string, label: string, isEnabled: boolean } | null, grantedBy: { id: string, username: string, firstName: string, lastName: string } | null, revokedBy: { id: string, username: string, firstName: string, lastName: string } | null };

export type NfcAccessEventFragment = { id: string, eventType: NfcNfcAccessEventEventTypeChoices, source: NfcNfcAccessEventSourceChoices, doorIdentifier: string, uidHexReported: string, occurredAt: string, notes: string, rawPayload: unknown, card: { id: string, uidHex: string, label: string, isEnabled: boolean } | null, cardAssignment: { id: string, externalHolderName: string, permanentAccess: boolean, accessStart: string | null, accessEnd: string | null, revokedAt: string | null } | null, resolvedUser: { id: string, username: string, firstName: string, lastName: string } | null };

export type UpsertNfcCardMutationVariables = Exact<{
  cardData: NfcCardInput;
}>;


export type UpsertNfcCardMutation = { upsertNfcCard: { ok: boolean, card: { id: string, uidHex: string, label: string, notes: string, isEnabled: boolean, createdAt: string, updatedAt: string, activeAssignment: { id: string, externalHolderName: string, assignedAt: string, accessStart: string | null, accessEnd: string | null, permanentAccess: boolean, revokedAt: string | null, revocationReason: string, hasAccessNow: boolean | null, metadata: unknown, card: { id: string, uidHex: string, label: string, isEnabled: boolean }, user: { id: string, username: string, firstName: string, lastName: string } | null, assignedBy: { id: string, username: string, firstName: string, lastName: string } | null, revokedBy: { id: string, username: string, firstName: string, lastName: string } | null } | null } | null } | null };

export type AssignNfcCardMutationVariables = Exact<{
  assignmentData: AssignNfcCardInput;
}>;


export type AssignNfcCardMutation = { assignNfcCard: { ok: boolean, assignment: { id: string, externalHolderName: string, assignedAt: string, accessStart: string | null, accessEnd: string | null, permanentAccess: boolean, revokedAt: string | null, revocationReason: string, hasAccessNow: boolean | null, metadata: unknown, card: { id: string, uidHex: string, label: string, isEnabled: boolean }, user: { id: string, username: string, firstName: string, lastName: string } | null, assignedBy: { id: string, username: string, firstName: string, lastName: string } | null, revokedBy: { id: string, username: string, firstName: string, lastName: string } | null } | null } | null };

export type RevokeNfcAssignmentMutationVariables = Exact<{
  revokeData: RevokeNfcAssignmentInput;
}>;


export type RevokeNfcAssignmentMutation = { revokeNfcAssignment: { ok: boolean, assignment: { id: string, externalHolderName: string, assignedAt: string, accessStart: string | null, accessEnd: string | null, permanentAccess: boolean, revokedAt: string | null, revocationReason: string, hasAccessNow: boolean | null, metadata: unknown, card: { id: string, uidHex: string, label: string, isEnabled: boolean }, user: { id: string, username: string, firstName: string, lastName: string } | null, assignedBy: { id: string, username: string, firstName: string, lastName: string } | null, revokedBy: { id: string, username: string, firstName: string, lastName: string } | null } | null } | null };

export type CreateNfcAccessGrantMutationVariables = Exact<{
  grantData: CreateNfcAccessGrantInput;
}>;


export type CreateNfcAccessGrantMutation = { createNfcAccessGrant: { ok: boolean, accessGrant: { id: string, scope: NfcNfcAccessGrantScopeChoices, participantPolicy: NfcNfcAccessGrantParticipantPolicyChoices, accessStart: string | null, accessEnd: string | null, permanentAccess: boolean, revokedAt: string | null, notes: string, hasAccessNow: boolean | null, createdAt: string, updatedAt: string, booking: { id: string, checkIn: string, checkOut: string } | null, grantedToUser: { id: string, username: string, firstName: string, lastName: string } | null, grantedToCard: { id: string, uidHex: string, label: string, isEnabled: boolean } | null, grantedBy: { id: string, username: string, firstName: string, lastName: string } | null, revokedBy: { id: string, username: string, firstName: string, lastName: string } | null } | null } | null };

export type RevokeNfcAccessGrantMutationVariables = Exact<{
  revokeData: RevokeNfcAccessGrantInput;
}>;


export type RevokeNfcAccessGrantMutation = { revokeNfcAccessGrant: { ok: boolean, accessGrant: { id: string, scope: NfcNfcAccessGrantScopeChoices, participantPolicy: NfcNfcAccessGrantParticipantPolicyChoices, accessStart: string | null, accessEnd: string | null, permanentAccess: boolean, revokedAt: string | null, notes: string, hasAccessNow: boolean | null, createdAt: string, updatedAt: string, booking: { id: string, checkIn: string, checkOut: string } | null, grantedToUser: { id: string, username: string, firstName: string, lastName: string } | null, grantedToCard: { id: string, uidHex: string, label: string, isEnabled: boolean } | null, grantedBy: { id: string, username: string, firstName: string, lastName: string } | null, revokedBy: { id: string, username: string, firstName: string, lastName: string } | null } | null } | null };

export type LogNfcAccessEventMutationVariables = Exact<{
  eventData: LogNfcAccessEventInput;
}>;


export type LogNfcAccessEventMutation = { logNfcAccessEvent: { ok: boolean, event: { id: string, eventType: NfcNfcAccessEventEventTypeChoices, source: NfcNfcAccessEventSourceChoices, doorIdentifier: string, uidHexReported: string, occurredAt: string, notes: string, rawPayload: unknown, card: { id: string, uidHex: string, label: string, isEnabled: boolean } | null, cardAssignment: { id: string, externalHolderName: string, permanentAccess: boolean, accessStart: string | null, accessEnd: string | null, revokedAt: string | null } | null, resolvedUser: { id: string, username: string, firstName: string, lastName: string } | null } | null } | null };

export type NfcCardsQueryVariables = Exact<{ [key: string]: never; }>;


export type NfcCardsQuery = { nfcCards: Array<{ id: string, uidHex: string, label: string, notes: string, isEnabled: boolean, createdAt: string, updatedAt: string, activeAssignment: { id: string, externalHolderName: string, assignedAt: string, accessStart: string | null, accessEnd: string | null, permanentAccess: boolean, revokedAt: string | null, revocationReason: string, hasAccessNow: boolean | null, metadata: unknown, card: { id: string, uidHex: string, label: string, isEnabled: boolean }, user: { id: string, username: string, firstName: string, lastName: string } | null, assignedBy: { id: string, username: string, firstName: string, lastName: string } | null, revokedBy: { id: string, username: string, firstName: string, lastName: string } | null } | null }> | null };

export type NfcCardQueryVariables = Exact<{
  uidHex: string;
}>;


export type NfcCardQuery = { nfcCard: { id: string, uidHex: string, label: string, notes: string, isEnabled: boolean, createdAt: string, updatedAt: string, activeAssignment: { id: string, externalHolderName: string, assignedAt: string, accessStart: string | null, accessEnd: string | null, permanentAccess: boolean, revokedAt: string | null, revocationReason: string, hasAccessNow: boolean | null, metadata: unknown, card: { id: string, uidHex: string, label: string, isEnabled: boolean }, user: { id: string, username: string, firstName: string, lastName: string } | null, assignedBy: { id: string, username: string, firstName: string, lastName: string } | null, revokedBy: { id: string, username: string, firstName: string, lastName: string } | null } | null } | null };

export type NfcCardAssignmentsQueryVariables = Exact<{
  activeOnly?: boolean | null | undefined;
}>;


export type NfcCardAssignmentsQuery = { nfcCardAssignments: Array<{ id: string, externalHolderName: string, assignedAt: string, accessStart: string | null, accessEnd: string | null, permanentAccess: boolean, revokedAt: string | null, revocationReason: string, hasAccessNow: boolean | null, metadata: unknown, card: { id: string, uidHex: string, label: string, isEnabled: boolean }, user: { id: string, username: string, firstName: string, lastName: string } | null, assignedBy: { id: string, username: string, firstName: string, lastName: string } | null, revokedBy: { id: string, username: string, firstName: string, lastName: string } | null }> | null };

export type MyNfcCardAssignmentQueryVariables = Exact<{ [key: string]: never; }>;


export type MyNfcCardAssignmentQuery = { myNfcCardAssignment: { id: string, externalHolderName: string, assignedAt: string, accessStart: string | null, accessEnd: string | null, permanentAccess: boolean, revokedAt: string | null, revocationReason: string, hasAccessNow: boolean | null, metadata: unknown, card: { id: string, uidHex: string, label: string, isEnabled: boolean }, user: { id: string, username: string, firstName: string, lastName: string } | null, assignedBy: { id: string, username: string, firstName: string, lastName: string } | null, revokedBy: { id: string, username: string, firstName: string, lastName: string } | null } | null };

export type NfcAccessGrantsQueryVariables = Exact<{
  activeOnly?: boolean | null | undefined;
}>;


export type NfcAccessGrantsQuery = { nfcAccessGrants: Array<{ id: string, scope: NfcNfcAccessGrantScopeChoices, participantPolicy: NfcNfcAccessGrantParticipantPolicyChoices, accessStart: string | null, accessEnd: string | null, permanentAccess: boolean, revokedAt: string | null, notes: string, hasAccessNow: boolean | null, createdAt: string, updatedAt: string, booking: { id: string, checkIn: string, checkOut: string } | null, grantedToUser: { id: string, username: string, firstName: string, lastName: string } | null, grantedToCard: { id: string, uidHex: string, label: string, isEnabled: boolean } | null, grantedBy: { id: string, username: string, firstName: string, lastName: string } | null, revokedBy: { id: string, username: string, firstName: string, lastName: string } | null }> | null };

export type NfcAccessEventsQueryVariables = Exact<{
  limit?: number | null | undefined;
  doorIdentifier?: string | null | undefined;
}>;


export type NfcAccessEventsQuery = { nfcAccessEvents: Array<{ id: string, eventType: NfcNfcAccessEventEventTypeChoices, source: NfcNfcAccessEventSourceChoices, doorIdentifier: string, uidHexReported: string, occurredAt: string, notes: string, rawPayload: unknown, card: { id: string, uidHex: string, label: string, isEnabled: boolean } | null, cardAssignment: { id: string, externalHolderName: string, permanentAccess: boolean, accessStart: string | null, accessEnd: string | null, revokedAt: string | null } | null, resolvedUser: { id: string, username: string, firstName: string, lastName: string } | null }> | null };

export type AdminOrganizationFragment = { id: string, name: string, hrGroup: { id: string, uuid: string } | null, primaryGroup: { id: string, uuid: string } | null, events: Array<{ id: string, title: string, startTime: string, shortDescription: string | null, availableSlots: number | null, isFull: boolean | null, usersAttending: Array<{ id: string }> | null }>, listings: Array<{ id: string, title: string, deadline: string }> | null };

export type OrgAdminEventFragment = { id: string, title: string, startTime: string, shortDescription: string | null, availableSlots: number | null, isFull: boolean | null, usersAttending: Array<{ id: string }> | null };

export type OrgAdminListingFragment = { id: string, title: string, deadline: string };

export type MembershipFragment = { id: string, user: { id: string, username: string, firstName: string, lastName: string }, group: { id: string, name: string, uuid: string } | null };

export type MembershipWithOrganizationFragment = { id: string, organization: { id: string, name: string }, user: { id: string, username: string, firstName: string, lastName: string }, group: { id: string, name: string, uuid: string } | null };

export type UpsertMembershipMutationVariables = Exact<{
  membershipData: MembershipInput;
}>;


export type UpsertMembershipMutation = { upsertMembership: { ok: boolean | null, membership: { id: string, organization: { id: string, name: string }, user: { id: string, username: string, firstName: string, lastName: string }, group: { id: string, name: string, uuid: string } | null } | null } | null };

export type RemoveMembershipMutationVariables = Exact<{
  membershipId: string | number;
}>;


export type RemoveMembershipMutation = { removeMembership: { ok: boolean | null, removedMember: { id: string, username: string, firstName: string, lastName: string } | null } | null };

export type AdminOrganizationQueryVariables = Exact<{
  orgId: string | number;
}>;


export type AdminOrganizationQuery = { organization: { id: string, name: string, hrGroup: { id: string, uuid: string } | null, primaryGroup: { id: string, uuid: string } | null, events: Array<{ id: string, title: string, startTime: string, shortDescription: string | null, availableSlots: number | null, isFull: boolean | null, usersAttending: Array<{ id: string }> | null }>, listings: Array<{ id: string, title: string, deadline: string }> | null } | null };

export type MembershipsQueryVariables = Exact<{
  organizationId: string | number;
}>;


export type MembershipsQuery = { memberships: Array<{ id: string, user: { id: string, username: string, firstName: string, lastName: string }, group: { id: string, name: string, uuid: string } | null }> | null };

export type AllOrganizationsForAdminEditQueryVariables = Exact<{
  search?: string | null | undefined;
}>;


export type AllOrganizationsForAdminEditQuery = { allOrganizations: Array<{ id: string, name: string, slug: string, primaryGroup: { id: string, name: string, uuid: string } | null, hrGroup: { id: string, name: string, uuid: string } | null, permissionGroups: Array<{ id: string, uuid: string, name: string, groupType: string }> | null }> | null };

export type HasPermissionQueryVariables = Exact<{
  permission: string;
}>;


export type HasPermissionQuery = { hasPermission: boolean | null };

export type UserFragment = { id: string, feideEmail: string, email: string, username: string, firstName: string, lastName: string, dateJoined: string, graduationYear: number | null, gradeYear: number | null, allergies: string | null, phoneNumber: string, firstLogin: boolean };

export type UserWithEventsAndOrgsFragment = { id: string, feideEmail: string, email: string, username: string, firstName: string, lastName: string, dateJoined: string, graduationYear: number | null, gradeYear: number | null, allergies: string | null, phoneNumber: string, firstLogin: boolean, events: Array<{ id: string }> | null, organizations: Array<{ id: string, name: string }> };

export type UserToEditFragment = { id: string, username: string, firstName: string, lastName: string, phoneNumber: string, allergies: string | null, email: string, graduationYear: number | null, firstLogin: boolean, feideEmail: string, canUpdateYear: boolean | null, yearUpdatedAt: string | null, nfcUidHex: string | null, nfcPinCode: string | null, nfcPermanentAccess: boolean | null };

export type UserAdminEditFragment = { feideUserid: string, gradeYear: number | null, dateJoined: string, lastLogin: string | null, id: string, username: string, firstName: string, lastName: string, phoneNumber: string, allergies: string | null, email: string, graduationYear: number | null, firstLogin: boolean, feideEmail: string, canUpdateYear: boolean | null, yearUpdatedAt: string | null, nfcUidHex: string | null, nfcPinCode: string | null, nfcPermanentAccess: boolean | null };

export type UserNfcSearchFragment = { id: string, username: string, firstName: string, lastName: string, feideEmail: string, nfcUidHex: string | null, nfcPinCode: string | null, nfcPermanentAccess: boolean | null };

export type UserAdminSearchFragment = { email: string, phoneNumber: string, allergies: string | null, graduationYear: number | null, gradeYear: number | null, dateJoined: string, lastLogin: string | null, feideUserid: string, id: string, username: string, firstName: string, lastName: string, feideEmail: string, nfcUidHex: string | null, nfcPinCode: string | null, nfcPermanentAccess: boolean | null };

export type UserOrganizationFragment = { id: string, name: string, slug: string, logoUrl: string | null, color: string | null, description: string };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: { idToken: string | null } | null };

export type AuthUserMutationVariables = Exact<{
  code: string;
}>;


export type AuthUserMutation = { authUser: { user: { id: string, feideEmail: string, email: string, username: string, firstName: string, lastName: string, dateJoined: string, graduationYear: number | null, gradeYear: number | null, allergies: string | null, phoneNumber: string, firstLogin: boolean } } };

export type UpdateUserMutationVariables = Exact<{
  userData?: UserInput | null | undefined;
}>;


export type UpdateUserMutation = { updateUser: { user: { id: string, feideEmail: string, email: string, username: string, firstName: string, lastName: string, dateJoined: string, graduationYear: number | null, gradeYear: number | null, allergies: string | null, phoneNumber: string, firstLogin: boolean } | null } | null };

export type AdminUpdateUserMutationVariables = Exact<{
  userId: string | number;
  userData: AdminUserInput;
}>;


export type AdminUpdateUserMutation = { adminUpdateUser: { user: { feideUserid: string, gradeYear: number | null, dateJoined: string, lastLogin: string | null, id: string, username: string, firstName: string, lastName: string, phoneNumber: string, allergies: string | null, email: string, graduationYear: number | null, firstLogin: boolean, feideEmail: string, canUpdateYear: boolean | null, yearUpdatedAt: string | null, nfcUidHex: string | null, nfcPinCode: string | null, nfcPermanentAccess: boolean | null } | null } | null };

export type AdminUpdateUserNfcMutationVariables = Exact<{
  userId: string | number;
  nfcData: AdminUserNfcInput;
}>;


export type AdminUpdateUserNfcMutation = { adminUpdateUserNfc: { user: { feideUserid: string, gradeYear: number | null, dateJoined: string, lastLogin: string | null, id: string, username: string, firstName: string, lastName: string, phoneNumber: string, allergies: string | null, email: string, graduationYear: number | null, firstLogin: boolean, feideEmail: string, canUpdateYear: boolean | null, yearUpdatedAt: string | null, nfcUidHex: string | null, nfcPinCode: string | null, nfcPermanentAccess: boolean | null } | null } | null };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { user: { id: string, feideEmail: string, email: string, username: string, firstName: string, lastName: string, dateJoined: string, graduationYear: number | null, gradeYear: number | null, allergies: string | null, phoneNumber: string, firstLogin: boolean } | null };

export type UserWithEventsAndOrgsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserWithEventsAndOrgsQuery = { user: { id: string, feideEmail: string, email: string, username: string, firstName: string, lastName: string, dateJoined: string, graduationYear: number | null, gradeYear: number | null, allergies: string | null, phoneNumber: string, firstLogin: boolean, events: Array<{ id: string }> | null, organizations: Array<{ id: string, name: string }> } | null };

export type UserToEditQueryVariables = Exact<{ [key: string]: never; }>;


export type UserToEditQuery = { user: { id: string, username: string, firstName: string, lastName: string, phoneNumber: string, allergies: string | null, email: string, graduationYear: number | null, firstLogin: boolean, feideEmail: string, canUpdateYear: boolean | null, yearUpdatedAt: string | null, nfcUidHex: string | null, nfcPinCode: string | null, nfcPermanentAccess: boolean | null } | null };

export type UserOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserOrganizationsQuery = { user: { id: string, isIndok: boolean, organizations: Array<{ id: string, name: string, slug: string, logoUrl: string | null, color: string | null, description: string }> } | null };

export type AdminEditCapabilitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminEditCapabilitiesQuery = { canManageUserProfiles: boolean, canManageUserNfc: boolean };

export type NfcUserSearchQueryVariables = Exact<{
  query: string;
  limit?: number | null | undefined;
}>;


export type NfcUserSearchQuery = { nfcUserSearch: Array<{ id: string, username: string, firstName: string, lastName: string, feideEmail: string, nfcUidHex: string | null, nfcPinCode: string | null, nfcPermanentAccess: boolean | null }> | null };

export type UserSearchQueryVariables = Exact<{
  query: string;
  limit?: number | null | undefined;
}>;


export type UserSearchQuery = { userSearch: Array<{ email: string, phoneNumber: string, allergies: string | null, graduationYear: number | null, gradeYear: number | null, dateJoined: string, lastLogin: string | null, feideUserid: string, id: string, username: string, firstName: string, lastName: string, feideEmail: string, nfcUidHex: string | null, nfcPinCode: string | null, nfcPermanentAccess: boolean | null }> | null };

export type ServerTimeQueryVariables = Exact<{ [key: string]: never; }>;


export type ServerTimeQuery = { serverTime: string | null };

export const DocumentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Document"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ArchiveDocumentType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"typeDoc"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"webLink"}}]}}]} as unknown as DocumentNode<DocumentFragment, unknown>;
export const CabinFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CabinType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"maxGuests"}},{"kind":"Field","name":{"kind":"Name","value":"internalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"externalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"internalPriceWeekend"}},{"kind":"Field","name":{"kind":"Name","value":"externalPriceWeekend"}}]}}]} as unknown as DocumentNode<CabinFragment, unknown>;
export const BookingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Booking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AllBookingsType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkIn"}},{"kind":"Field","name":{"kind":"Name","value":"checkOut"}},{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<BookingFragment, unknown>;
export const AdminBookingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkIn"}},{"kind":"Field","name":{"kind":"Name","value":"checkOut"}},{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"receiverEmail"}},{"kind":"Field","name":{"kind":"Name","value":"externalParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"internalParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"isTentative"}},{"kind":"Field","name":{"kind":"Name","value":"isDeclined"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"extraInfo"}},{"kind":"Field","name":{"kind":"Name","value":"declineReason"}}]}}]} as unknown as DocumentNode<AdminBookingFragment, unknown>;
export const BookingResponsibleFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingResponsible"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookingResponsibleType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]} as unknown as DocumentNode<BookingResponsibleFragment, unknown>;
export const BookingSemesterFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingSemester"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBookingSemesterType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fallStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"springStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"springEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"springSemesterActive"}}]}}]} as unknown as DocumentNode<BookingSemesterFragment, unknown>;
export const ProductFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}}]} as unknown as DocumentNode<ProductFragment, unknown>;
export const OrderFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredProduct"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Product"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}}]} as unknown as DocumentNode<OrderFragment, unknown>;
export const EventFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"allowedGradeYears"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"signupOpenDate"}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<EventFieldsFragment, unknown>;
export const EventDetailFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventDetailFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"allowedGradeYears"}},{"kind":"Field","name":{"kind":"Name","value":"hasExtraInformation"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"signupOpenDate"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"bindingSignup"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}},{"kind":"Field","name":{"kind":"Name","value":"positionOnWaitingList"}},{"kind":"Field","name":{"kind":"Name","value":"hasBoughtTicket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}}]}}]} as unknown as DocumentNode<EventDetailFieldsFragment, unknown>;
export const SignUpWithTicketFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignUpWithTicket"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userGradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"userAllergies"}},{"kind":"Field","name":{"kind":"Name","value":"userPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"extraInformation"}},{"kind":"Field","name":{"kind":"Name","value":"hasBoughtTicket"}}]}}]} as unknown as DocumentNode<SignUpWithTicketFragment, unknown>;
export const SignUpFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userGradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"userAllergies"}},{"kind":"Field","name":{"kind":"Name","value":"userPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"extraInformation"}}]}}]} as unknown as DocumentNode<SignUpFragment, unknown>;
export const AdminEventFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}}]}},{"kind":"Field","name":{"kind":"Name","value":"availableSlots"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"signupOpenDate"}},{"kind":"Field","name":{"kind":"Name","value":"usersAttending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignUpWithTicket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usersOnWaitingList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignUp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"hasExtraInformation"}},{"kind":"Field","name":{"kind":"Name","value":"bindingSignup"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"allowedGradeYears"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignUpWithTicket"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userGradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"userAllergies"}},{"kind":"Field","name":{"kind":"Name","value":"userPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"extraInformation"}},{"kind":"Field","name":{"kind":"Name","value":"hasBoughtTicket"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userGradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"userAllergies"}},{"kind":"Field","name":{"kind":"Name","value":"userPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"extraInformation"}}]}}]} as unknown as DocumentNode<AdminEventFragment, unknown>;
export const OptionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]} as unknown as DocumentNode<OptionFragment, unknown>;
export const QuestionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]} as unknown as DocumentNode<QuestionFragment, unknown>;
export const AnswerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]} as unknown as DocumentNode<AnswerFragment, unknown>;
export const QuestionWithAnswerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]} as unknown as DocumentNode<QuestionWithAnswerFragment, unknown>;
export const FormWithAnswersFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FormWithAnswers"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswer"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}}]}}]}}]} as unknown as DocumentNode<FormWithAnswersFragment, unknown>;
export const JanHusGuestListEntryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]} as unknown as DocumentNode<JanHusGuestListEntryFragment, unknown>;
export const JanHusBookingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookingLevel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"adminComment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]} as unknown as DocumentNode<JanHusBookingFragment, unknown>;
export const JanHusBookingRequestFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingRequest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingRequestType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"requesterUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterEmail"}},{"kind":"Field","name":{"kind":"Name","value":"requesterPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"adminComment"}},{"kind":"Field","name":{"kind":"Name","value":"convertedBooking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<JanHusBookingRequestFragment, unknown>;
export const JanHusBookingSettingsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingSettingsType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"minDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"slotGranularityMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"openingHour"}},{"kind":"Field","name":{"kind":"Name","value":"closingHour"}},{"kind":"Field","name":{"kind":"Name","value":"bufferMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"organizationBookingOpensWeeksBefore"}},{"kind":"Field","name":{"kind":"Name","value":"generalBookingOpensWeeksBefore"}},{"kind":"Field","name":{"kind":"Name","value":"fallStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"springStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"springEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"springSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"externalBookingsEnabled"}}]}}]} as unknown as DocumentNode<JanHusBookingSettingsFragment, unknown>;
export const JanHusAreaConfigurationFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusAreaConfiguration"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusAreaConfigurationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"internalPricePerHour"}},{"kind":"Field","name":{"kind":"Name","value":"externalPricePerHour"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningFee"}},{"kind":"Field","name":{"kind":"Name","value":"defaultDepositAmount"}}]}}]} as unknown as DocumentNode<JanHusAreaConfigurationFragment, unknown>;
export const JanHusBookingLevelFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingLevel"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingLevelType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"canBookAnytime"}},{"kind":"Field","name":{"kind":"Name","value":"canCreateProvisional"}},{"kind":"Field","name":{"kind":"Name","value":"canCreateConfirmed"}},{"kind":"Field","name":{"kind":"Name","value":"canOverrideLowerLevels"}},{"kind":"Field","name":{"kind":"Name","value":"canEditOwnBookingsOnly"}},{"kind":"Field","name":{"kind":"Name","value":"canEditAllBookings"}},{"kind":"Field","name":{"kind":"Name","value":"bookingOpensWeeksBefore"}}]}}]} as unknown as DocumentNode<JanHusBookingLevelFragment, unknown>;
export const ListingOrganizationFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<ListingOrganizationFragment, unknown>;
export const ListingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"endDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chips"}},{"kind":"Field","name":{"kind":"Name","value":"readMoreUrl"}},{"kind":"Field","name":{"kind":"Name","value":"heroImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingOrganization"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<ListingFragment, unknown>;
export const ListingWithFormIdFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingWithFormId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Listing"}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"endDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chips"}},{"kind":"Field","name":{"kind":"Name","value":"readMoreUrl"}},{"kind":"Field","name":{"kind":"Name","value":"heroImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingOrganization"}}]}}]}}]} as unknown as DocumentNode<ListingWithFormIdFragment, unknown>;
export const FormFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Form"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}}]} as unknown as DocumentNode<FormFragment, unknown>;
export const ListingWithFormFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingWithForm"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Listing"}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Form"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"endDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chips"}},{"kind":"Field","name":{"kind":"Name","value":"readMoreUrl"}},{"kind":"Field","name":{"kind":"Name","value":"heroImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingOrganization"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Form"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}}]}}]}}]} as unknown as DocumentNode<ListingWithFormFragment, unknown>;
export const QuestionWithAnswerIdsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}}]} as unknown as DocumentNode<QuestionWithAnswerIdsFragment, unknown>;
export const AnswerWithQuestionIdFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnswerWithQuestionId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]} as unknown as DocumentNode<AnswerWithQuestionIdFragment, unknown>;
export const ResponseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Response"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResponseType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"respondent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnswerWithQuestionId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnswerWithQuestionId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ResponseFragment, unknown>;
export const FormWithAllResponsesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FormWithAllResponses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswerIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Response"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnswerWithQuestionId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Response"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResponseType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"respondent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnswerWithQuestionId"}}]}}]}}]} as unknown as DocumentNode<FormWithAllResponsesFragment, unknown>;
export const ListingWithResponsesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingWithResponses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Listing"}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FormWithAllResponses"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnswerWithQuestionId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Response"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResponseType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"respondent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnswerWithQuestionId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"endDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chips"}},{"kind":"Field","name":{"kind":"Name","value":"readMoreUrl"}},{"kind":"Field","name":{"kind":"Name","value":"heroImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingOrganization"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FormWithAllResponses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswerIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Response"}}]}}]}}]} as unknown as DocumentNode<ListingWithResponsesFragment, unknown>;
export const NfcCardLiteFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}}]} as unknown as DocumentNode<NfcCardLiteFragment, unknown>;
export const NfcUserLiteFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcUserLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]} as unknown as DocumentNode<NfcUserLiteFragment, unknown>;
export const NfcCardAssignmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardAssignment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardAssignmentType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"assignedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accessStart"}},{"kind":"Field","name":{"kind":"Name","value":"accessEnd"}},{"kind":"Field","name":{"kind":"Name","value":"permanentAccess"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccessNow"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcUserLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]} as unknown as DocumentNode<NfcCardAssignmentFragment, unknown>;
export const NfcCardFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"activeAssignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardAssignment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcUserLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardAssignment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardAssignmentType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"assignedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accessStart"}},{"kind":"Field","name":{"kind":"Name","value":"accessEnd"}},{"kind":"Field","name":{"kind":"Name","value":"permanentAccess"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccessNow"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}}]}}]} as unknown as DocumentNode<NfcCardFragment, unknown>;
export const NfcAccessGrantFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcAccessGrant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcAccessGrantType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"participantPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"accessStart"}},{"kind":"Field","name":{"kind":"Name","value":"accessEnd"}},{"kind":"Field","name":{"kind":"Name","value":"permanentAccess"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccessNow"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkIn"}},{"kind":"Field","name":{"kind":"Name","value":"checkOut"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grantedToUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grantedToCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grantedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcUserLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}}]} as unknown as DocumentNode<NfcAccessGrantFragment, unknown>;
export const NfcAccessEventFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcAccessEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcAccessEventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"doorIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"uidHexReported"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"rawPayload"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cardAssignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"permanentAccess"}},{"kind":"Field","name":{"kind":"Name","value":"accessStart"}},{"kind":"Field","name":{"kind":"Name","value":"accessEnd"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolvedUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcUserLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]} as unknown as DocumentNode<NfcAccessEventFragment, unknown>;
export const OrgAdminEventFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgAdminEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"availableSlots"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"usersAttending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<OrgAdminEventFragment, unknown>;
export const OrgAdminListingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgAdminListing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}}]}}]} as unknown as DocumentNode<OrgAdminListingFragment, unknown>;
export const AdminOrganizationFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"hrGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrgAdminEvent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrgAdminListing"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgAdminEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"availableSlots"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"usersAttending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgAdminListing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}}]}}]} as unknown as DocumentNode<AdminOrganizationFragment, unknown>;
export const MembershipFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Membership"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MembershipType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<MembershipFragment, unknown>;
export const MembershipWithOrganizationFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MembershipWithOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MembershipType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Membership"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Membership"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MembershipType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<MembershipWithOrganizationFragment, unknown>;
export const UserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}}]}}]} as unknown as DocumentNode<UserFragment, unknown>;
export const UserWithEventsAndOrgsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserWithEventsAndOrgs"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}}]}}]} as unknown as DocumentNode<UserWithEventsAndOrgsFragment, unknown>;
export const UserToEditFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserToEdit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"yearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nfcUidHex"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPinCode"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}}]} as unknown as DocumentNode<UserToEditFragment, unknown>;
export const UserAdminEditFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAdminEdit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserToEdit"}},{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserToEdit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"yearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nfcUidHex"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPinCode"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}}]} as unknown as DocumentNode<UserAdminEditFragment, unknown>;
export const UserNfcSearchFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNfcSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"nfcUidHex"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPinCode"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}}]} as unknown as DocumentNode<UserNfcSearchFragment, unknown>;
export const UserAdminSearchFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAdminSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserNfcSearch"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNfcSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"nfcUidHex"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPinCode"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}}]} as unknown as DocumentNode<UserAdminSearchFragment, unknown>;
export const UserOrganizationFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<UserOrganizationFragment, unknown>;
export const ArchiveByTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"archiveByTypes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentTypes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"names"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveByTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"typeDoc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentTypes"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"names"},"value":{"kind":"Variable","name":{"kind":"Name","value":"names"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Document"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Document"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ArchiveDocumentType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"typeDoc"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"webLink"}}]}}]} as unknown as DocumentNode<ArchiveByTypesQuery, ArchiveByTypesQueryVariables>;
export const FeaturedArchiveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"featuredArchive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"featuredArchive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Document"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Document"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ArchiveDocumentType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"typeDoc"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"webLink"}}]}}]} as unknown as DocumentNode<FeaturedArchiveQuery, FeaturedArchiveQueryVariables>;
export const AvailableYearsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"availableYears"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableYears"}}]}}]} as unknown as DocumentNode<AvailableYearsQuery, AvailableYearsQueryVariables>;
export const DocumentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"documents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentTypes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"names"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveByTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"typeDoc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentTypes"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"names"},"value":{"kind":"Variable","name":{"kind":"Name","value":"names"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Document"}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredArchive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Document"}}]}},{"kind":"Field","name":{"kind":"Name","value":"availableYears"}},{"kind":"Field","name":{"kind":"Name","value":"hasPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"permission"},"value":{"kind":"StringValue","value":"archive.view_archivedocument","block":false}}]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Document"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ArchiveDocumentType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"typeDoc"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"webLink"}}]}}]} as unknown as DocumentNode<DocumentsQuery, DocumentsQueryVariables>;
export const CreateBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<CreateBookingMutation, CreateBookingMutationVariables>;
export const ConfirmBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"confirmBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingData"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isTentative"},"value":{"kind":"BooleanValue","value":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<ConfirmBookingMutation, ConfirmBookingMutationVariables>;
export const DeclineBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"declineBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"declineReason"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingData"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isTentative"},"value":{"kind":"BooleanValue","value":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"isDeclined"},"value":{"kind":"BooleanValue","value":true}},{"kind":"ObjectField","name":{"kind":"Name","value":"declineReason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"declineReason"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeclineBookingMutation, DeclineBookingMutationVariables>;
export const SendEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emailInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"emailInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emailInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<SendEmailMutation, SendEmailMutationVariables>;
export const UpdateCabinDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCabin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cabinData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCabinInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCabin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cabinData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cabinData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Cabin"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CabinType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"maxGuests"}},{"kind":"Field","name":{"kind":"Name","value":"internalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"externalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"internalPriceWeekend"}},{"kind":"Field","name":{"kind":"Name","value":"externalPriceWeekend"}}]}}]} as unknown as DocumentNode<UpdateCabinMutation, UpdateCabinMutationVariables>;
export const UpdateBookingSemesterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateBookingSemester"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"semesterData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBookingSemesterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBookingSemester"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"semesterData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"semesterData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingSemester"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingSemester"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingSemester"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBookingSemesterType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fallStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"springStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"springEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"springSemesterActive"}}]}}]} as unknown as DocumentNode<UpdateBookingSemesterMutation, UpdateBookingSemesterMutationVariables>;
export const CabinsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Cabin"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CabinType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"maxGuests"}},{"kind":"Field","name":{"kind":"Name","value":"internalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"externalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"internalPriceWeekend"}},{"kind":"Field","name":{"kind":"Name","value":"externalPriceWeekend"}}]}}]} as unknown as DocumentNode<CabinsQuery, CabinsQueryVariables>;
export const AllBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Booking"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Booking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AllBookingsType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkIn"}},{"kind":"Field","name":{"kind":"Name","value":"checkOut"}},{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AllBookingsQuery, AllBookingsQueryVariables>;
export const MyCabinBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myCabinBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myCabinBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminBooking"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkIn"}},{"kind":"Field","name":{"kind":"Name","value":"checkOut"}},{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"receiverEmail"}},{"kind":"Field","name":{"kind":"Name","value":"externalParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"internalParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"isTentative"}},{"kind":"Field","name":{"kind":"Name","value":"isDeclined"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"extraInfo"}},{"kind":"Field","name":{"kind":"Name","value":"declineReason"}}]}}]} as unknown as DocumentNode<MyCabinBookingsQuery, MyCabinBookingsQueryVariables>;
export const AdminAllBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminAllBookings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminAllBookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminBooking"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkIn"}},{"kind":"Field","name":{"kind":"Name","value":"checkOut"}},{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"receiverEmail"}},{"kind":"Field","name":{"kind":"Name","value":"externalParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"internalParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"isTentative"}},{"kind":"Field","name":{"kind":"Name","value":"isDeclined"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"extraInfo"}},{"kind":"Field","name":{"kind":"Name","value":"declineReason"}}]}}]} as unknown as DocumentNode<AdminAllBookingsQuery, AdminAllBookingsQueryVariables>;
export const ActiveBookingResponsibleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"activeBookingResponsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeBookingResponsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingResponsible"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingResponsible"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookingResponsibleType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]} as unknown as DocumentNode<ActiveBookingResponsibleQuery, ActiveBookingResponsibleQueryVariables>;
export const CabinsAndResponsiblesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"cabinsAndResponsibles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Cabin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activeBookingResponsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CabinType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"maxGuests"}},{"kind":"Field","name":{"kind":"Name","value":"internalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"externalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"internalPriceWeekend"}},{"kind":"Field","name":{"kind":"Name","value":"externalPriceWeekend"}}]}}]} as unknown as DocumentNode<CabinsAndResponsiblesQuery, CabinsAndResponsiblesQueryVariables>;
export const BookingSemesterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"bookingSemester"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingSemester"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingSemester"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingSemester"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBookingSemesterType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fallStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"springStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"springEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"springSemesterActive"}}]}}]} as unknown as DocumentNode<BookingSemesterQuery, BookingSemesterQueryVariables>;
export const InitiateOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"initiateOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"quantity"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fallbackRedirect"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initiateOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}},{"kind":"Argument","name":{"kind":"Name","value":"quantity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"quantity"}}},{"kind":"Argument","name":{"kind":"Name","value":"fallbackRedirect"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fallbackRedirect"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"redirect"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}}]}}]}}]} as unknown as DocumentNode<InitiateOrderMutation, InitiateOrderMutationVariables>;
export const AttemptCapturePaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"attemptCapturePayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attemptCapturePayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Order"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredProduct"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Product"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<AttemptCapturePaymentMutation, AttemptCapturePaymentMutationVariables>;
export const DeliveredProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deliveredProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deliveredProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Order"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredProduct"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Product"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<DeliveredProductMutation, DeliveredProductMutationVariables>;
export const ProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"product"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Product"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}}]} as unknown as DocumentNode<ProductQuery, ProductQueryVariables>;
export const ProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}}]}}]} as unknown as DocumentNode<ProductsQuery, ProductsQueryVariables>;
export const UserOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Order"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredProduct"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Product"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<UserOrdersQuery, UserOrdersQueryVariables>;
export const AllUserOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allUserOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allUserOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Order"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredProduct"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Product"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<AllUserOrdersQuery, AllUserOrdersQueryVariables>;
export const PaginatedShopOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"paginatedShopOrders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paginatedShopOrders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Order"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredProduct"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Product"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<PaginatedShopOrdersQuery, PaginatedShopOrdersQueryVariables>;
export const CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"allowedGradeYears"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"signupOpenDate"}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>;
export const UpdateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"eventData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventDetailFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventDetailFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"allowedGradeYears"}},{"kind":"Field","name":{"kind":"Name","value":"hasExtraInformation"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"signupOpenDate"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"bindingSignup"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}},{"kind":"Field","name":{"kind":"Name","value":"positionOnWaitingList"}},{"kind":"Field","name":{"kind":"Name","value":"hasBoughtTicket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}}]}}]} as unknown as DocumentNode<UpdateEventMutation, UpdateEventMutationVariables>;
export const EventSignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"eventSignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"extraInformation"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventSignUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"extraInformation"},"value":{"kind":"Variable","name":{"kind":"Name","value":"extraInformation"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}},{"kind":"Field","name":{"kind":"Name","value":"positionOnWaitingList"}}]}}]}}]}}]}}]} as unknown as DocumentNode<EventSignUpMutation, EventSignUpMutationVariables>;
export const EventSignOffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"eventSignOff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventSignOff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}},{"kind":"Field","name":{"kind":"Name","value":"positionOnWaitingList"}}]}}]}}]}}]}}]} as unknown as DocumentNode<EventSignOffMutation, EventSignOffMutationVariables>;
export const AdminEventSignOffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminEventSignOff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminEventSignOff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<AdminEventSignOffMutation, AdminEventSignOffMutationVariables>;
export const SendEventMailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendEventMails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"receiverEmails"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subject"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendEventMails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"receiverEmails"},"value":{"kind":"Variable","name":{"kind":"Name","value":"receiverEmails"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"Argument","name":{"kind":"Name","value":"subject"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subject"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<SendEventMailsMutation, SendEventMailsMutationVariables>;
export const EventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"events"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organization"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organization"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organization"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"Argument","name":{"kind":"Name","value":"startTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startTime"}}},{"kind":"Argument","name":{"kind":"Name","value":"endTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"defaultEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"permission"},"value":{"kind":"StringValue","value":"events.add_event","block":false}}]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"allowedGradeYears"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"signupOpenDate"}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<EventsQuery, EventsQueryVariables>;
export const EventDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"eventDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventDetailFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventDetailFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"allowedGradeYears"}},{"kind":"Field","name":{"kind":"Name","value":"hasExtraInformation"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"signupOpenDate"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"bindingSignup"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}},{"kind":"Field","name":{"kind":"Name","value":"positionOnWaitingList"}},{"kind":"Field","name":{"kind":"Name","value":"hasBoughtTicket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}}]}}]} as unknown as DocumentNode<EventDetailsQuery, EventDetailsQueryVariables>;
export const AllCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AllCategoriesQuery, AllCategoriesQueryVariables>;
export const EventFilteredOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"eventFilteredOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventFilteredOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<EventFilteredOrganizationsQuery, EventFilteredOrganizationsQueryVariables>;
export const AdminEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminEvent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignUpWithTicket"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userGradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"userAllergies"}},{"kind":"Field","name":{"kind":"Name","value":"userPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"extraInformation"}},{"kind":"Field","name":{"kind":"Name","value":"hasBoughtTicket"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userGradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"userAllergies"}},{"kind":"Field","name":{"kind":"Name","value":"userPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"extraInformation"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}}]}},{"kind":"Field","name":{"kind":"Name","value":"availableSlots"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"signupOpenDate"}},{"kind":"Field","name":{"kind":"Name","value":"usersAttending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignUpWithTicket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usersOnWaitingList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignUp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"hasExtraInformation"}},{"kind":"Field","name":{"kind":"Name","value":"bindingSignup"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"allowedGradeYears"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AdminEventQuery, AdminEventQueryVariables>;
export const EventSignUpsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"eventSignUps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"usersAttending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userEmail"}}]}}]}}]}}]} as unknown as DocumentNode<EventSignUpsQuery, EventSignUpsQueryVariables>;
export const AttendeeReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"attendeeReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filetype"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendeeReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}},{"kind":"Argument","name":{"kind":"Name","value":"filetype"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filetype"}}}]}]}}]} as unknown as DocumentNode<AttendeeReportQuery, AttendeeReportQueryVariables>;
export const AttendeeReportOrgDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"attendeeReportOrg"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filetype"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendeeReportOrg"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"Argument","name":{"kind":"Name","value":"fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}},{"kind":"Argument","name":{"kind":"Name","value":"filetype"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filetype"}}}]}]}}]} as unknown as DocumentNode<AttendeeReportOrgQuery, AttendeeReportOrgQueryVariables>;
export const AttendeeReportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"attendeeReports"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filetype"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendeeReports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}},{"kind":"Argument","name":{"kind":"Name","value":"filetype"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filetype"}}}]}]}}]} as unknown as DocumentNode<AttendeeReportsQuery, AttendeeReportsQueryVariables>;
export const EventUserOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"eventUserOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<EventUserOrganizationsQuery, EventUserOrganizationsQueryVariables>;
export const CreateFormDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createForm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFormInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listingId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createForm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"formData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formData"}}},{"kind":"Argument","name":{"kind":"Name","value":"listingId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listingId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FormWithAllResponses"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnswerWithQuestionId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Response"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResponseType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"respondent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnswerWithQuestionId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FormWithAllResponses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswerIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Response"}}]}}]}}]} as unknown as DocumentNode<CreateFormMutation, CreateFormMutationVariables>;
export const UpdateFormDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateForm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BaseFormInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateForm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"formData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FormWithAllResponses"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnswerWithQuestionId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Response"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResponseType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"respondent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnswerWithQuestionId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FormWithAllResponses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswerIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Response"}}]}}]}}]} as unknown as DocumentNode<UpdateFormMutation, UpdateFormMutationVariables>;
export const CreateQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"questionData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateQuestionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"formId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formId"}}},{"kind":"Argument","name":{"kind":"Name","value":"questionData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"questionData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswerIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateQuestionMutation, CreateQuestionMutationVariables>;
export const UpdateQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"questionData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BaseQuestionInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"optionData"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OptionInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUpdateAndDeleteOptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"questionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"optionData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"optionData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updateQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"questionData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"questionData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswerIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateQuestionMutation, UpdateQuestionMutationVariables>;
export const DeleteQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletedId"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeleteQuestionMutation, DeleteQuestionMutationVariables>;
export const SubmitAnswersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"submitAnswers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"answersData"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitAnswers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"formId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formId"}}},{"kind":"Argument","name":{"kind":"Name","value":"answersData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"answersData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<SubmitAnswersMutation, SubmitAnswersMutationVariables>;
export const FormWithAllResponsesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"formWithAllResponses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"form"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"formId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FormWithAllResponses"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnswerWithQuestionId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Response"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResponseType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"respondent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnswerWithQuestionId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FormWithAllResponses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswerIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Response"}}]}}]}}]} as unknown as DocumentNode<FormWithAllResponsesQuery, FormWithAllResponsesQueryVariables>;
export const FormWithAnswersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"formWithAnswers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"form"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"formId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FormWithAnswers"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FormWithAnswers"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswer"}}]}}]}}]} as unknown as DocumentNode<FormWithAnswersQuery, FormWithAnswersQueryVariables>;
export const CreateJanhusBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateJanhusBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createJanhusBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBooking"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookingLevel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"adminComment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateJanhusBookingMutation, CreateJanhusBookingMutationVariables>;
export const UpdateJanhusBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateJanhusBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateJanHusBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateJanhusBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBooking"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookingLevel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"adminComment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateJanhusBookingMutation, UpdateJanhusBookingMutationVariables>;
export const ReviewJanhusBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReviewJanhusBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reviewData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReviewJanHusBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviewJanhusBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"reviewData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reviewData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBooking"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookingLevel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"adminComment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ReviewJanhusBookingMutation, ReviewJanhusBookingMutationVariables>;
export const CreateJanhusBookingRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateJanhusBookingRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createJanhusBookingRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"requestData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"bookingRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBookingRequest"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingRequest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingRequestType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"requesterUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterEmail"}},{"kind":"Field","name":{"kind":"Name","value":"requesterPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"adminComment"}},{"kind":"Field","name":{"kind":"Name","value":"convertedBooking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateJanhusBookingRequestMutation, CreateJanhusBookingRequestMutationVariables>;
export const ReviewJanhusBookingRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReviewJanhusBookingRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reviewData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReviewJanHusBookingRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviewJanhusBookingRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"reviewData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reviewData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"bookingRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBookingRequest"}}]}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBooking"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingRequest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingRequestType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"requesterUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterEmail"}},{"kind":"Field","name":{"kind":"Name","value":"requesterPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"adminComment"}},{"kind":"Field","name":{"kind":"Name","value":"convertedBooking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookingLevel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"adminComment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ReviewJanhusBookingRequestMutation, ReviewJanhusBookingRequestMutationVariables>;
export const UpdateJanhusBookingSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateJanhusBookingSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"settingsData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingSettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateJanhusBookingSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"settingsData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"settingsData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"bookingSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBookingSettings"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingSettingsType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"minDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"slotGranularityMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"openingHour"}},{"kind":"Field","name":{"kind":"Name","value":"closingHour"}},{"kind":"Field","name":{"kind":"Name","value":"bufferMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"organizationBookingOpensWeeksBefore"}},{"kind":"Field","name":{"kind":"Name","value":"generalBookingOpensWeeksBefore"}},{"kind":"Field","name":{"kind":"Name","value":"fallStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"springStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"springEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"springSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"externalBookingsEnabled"}}]}}]} as unknown as DocumentNode<UpdateJanhusBookingSettingsMutation, UpdateJanhusBookingSettingsMutationVariables>;
export const UpdateJanhusAreaConfigurationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateJanhusAreaConfiguration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"areaData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusAreaConfigurationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateJanhusAreaConfiguration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"areaData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"areaData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"areaConfiguration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusAreaConfiguration"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusAreaConfiguration"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusAreaConfigurationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"internalPricePerHour"}},{"kind":"Field","name":{"kind":"Name","value":"externalPricePerHour"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningFee"}},{"kind":"Field","name":{"kind":"Name","value":"defaultDepositAmount"}}]}}]} as unknown as DocumentNode<UpdateJanhusAreaConfigurationMutation, UpdateJanhusAreaConfigurationMutationVariables>;
export const CreateJanhusPaymentProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateJanhusPaymentProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createJanhusPaymentProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingId"}}},{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBooking"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookingLevel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"adminComment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateJanhusPaymentProductMutation, CreateJanhusPaymentProductMutationVariables>;
export const DeleteJanhusBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteJanhusBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteJanhusBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeleteJanhusBookingMutation, DeleteJanhusBookingMutationVariables>;
export const DeleteJanhusBookingRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteJanhusBookingRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteJanhusBookingRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"requestId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeleteJanhusBookingRequestMutation, DeleteJanhusBookingRequestMutationVariables>;
export const JanHusBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusBookings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startsAt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endsAt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"area"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusBookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startsAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startsAt"}}},{"kind":"Argument","name":{"kind":"Name","value":"endsAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endsAt"}}},{"kind":"Argument","name":{"kind":"Name","value":"area"},"value":{"kind":"Variable","name":{"kind":"Name","value":"area"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBooking"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookingLevel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"adminComment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<JanHusBookingsQuery, JanHusBookingsQueryVariables>;
export const JanHusMyBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusMyBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusMyBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBooking"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookingLevel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"adminComment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<JanHusMyBookingsQuery, JanHusMyBookingsQueryVariables>;
export const JanHusGuestSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusGuestSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusGuestSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingId"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]} as unknown as DocumentNode<JanHusGuestSearchQuery, JanHusGuestSearchQueryVariables>;
export const JanHusGuestSearchForRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusGuestSearchForRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusGuestSearchForRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]} as unknown as DocumentNode<JanHusGuestSearchForRequestQuery, JanHusGuestSearchForRequestQueryVariables>;
export const AdminJanHusBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminJanHusBookings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminJanhusBookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBooking"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookingLevel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"adminComment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<AdminJanHusBookingsQuery, AdminJanHusBookingsQueryVariables>;
export const JanHusBookingSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusBookingSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusBookingSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBookingSettings"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingSettingsType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"minDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"slotGranularityMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"openingHour"}},{"kind":"Field","name":{"kind":"Name","value":"closingHour"}},{"kind":"Field","name":{"kind":"Name","value":"bufferMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"organizationBookingOpensWeeksBefore"}},{"kind":"Field","name":{"kind":"Name","value":"generalBookingOpensWeeksBefore"}},{"kind":"Field","name":{"kind":"Name","value":"fallStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"springStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"springEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"springSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"externalBookingsEnabled"}}]}}]} as unknown as DocumentNode<JanHusBookingSettingsQuery, JanHusBookingSettingsQueryVariables>;
export const JanHusAreaConfigurationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusAreaConfigurations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusAreaConfigurations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusAreaConfiguration"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusAreaConfiguration"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusAreaConfigurationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"internalPricePerHour"}},{"kind":"Field","name":{"kind":"Name","value":"externalPricePerHour"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningFee"}},{"kind":"Field","name":{"kind":"Name","value":"defaultDepositAmount"}}]}}]} as unknown as DocumentNode<JanHusAreaConfigurationsQuery, JanHusAreaConfigurationsQueryVariables>;
export const JanHusBookingLevelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusBookingLevels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusBookingLevels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBookingLevel"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingLevel"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingLevelType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"canBookAnytime"}},{"kind":"Field","name":{"kind":"Name","value":"canCreateProvisional"}},{"kind":"Field","name":{"kind":"Name","value":"canCreateConfirmed"}},{"kind":"Field","name":{"kind":"Name","value":"canOverrideLowerLevels"}},{"kind":"Field","name":{"kind":"Name","value":"canEditOwnBookingsOnly"}},{"kind":"Field","name":{"kind":"Name","value":"canEditAllBookings"}},{"kind":"Field","name":{"kind":"Name","value":"bookingOpensWeeksBefore"}}]}}]} as unknown as DocumentNode<JanHusBookingLevelsQuery, JanHusBookingLevelsQueryVariables>;
export const JanHusMyBookingLevelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusMyBookingLevel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusMyBookingLevel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBookingLevel"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingLevel"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingLevelType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"canBookAnytime"}},{"kind":"Field","name":{"kind":"Name","value":"canCreateProvisional"}},{"kind":"Field","name":{"kind":"Name","value":"canCreateConfirmed"}},{"kind":"Field","name":{"kind":"Name","value":"canOverrideLowerLevels"}},{"kind":"Field","name":{"kind":"Name","value":"canEditOwnBookingsOnly"}},{"kind":"Field","name":{"kind":"Name","value":"canEditAllBookings"}},{"kind":"Field","name":{"kind":"Name","value":"bookingOpensWeeksBefore"}}]}}]} as unknown as DocumentNode<JanHusMyBookingLevelQuery, JanHusMyBookingLevelQueryVariables>;
export const JanHusBookingRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusBookingRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusBookingRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBookingRequest"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingRequest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingRequestType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"requesterUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterEmail"}},{"kind":"Field","name":{"kind":"Name","value":"requesterPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"adminComment"}},{"kind":"Field","name":{"kind":"Name","value":"convertedBooking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<JanHusBookingRequestsQuery, JanHusBookingRequestsQueryVariables>;
export const CreateListingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createListing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateListingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createListing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"listingData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<CreateListingMutation, CreateListingMutationVariables>;
export const UpdateListingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateListing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BaseListingInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateListing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"listingData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<UpdateListingMutation, UpdateListingMutationVariables>;
export const DeleteListingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteListing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteListing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listingId"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeleteListingMutation, DeleteListingMutationVariables>;
export const ListingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingWithFormId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"endDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chips"}},{"kind":"Field","name":{"kind":"Name","value":"readMoreUrl"}},{"kind":"Field","name":{"kind":"Name","value":"heroImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingOrganization"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingWithFormId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Listing"}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ListingQuery, ListingQueryVariables>;
export const ListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Listing"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"endDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chips"}},{"kind":"Field","name":{"kind":"Name","value":"readMoreUrl"}},{"kind":"Field","name":{"kind":"Name","value":"heroImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingOrganization"}}]}}]}}]} as unknown as DocumentNode<ListingsQuery, ListingsQueryVariables>;
export const ListingWithFormDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listingWithForm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingWithForm"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"endDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chips"}},{"kind":"Field","name":{"kind":"Name","value":"readMoreUrl"}},{"kind":"Field","name":{"kind":"Name","value":"heroImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingOrganization"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Form"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingWithForm"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Listing"}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Form"}}]}}]}}]} as unknown as DocumentNode<ListingWithFormQuery, ListingWithFormQueryVariables>;
export const ListingWithResponsesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listingWithResponses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingWithResponses"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"endDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chips"}},{"kind":"Field","name":{"kind":"Name","value":"readMoreUrl"}},{"kind":"Field","name":{"kind":"Name","value":"heroImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingOrganization"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnswerWithQuestionId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Response"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResponseType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"respondent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnswerWithQuestionId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FormWithAllResponses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswerIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Response"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingWithResponses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Listing"}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FormWithAllResponses"}}]}}]}}]} as unknown as DocumentNode<ListingWithResponsesQuery, ListingWithResponsesQueryVariables>;
export const UpsertNfcCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"upsertNfcCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertNfcCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cardData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCard"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcUserLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardAssignment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardAssignmentType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"assignedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accessStart"}},{"kind":"Field","name":{"kind":"Name","value":"accessEnd"}},{"kind":"Field","name":{"kind":"Name","value":"permanentAccess"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccessNow"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"activeAssignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardAssignment"}}]}}]}}]} as unknown as DocumentNode<UpsertNfcCardMutation, UpsertNfcCardMutationVariables>;
export const AssignNfcCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"assignNfcCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignNfcCardInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignNfcCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"assignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardAssignment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcUserLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardAssignment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardAssignmentType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"assignedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accessStart"}},{"kind":"Field","name":{"kind":"Name","value":"accessEnd"}},{"kind":"Field","name":{"kind":"Name","value":"permanentAccess"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccessNow"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}}]}}]} as unknown as DocumentNode<AssignNfcCardMutation, AssignNfcCardMutationVariables>;
export const RevokeNfcAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"revokeNfcAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"revokeData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RevokeNfcAssignmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revokeNfcAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"revokeData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"revokeData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"assignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardAssignment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcUserLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardAssignment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardAssignmentType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"assignedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accessStart"}},{"kind":"Field","name":{"kind":"Name","value":"accessEnd"}},{"kind":"Field","name":{"kind":"Name","value":"permanentAccess"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccessNow"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}}]}}]} as unknown as DocumentNode<RevokeNfcAssignmentMutation, RevokeNfcAssignmentMutationVariables>;
export const CreateNfcAccessGrantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createNfcAccessGrant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"grantData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNfcAccessGrantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNfcAccessGrant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"grantData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"grantData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"accessGrant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcAccessGrant"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcUserLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcAccessGrant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcAccessGrantType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"participantPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"accessStart"}},{"kind":"Field","name":{"kind":"Name","value":"accessEnd"}},{"kind":"Field","name":{"kind":"Name","value":"permanentAccess"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccessNow"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkIn"}},{"kind":"Field","name":{"kind":"Name","value":"checkOut"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grantedToUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grantedToCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grantedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}}]}}]} as unknown as DocumentNode<CreateNfcAccessGrantMutation, CreateNfcAccessGrantMutationVariables>;
export const RevokeNfcAccessGrantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"revokeNfcAccessGrant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"revokeData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RevokeNfcAccessGrantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revokeNfcAccessGrant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"revokeData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"revokeData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"accessGrant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcAccessGrant"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcUserLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcAccessGrant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcAccessGrantType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"participantPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"accessStart"}},{"kind":"Field","name":{"kind":"Name","value":"accessEnd"}},{"kind":"Field","name":{"kind":"Name","value":"permanentAccess"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccessNow"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkIn"}},{"kind":"Field","name":{"kind":"Name","value":"checkOut"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grantedToUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grantedToCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grantedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}}]}}]} as unknown as DocumentNode<RevokeNfcAccessGrantMutation, RevokeNfcAccessGrantMutationVariables>;
export const LogNfcAccessEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logNfcAccessEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LogNfcAccessEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logNfcAccessEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcAccessEvent"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcUserLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcAccessEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcAccessEventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"doorIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"uidHexReported"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"rawPayload"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cardAssignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"permanentAccess"}},{"kind":"Field","name":{"kind":"Name","value":"accessStart"}},{"kind":"Field","name":{"kind":"Name","value":"accessEnd"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolvedUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}}]}}]} as unknown as DocumentNode<LogNfcAccessEventMutation, LogNfcAccessEventMutationVariables>;
export const NfcCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nfcCards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nfcCards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcUserLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardAssignment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardAssignmentType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"assignedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accessStart"}},{"kind":"Field","name":{"kind":"Name","value":"accessEnd"}},{"kind":"Field","name":{"kind":"Name","value":"permanentAccess"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccessNow"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"activeAssignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardAssignment"}}]}}]}}]} as unknown as DocumentNode<NfcCardsQuery, NfcCardsQueryVariables>;
export const NfcCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nfcCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uidHex"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nfcCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uidHex"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uidHex"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcUserLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardAssignment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardAssignmentType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"assignedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accessStart"}},{"kind":"Field","name":{"kind":"Name","value":"accessEnd"}},{"kind":"Field","name":{"kind":"Name","value":"permanentAccess"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccessNow"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"activeAssignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardAssignment"}}]}}]}}]} as unknown as DocumentNode<NfcCardQuery, NfcCardQueryVariables>;
export const NfcCardAssignmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nfcCardAssignments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"activeOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nfcCardAssignments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"activeOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"activeOnly"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardAssignment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcUserLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardAssignment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardAssignmentType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"assignedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accessStart"}},{"kind":"Field","name":{"kind":"Name","value":"accessEnd"}},{"kind":"Field","name":{"kind":"Name","value":"permanentAccess"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccessNow"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}}]}}]} as unknown as DocumentNode<NfcCardAssignmentsQuery, NfcCardAssignmentsQueryVariables>;
export const MyNfcCardAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myNfcCardAssignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myNfcCardAssignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardAssignment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcUserLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardAssignment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardAssignmentType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"assignedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accessStart"}},{"kind":"Field","name":{"kind":"Name","value":"accessEnd"}},{"kind":"Field","name":{"kind":"Name","value":"permanentAccess"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revocationReason"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccessNow"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}}]}}]} as unknown as DocumentNode<MyNfcCardAssignmentQuery, MyNfcCardAssignmentQueryVariables>;
export const NfcAccessGrantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nfcAccessGrants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"activeOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nfcAccessGrants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"activeOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"activeOnly"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcAccessGrant"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcUserLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcAccessGrant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcAccessGrantType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"participantPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"accessStart"}},{"kind":"Field","name":{"kind":"Name","value":"accessEnd"}},{"kind":"Field","name":{"kind":"Name","value":"permanentAccess"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccessNow"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkIn"}},{"kind":"Field","name":{"kind":"Name","value":"checkOut"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grantedToUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grantedToCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grantedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"revokedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}}]}}]} as unknown as DocumentNode<NfcAccessGrantsQuery, NfcAccessGrantsQueryVariables>;
export const NfcAccessEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nfcAccessEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"doorIdentifier"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nfcAccessEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"doorIdentifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"doorIdentifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcAccessEvent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcCardLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcCardType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uidHex"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcUserLite"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NfcAccessEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NfcAccessEventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"doorIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"uidHexReported"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"rawPayload"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcCardLite"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cardAssignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"externalHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"permanentAccess"}},{"kind":"Field","name":{"kind":"Name","value":"accessStart"}},{"kind":"Field","name":{"kind":"Name","value":"accessEnd"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolvedUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NfcUserLite"}}]}}]}}]} as unknown as DocumentNode<NfcAccessEventsQuery, NfcAccessEventsQueryVariables>;
export const UpsertMembershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"upsertMembership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"membershipData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MembershipInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertMembership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"membershipData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"membershipData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"membership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MembershipWithOrganization"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Membership"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MembershipType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MembershipWithOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MembershipType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Membership"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpsertMembershipMutation, UpsertMembershipMutationVariables>;
export const RemoveMembershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeMembership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"membershipId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMembership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"membershipId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"membershipId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"removedMember"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]} as unknown as DocumentNode<RemoveMembershipMutation, RemoveMembershipMutationVariables>;
export const AdminOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminOrganization"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgAdminEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"availableSlots"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"usersAttending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgAdminListing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"hrGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrgAdminEvent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrgAdminListing"}}]}}]}}]} as unknown as DocumentNode<AdminOrganizationQuery, AdminOrganizationQueryVariables>;
export const MembershipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"memberships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Membership"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Membership"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MembershipType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<MembershipsQuery, MembershipsQueryVariables>;
export const AllOrganizationsForAdminEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allOrganizationsForAdminEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allOrganizations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"primaryGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hrGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissionGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"groupType"}}]}}]}}]}}]} as unknown as DocumentNode<AllOrganizationsForAdminEditQuery, AllOrganizationsForAdminEditQueryVariables>;
export const HasPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"hasPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permission"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"permission"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permission"}}}]}]}}]} as unknown as DocumentNode<HasPermissionQuery, HasPermissionQueryVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idToken"}}]}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const AuthUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"authUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}}]}}]} as unknown as DocumentNode<AuthUserMutation, AuthUserMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userData"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const AdminUpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminUpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AdminUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUpdateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAdminEdit"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserToEdit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"yearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nfcUidHex"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPinCode"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAdminEdit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserToEdit"}},{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}}]}}]} as unknown as DocumentNode<AdminUpdateUserMutation, AdminUpdateUserMutationVariables>;
export const AdminUpdateUserNfcDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminUpdateUserNfc"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nfcData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AdminUserNfcInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUpdateUserNfc"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"nfcData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nfcData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAdminEdit"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserToEdit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"yearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nfcUidHex"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPinCode"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAdminEdit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserToEdit"}},{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}}]}}]} as unknown as DocumentNode<AdminUpdateUserNfcMutation, AdminUpdateUserNfcMutationVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const UserWithEventsAndOrgsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userWithEventsAndOrgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserWithEventsAndOrgs"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserWithEventsAndOrgs"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UserWithEventsAndOrgsQuery, UserWithEventsAndOrgsQueryVariables>;
export const UserToEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userToEdit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserToEdit"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserToEdit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"yearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nfcUidHex"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPinCode"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}}]} as unknown as DocumentNode<UserToEditQuery, UserToEditQueryVariables>;
export const UserOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isIndok"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserOrganization"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<UserOrganizationsQuery, UserOrganizationsQueryVariables>;
export const AdminEditCapabilitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminEditCapabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canManageUserProfiles"}},{"kind":"Field","name":{"kind":"Name","value":"canManageUserNfc"}}]}}]} as unknown as DocumentNode<AdminEditCapabilitiesQuery, AdminEditCapabilitiesQueryVariables>;
export const NfcUserSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nfcUserSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nfcUserSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserNfcSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNfcSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"nfcUidHex"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPinCode"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}}]} as unknown as DocumentNode<NfcUserSearchQuery, NfcUserSearchQueryVariables>;
export const UserSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAdminSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNfcSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"nfcUidHex"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPinCode"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAdminSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserNfcSearch"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}}]}}]} as unknown as DocumentNode<UserSearchQuery, UserSearchQueryVariables>;
export const ServerTimeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"serverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverTime"}}]}}]} as unknown as DocumentNode<ServerTimeQuery, ServerTimeQueryVariables>;