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
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: { input: string; output: string; }
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: { input: string; output: string; }
  /** The `Decimal` scalar type represents a python Decimal. */
  Decimal: { input: number; output: number; }
  /**
   * Allows use of a JSON String for input / output from the GraphQL schema.
   *
   * Use of this type is *not recommended* as you lose the benefits of having a defined, static
   * schema (one of the key benefits of GraphQL).
   */
  JSONString: { input: any; output: any; }
  /**
   * Leverages the internal Python implmeentation of UUID (uuid.UUID) to provide native UUID objects
   * in fields, resolvers and input.
   */
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
  isInternalPrice: Maybe<Scalars['Int']['output']>;
  isTentative: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  numberOfNights: Maybe<Scalars['Int']['output']>;
  phone: Scalars['String']['output'];
  price: Maybe<Scalars['Int']['output']>;
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
  event: Maybe<EventType>;
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
  id: Maybe<Scalars['UUID']['output']>;
  question: QuestionType;
  uuid: Scalars['UUID']['output'];
};

export type ArchiveDocumentType = {
  __typename?: 'ArchiveDocumentType';
  featured: Scalars['Boolean']['output'];
  fileLocation: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  thumbnail: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  typeDoc: ArchiveDocumentTypeDoc;
  webLink: Maybe<Scalars['String']['output']>;
  year: Maybe<Scalars['Int']['output']>;
};

/** An enumeration. */
export enum ArchiveDocumentTypeDoc {
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

export type AssignMembership = {
  __typename?: 'AssignMembership';
  membership: Maybe<MembershipType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type AttemptCapturePayment = {
  __typename?: 'AttemptCapturePayment';
  order: Maybe<OrderType>;
  status: Maybe<PaymentStatus>;
};

export type AuthUser = {
  __typename?: 'AuthUser';
  user: UserType;
};

export type BaseFormInput = {
  description: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  organizationId: InputMaybe<Scalars['ID']['input']>;
};

export type BaseListingInput = {
  application: InputMaybe<Scalars['Boolean']['input']>;
  applicationUrl: InputMaybe<Scalars['String']['input']>;
  case: InputMaybe<Scalars['Boolean']['input']>;
  deadline: InputMaybe<Scalars['DateTime']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  endDatetime: InputMaybe<Scalars['DateTime']['input']>;
  formId: InputMaybe<Scalars['ID']['input']>;
  interview: InputMaybe<Scalars['Boolean']['input']>;
  readMoreUrl: InputMaybe<Scalars['String']['input']>;
  startDatetime: InputMaybe<Scalars['DateTime']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
};

export type BaseQuestionInput = {
  description: InputMaybe<Scalars['String']['input']>;
  mandatory: InputMaybe<Scalars['Boolean']['input']>;
  question: InputMaybe<Scalars['String']['input']>;
  questionType: InputMaybe<QuestionTypeEnum>;
};

export type BlogPostType = {
  __typename?: 'BlogPostType';
  author: Maybe<UserType>;
  blog: Maybe<BlogType>;
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
  organization: Maybe<OrganizationType>;
};

/** Basic booking object type used as a base for other types and as a standalone */
export type BookingInput = {
  cabins: InputMaybe<Array<Scalars['Int']['input']>>;
  checkIn: InputMaybe<Scalars['Date']['input']>;
  checkOut: InputMaybe<Scalars['Date']['input']>;
  externalParticipants: InputMaybe<Scalars['Int']['input']>;
  extraInfo: InputMaybe<Scalars['String']['input']>;
  firstName: InputMaybe<Scalars['String']['input']>;
  internalParticipants: InputMaybe<Scalars['Int']['input']>;
  lastName: InputMaybe<Scalars['String']['input']>;
  phone: InputMaybe<Scalars['String']['input']>;
  receiverEmail: InputMaybe<Scalars['String']['input']>;
};

export type BookingResponsibleType = {
  __typename?: 'BookingResponsibleType';
  active: Maybe<Scalars['Boolean']['output']>;
  email: Maybe<Scalars['String']['output']>;
  firstName: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName: Maybe<Scalars['String']['output']>;
  phone: Maybe<Scalars['Int']['output']>;
};

export type CabinType = {
  __typename?: 'CabinType';
  externalPrice: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  internalPrice: Scalars['Int']['output'];
  maxGuests: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type CategoryInput = {
  name: InputMaybe<Scalars['String']['input']>;
};

export type CategoryType = {
  __typename?: 'CategoryType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CreateArchiveDocument = {
  __typename?: 'CreateArchiveDocument';
  arhiveDocument: Maybe<ArchiveDocumentType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type CreateBlog = {
  __typename?: 'CreateBlog';
  blog: Maybe<BlogType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type CreateBlogPost = {
  __typename?: 'CreateBlogPost';
  blogPost: Maybe<BlogPostType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

/** Add a new booking to the database */
export type CreateBooking = {
  __typename?: 'CreateBooking';
  booking: Maybe<AllBookingsType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

/** Create a new event category */
export type CreateCategory = {
  __typename?: 'CreateCategory';
  category: Maybe<CategoryType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

/** Create a new event */
export type CreateEvent = {
  __typename?: 'CreateEvent';
  event: Maybe<EventType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type CreateEventInput = {
  allowedGradeYears: InputMaybe<Array<Scalars['Int']['input']>>;
  availableSlots: InputMaybe<Scalars['Int']['input']>;
  bindingSignup: InputMaybe<Scalars['Boolean']['input']>;
  categoryId: InputMaybe<Scalars['ID']['input']>;
  contactEmail: InputMaybe<Scalars['String']['input']>;
  deadline: InputMaybe<Scalars['DateTime']['input']>;
  description: Scalars['String']['input'];
  endTime: InputMaybe<Scalars['DateTime']['input']>;
  hasExtraInformation: InputMaybe<Scalars['Boolean']['input']>;
  image: InputMaybe<Scalars['String']['input']>;
  isAttendable: Scalars['Boolean']['input'];
  location: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  price: InputMaybe<Scalars['Float']['input']>;
  shortDescription: InputMaybe<Scalars['String']['input']>;
  signupOpenDate: InputMaybe<Scalars['DateTime']['input']>;
  startTime: Scalars['DateTime']['input'];
  title: Scalars['String']['input'];
};

export type CreateForm = {
  __typename?: 'CreateForm';
  form: Maybe<FormType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type CreateFormInput = {
  description: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
};

/** Creates a new listing */
export type CreateListing = {
  __typename?: 'CreateListing';
  listing: Maybe<ListingType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type CreateListingInput = {
  application: InputMaybe<Scalars['Boolean']['input']>;
  applicationUrl: InputMaybe<Scalars['String']['input']>;
  case: InputMaybe<Scalars['Boolean']['input']>;
  deadline: Scalars['DateTime']['input'];
  description: InputMaybe<Scalars['String']['input']>;
  endDatetime: InputMaybe<Scalars['DateTime']['input']>;
  formId: InputMaybe<Scalars['ID']['input']>;
  interview: InputMaybe<Scalars['Boolean']['input']>;
  organizationId: Scalars['ID']['input'];
  readMoreUrl: InputMaybe<Scalars['String']['input']>;
  startDatetime: InputMaybe<Scalars['DateTime']['input']>;
  title: Scalars['String']['input'];
};

export type CreateOrganization = {
  __typename?: 'CreateOrganization';
  ok: Maybe<Scalars['Boolean']['output']>;
  organization: Maybe<OrganizationType>;
};

export type CreateProduct = {
  __typename?: 'CreateProduct';
  ok: Maybe<Scalars['Boolean']['output']>;
  product: Maybe<ProductType>;
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
  ok: Maybe<Scalars['Boolean']['output']>;
  question: Maybe<QuestionType>;
};

export type CreateQuestionInput = {
  description: InputMaybe<Scalars['String']['input']>;
  mandatory: InputMaybe<Scalars['Boolean']['input']>;
  question: Scalars['String']['input'];
  questionType: InputMaybe<QuestionTypeEnum>;
};

export type CreateUpdateAndDeleteOptions = {
  __typename?: 'CreateUpdateAndDeleteOptions';
  ok: Maybe<Scalars['Boolean']['output']>;
  options: Maybe<Array<OptionType>>;
};

export type DeleteAnswer = {
  __typename?: 'DeleteAnswer';
  deletedUuid: Maybe<Scalars['ID']['output']>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteAnswersToForm = {
  __typename?: 'DeleteAnswersToForm';
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteArchiveDocument = {
  __typename?: 'DeleteArchiveDocument';
  archiveDocument: Maybe<ArchiveDocumentType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteBlog = {
  __typename?: 'DeleteBlog';
  ok: Maybe<Scalars['ID']['output']>;
};

export type DeleteBlogPost = {
  __typename?: 'DeleteBlogPost';
  ok: Maybe<Scalars['Boolean']['output']>;
};

/** Deletes the booking with the given ID */
export type DeleteBooking = {
  __typename?: 'DeleteBooking';
  bookingId: Maybe<Scalars['ID']['output']>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

/** Deletes the category with a given ID */
export type DeleteCategory = {
  __typename?: 'DeleteCategory';
  category: Maybe<CategoryType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

/** Deletes the event with the given ID */
export type DeleteEvent = {
  __typename?: 'DeleteEvent';
  event: Maybe<EventType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteForm = {
  __typename?: 'DeleteForm';
  deletedId: Maybe<Scalars['ID']['output']>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

/** Deletes the listing with the given ID */
export type DeleteListing = {
  __typename?: 'DeleteListing';
  listingId: Maybe<Scalars['ID']['output']>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteOrganization = {
  __typename?: 'DeleteOrganization';
  ok: Maybe<Scalars['Boolean']['output']>;
  organization: Maybe<OrganizationType>;
};

export type DeleteQuestion = {
  __typename?: 'DeleteQuestion';
  deletedId: Maybe<Scalars['ID']['output']>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type EmailInput = {
  cabins: InputMaybe<Array<Scalars['Int']['input']>>;
  checkIn: InputMaybe<Scalars['Date']['input']>;
  checkOut: InputMaybe<Scalars['Date']['input']>;
  emailType: InputMaybe<Scalars['String']['input']>;
  externalParticipants: InputMaybe<Scalars['Int']['input']>;
  extraInfo: InputMaybe<Scalars['String']['input']>;
  firstName: InputMaybe<Scalars['String']['input']>;
  internalParticipants: InputMaybe<Scalars['Int']['input']>;
  lastName: InputMaybe<Scalars['String']['input']>;
  phone: InputMaybe<Scalars['String']['input']>;
  receiverEmail: InputMaybe<Scalars['String']['input']>;
};

/**
 * Sets the field is_attending to False in the Sign Up for the user that
 * sent the request, for the event with the given ID
 * NOTE: The sign up still exists, it is not deleted from the database
 *       when a user signs off an event
 */
export type EventSignOff = {
  __typename?: 'EventSignOff';
  event: Maybe<EventType>;
  isFull: Maybe<Scalars['Boolean']['output']>;
};

/**
 * Creates a new Sign Up for the user that sent the request, for the event
 * with the given ID
 */
export type EventSignUp = {
  __typename?: 'EventSignUp';
  event: Maybe<EventType>;
  isFull: Maybe<Scalars['Boolean']['output']>;
};

export type EventSignUpInput = {
  extraInformation: InputMaybe<Scalars['String']['input']>;
};

export type EventType = {
  __typename?: 'EventType';
  allowedGradeYears: Maybe<Array<Scalars['Int']['output']>>;
  availableSlots: Maybe<Scalars['Int']['output']>;
  bindingSignup: Scalars['Boolean']['output'];
  category: Maybe<CategoryType>;
  contactEmail: Scalars['String']['output'];
  deadline: Maybe<Scalars['DateTime']['output']>;
  description: Scalars['String']['output'];
  endTime: Maybe<Scalars['DateTime']['output']>;
  hasExtraInformation: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  image: Maybe<Scalars['String']['output']>;
  isAttendable: Scalars['Boolean']['output'];
  isFull: Maybe<Scalars['Boolean']['output']>;
  location: Maybe<Scalars['String']['output']>;
  organization: OrganizationType;
  price: Maybe<Scalars['Float']['output']>;
  product: Maybe<ProductType>;
  publisher: Maybe<UserType>;
  shortDescription: Maybe<Scalars['String']['output']>;
  signupOpenDate: Maybe<Scalars['DateTime']['output']>;
  startTime: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
  userAttendance: Maybe<UserAttendingType>;
  usersAttending: Maybe<Array<SignUpType>>;
  usersOnWaitingList: Maybe<Array<SignUpType>>;
};

/** A form containing questions, optionally linked to a listing. */
export type FormType = {
  __typename?: 'FormType';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organization: Maybe<OrganizationType>;
  questions: Array<QuestionType>;
  responder: Maybe<UserType>;
  responders: Maybe<Array<UserType>>;
  response: Maybe<ResponseType>;
  responses: Maybe<Array<ResponseType>>;
};


/** A form containing questions, optionally linked to a listing. */
export type FormTypeResponderArgs = {
  userId: Scalars['ID']['input'];
};


/** A form containing questions, optionally linked to a listing. */
export type FormTypeRespondersArgs = {
  userId: InputMaybe<Scalars['ID']['input']>;
};


/** A form containing questions, optionally linked to a listing. */
export type FormTypeResponseArgs = {
  responsePk: InputMaybe<Scalars['UUID']['input']>;
};

export type InitiateOrder = {
  __typename?: 'InitiateOrder';
  orderId: Maybe<Scalars['UUID']['output']>;
  redirect: Maybe<Scalars['String']['output']>;
};

export type ListingType = {
  __typename?: 'ListingType';
  applicationUrl: Maybe<Scalars['String']['output']>;
  chips: Array<Scalars['String']['output']>;
  deadline: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  endDatetime: Scalars['DateTime']['output'];
  form: Maybe<FormType>;
  heroImageUrl: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  organization: OrganizationType;
  readMoreUrl: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  startDatetime: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
  viewCount: Scalars['Int']['output'];
};

export type Logout = {
  __typename?: 'Logout';
  idToken: Maybe<Scalars['String']['output']>;
};

export type MembershipInput = {
  groupId: InputMaybe<Scalars['ID']['input']>;
  organizationId: InputMaybe<Scalars['ID']['input']>;
  userId: InputMaybe<Scalars['ID']['input']>;
};

export type MembershipType = {
  __typename?: 'MembershipType';
  group: Maybe<ResponsibleGroupType>;
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
  adminEventSignOff: Maybe<AdminEventSignOff>;
  assignMembership: Maybe<AssignMembership>;
  attemptCapturePayment: Maybe<AttemptCapturePayment>;
  authUser: AuthUser;
  createArchivedocument: Maybe<CreateArchiveDocument>;
  createBlog: Maybe<CreateBlog>;
  createBlogPost: Maybe<CreateBlogPost>;
  /** Add a new booking to the database */
  createBooking: Maybe<CreateBooking>;
  /** Create a new event category */
  createCategory: Maybe<CreateCategory>;
  /** Create a new event */
  createEvent: Maybe<CreateEvent>;
  createForm: Maybe<CreateForm>;
  /** Creates a new listing */
  createListing: Maybe<CreateListing>;
  createOrganization: Maybe<CreateOrganization>;
  createProduct: Maybe<CreateProduct>;
  createQuestion: Maybe<CreateQuestion>;
  createUpdateAndDeleteOptions: Maybe<CreateUpdateAndDeleteOptions>;
  deleteAnswer: Maybe<DeleteAnswer>;
  deleteAnswers: Maybe<DeleteAnswersToForm>;
  deleteArchivedocument: Maybe<DeleteArchiveDocument>;
  deleteBlog: Maybe<DeleteBlog>;
  deleteBlogPost: Maybe<DeleteBlogPost>;
  /** Deletes the booking with the given ID */
  deleteBooking: Maybe<DeleteBooking>;
  /** Deletes the category with a given ID */
  deleteCategory: Maybe<DeleteCategory>;
  /** Deletes the event with the given ID */
  deleteEvent: Maybe<DeleteEvent>;
  deleteForm: Maybe<DeleteForm>;
  /** Deletes the listing with the given ID */
  deleteListing: Maybe<DeleteListing>;
  deleteOrganization: Maybe<DeleteOrganization>;
  deleteQuestion: Maybe<DeleteQuestion>;
  /**
   * Sets the field is_attending to False in the Sign Up for the user that
   * sent the request, for the event with the given ID
   * NOTE: The sign up still exists, it is not deleted from the database
   *       when a user signs off an event
   */
  eventSignOff: Maybe<EventSignOff>;
  /**
   * Creates a new Sign Up for the user that sent the request, for the event
   * with the given ID
   */
  eventSignUp: Maybe<EventSignUp>;
  initiateOrder: Maybe<InitiateOrder>;
  logout: Maybe<Logout>;
  /** Sends email to the user or an admin (or both) */
  sendEmail: Maybe<SendEmail>;
  /** Send an email to all users signed up to an event */
  sendEventMails: Maybe<SendEventEmails>;
  submitAnswers: Maybe<SubmitOrUpdateAnswers>;
  updateArchivedocument: Maybe<UpdateArchiveDocument>;
  updateBlog: Maybe<UpdateBlog>;
  updateBlogPost: Maybe<UpdateBlogPost>;
  /** Change the given booking */
  updateBooking: Maybe<UpdateBooking>;
  /** Update the booking semester */
  updateBookingSemester: Maybe<UpdateBookingSemester>;
  /** Change the given cabin */
  updateCabin: Maybe<UpdateCabin>;
  /** Updates the category with a given ID with the data in category_data */
  updateCategory: Maybe<UpdateCategory>;
  /** Updates the event with a given ID with the data in event_data */
  updateEvent: Maybe<UpdateEvent>;
  updateForm: Maybe<UpdateForm>;
  updateListing: Maybe<UpdateListing>;
  updateOrganization: Maybe<UpdateOrganization>;
  updateQuestion: Maybe<UpdateQuestion>;
  updateUser: Maybe<UpdateUser>;
};


export type MutationsAdminEventSignOffArgs = {
  eventId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationsAssignMembershipArgs = {
  membershipData: MembershipInput;
};


export type MutationsAttemptCapturePaymentArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationsAuthUserArgs = {
  code: Scalars['String']['input'];
};


export type MutationsCreateArchivedocumentArgs = {
  date: InputMaybe<Scalars['DateTime']['input']>;
  fileLocation: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
  typeDoc: InputMaybe<Scalars['String']['input']>;
  webLink: InputMaybe<Scalars['String']['input']>;
};


export type MutationsCreateBlogArgs = {
  description: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  organizationId: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsCreateBlogPostArgs = {
  authorId: InputMaybe<Scalars['ID']['input']>;
  blogId: InputMaybe<Scalars['ID']['input']>;
  text: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
};


export type MutationsCreateBookingArgs = {
  bookingData: InputMaybe<BookingInput>;
};


export type MutationsCreateCategoryArgs = {
  categoryData: CategoryInput;
};


export type MutationsCreateEventArgs = {
  eventData: CreateEventInput;
};


export type MutationsCreateFormArgs = {
  formData: CreateFormInput;
  listingId: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsCreateListingArgs = {
  listingData: CreateListingInput;
};


export type MutationsCreateOrganizationArgs = {
  organizationData: OrganizationInput;
};


export type MutationsCreateProductArgs = {
  productData: CreateProductInput;
};


export type MutationsCreateQuestionArgs = {
  formId: InputMaybe<Scalars['ID']['input']>;
  questionData: CreateQuestionInput;
};


export type MutationsCreateUpdateAndDeleteOptionsArgs = {
  optionData: InputMaybe<Array<OptionInput>>;
  questionId: Scalars['ID']['input'];
};


export type MutationsDeleteAnswerArgs = {
  uuid: Scalars['ID']['input'];
};


export type MutationsDeleteAnswersArgs = {
  formId: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteArchivedocumentArgs = {
  id: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteBlogArgs = {
  blogId: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteBlogPostArgs = {
  blogPostId: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteBookingArgs = {
  id: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteCategoryArgs = {
  id: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteEventArgs = {
  id: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteFormArgs = {
  id: Scalars['ID']['input'];
};


export type MutationsDeleteListingArgs = {
  id: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationsDeleteQuestionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationsEventSignOffArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationsEventSignUpArgs = {
  data: InputMaybe<EventSignUpInput>;
  eventId: Scalars['ID']['input'];
};


export type MutationsInitiateOrderArgs = {
  fallbackRedirect: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['ID']['input'];
  quantity: InputMaybe<Scalars['Int']['input']>;
};


export type MutationsSendEmailArgs = {
  emailInput: InputMaybe<EmailInput>;
};


export type MutationsSendEventMailsArgs = {
  content: InputMaybe<Scalars['String']['input']>;
  eventId: Scalars['ID']['input'];
  receiverEmails: InputMaybe<Array<Scalars['String']['input']>>;
  subject: Scalars['String']['input'];
};


export type MutationsSubmitAnswersArgs = {
  answersData: InputMaybe<Array<AnswerInput>>;
  formId: Scalars['ID']['input'];
};


export type MutationsUpdateArchivedocumentArgs = {
  date: InputMaybe<Scalars['DateTime']['input']>;
  fileLocation: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['ID']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
  typeDoc: InputMaybe<Scalars['String']['input']>;
  webLink: InputMaybe<Scalars['String']['input']>;
};


export type MutationsUpdateBlogArgs = {
  blogData: InputMaybe<UpdateBlogInput>;
};


export type MutationsUpdateBlogPostArgs = {
  blogPostData: InputMaybe<UpdateBlogPostInput>;
};


export type MutationsUpdateBookingArgs = {
  bookingData: InputMaybe<UpdateBookingInput>;
};


export type MutationsUpdateBookingSemesterArgs = {
  semesterData: InputMaybe<UpdateBookingSemesterInput>;
};


export type MutationsUpdateCabinArgs = {
  cabinData: InputMaybe<UpdateCabinInput>;
};


export type MutationsUpdateCategoryArgs = {
  categoryData: InputMaybe<CategoryInput>;
  id: Scalars['ID']['input'];
};


export type MutationsUpdateEventArgs = {
  eventData: InputMaybe<UpdateEventInput>;
  id: Scalars['ID']['input'];
};


export type MutationsUpdateFormArgs = {
  formData: BaseFormInput;
  id: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsUpdateListingArgs = {
  id: Scalars['ID']['input'];
  listingData: InputMaybe<BaseListingInput>;
};


export type MutationsUpdateOrganizationArgs = {
  id: Scalars['ID']['input'];
  organizationData: InputMaybe<OrganizationInput>;
};


export type MutationsUpdateQuestionArgs = {
  id: Scalars['ID']['input'];
  questionData: BaseQuestionInput;
};


export type MutationsUpdateUserArgs = {
  userData: InputMaybe<UserInput>;
};

export type OptionInput = {
  answer: Scalars['String']['input'];
  id: InputMaybe<Scalars['ID']['input']>;
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
  length: Maybe<Scalars['Int']['output']>;
  orders: Maybe<Array<OrderType>>;
};

export type OrganizationInput = {
  description: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  parentId: InputMaybe<Scalars['ID']['input']>;
};

export type OrganizationType = {
  __typename?: 'OrganizationType';
  absoluteSlug: Maybe<Scalars['String']['output']>;
  children: Array<OrganizationType>;
  color: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  events: Array<EventType>;
  hrGroup: Maybe<ResponsibleGroupType>;
  id: Scalars['ID']['output'];
  listings: Maybe<Array<ListingType>>;
  logoUrl: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  parent: Maybe<OrganizationType>;
  primaryGroup: Maybe<ResponsibleGroupType>;
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
  sizes: Scalars['JSONString']['output'];
  types: Scalars['JSONString']['output'];
};

export type Queries = {
  __typename?: 'Queries';
  activeBookingResponsible: Maybe<BookingResponsibleType>;
  adminAllBookings: Maybe<Array<AdminBookingType>>;
  allBlogPosts: Maybe<Array<BlogPostType>>;
  allBlogs: Maybe<Array<BlogType>>;
  allBookings: Maybe<Array<AllBookingsType>>;
  allCategories: Maybe<Array<CategoryType>>;
  allEvents: Maybe<Array<EventType>>;
  allOrganizations: Maybe<Array<OrganizationType>>;
  allUsers: Maybe<Array<UserType>>;
  archiveByTypes: Array<ArchiveDocumentType>;
  attendeeReport: Maybe<Scalars['String']['output']>;
  attendeeReportOrg: Maybe<Scalars['String']['output']>;
  attendeeReports: Maybe<Scalars['String']['output']>;
  availableYears: Array<Scalars['String']['output']>;
  blog: Maybe<BlogType>;
  blogPost: Maybe<BlogPostType>;
  bookingSemester: Maybe<UpdateBookingSemesterType>;
  cabins: Maybe<Array<CabinType>>;
  category: Maybe<CategoryType>;
  defaultEvents: Maybe<Array<EventType>>;
  event: Maybe<EventType>;
  eventFilteredOrganizations: Maybe<Array<OrganizationType>>;
  featuredArchive: Array<ArchiveDocumentType>;
  form: Maybe<FormType>;
  forms: Maybe<Array<FormType>>;
  hasPermission: Maybe<Scalars['Boolean']['output']>;
  listing: Maybe<ListingType>;
  listings: Maybe<Array<ListingType>>;
  logout: Scalars['String']['output'];
  memberships: Maybe<Array<MembershipType>>;
  order: Maybe<OrderType>;
  ordersByStatus: Maybe<OrdersByStatusType>;
  organization: Maybe<OrganizationType>;
  product: Maybe<ProductType>;
  products: Maybe<Array<ProductType>>;
  response: Maybe<ResponseType>;
  responses: Maybe<Array<ResponseType>>;
  serverTime: Maybe<Scalars['DateTime']['output']>;
  signUps: Maybe<SignUpType>;
  user: Maybe<UserType>;
  userOrders: Maybe<Array<OrderType>>;
};


export type QueriesAdminAllBookingsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
};


export type QueriesAllEventsArgs = {
  category: InputMaybe<Scalars['String']['input']>;
  endTime: InputMaybe<Scalars['DateTime']['input']>;
  organization: InputMaybe<Scalars['String']['input']>;
  startTime: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueriesAllOrganizationsArgs = {
  search: InputMaybe<Scalars['String']['input']>;
};


export type QueriesArchiveByTypesArgs = {
  names: InputMaybe<Scalars['String']['input']>;
  typeDoc: Array<InputMaybe<Scalars['String']['input']>>;
  year: InputMaybe<Scalars['Int']['input']>;
};


export type QueriesAttendeeReportArgs = {
  eventId: Scalars['ID']['input'];
  fields: InputMaybe<Array<Scalars['String']['input']>>;
  filetype: InputMaybe<Scalars['String']['input']>;
};


export type QueriesAttendeeReportOrgArgs = {
  fields: InputMaybe<Array<Scalars['String']['input']>>;
  filetype: InputMaybe<Scalars['String']['input']>;
  orgId: Scalars['ID']['input'];
};


export type QueriesAttendeeReportsArgs = {
  eventIds: Array<Scalars['ID']['input']>;
  fields: InputMaybe<Array<Scalars['String']['input']>>;
  filetype: InputMaybe<Scalars['String']['input']>;
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
  formId: InputMaybe<Scalars['ID']['input']>;
};


export type QueriesHasPermissionArgs = {
  permission: Scalars['String']['input'];
};


export type QueriesListingArgs = {
  id: InputMaybe<Scalars['ID']['input']>;
};


export type QueriesListingsArgs = {
  search: InputMaybe<Scalars['String']['input']>;
};


export type QueriesMembershipsArgs = {
  organizationId: InputMaybe<Scalars['ID']['input']>;
};


export type QueriesOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type QueriesOrdersByStatusArgs = {
  productId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type QueriesOrganizationArgs = {
  id: InputMaybe<Scalars['ID']['input']>;
  slug: InputMaybe<Scalars['String']['input']>;
};


export type QueriesProductArgs = {
  productId: Scalars['ID']['input'];
};


export type QueriesResponseArgs = {
  formId: Scalars['ID']['input'];
  responseId: InputMaybe<Scalars['ID']['input']>;
};


export type QueriesResponsesArgs = {
  formId: Scalars['ID']['input'];
};


export type QueriesSignUpsArgs = {
  eventId: Scalars['ID']['input'];
};

/** A question on a form. */
export type QuestionType = {
  __typename?: 'QuestionType';
  answer: Maybe<AnswerType>;
  answers: Maybe<Array<AnswerType>>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mandatory: Scalars['Boolean']['output'];
  options: Maybe<Array<OptionType>>;
  question: Scalars['String']['output'];
  questionType: Maybe<QuestionTypeEnum>;
};


/** A question on a form. */
export type QuestionTypeAnswersArgs = {
  userId: InputMaybe<Scalars['ID']['input']>;
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

/** An enumeration. */
export enum ResponseStatus {
  /** Red */
  A_0 = 'A_0',
  /** Yellow */
  A_1 = 'A_1',
  /** Green */
  A_2 = 'A_2',
  /** Unknown */
  None = 'NONE'
}

/** A response instance that contains information about a user's response to a form. */
export type ResponseType = {
  __typename?: 'ResponseType';
  answers: Array<AnswerType>;
  form: FormType;
  id: Maybe<Scalars['UUID']['output']>;
  questions: Maybe<Array<QuestionType>>;
  respondent: UserType;
  status: Maybe<ResponseStatus>;
  uuid: Scalars['UUID']['output'];
};

export type ResponsibleGroupType = {
  __typename?: 'ResponsibleGroupType';
  description: Maybe<Scalars['String']['output']>;
  groupType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organization: OrganizationType;
  uuid: Scalars['UUID']['output'];
};

/** Sends email to the user or an admin (or both) */
export type SendEmail = {
  __typename?: 'SendEmail';
  ok: Maybe<Scalars['Boolean']['output']>;
};

/** Send an email to all users signed up to an event */
export type SendEventEmails = {
  __typename?: 'SendEventEmails';
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type SignUpType = {
  __typename?: 'SignUpType';
  event: EventType;
  extraInformation: Scalars['String']['output'];
  hasBoughtTicket: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  isAttending: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTime']['output'];
  user: UserType;
  userAllergies: Maybe<Scalars['String']['output']>;
  userEmail: Scalars['String']['output'];
  userGradeYear: Scalars['Int']['output'];
  userPhoneNumber: Scalars['String']['output'];
};

export type SubmitOrUpdateAnswers = {
  __typename?: 'SubmitOrUpdateAnswers';
  message: Maybe<Scalars['String']['output']>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateArchiveDocument = {
  __typename?: 'UpdateArchiveDocument';
  event: Maybe<ArchiveDocumentType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateBlog = {
  __typename?: 'UpdateBlog';
  blog: Maybe<BlogType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateBlogInput = {
  description: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: InputMaybe<Scalars['String']['input']>;
  organizationId: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateBlogPost = {
  __typename?: 'UpdateBlogPost';
  blogPost: Maybe<BlogPostType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateBlogPostInput = {
  blogId: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  text: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
};

/** Change the given booking */
export type UpdateBooking = {
  __typename?: 'UpdateBooking';
  booking: Maybe<AllBookingsType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateBookingInput = {
  cabins: InputMaybe<Array<Scalars['Int']['input']>>;
  checkIn: InputMaybe<Scalars['Date']['input']>;
  checkOut: InputMaybe<Scalars['Date']['input']>;
  declineReason: InputMaybe<Scalars['String']['input']>;
  externalParticipants: InputMaybe<Scalars['Int']['input']>;
  extraInfo: InputMaybe<Scalars['String']['input']>;
  firstName: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  internalParticipants: InputMaybe<Scalars['Int']['input']>;
  isDeclined: InputMaybe<Scalars['Boolean']['input']>;
  isTentative: InputMaybe<Scalars['Boolean']['input']>;
  lastName: InputMaybe<Scalars['String']['input']>;
  phone: InputMaybe<Scalars['String']['input']>;
  receiverEmail: InputMaybe<Scalars['String']['input']>;
};

/** Update the booking semester */
export type UpdateBookingSemester = {
  __typename?: 'UpdateBookingSemester';
  bookingSemester: Maybe<UpdateBookingSemesterType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateBookingSemesterInput = {
  fallEndDate: InputMaybe<Scalars['Date']['input']>;
  fallSemesterActive: InputMaybe<Scalars['Boolean']['input']>;
  fallStartDate: InputMaybe<Scalars['Date']['input']>;
  springEndDate: InputMaybe<Scalars['Date']['input']>;
  springSemesterActive: InputMaybe<Scalars['Boolean']['input']>;
  springStartDate: InputMaybe<Scalars['Date']['input']>;
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
  cabin: Maybe<CabinType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateCabinInput = {
  externalPrice: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['ID']['input']>;
  internalPrice: InputMaybe<Scalars['Int']['input']>;
  maxGuests: InputMaybe<Scalars['Int']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
};

/** Updates the category with a given ID with the data in category_data */
export type UpdateCategory = {
  __typename?: 'UpdateCategory';
  category: Maybe<CategoryType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

/** Updates the event with a given ID with the data in event_data */
export type UpdateEvent = {
  __typename?: 'UpdateEvent';
  event: Maybe<EventType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateEventInput = {
  allowedGradeYears: InputMaybe<Array<Scalars['Int']['input']>>;
  availableSlots: InputMaybe<Scalars['Int']['input']>;
  bindingSignup: InputMaybe<Scalars['Boolean']['input']>;
  categoryId: InputMaybe<Scalars['ID']['input']>;
  contactEmail: InputMaybe<Scalars['String']['input']>;
  deadline: InputMaybe<Scalars['DateTime']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  endTime: InputMaybe<Scalars['DateTime']['input']>;
  hasExtraInformation: InputMaybe<Scalars['Boolean']['input']>;
  image: InputMaybe<Scalars['String']['input']>;
  isAttendable: InputMaybe<Scalars['Boolean']['input']>;
  location: InputMaybe<Scalars['String']['input']>;
  organizationId: InputMaybe<Scalars['ID']['input']>;
  price: InputMaybe<Scalars['Float']['input']>;
  shortDescription: InputMaybe<Scalars['String']['input']>;
  signupOpenDate: InputMaybe<Scalars['DateTime']['input']>;
  startTime: InputMaybe<Scalars['DateTime']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
};

export type UpdateForm = {
  __typename?: 'UpdateForm';
  form: Maybe<FormType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateListing = {
  __typename?: 'UpdateListing';
  listing: Maybe<ListingType>;
  ok: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateOrganization = {
  __typename?: 'UpdateOrganization';
  ok: Maybe<Scalars['Boolean']['output']>;
  organization: Maybe<OrganizationType>;
};

export type UpdateQuestion = {
  __typename?: 'UpdateQuestion';
  ok: Maybe<Scalars['Boolean']['output']>;
  question: Maybe<QuestionType>;
};

export type UpdateUser = {
  __typename?: 'UpdateUser';
  user: Maybe<UserType>;
};

export type UserAttendingType = {
  __typename?: 'UserAttendingType';
  hasBoughtTicket: Maybe<Scalars['Boolean']['output']>;
  isOnWaitingList: Maybe<Scalars['Boolean']['output']>;
  isSignedUp: Maybe<Scalars['Boolean']['output']>;
  positionOnWaitingList: Maybe<Scalars['Int']['output']>;
};

export type UserInput = {
  allergies: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  firstName: InputMaybe<Scalars['String']['input']>;
  graduationYear: InputMaybe<Scalars['Int']['input']>;
  lastName: InputMaybe<Scalars['String']['input']>;
  phoneNumber: InputMaybe<Scalars['String']['input']>;
};

export type UserType = {
  __typename?: 'UserType';
  allergies: Maybe<Scalars['String']['output']>;
  canUpdateYear: Maybe<Scalars['Boolean']['output']>;
  dateJoined: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  events: Maybe<Array<EventType>>;
  feideEmail: Scalars['String']['output'];
  feideUserid: Scalars['String']['output'];
  firstLogin: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  gradeYear: Maybe<Scalars['Int']['output']>;
  graduationYear: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  idToken: Scalars['String']['output'];
  lastLogin: Maybe<Scalars['DateTime']['output']>;
  lastName: Scalars['String']['output'];
  memberships: Array<MembershipType>;
  organizations: Array<OrganizationType>;
  phoneNumber: Scalars['String']['output'];
  responses: Array<ResponseType>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']['output'];
  yearUpdatedAt: Maybe<Scalars['DateTime']['output']>;
};

export type LoggedInUserQueryVariables = Exact<{ [key: string]: never; }>;


export type LoggedInUserQuery = { __typename?: 'Queries', user: { __typename?: 'UserType', id: string, firstName: string } | null };

export type UserWithIdQueryVariables = Exact<{ [key: string]: never; }>;


export type UserWithIdQuery = { __typename?: 'Queries', user: { __typename?: 'UserType', id: string } | null };

export type HasPermissionQueryVariables = Exact<{
  permission: Scalars['String']['input'];
}>;


export type HasPermissionQuery = { __typename?: 'Queries', hasPermission: boolean | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutations', logout: { __typename?: 'Logout', idToken: string | null } | null };

export type ProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileQuery = { __typename?: 'Queries', user: { __typename?: 'UserType', id: string, feideEmail: string, email: string, username: string, firstName: string, lastName: string, dateJoined: string, graduationYear: number | null, gradeYear: number | null, allergies: string | null, phoneNumber: string, firstLogin: boolean } | null };

export type CabinPermissionQueryVariables = Exact<{ [key: string]: never; }>;


export type CabinPermissionQuery = { __typename?: 'Queries', hasPermission: boolean | null };


export const LoggedInUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoggedInUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]} as unknown as DocumentNode<LoggedInUserQuery, LoggedInUserQueryVariables>;
export const UserWithIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserWithId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UserWithIdQuery, UserWithIdQueryVariables>;
export const HasPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HasPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permission"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"permission"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permission"}}}]}]}}]} as unknown as DocumentNode<HasPermissionQuery, HasPermissionQueryVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idToken"}}]}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const ProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}}]}}]}}]} as unknown as DocumentNode<ProfileQuery, ProfileQueryVariables>;
export const CabinPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CabinPermission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"permission"},"value":{"kind":"StringValue","value":"cabins.manage_booking","block":false}}]}]}}]} as unknown as DocumentNode<CabinPermissionQuery, CabinPermissionQueryVariables>;