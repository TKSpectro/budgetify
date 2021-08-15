import { gql } from '@apollo/client';
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
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
};

export type AuthToken = {
  __typename?: 'AuthToken';
  token: Scalars['String'];
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['String'];
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  payments?: Maybe<Array<Maybe<Payment>>>;
};


export type Household = {
  __typename?: 'Household';
  id: Scalars['String'];
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  ownerId: Scalars['String'];
  owner?: Maybe<User>;
  members?: Maybe<Array<Maybe<User>>>;
  invites?: Maybe<Array<Maybe<Invite>>>;
  payments?: Maybe<Array<Maybe<Payment>>>;
};

/** The interval of how often the payment should be booked */
export enum Interval {
  Daily = 'DAILY',
  Weekly = 'WEEKLY',
  Monthly = 'MONTHLY',
  Quarterly = 'QUARTERLY',
  Yearly = 'YEARLY'
}

export type Invite = {
  __typename?: 'Invite';
  id: Scalars['String'];
  validUntil: Scalars['DateTime'];
  wasUsed: Scalars['Boolean'];
  invitedEmail: Scalars['String'];
  link: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  senderId: Scalars['String'];
  sender?: Maybe<User>;
  householdId: Scalars['String'];
  household?: Maybe<Household>;
};

export type Mutation = {
  __typename?: 'Mutation';
  signup: AuthToken;
  login: AuthToken;
  createCategory: Category;
  removeCategory: Category;
  bookRecurringPayments?: Maybe<Array<Maybe<RecurringPayment>>>;
};


export type MutationSignupArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationCreateCategoryArgs = {
  name: Scalars['String'];
};


export type MutationRemoveCategoryArgs = {
  name: Scalars['String'];
};


export type MutationBookRecurringPaymentsArgs = {
  secretKey: Scalars['String'];
};

export type Payment = {
  __typename?: 'Payment';
  id: Scalars['String'];
  name: Scalars['String'];
  value: Scalars['Float'];
  description?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  categoryId: Scalars['String'];
  category?: Maybe<Category>;
  userId?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  householdId: Scalars['String'];
  household?: Maybe<Household>;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  categories: Array<Maybe<Category>>;
  category?: Maybe<Category>;
  households?: Maybe<Array<Maybe<Household>>>;
  household?: Maybe<Household>;
  recurringPayments?: Maybe<Array<Maybe<RecurringPayment>>>;
};


export type QueryCategoryArgs = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};


export type QueryHouseholdArgs = {
  id?: Maybe<Scalars['String']>;
};

export type RecurringPayment = {
  __typename?: 'RecurringPayment';
  id: Scalars['String'];
  name: Scalars['String'];
  value: Scalars['Float'];
  description?: Maybe<Scalars['String']>;
  interval: Interval;
  startDate: Scalars['DateTime'];
  endDate?: Maybe<Scalars['DateTime']>;
  lastBooking?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  categoryId: Scalars['String'];
  category?: Maybe<Category>;
  userId?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  householdId: Scalars['String'];
  household?: Maybe<Household>;
  payments?: Maybe<Array<Maybe<Payment>>>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  name: Scalars['String'];
  email: Scalars['String'];
  hashedPassword: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  payments?: Maybe<Array<Maybe<Payment>>>;
  households?: Maybe<Array<Maybe<Household>>>;
  invites?: Maybe<Array<Maybe<Invite>>>;
  ownedHouseholds?: Maybe<Array<Maybe<Household>>>;
};
