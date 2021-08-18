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
  id: Scalars['String'];
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};


export type Household = {
  __typename?: 'Household';
  id: Scalars['String'];
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  ownerId: Scalars['String'];
  /** The user which has management right's over the household. */
  owner?: Maybe<User>;
  /** A list of all user's which have access to this household. */
  members?: Maybe<Array<Maybe<User>>>;
  /** A list of all invite's for this household. */
  invites?: Maybe<Array<Maybe<Invite>>>;
  /** A list of all payment's which where booked into this household. */
  payments?: Maybe<Array<Maybe<Payment>>>;
  /** A list of all recurring payment's which will be booked into this household. */
  recurringPayments?: Maybe<Array<Maybe<RecurringPayment>>>;
};


export type HouseholdPaymentsArgs = {
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type HouseholdRecurringPaymentsArgs = {
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};

/** HelperType: The interval of how often the payment should be booked. */
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
  /** The email of the person which was invited. */
  invitedEmail: Scalars['String'];
  /** The link which can be used from invited person to use the invite. */
  link: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  senderId: Scalars['String'];
  /** The user which sent the invite. (Referrer) */
  sender?: Maybe<User>;
  householdId: Scalars['String'];
  /** The household in which the person was invited. */
  household?: Maybe<Household>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * This mutation takes the values for a new user as arguments.
   *       Saves them and returns a JWT (JSON-Web-Token)
   *       for further authentication with the graphql-api.
   */
  signup: AuthToken;
  /**
   * This mutation takes the email and password of an existing user.
   *       Returns a JWT (JSON-Web-Token) for further authentication with the graphql-api.
   */
  login: AuthToken;
  /** Create a new category. Can just be called by an admin. */
  createCategory: Category;
  /** Remove a new category. Can just be called by an admin. */
  removeCategory: Category;
  /** Create a new payment. Need to be logged in. */
  createPayment: Payment;
  /**
   * This mutation should be called regularly (at least once a day)
   *         by a CRON-Job or something of this kind. To book all recurringPayment
   *         which need to be booked.
   */
  bookRecurringPayments?: Maybe<Array<Maybe<RecurringPayment>>>;
  /** Deletes a user and removes all references to it. Need to be logged in. */
  deleteUser: User;
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


export type MutationCreatePaymentArgs = {
  name: Scalars['String'];
  value: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  categoryId: Scalars['String'];
  householdId: Scalars['String'];
};


export type MutationBookRecurringPaymentsArgs = {
  secretKey: Scalars['String'];
};

/** A payment is a NOT changeable booking of a specific value. */
export type Payment = {
  __typename?: 'Payment';
  id: Scalars['String'];
  name: Scalars['String'];
  value: Scalars['Float'];
  description?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  categoryId: Scalars['String'];
  /** The category in which the user placed it. (e.g. food, income) */
  category?: Maybe<Category>;
  userId?: Maybe<Scalars['String']>;
  /** The user from which the payment was booked. */
  user?: Maybe<User>;
  householdId: Scalars['String'];
  /** The household in which the payment was booked. */
  household?: Maybe<Household>;
};

export type Query = {
  __typename?: 'Query';
  /** Returns the data of the currently logged in user. */
  me?: Maybe<User>;
  /** All available categories. Filterable by id or name via arguments */
  categories?: Maybe<Array<Maybe<Category>>>;
  /**
   * Returns all households available in the database.
   *       Can only be queried by admin accounts.
   */
  allHouseholds?: Maybe<Array<Maybe<Household>>>;
  households?: Maybe<Array<Maybe<Household>>>;
  household?: Maybe<Household>;
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
  id: Scalars['String'];
  name: Scalars['String'];
  value: Scalars['Float'];
  description?: Maybe<Scalars['String']>;
  interval: Interval;
  startDate: Scalars['DateTime'];
  endDate?: Maybe<Scalars['DateTime']>;
  /** The date of when this recurring payment was last booked. */
  lastBooking?: Maybe<Scalars['DateTime']>;
  /** The date of when this recurring payment should be booked next. */
  nextBooking?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  categoryId: Scalars['String'];
  /** The category in which the payment will be booked. */
  category?: Maybe<Category>;
  userId?: Maybe<Scalars['String']>;
  /** The user from whom the payment will be booked. */
  user?: Maybe<User>;
  householdId: Scalars['String'];
  /** The household in which the payment will be booked. */
  household?: Maybe<Household>;
  /** All payment's which where booked by this recurring payment. */
  payments?: Maybe<Array<Maybe<Payment>>>;
};

/** A user is an account which can join households and create payments */
export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  name: Scalars['String'];
  email: Scalars['String'];
  /** The user's safely encrypted password */
  hashedPassword: Scalars['String'];
  /** The user's role. This could be extended to a complete role system in the future */
  isAdmin: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  /** All payment's which where done by the user. */
  payments?: Maybe<Array<Maybe<Payment>>>;
  /** The household's in which the user is a member. */
  households?: Maybe<Array<Maybe<Household>>>;
  /** The invite's which where send by the user. */
  invites?: Maybe<Array<Maybe<Invite>>>;
  /** The household's in which the user is the current owner */
  ownedHouseholds?: Maybe<Array<Maybe<Household>>>;
};
