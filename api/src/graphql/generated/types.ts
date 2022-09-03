import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { User as UserModel, Permission as PermissionModel, Cabin as CabinModel, Booking as BookingModel } from '@prisma/client';
import { IContext } from '@/graphql/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: Date;
};

export type Booking = {
  readonly __typename: 'Booking';
  readonly cabin: Cabin;
  readonly email: Scalars['String'];
  readonly endDate: Scalars['DateTime'];
  readonly firstName: Scalars['String'];
  readonly id: Scalars['ID'];
  readonly lastName: Scalars['String'];
  readonly phoneNumber: Scalars['String'];
  readonly startDate: Scalars['DateTime'];
  readonly status: Status;
};

export type Cabin = {
  readonly __typename: 'Cabin';
  readonly externalPrice: Scalars['String'];
  readonly id: Scalars['ID'];
  readonly internalPrice: Scalars['String'];
  readonly name: Scalars['String'];
};

export type Mutation = {
  readonly __typename: 'Mutation';
  readonly authenticate: User;
  readonly createUser?: Maybe<User>;
  readonly logout: Scalars['Boolean'];
  readonly newBooking: Booking;
  readonly redirectUrl: Scalars['String'];
  readonly updateBookingStatus: Booking;
  readonly updateUser: User;
};


export type MutationAuthenticateArgs = {
  code: Scalars['String'];
};


export type MutationCreateUserArgs = {
  firstName: Scalars['String'];
};


export type MutationNewBookingArgs = {
  data: NewBookingInput;
};


export type MutationRedirectUrlArgs = {
  state?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateBookingStatusArgs = {
  id: Scalars['ID'];
  status: Status;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
  id: Scalars['ID'];
};

export type NewBookingInput = {
  readonly cabinId: Scalars['ID'];
  readonly email: Scalars['String'];
  readonly endDate: Scalars['DateTime'];
  readonly firstName: Scalars['String'];
  readonly lastName: Scalars['String'];
  readonly phoneNumber: Scalars['String'];
  readonly startDate: Scalars['DateTime'];
};

export type Permission = {
  readonly __typename: 'Permission';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

export type Query = {
  readonly __typename: 'Query';
  readonly hasPermission: Scalars['Boolean'];
  readonly user?: Maybe<User>;
  readonly users: ReadonlyArray<User>;
};


export type QueryHasPermissionArgs = {
  permission: Scalars['String'];
};

export enum Status {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type UpdateUserInput = {
  readonly allergies?: InputMaybe<Scalars['String']>;
  readonly firstName: Scalars['String'];
  readonly graduationYear?: InputMaybe<Scalars['Int']>;
  readonly lastName: Scalars['String'];
  readonly phoneNumber?: InputMaybe<Scalars['String']>;
};

export type User = {
  readonly __typename: 'User';
  readonly allergies?: Maybe<Scalars['String']>;
  readonly canUpdateYear: Scalars['Boolean'];
  readonly createdAt: Scalars['String'];
  readonly firstLogin: Scalars['Boolean'];
  readonly firstName: Scalars['String'];
  readonly graduationYear?: Maybe<Scalars['Int']>;
  readonly graduationYearUpdatedAt?: Maybe<Scalars['DateTime']>;
  readonly id: Scalars['ID'];
  readonly lastName: Scalars['String'];
  readonly permissions: ReadonlyArray<Permission>;
  readonly phoneNumber?: Maybe<Scalars['String']>;
  readonly username: Scalars['String'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Booking: ResolverTypeWrapper<BookingModel>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Cabin: ResolverTypeWrapper<CabinModel>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  NewBookingInput: NewBookingInput;
  Permission: ResolverTypeWrapper<PermissionModel>;
  Query: ResolverTypeWrapper<{}>;
  Status: Status;
  String: ResolverTypeWrapper<Scalars['String']>;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<UserModel>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Booking: BookingModel;
  Boolean: Scalars['Boolean'];
  Cabin: CabinModel;
  DateTime: Scalars['DateTime'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  NewBookingInput: NewBookingInput;
  Permission: PermissionModel;
  Query: {};
  String: Scalars['String'];
  UpdateUserInput: UpdateUserInput;
  User: UserModel;
}>;

export type BookingResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Booking'] = ResolversParentTypes['Booking']> = ResolversObject<{
  cabin?: Resolver<ResolversTypes['Cabin'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phoneNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CabinResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Cabin'] = ResolversParentTypes['Cabin']> = ResolversObject<{
  externalPrice?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  internalPrice?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  authenticate?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationAuthenticateArgs, 'code'>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'firstName'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  newBooking?: Resolver<ResolversTypes['Booking'], ParentType, ContextType, RequireFields<MutationNewBookingArgs, 'data'>>;
  redirectUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType, Partial<MutationRedirectUrlArgs>>;
  updateBookingStatus?: Resolver<ResolversTypes['Booking'], ParentType, ContextType, RequireFields<MutationUpdateBookingStatusArgs, 'id' | 'status'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'data' | 'id'>>;
}>;

export type PermissionResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Permission'] = ResolversParentTypes['Permission']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  hasPermission?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryHasPermissionArgs, 'permission'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  users?: Resolver<ReadonlyArray<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  allergies?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  canUpdateYear?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstLogin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  graduationYear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  graduationYearUpdatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  permissions?: Resolver<ReadonlyArray<ResolversTypes['Permission']>, ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = IContext> = ResolversObject<{
  Booking?: BookingResolvers<ContextType>;
  Cabin?: CabinResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Permission?: PermissionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

