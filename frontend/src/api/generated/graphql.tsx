import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
  /**
   * Leverages the internal Python implmeentation of UUID (uuid.UUID) to provide native UUID objects
   * in fields, resolvers and input.
   */
  UUID: any;
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: any;
  /**
   * The `GenericScalar` scalar type represents a generic
   * GraphQL scalar value that could be:
   * String, Boolean, Int, Float, List or Object.
   */
  GenericScalar: any;
};

export type Queries = {
  __typename?: "Queries";
  serverTime?: Maybe<Scalars["DateTime"]>;
  option?: Maybe<OptionType>;
  options?: Maybe<Array<Maybe<OptionType>>>;
  form?: Maybe<FormType>;
  forms?: Maybe<Array<Maybe<FormType>>>;
  question?: Maybe<QuestionType>;
  questions?: Maybe<Array<Maybe<QuestionType>>>;
  answer?: Maybe<AnswerType>;
  answers?: Maybe<Array<Maybe<AnswerType>>>;
  response?: Maybe<ResponseType>;
  responses?: Maybe<Array<Maybe<ResponseType>>>;
  listings?: Maybe<Array<Maybe<ListingType>>>;
  listing?: Maybe<ListingType>;
  allOrganizations?: Maybe<Array<Maybe<OrganizationType>>>;
  organization?: Maybe<OrganizationType>;
  eventFilteredOrganizations?: Maybe<Array<Maybe<OrganizationType>>>;
  memberships?: Maybe<Array<Maybe<MembershipType>>>;
  allRoles?: Maybe<Array<Maybe<RoleType>>>;
  allBookings?: Maybe<Array<Maybe<BookingType>>>;
  bookingsByMonth?: Maybe<Array<Maybe<BookingType>>>;
  booking?: Maybe<BookingType>;
  cabins?: Maybe<Array<Maybe<CabinType>>>;
  allUsers?: Maybe<Array<Maybe<UserType>>>;
  user?: Maybe<UserType>;
  featuredArchive?: Maybe<Array<Maybe<ArchiveDocumentType>>>;
  archiveByTypes?: Maybe<Array<Maybe<ArchiveDocumentType>>>;
  availableYears?: Maybe<Array<Maybe<Scalars["String"]>>>;
  allEvents?: Maybe<Array<Maybe<EventType>>>;
  defaultEvents?: Maybe<Array<Maybe<EventType>>>;
  event?: Maybe<EventType>;
  allCategories?: Maybe<Array<Maybe<CategoryType>>>;
  category?: Maybe<CategoryType>;
  attendeeReport?: Maybe<Scalars["String"]>;
  attendeeReports?: Maybe<Scalars["String"]>;
  attendeeReportOrg?: Maybe<Scalars["String"]>;
  signUps?: Maybe<SignUpType>;
};

export type QueriesOptionArgs = {
  id?: Maybe<Scalars["ID"]>;
};

export type QueriesOptionsArgs = {
  search?: Maybe<Scalars["String"]>;
};

export type QueriesFormArgs = {
  formId?: Maybe<Scalars["ID"]>;
};

export type QueriesFormsArgs = {
  search?: Maybe<Scalars["String"]>;
};

export type QueriesQuestionArgs = {
  id?: Maybe<Scalars["ID"]>;
};

export type QueriesQuestionsArgs = {
  search?: Maybe<Scalars["String"]>;
};

export type QueriesAnswerArgs = {
  id?: Maybe<Scalars["ID"]>;
};

export type QueriesAnswersArgs = {
  search?: Maybe<Scalars["String"]>;
};

export type QueriesResponseArgs = {
  formId: Scalars["ID"];
  responseId?: Maybe<Scalars["ID"]>;
};

export type QueriesResponsesArgs = {
  formId: Scalars["ID"];
};

export type QueriesListingsArgs = {
  search?: Maybe<Scalars["String"]>;
};

export type QueriesListingArgs = {
  id?: Maybe<Scalars["ID"]>;
};

export type QueriesAllOrganizationsArgs = {
  search?: Maybe<Scalars["String"]>;
};

export type QueriesOrganizationArgs = {
  id?: Maybe<Scalars["ID"]>;
  slug?: Maybe<Scalars["String"]>;
};

export type QueriesMembershipsArgs = {
  organizationId?: Maybe<Scalars["ID"]>;
};

export type QueriesBookingsByMonthArgs = {
  year?: Maybe<Scalars["String"]>;
  month?: Maybe<Scalars["String"]>;
};

export type QueriesBookingArgs = {
  bookingId: Scalars["ID"];
};

export type QueriesArchiveByTypesArgs = {
  typeDoc: Array<Maybe<Scalars["String"]>>;
  year?: Maybe<Scalars["Int"]>;
  names?: Maybe<Scalars["String"]>;
};

export type QueriesAllEventsArgs = {
  category?: Maybe<Scalars["String"]>;
  organization?: Maybe<Scalars["String"]>;
  startTime?: Maybe<Scalars["DateTime"]>;
  endTime?: Maybe<Scalars["DateTime"]>;
};

export type QueriesEventArgs = {
  id: Scalars["ID"];
};

export type QueriesCategoryArgs = {
  id: Scalars["ID"];
};

export type QueriesAttendeeReportArgs = {
  eventId: Scalars["ID"];
  fields?: Maybe<Array<Maybe<Scalars["String"]>>>;
  filetype?: Maybe<Scalars["String"]>;
};

export type QueriesAttendeeReportsArgs = {
  eventIds: Array<Maybe<Scalars["ID"]>>;
  fields?: Maybe<Array<Maybe<Scalars["String"]>>>;
  filetype?: Maybe<Scalars["String"]>;
};

export type QueriesAttendeeReportOrgArgs = {
  orgId: Scalars["ID"];
  fields?: Maybe<Array<Maybe<Scalars["String"]>>>;
  filetype?: Maybe<Scalars["String"]>;
};

export type QueriesSignUpsArgs = {
  eventId: Scalars["ID"];
};

/** Option for multiple choice questions */
export type OptionType = {
  __typename?: "OptionType";
  id: Scalars["ID"];
  answer: Scalars["String"];
  question: QuestionType;
};

/** A question on a form. */
export type QuestionType = {
  __typename?: "QuestionType";
  id: Scalars["ID"];
  question: Scalars["String"];
  description: Scalars["String"];
  mandatory: Scalars["Boolean"];
  options?: Maybe<Array<Maybe<OptionType>>>;
  answers?: Maybe<Array<Maybe<AnswerType>>>;
  answer?: Maybe<AnswerType>;
  questionType?: Maybe<Scalars["String"]>;
};

/** A question on a form. */
export type QuestionTypeAnswersArgs = {
  userId?: Maybe<Scalars["ID"]>;
};

/** A question on a form. */
export type QuestionTypeAnswerArgs = {
  userId: Scalars["ID"];
};

/** A user's answer to a question. */
export type AnswerType = {
  __typename?: "AnswerType";
  uuid: Scalars["UUID"];
  question: QuestionType;
  answer: Scalars["String"];
  user?: Maybe<UserType>;
  id?: Maybe<Scalars["ID"]>;
};

export type UserType = {
  __typename?: "UserType";
  id: Scalars["ID"];
  lastLogin?: Maybe<Scalars["DateTime"]>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars["String"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  email: Scalars["String"];
  dateJoined: Scalars["DateTime"];
  feideUserid: Scalars["String"];
  feideEmail: Scalars["String"];
  idToken: Scalars["String"];
  allergies: Scalars["String"];
  phoneNumber: Scalars["String"];
  firstLogin: Scalars["Boolean"];
  graduationYear?: Maybe<Scalars["Int"]>;
  organizations: Array<OrganizationType>;
  memberships: Array<MembershipType>;
  gradeYear?: Maybe<Scalars["Int"]>;
  events?: Maybe<Array<Maybe<EventType>>>;
};

export type OrganizationType = {
  __typename?: "OrganizationType";
  id: Scalars["ID"];
  name: Scalars["String"];
  slug: Scalars["String"];
  description: Scalars["String"];
  parent?: Maybe<OrganizationType>;
  color?: Maybe<Scalars["String"]>;
  users: Array<UserType>;
  children: Array<OrganizationType>;
  events: Array<EventType>;
  absoluteSlug?: Maybe<Scalars["String"]>;
  listings?: Maybe<Array<Maybe<ListingType>>>;
};

export type EventType = {
  __typename?: "EventType";
  id: Scalars["ID"];
  title: Scalars["String"];
  description: Scalars["String"];
  startTime: Scalars["DateTime"];
  isAttendable: Scalars["Boolean"];
  publisher?: Maybe<UserType>;
  endTime?: Maybe<Scalars["DateTime"]>;
  location?: Maybe<Scalars["String"]>;
  organization: OrganizationType;
  category?: Maybe<CategoryType>;
  image?: Maybe<Scalars["String"]>;
  deadline?: Maybe<Scalars["DateTime"]>;
  signupOpenDate?: Maybe<Scalars["DateTime"]>;
  price?: Maybe<Scalars["Float"]>;
  shortDescription?: Maybe<Scalars["String"]>;
  hasExtraInformation: Scalars["Boolean"];
  contactEmail: Scalars["String"];
  bindingSignup: Scalars["Boolean"];
  userAttendance?: Maybe<UserAttendingType>;
  isFull?: Maybe<Scalars["Boolean"]>;
  usersOnWaitingList?: Maybe<Array<Maybe<UserType>>>;
  usersAttending?: Maybe<Array<Maybe<UserType>>>;
  allowedGradeYears?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  availableSlots?: Maybe<Scalars["Int"]>;
};

export type CategoryType = {
  __typename?: "CategoryType";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type UserAttendingType = {
  __typename?: "UserAttendingType";
  isSignedUp?: Maybe<Scalars["Boolean"]>;
  isOnWaitingList?: Maybe<Scalars["Boolean"]>;
};

export type ListingType = {
  __typename?: "ListingType";
  id: Scalars["ID"];
  title: Scalars["String"];
  slug: Scalars["String"];
  description: Scalars["String"];
  startDatetime: Scalars["DateTime"];
  endDatetime: Scalars["DateTime"];
  deadline: Scalars["DateTime"];
  organization?: Maybe<OrganizationType>;
  url?: Maybe<Scalars["String"]>;
  form?: Maybe<FormType>;
};

/** A form containing questions, optionally linked to a listing. */
export type FormType = {
  __typename?: "FormType";
  id: Scalars["ID"];
  organization?: Maybe<OrganizationType>;
  name: Scalars["String"];
  description: Scalars["String"];
  questions?: Maybe<Array<Maybe<QuestionType>>>;
  responders?: Maybe<Array<Maybe<UserType>>>;
  responder?: Maybe<UserType>;
  responses?: Maybe<Array<Maybe<ResponseType>>>;
};

/** A form containing questions, optionally linked to a listing. */
export type FormTypeRespondersArgs = {
  userId?: Maybe<Scalars["ID"]>;
};

/** A form containing questions, optionally linked to a listing. */
export type FormTypeResponderArgs = {
  userId: Scalars["ID"];
};

/** A response instance that contains information about a user's response to a form. */
export type ResponseType = {
  __typename?: "ResponseType";
  uuid: Scalars["UUID"];
  respondent: UserType;
  form: FormType;
  status?: Maybe<ResponseStatus>;
  answers?: Maybe<Array<Maybe<AnswerType>>>;
  id?: Maybe<Scalars["ID"]>;
};

/** An enumeration. */
export enum ResponseStatus {
  /** Unknown */
  None = "NONE",
  /** Red */
  A_0 = "A_0",
  /** Yellow */
  A_1 = "A_1",
  /** Green */
  A_2 = "A_2",
}

export type MembershipType = {
  __typename?: "MembershipType";
  id: Scalars["ID"];
  user: UserType;
  organization: OrganizationType;
  role: RoleType;
};

export type RoleType = {
  __typename?: "RoleType";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type BookingType = {
  __typename?: "BookingType";
  id: Scalars["ID"];
  firstname: Scalars["String"];
  surname: Scalars["String"];
  phone: Scalars["Int"];
  receiverEmail: Scalars["String"];
  bookFrom: Scalars["Date"];
  bookTo: Scalars["Date"];
  price: Scalars["Int"];
  cabins: Array<CabinType>;
};

export type CabinType = {
  __typename?: "CabinType";
  id: Scalars["ID"];
  name: Scalars["String"];
  bookingSet: Array<BookingType>;
};

export type ArchiveDocumentType = {
  __typename?: "ArchiveDocumentType";
  id: Scalars["ID"];
  title: Scalars["String"];
  typeDoc: ArchiveDocumentTypeDoc;
  fileLocation: Scalars["String"];
  featured: Scalars["Boolean"];
  year?: Maybe<Scalars["Int"]>;
  webLink?: Maybe<Scalars["String"]>;
  thumbnail?: Maybe<Scalars["String"]>;
};

/** An enumeration. */
export enum ArchiveDocumentTypeDoc {
  /** Budsjett og Regnskap */
  BudsjettOgRegnskap = "BUDSJETT_OG_REGNSKAP",
  /** Generalforsamling */
  Generalforsamling = "GENERALFORSAMLING",
  /** Årbøker */
  Arboker = "ARBOKER",
  /** Foreningens lover */
  ForeningensLover = "FORENINGENS_LOVER",
  /** Støtte fra HS */
  StotteFraHs = "STOTTE_FRA_HS",
  /** Utveksling */
  Utveksling = "UTVEKSLING",
  /** Annet */
  Annet = "ANNET",
}

export type SignUpType = {
  __typename?: "SignUpType";
  id: Scalars["ID"];
  timestamp: Scalars["DateTime"];
  isAttending: Scalars["Boolean"];
  extraInformation: Scalars["String"];
  event: EventType;
  user: UserType;
  userEmail: Scalars["String"];
  userAllergies: Scalars["String"];
  userPhoneNumber: Scalars["String"];
  userGradeYear: Scalars["Int"];
};

export type Mutations = {
  __typename?: "Mutations";
  createQuestion?: Maybe<CreateQuestion>;
  updateQuestion?: Maybe<UpdateQuestion>;
  deleteQuestion?: Maybe<DeleteQuestion>;
  createForm?: Maybe<CreateForm>;
  updateForm?: Maybe<UpdateForm>;
  deleteForm?: Maybe<DeleteForm>;
  deleteAnswer?: Maybe<DeleteAnswer>;
  submitAnswers?: Maybe<SubmitOrUpdateAnswers>;
  deleteAnswers?: Maybe<DeleteAnswersToForm>;
  createUpdateAndDeleteOptions?: Maybe<CreateUpdateAndDeleteOptions>;
  /** Creates a new listing */
  createListing?: Maybe<CreateListing>;
  updateListing?: Maybe<UpdateListing>;
  /** Deletes the listing with the given ID */
  deleteListing?: Maybe<DeleteListing>;
  createOrganization?: Maybe<CreateOrganization>;
  updateOrganization?: Maybe<UpdateOrganization>;
  deleteOrganization?: Maybe<DeleteOrganization>;
  createRole?: Maybe<CreateRole>;
  assignMembership?: Maybe<AssignMembership>;
  createCabin?: Maybe<CreateBooking>;
  updateBooking?: Maybe<UpdateBooking>;
  deleteBooking?: Maybe<DeleteBooking>;
  sendEmail?: Maybe<SendEmail>;
  authUser?: Maybe<AuthUser>;
  updateUser?: Maybe<UpdateUser>;
  verifyToken?: Maybe<Verify>;
  refreshToken?: Maybe<Refresh>;
  deleteTokenCookie?: Maybe<DeleteJsonWebTokenCookie>;
  getIdToken?: Maybe<GetIdToken>;
  createArchivedocument?: Maybe<CreateArchiveDocument>;
  updateArchivedocument?: Maybe<UpdateArchiveDocument>;
  deleteArchivedocument?: Maybe<DeleteArchiveDocument>;
  createEvent?: Maybe<CreateEvent>;
  updateEvent?: Maybe<UpdateEvent>;
  eventSignUp?: Maybe<EventSignUp>;
  eventSignOff?: Maybe<EventSignOff>;
  adminEventSignOff?: Maybe<AdminEventSignOff>;
  deleteEvent?: Maybe<DeleteEvent>;
  createCategory?: Maybe<CreateCategory>;
  updateCategory?: Maybe<UpdateCategory>;
  deleteCategory?: Maybe<DeleteCategory>;
  sendEventMails?: Maybe<SendEventEmails>;
};

export type MutationsCreateQuestionArgs = {
  questionData: CreateQuestionInput;
};

export type MutationsUpdateQuestionArgs = {
  id: Scalars["ID"];
  questionData: BaseQuestionInput;
};

export type MutationsDeleteQuestionArgs = {
  id: Scalars["ID"];
};

export type MutationsCreateFormArgs = {
  formData: CreateFormInput;
  listingId?: Maybe<Scalars["ID"]>;
};

export type MutationsUpdateFormArgs = {
  formData: BaseFormInput;
  id?: Maybe<Scalars["ID"]>;
};

export type MutationsDeleteFormArgs = {
  id: Scalars["ID"];
};

export type MutationsDeleteAnswerArgs = {
  uuid: Scalars["ID"];
};

export type MutationsSubmitAnswersArgs = {
  answersData?: Maybe<Array<Maybe<AnswerInput>>>;
  formId: Scalars["ID"];
};

export type MutationsDeleteAnswersArgs = {
  formId?: Maybe<Scalars["ID"]>;
};

export type MutationsCreateUpdateAndDeleteOptionsArgs = {
  optionData?: Maybe<Array<Maybe<OptionInput>>>;
  questionId: Scalars["ID"];
};

export type MutationsCreateListingArgs = {
  listingData: CreateListingInput;
};

export type MutationsUpdateListingArgs = {
  id: Scalars["ID"];
  listingData?: Maybe<BaseListingInput>;
};

export type MutationsDeleteListingArgs = {
  id?: Maybe<Scalars["ID"]>;
};

export type MutationsCreateOrganizationArgs = {
  organizationData: OrganizationInput;
};

export type MutationsUpdateOrganizationArgs = {
  id: Scalars["ID"];
  organizationData?: Maybe<OrganizationInput>;
};

export type MutationsDeleteOrganizationArgs = {
  id: Scalars["ID"];
};

export type MutationsCreateRoleArgs = {
  roleData: RoleInput;
};

export type MutationsAssignMembershipArgs = {
  membershipData: MembershipInput;
};

export type MutationsCreateCabinArgs = {
  bookFrom?: Maybe<Scalars["String"]>;
  bookTo?: Maybe<Scalars["String"]>;
  cabins?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  firstname?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["Int"]>;
  price?: Maybe<Scalars["Int"]>;
  receiverEmail?: Maybe<Scalars["String"]>;
  surname?: Maybe<Scalars["String"]>;
};

export type MutationsUpdateBookingArgs = {
  bookingId?: Maybe<Scalars["ID"]>;
  contactNum?: Maybe<Scalars["Int"]>;
  contactPerson?: Maybe<Scalars["String"]>;
  endDay?: Maybe<Scalars["String"]>;
  startDay?: Maybe<Scalars["String"]>;
};

export type MutationsDeleteBookingArgs = {
  bookingId?: Maybe<Scalars["ID"]>;
};

export type MutationsSendEmailArgs = {
  bookFrom?: Maybe<Scalars["String"]>;
  bookTo?: Maybe<Scalars["String"]>;
  firstname?: Maybe<Scalars["String"]>;
  price?: Maybe<Scalars["Int"]>;
  receiverEmail?: Maybe<Scalars["String"]>;
  surname?: Maybe<Scalars["String"]>;
};

export type MutationsAuthUserArgs = {
  code?: Maybe<Scalars["String"]>;
};

export type MutationsUpdateUserArgs = {
  userData?: Maybe<UserInput>;
};

export type MutationsVerifyTokenArgs = {
  token?: Maybe<Scalars["String"]>;
};

export type MutationsRefreshTokenArgs = {
  token?: Maybe<Scalars["String"]>;
};

export type MutationsCreateArchivedocumentArgs = {
  date?: Maybe<Scalars["DateTime"]>;
  fileLocation?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
  typeDoc?: Maybe<Scalars["String"]>;
  webLink?: Maybe<Scalars["String"]>;
};

export type MutationsUpdateArchivedocumentArgs = {
  date?: Maybe<Scalars["DateTime"]>;
  fileLocation?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["ID"]>;
  title?: Maybe<Scalars["String"]>;
  typeDoc?: Maybe<Scalars["String"]>;
  webLink?: Maybe<Scalars["String"]>;
};

export type MutationsDeleteArchivedocumentArgs = {
  id?: Maybe<Scalars["ID"]>;
};

export type MutationsCreateEventArgs = {
  eventData: CreateEventInput;
};

export type MutationsUpdateEventArgs = {
  eventData?: Maybe<UpdateEventInput>;
  id: Scalars["ID"];
};

export type MutationsEventSignUpArgs = {
  data?: Maybe<EventSignUpInput>;
  eventId: Scalars["ID"];
};

export type MutationsEventSignOffArgs = {
  eventId: Scalars["ID"];
};

export type MutationsAdminEventSignOffArgs = {
  eventId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type MutationsDeleteEventArgs = {
  id?: Maybe<Scalars["ID"]>;
};

export type MutationsCreateCategoryArgs = {
  categoryData: CategoryInput;
};

export type MutationsUpdateCategoryArgs = {
  categoryData?: Maybe<CategoryInput>;
  id: Scalars["ID"];
};

export type MutationsDeleteCategoryArgs = {
  id?: Maybe<Scalars["ID"]>;
};

export type MutationsSendEventMailsArgs = {
  content?: Maybe<Scalars["String"]>;
  eventId: Scalars["ID"];
  receiverEmails?: Maybe<Array<Maybe<Scalars["String"]>>>;
  subject?: Maybe<Scalars["String"]>;
};

export type CreateQuestion = {
  __typename?: "CreateQuestion";
  ok?: Maybe<Scalars["Boolean"]>;
  question?: Maybe<QuestionType>;
};

export type CreateQuestionInput = {
  questionType?: Maybe<QuestionTypeEnum>;
  question: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  formId: Scalars["ID"];
};

export enum QuestionTypeEnum {
  Paragraph = "PARAGRAPH",
  ShortAnswer = "SHORT_ANSWER",
  MultipleChoice = "MULTIPLE_CHOICE",
  Checkboxes = "CHECKBOXES",
  Dropdown = "DROPDOWN",
  Slider = "SLIDER",
  FileUpload = "FILE_UPLOAD",
}

export type UpdateQuestion = {
  __typename?: "UpdateQuestion";
  ok?: Maybe<Scalars["Boolean"]>;
  question?: Maybe<QuestionType>;
};

export type BaseQuestionInput = {
  questionType?: Maybe<QuestionTypeEnum>;
  question?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
};

export type DeleteQuestion = {
  __typename?: "DeleteQuestion";
  ok?: Maybe<Scalars["Boolean"]>;
  deletedId?: Maybe<Scalars["ID"]>;
};

export type CreateForm = {
  __typename?: "CreateForm";
  form?: Maybe<FormType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type CreateFormInput = {
  name: Scalars["String"];
  organizationId?: Maybe<Scalars["ID"]>;
  description?: Maybe<Scalars["String"]>;
};

export type UpdateForm = {
  __typename?: "UpdateForm";
  form?: Maybe<FormType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type BaseFormInput = {
  name?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["ID"]>;
  description?: Maybe<Scalars["String"]>;
};

export type DeleteForm = {
  __typename?: "DeleteForm";
  deletedId?: Maybe<Scalars["ID"]>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type DeleteAnswer = {
  __typename?: "DeleteAnswer";
  ok?: Maybe<Scalars["Boolean"]>;
  deletedUuid?: Maybe<Scalars["ID"]>;
};

export type SubmitOrUpdateAnswers = {
  __typename?: "SubmitOrUpdateAnswers";
  ok?: Maybe<Scalars["Boolean"]>;
};

export type AnswerInput = {
  questionId: Scalars["ID"];
  answer: Scalars["String"];
};

export type DeleteAnswersToForm = {
  __typename?: "DeleteAnswersToForm";
  ok?: Maybe<Scalars["Boolean"]>;
};

export type CreateUpdateAndDeleteOptions = {
  __typename?: "CreateUpdateAndDeleteOptions";
  ok?: Maybe<Scalars["Boolean"]>;
  options?: Maybe<Array<Maybe<OptionType>>>;
};

export type OptionInput = {
  answer: Scalars["String"];
  id?: Maybe<Scalars["ID"]>;
};

/** Creates a new listing */
export type CreateListing = {
  __typename?: "CreateListing";
  ok?: Maybe<Scalars["Boolean"]>;
  listing?: Maybe<ListingType>;
};

export type CreateListingInput = {
  title: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  startDatetime?: Maybe<Scalars["DateTime"]>;
  endDatetime?: Maybe<Scalars["DateTime"]>;
  deadline: Scalars["DateTime"];
  url?: Maybe<Scalars["String"]>;
  organizationId: Scalars["ID"];
  formId?: Maybe<Scalars["ID"]>;
};

export type UpdateListing = {
  __typename?: "UpdateListing";
  listing?: Maybe<ListingType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type BaseListingInput = {
  title?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  startDatetime?: Maybe<Scalars["DateTime"]>;
  endDatetime?: Maybe<Scalars["DateTime"]>;
  deadline?: Maybe<Scalars["DateTime"]>;
  url?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["ID"]>;
  formId?: Maybe<Scalars["ID"]>;
};

/** Deletes the listing with the given ID */
export type DeleteListing = {
  __typename?: "DeleteListing";
  ok?: Maybe<Scalars["Boolean"]>;
  listingId?: Maybe<Scalars["ID"]>;
};

export type CreateOrganization = {
  __typename?: "CreateOrganization";
  organization?: Maybe<OrganizationType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type OrganizationInput = {
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  parentId?: Maybe<Scalars["ID"]>;
};

export type UpdateOrganization = {
  __typename?: "UpdateOrganization";
  organization?: Maybe<OrganizationType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type DeleteOrganization = {
  __typename?: "DeleteOrganization";
  organization?: Maybe<OrganizationType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type CreateRole = {
  __typename?: "CreateRole";
  role?: Maybe<RoleType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type RoleInput = {
  name?: Maybe<Scalars["String"]>;
};

export type AssignMembership = {
  __typename?: "AssignMembership";
  membership?: Maybe<MembershipType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type MembershipInput = {
  userId?: Maybe<Scalars["ID"]>;
  organizationId?: Maybe<Scalars["ID"]>;
  roleId?: Maybe<Scalars["ID"]>;
};

export type CreateBooking = {
  __typename?: "CreateBooking";
  ok?: Maybe<Scalars["Boolean"]>;
  booking?: Maybe<BookingType>;
};

export type UpdateBooking = {
  __typename?: "UpdateBooking";
  ok?: Maybe<Scalars["Boolean"]>;
  booking?: Maybe<BookingType>;
};

export type DeleteBooking = {
  __typename?: "DeleteBooking";
  ok?: Maybe<Scalars["Boolean"]>;
};

export type SendEmail = {
  __typename?: "SendEmail";
  ok?: Maybe<Scalars["Boolean"]>;
};

export type AuthUser = {
  __typename?: "AuthUser";
  token?: Maybe<Scalars["String"]>;
  user?: Maybe<UserType>;
  isIndokStudent?: Maybe<Scalars["Boolean"]>;
  idToken?: Maybe<Scalars["String"]>;
};

export type UpdateUser = {
  __typename?: "UpdateUser";
  user?: Maybe<UserType>;
};

export type UserInput = {
  email?: Maybe<Scalars["String"]>;
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  graduationYear?: Maybe<Scalars["Int"]>;
  phoneNumber?: Maybe<Scalars["String"]>;
  allergies?: Maybe<Scalars["String"]>;
};

export type Verify = {
  __typename?: "Verify";
  payload: Scalars["GenericScalar"];
};

export type Refresh = {
  __typename?: "Refresh";
  payload: Scalars["GenericScalar"];
  refreshExpiresIn: Scalars["Int"];
  token: Scalars["String"];
};

export type DeleteJsonWebTokenCookie = {
  __typename?: "DeleteJSONWebTokenCookie";
  deleted: Scalars["Boolean"];
};

export type GetIdToken = {
  __typename?: "GetIDToken";
  idToken: Scalars["String"];
};

export type CreateArchiveDocument = {
  __typename?: "CreateArchiveDocument";
  ok?: Maybe<Scalars["Boolean"]>;
  arhiveDocument?: Maybe<ArchiveDocumentType>;
};

export type UpdateArchiveDocument = {
  __typename?: "UpdateArchiveDocument";
  ok?: Maybe<Scalars["Boolean"]>;
  event?: Maybe<ArchiveDocumentType>;
};

export type DeleteArchiveDocument = {
  __typename?: "DeleteArchiveDocument";
  ok?: Maybe<Scalars["Boolean"]>;
  archiveDocument?: Maybe<ArchiveDocumentType>;
};

export type CreateEvent = {
  __typename?: "CreateEvent";
  ok?: Maybe<Scalars["Boolean"]>;
  event?: Maybe<EventType>;
};

export type CreateEventInput = {
  title: Scalars["String"];
  description: Scalars["String"];
  startTime: Scalars["DateTime"];
  endTime?: Maybe<Scalars["DateTime"]>;
  location?: Maybe<Scalars["String"]>;
  categoryId?: Maybe<Scalars["ID"]>;
  image?: Maybe<Scalars["String"]>;
  isAttendable: Scalars["Boolean"];
  deadline?: Maybe<Scalars["DateTime"]>;
  signupOpenDate?: Maybe<Scalars["DateTime"]>;
  availableSlots?: Maybe<Scalars["Int"]>;
  price?: Maybe<Scalars["Float"]>;
  shortDescription?: Maybe<Scalars["String"]>;
  hasExtraInformation?: Maybe<Scalars["Boolean"]>;
  contactEmail?: Maybe<Scalars["String"]>;
  bindingSignup?: Maybe<Scalars["Boolean"]>;
  allowedGradeYears?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  organizationId: Scalars["ID"];
};

export type UpdateEvent = {
  __typename?: "UpdateEvent";
  ok?: Maybe<Scalars["Boolean"]>;
  event?: Maybe<EventType>;
};

export type UpdateEventInput = {
  title?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  startTime?: Maybe<Scalars["DateTime"]>;
  endTime?: Maybe<Scalars["DateTime"]>;
  location?: Maybe<Scalars["String"]>;
  categoryId?: Maybe<Scalars["ID"]>;
  image?: Maybe<Scalars["String"]>;
  isAttendable?: Maybe<Scalars["Boolean"]>;
  deadline?: Maybe<Scalars["DateTime"]>;
  signupOpenDate?: Maybe<Scalars["DateTime"]>;
  availableSlots?: Maybe<Scalars["Int"]>;
  price?: Maybe<Scalars["Float"]>;
  shortDescription?: Maybe<Scalars["String"]>;
  hasExtraInformation?: Maybe<Scalars["Boolean"]>;
  contactEmail?: Maybe<Scalars["String"]>;
  bindingSignup?: Maybe<Scalars["Boolean"]>;
  allowedGradeYears?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  organizationId?: Maybe<Scalars["ID"]>;
};

export type EventSignUp = {
  __typename?: "EventSignUp";
  isFull?: Maybe<Scalars["Boolean"]>;
  event?: Maybe<EventType>;
};

export type EventSignUpInput = {
  extraInformation?: Maybe<Scalars["String"]>;
};

export type EventSignOff = {
  __typename?: "EventSignOff";
  isFull?: Maybe<Scalars["Boolean"]>;
  event?: Maybe<EventType>;
};

export type AdminEventSignOff = {
  __typename?: "AdminEventSignOff";
  event?: Maybe<EventType>;
};

export type DeleteEvent = {
  __typename?: "DeleteEvent";
  ok?: Maybe<Scalars["Boolean"]>;
  event?: Maybe<EventType>;
};

export type CreateCategory = {
  __typename?: "CreateCategory";
  ok?: Maybe<Scalars["Boolean"]>;
  category?: Maybe<CategoryType>;
};

export type CategoryInput = {
  name?: Maybe<Scalars["String"]>;
};

export type UpdateCategory = {
  __typename?: "UpdateCategory";
  ok?: Maybe<Scalars["Boolean"]>;
  category?: Maybe<CategoryType>;
};

export type DeleteCategory = {
  __typename?: "DeleteCategory";
  ok?: Maybe<Scalars["Boolean"]>;
  category?: Maybe<CategoryType>;
};

export type SendEventEmails = {
  __typename?: "SendEventEmails";
  ok?: Maybe<Scalars["Boolean"]>;
};

export type AllEventCategoriesQueryVariables = Exact<{ [key: string]: never }>;

export type AllEventCategoriesQuery = { __typename?: "Queries" } & {
  allCategories?: Maybe<Array<Maybe<{ __typename?: "CategoryType" } & EventCategoryFragment>>>;
};

export type EventCategoryFragment = { __typename?: "CategoryType" } & Pick<CategoryType, "id" | "name">;

export type EventCategoryQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type EventCategoryQuery = { __typename?: "Queries" } & {
  category?: Maybe<{ __typename?: "CategoryType" } & EventCategoryFragment>;
};

export type AllEventsQueryVariables = Exact<{
  organization?: Maybe<Scalars["String"]>;
  category?: Maybe<Scalars["String"]>;
  startTime?: Maybe<Scalars["DateTime"]>;
  endTime?: Maybe<Scalars["DateTime"]>;
}>;

export type AllEventsQuery = { __typename?: "Queries" } & {
  allEvents?: Maybe<Array<Maybe<{ __typename?: "EventType" } & EventFragment>>>;
};

export type EventFragment = { __typename?: "EventType" } & Pick<
  EventType,
  | "id"
  | "title"
  | "startTime"
  | "endTime"
  | "location"
  | "description"
  | "image"
  | "isAttendable"
  | "deadline"
  | "price"
  | "shortDescription"
  | "signupOpenDate"
  | "isFull"
  | "hasExtraInformation"
  | "allowedGradeYears"
  | "contactEmail"
  | "bindingSignup"
> & {
    organization: { __typename?: "OrganizationType" } & OrganizationFragment;
    category?: Maybe<{ __typename?: "CategoryType" } & EventCategoryFragment>;
    publisher?: Maybe<
      { __typename?: "UserType" } & Pick<
        UserType,
        "id" | "username" | "email" | "firstName" | "lastName" | "dateJoined"
      >
    >;
    userAttendance?: Maybe<
      { __typename?: "UserAttendingType" } & Pick<UserAttendingType, "isSignedUp" | "isOnWaitingList">
    >;
  };

export type EventQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type EventQuery = { __typename?: "Queries" } & { event?: Maybe<{ __typename?: "EventType" } & EventFragment> };

export type EventFilteredOrganizationsQueryVariables = Exact<{ [key: string]: never }>;

export type EventFilteredOrganizationsQuery = { __typename?: "Queries" } & {
  eventFilteredOrganizations?: Maybe<
    Array<
      Maybe<
        { __typename?: "OrganizationType" } & Pick<OrganizationType, "id" | "name" | "color"> & {
            children: Array<{ __typename?: "OrganizationType" } & Pick<OrganizationType, "id" | "name">>;
          }
      >
    >
  >;
};

export type OrganizationFragment = { __typename?: "OrganizationType" } & Pick<
  OrganizationType,
  "id" | "name" | "slug" | "description" | "color"
> & {
    parent?: Maybe<{ __typename?: "OrganizationType" } & Pick<OrganizationType, "id" | "name">>;
    children: Array<{ __typename?: "OrganizationType" } & Pick<OrganizationType, "id" | "name">>;
  };

export type AuthUserMutationVariables = Exact<{
  code: Scalars["String"];
}>;

export type AuthUserMutation = { __typename?: "Mutations" } & {
  authUser?: Maybe<
    { __typename?: "AuthUser" } & Pick<AuthUser, "token" | "isIndokStudent" | "idToken"> & {
        user?: Maybe<{ __typename?: "UserType" } & UserFragment>;
      }
  >;
};

export type DeleteTokenCookieMutationVariables = Exact<{ [key: string]: never }>;

export type DeleteTokenCookieMutation = { __typename?: "Mutations" } & {
  deleteTokenCookie?: Maybe<{ __typename?: "DeleteJSONWebTokenCookie" } & Pick<DeleteJsonWebTokenCookie, "deleted">>;
};

export type UserFragment = { __typename?: "UserType" } & Pick<
  UserType,
  | "id"
  | "feideEmail"
  | "email"
  | "username"
  | "firstName"
  | "lastName"
  | "dateJoined"
  | "graduationYear"
  | "gradeYear"
  | "allergies"
  | "phoneNumber"
  | "firstLogin"
> & {
    events?: Maybe<Array<Maybe<{ __typename?: "EventType" } & Pick<EventType, "id">>>>;
    organizations: Array<{ __typename?: "OrganizationType" } & OrganizationFragment>;
  };

export type GetUserQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserQuery = { __typename?: "Queries" } & { user?: Maybe<{ __typename?: "UserType" } & UserFragment> };

export const OrganizationFragmentDoc = gql`
  fragment organization on OrganizationType {
    id
    name
    slug
    description
    color
    parent {
      id
      name
    }
    children {
      id
      name
    }
  }
`;
export const EventCategoryFragmentDoc = gql`
  fragment eventCategory on CategoryType {
    id
    name
  }
`;
export const EventFragmentDoc = gql`
  fragment event on EventType {
    id
    title
    startTime
    endTime
    location
    description
    organization {
      ...organization
    }
    category {
      ...eventCategory
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
    contactEmail
    bindingSignup
  }
  ${OrganizationFragmentDoc}
  ${EventCategoryFragmentDoc}
`;
export const UserFragmentDoc = gql`
  fragment user on UserType {
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
      ...organization
    }
  }
  ${OrganizationFragmentDoc}
`;
export const AllEventCategoriesDocument = gql`
  query allEventCategories {
    allCategories {
      ...eventCategory
    }
  }
  ${EventCategoryFragmentDoc}
`;

/**
 * __useAllEventCategoriesQuery__
 *
 * To run a query within a React component, call `useAllEventCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllEventCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllEventCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllEventCategoriesQuery(
  baseOptions?: Apollo.QueryHookOptions<AllEventCategoriesQuery, AllEventCategoriesQueryVariables>
) {
  return Apollo.useQuery<AllEventCategoriesQuery, AllEventCategoriesQueryVariables>(
    AllEventCategoriesDocument,
    baseOptions
  );
}
export function useAllEventCategoriesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AllEventCategoriesQuery, AllEventCategoriesQueryVariables>
) {
  return Apollo.useLazyQuery<AllEventCategoriesQuery, AllEventCategoriesQueryVariables>(
    AllEventCategoriesDocument,
    baseOptions
  );
}
export type AllEventCategoriesQueryHookResult = ReturnType<typeof useAllEventCategoriesQuery>;
export type AllEventCategoriesLazyQueryHookResult = ReturnType<typeof useAllEventCategoriesLazyQuery>;
export type AllEventCategoriesQueryResult = Apollo.QueryResult<
  AllEventCategoriesQuery,
  AllEventCategoriesQueryVariables
>;
export const EventCategoryDocument = gql`
  query EventCategory($id: ID!) {
    category(id: $id) {
      ...eventCategory
    }
  }
  ${EventCategoryFragmentDoc}
`;

/**
 * __useEventCategoryQuery__
 *
 * To run a query within a React component, call `useEventCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEventCategoryQuery(
  baseOptions: Apollo.QueryHookOptions<EventCategoryQuery, EventCategoryQueryVariables>
) {
  return Apollo.useQuery<EventCategoryQuery, EventCategoryQueryVariables>(EventCategoryDocument, baseOptions);
}
export function useEventCategoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EventCategoryQuery, EventCategoryQueryVariables>
) {
  return Apollo.useLazyQuery<EventCategoryQuery, EventCategoryQueryVariables>(EventCategoryDocument, baseOptions);
}
export type EventCategoryQueryHookResult = ReturnType<typeof useEventCategoryQuery>;
export type EventCategoryLazyQueryHookResult = ReturnType<typeof useEventCategoryLazyQuery>;
export type EventCategoryQueryResult = Apollo.QueryResult<EventCategoryQuery, EventCategoryQueryVariables>;
export const AllEventsDocument = gql`
  query AllEvents($organization: String, $category: String, $startTime: DateTime, $endTime: DateTime) {
    allEvents(organization: $organization, category: $category, startTime: $startTime, endTime: $endTime) {
      ...event
    }
  }
  ${EventFragmentDoc}
`;

/**
 * __useAllEventsQuery__
 *
 * To run a query within a React component, call `useAllEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllEventsQuery({
 *   variables: {
 *      organization: // value for 'organization'
 *      category: // value for 'category'
 *      startTime: // value for 'startTime'
 *      endTime: // value for 'endTime'
 *   },
 * });
 */
export function useAllEventsQuery(baseOptions?: Apollo.QueryHookOptions<AllEventsQuery, AllEventsQueryVariables>) {
  return Apollo.useQuery<AllEventsQuery, AllEventsQueryVariables>(AllEventsDocument, baseOptions);
}
export function useAllEventsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AllEventsQuery, AllEventsQueryVariables>
) {
  return Apollo.useLazyQuery<AllEventsQuery, AllEventsQueryVariables>(AllEventsDocument, baseOptions);
}
export type AllEventsQueryHookResult = ReturnType<typeof useAllEventsQuery>;
export type AllEventsLazyQueryHookResult = ReturnType<typeof useAllEventsLazyQuery>;
export type AllEventsQueryResult = Apollo.QueryResult<AllEventsQuery, AllEventsQueryVariables>;
export const EventDocument = gql`
  query Event($id: ID!) {
    event(id: $id) {
      ...event
    }
  }
  ${EventFragmentDoc}
`;

/**
 * __useEventQuery__
 *
 * To run a query within a React component, call `useEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEventQuery(baseOptions: Apollo.QueryHookOptions<EventQuery, EventQueryVariables>) {
  return Apollo.useQuery<EventQuery, EventQueryVariables>(EventDocument, baseOptions);
}
export function useEventLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventQuery, EventQueryVariables>) {
  return Apollo.useLazyQuery<EventQuery, EventQueryVariables>(EventDocument, baseOptions);
}
export type EventQueryHookResult = ReturnType<typeof useEventQuery>;
export type EventLazyQueryHookResult = ReturnType<typeof useEventLazyQuery>;
export type EventQueryResult = Apollo.QueryResult<EventQuery, EventQueryVariables>;
export const EventFilteredOrganizationsDocument = gql`
  query eventFilteredOrganizations {
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

/**
 * __useEventFilteredOrganizationsQuery__
 *
 * To run a query within a React component, call `useEventFilteredOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventFilteredOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventFilteredOrganizationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useEventFilteredOrganizationsQuery(
  baseOptions?: Apollo.QueryHookOptions<EventFilteredOrganizationsQuery, EventFilteredOrganizationsQueryVariables>
) {
  return Apollo.useQuery<EventFilteredOrganizationsQuery, EventFilteredOrganizationsQueryVariables>(
    EventFilteredOrganizationsDocument,
    baseOptions
  );
}
export function useEventFilteredOrganizationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EventFilteredOrganizationsQuery, EventFilteredOrganizationsQueryVariables>
) {
  return Apollo.useLazyQuery<EventFilteredOrganizationsQuery, EventFilteredOrganizationsQueryVariables>(
    EventFilteredOrganizationsDocument,
    baseOptions
  );
}
export type EventFilteredOrganizationsQueryHookResult = ReturnType<typeof useEventFilteredOrganizationsQuery>;
export type EventFilteredOrganizationsLazyQueryHookResult = ReturnType<typeof useEventFilteredOrganizationsLazyQuery>;
export type EventFilteredOrganizationsQueryResult = Apollo.QueryResult<
  EventFilteredOrganizationsQuery,
  EventFilteredOrganizationsQueryVariables
>;
export const AuthUserDocument = gql`
  mutation AuthUser($code: String!) {
    authUser(code: $code) {
      token
      user {
        ...user
      }
      isIndokStudent
      idToken
    }
  }
  ${UserFragmentDoc}
`;
export type AuthUserMutationFn = Apollo.MutationFunction<AuthUserMutation, AuthUserMutationVariables>;

/**
 * __useAuthUserMutation__
 *
 * To run a mutation, you first call `useAuthUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuthUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authUserMutation, { data, loading, error }] = useAuthUserMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useAuthUserMutation(
  baseOptions?: Apollo.MutationHookOptions<AuthUserMutation, AuthUserMutationVariables>
) {
  return Apollo.useMutation<AuthUserMutation, AuthUserMutationVariables>(AuthUserDocument, baseOptions);
}
export type AuthUserMutationHookResult = ReturnType<typeof useAuthUserMutation>;
export type AuthUserMutationResult = Apollo.MutationResult<AuthUserMutation>;
export type AuthUserMutationOptions = Apollo.BaseMutationOptions<AuthUserMutation, AuthUserMutationVariables>;
export const DeleteTokenCookieDocument = gql`
  mutation DeleteTokenCookie {
    deleteTokenCookie {
      deleted
    }
  }
`;
export type DeleteTokenCookieMutationFn = Apollo.MutationFunction<
  DeleteTokenCookieMutation,
  DeleteTokenCookieMutationVariables
>;

/**
 * __useDeleteTokenCookieMutation__
 *
 * To run a mutation, you first call `useDeleteTokenCookieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTokenCookieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTokenCookieMutation, { data, loading, error }] = useDeleteTokenCookieMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteTokenCookieMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteTokenCookieMutation, DeleteTokenCookieMutationVariables>
) {
  return Apollo.useMutation<DeleteTokenCookieMutation, DeleteTokenCookieMutationVariables>(
    DeleteTokenCookieDocument,
    baseOptions
  );
}
export type DeleteTokenCookieMutationHookResult = ReturnType<typeof useDeleteTokenCookieMutation>;
export type DeleteTokenCookieMutationResult = Apollo.MutationResult<DeleteTokenCookieMutation>;
export type DeleteTokenCookieMutationOptions = Apollo.BaseMutationOptions<
  DeleteTokenCookieMutation,
  DeleteTokenCookieMutationVariables
>;
export const GetUserDocument = gql`
  query GetUser {
    user {
      ...user
    }
  }
  ${UserFragmentDoc}
`;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserQuery(baseOptions?: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
  return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
}
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
  return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
}
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
