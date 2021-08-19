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

/**
 * HelperType: Contains a JWT string (JSON-Web-Token)
 *     for the authentication of the user.
 */
export type AuthToken = {
  __typename?: 'AuthToken';
  token: Scalars['String'];
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};


export type Household = {
  __typename?: 'Household';
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  /** A list of all invite's for this household. */
  invites?: Maybe<Array<Maybe<Invite>>>;
  /** A list of all user's which have access to this household. */
  members?: Maybe<Array<Maybe<User>>>;
  name: Scalars['String'];
  /** The user which has management right's over the household. */
  owner?: Maybe<User>;
  ownerId: Scalars['String'];
  /** A list of all payment's which where booked into this household. */
  payments?: Maybe<Array<Maybe<Payment>>>;
  /** A list of all recurring payment's which will be booked into this household. */
  recurringPayments?: Maybe<Array<Maybe<RecurringPayment>>>;
  updatedAt: Scalars['DateTime'];
};


export type HouseholdPaymentsArgs = {
  endDate?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  startDate?: Maybe<Scalars['String']>;
};


export type HouseholdRecurringPaymentsArgs = {
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};

/** HelperType: The interval of how often the payment should be booked. */
export enum Interval {
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  Quarterly = 'QUARTERLY',
  Weekly = 'WEEKLY',
  Yearly = 'YEARLY'
}

export type Invite = {
  __typename?: 'Invite';
  createdAt: Scalars['DateTime'];
  /** The household in which the person was invited. */
  household?: Maybe<Household>;
  householdId: Scalars['String'];
  id: Scalars['String'];
  /** The email of the person which was invited. */
  invitedEmail: Scalars['String'];
  /** The link which can be used from invited person to use the invite. */
  link: Scalars['String'];
  /** The user which sent the invite. (Referrer) */
  sender?: Maybe<User>;
  senderId: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  validUntil: Scalars['DateTime'];
  wasUsed: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * This mutation should be called regularly (at least once a day)
   *         by a CRON-Job or something of this kind. To book all recurringPayment
   *         which need to be booked.
   */
  bookRecurringPayments?: Maybe<Array<Maybe<RecurringPayment>>>;
  /** Create a new category. Can just be called by an admin. */
  createCategory: Category;
  /** Create a new payment. Need to be logged in. */
  createPayment: Payment;
  /** Deletes a user and removes all references to it. Need to be logged in. */
  deleteUser: User;
  /**
   * This mutation takes the email and password of an existing user.
   *       Returns a JWT (JSON-Web-Token) for further authentication with the graphql-api.
   */
  login: AuthToken;
  /** Remove a new category. Can just be called by an admin. */
  removeCategory: Category;
  /**
   * This mutation takes the values for a new user as arguments.
   *       Saves them and returns a JWT (JSON-Web-Token)
   *       for further authentication with the graphql-api.
   */
  signup: AuthToken;
};


export type MutationBookRecurringPaymentsArgs = {
  secretKey: Scalars['String'];
};


export type MutationCreateCategoryArgs = {
  name: Scalars['String'];
};


export type MutationCreatePaymentArgs = {
  categoryId: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  householdId: Scalars['String'];
  name: Scalars['String'];
  value: Scalars['Int'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRemoveCategoryArgs = {
  name: Scalars['String'];
};


export type MutationSignupArgs = {
  email: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  password: Scalars['String'];
};

/** A payment is a NOT changeable booking of a specific value. */
export type Payment = {
  __typename?: 'Payment';
  /** The category in which the user placed it. (e.g. food, income) */
  category?: Maybe<Category>;
  categoryId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  /** The household in which the payment was booked. */
  household?: Maybe<Household>;
  householdId: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  /** The user from which the payment was booked. */
  user?: Maybe<User>;
  userId?: Maybe<Scalars['String']>;
  value: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  /**
   * Returns all households available in the database.
   *       Can only be queried by admin accounts.
   */
  allHouseholds?: Maybe<Array<Maybe<Household>>>;
  /** All available categories. Filterable by id or name via arguments */
  categories?: Maybe<Array<Maybe<Category>>>;
  household?: Maybe<Household>;
  households?: Maybe<Array<Maybe<Household>>>;
  /** Returns the data of the currently logged in user. */
  me?: Maybe<User>;
  recurringPayments?: Maybe<Array<Maybe<RecurringPayment>>>;
};


export type QueryCategoriesArgs = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};


export type QueryHouseholdArgs = {
  id?: Maybe<Scalars['String']>;
};

export type RecurringPayment = {
  __typename?: 'RecurringPayment';
  /** The category in which the payment will be booked. */
  category?: Maybe<Category>;
  categoryId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['DateTime']>;
  /** The household in which the payment will be booked. */
  household?: Maybe<Household>;
  householdId: Scalars['String'];
  id: Scalars['String'];
  interval: Interval;
  /** The date of when this recurring payment was last booked. */
  lastBooking?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  /** The date of when this recurring payment should be booked next. */
  nextBooking?: Maybe<Scalars['DateTime']>;
  /** All payment's which where booked by this recurring payment. */
  payments?: Maybe<Array<Maybe<Payment>>>;
  startDate: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  /** The user from whom the payment will be booked. */
  user?: Maybe<User>;
  userId?: Maybe<Scalars['String']>;
  value: Scalars['Float'];
};

/** A user is an account which can join households and create payments */
export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  firstname: Scalars['String'];
  /** The user's safely encrypted password */
  hashedPassword: Scalars['String'];
  /** The household's in which the user is a member. */
  households?: Maybe<Array<Maybe<Household>>>;
  id: Scalars['String'];
  /** The invite's which where send by the user. */
  invites?: Maybe<Array<Maybe<Invite>>>;
  /** The user's role. This could be extended to a complete role system in the future */
  isAdmin: Scalars['Boolean'];
  lastname: Scalars['String'];
  name: Scalars['String'];
  /** The household's in which the user is the current owner */
  ownedHouseholds?: Maybe<Array<Maybe<Household>>>;
  /** All payment's which where done by the user. */
  payments?: Maybe<Array<Maybe<Payment>>>;
  updatedAt: Scalars['DateTime'];
};
