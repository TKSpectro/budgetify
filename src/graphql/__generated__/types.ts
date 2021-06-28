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

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['DateTime'];
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategory: Category;
  removeCategory: Category;
};

export type MutationCreateCategoryArgs = {
  name: Scalars['String'];
};

export type MutationRemoveCategoryArgs = {
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  categories: Array<Maybe<Category>>;
  category?: Maybe<Category>;
};

export type QueryCategoryArgs = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};
