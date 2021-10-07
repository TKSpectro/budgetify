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
  /** Date custom scalar type */
  DateTime: any;
  /** Money custom scalar type. Converts int to float with 2 decimals. */
  Money: any;
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

export type Group = {
  __typename?: 'Group';
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  /** A list of all invites to this group. */
  invites?: Maybe<Array<Maybe<Invite>>>;
  /** A list of all user's which have access to this group. */
  members?: Maybe<Array<Maybe<User>>>;
  name: Scalars['String'];
  /** The users which have management right's over the group. */
  owners?: Maybe<Array<Maybe<User>>>;
  /** A list of all thresholds hooked to this group. */
  thresholds?: Maybe<Array<Maybe<Threshold>>>;
  /** The count of all transactions in this group. */
  transactionCount?: Maybe<Scalars['Int']>;
  /** A list of all transactions which happened in this group. */
  transactions?: Maybe<Array<Maybe<GroupTransaction>>>;
  updatedAt: Scalars['DateTime'];
  value: Scalars['Money'];
};


export type GroupTransactionsArgs = {
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};

export type GroupTransaction = {
  __typename?: 'GroupTransaction';
  createdAt: Scalars['DateTime'];
  /** The group in which this transaction was booked. */
  group?: Maybe<Group>;
  groupId: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  /** All users which ate some of the bought food from this transaction. */
  participants?: Maybe<Array<Maybe<User>>>;
  type: TransactionType;
  updatedAt: Scalars['DateTime'];
  /** The user which booked the transaction. */
  user?: Maybe<User>;
  userId: Scalars['String'];
  value: Scalars['Money'];
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
  /** All payment values summed up. */
  sumOfAllPayments?: Maybe<Scalars['Money']>;
  updatedAt: Scalars['DateTime'];
};


export type HouseholdPaymentsArgs = {
  calcBeforeStartDate?: Maybe<Scalars['Boolean']>;
  endDate?: Maybe<Scalars['DateTime']>;
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  startDate?: Maybe<Scalars['DateTime']>;
};


export type HouseholdRecurringPaymentsArgs = {
  id?: Maybe<Scalars['String']>;
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
  /** The group in which the person was invited. */
  group?: Maybe<Group>;
  groupId?: Maybe<Scalars['String']>;
  /** The household in which the person was invited. */
  household?: Maybe<Household>;
  householdId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  /** The email of the person which was invited. */
  invitedEmail: Scalars['String'];
  /** The user which sent the invite. (Referrer) */
  sender?: Maybe<User>;
  senderId: Scalars['String'];
  /** The token which can be used from invited person to use the invite. */
  token: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  validUntil: Scalars['DateTime'];
  wasUsed: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Add a new owner to a group. Need to be logged in and be owner of the group. */
  addGroupOwner: Group;
  /**
   * This mutation should be called regularly (at least once a day)
   *         by a CRON-Job or something of this kind. To book all recurringPayment
   *         which need to be booked.
   */
  bookRecurringPayments?: Maybe<Array<Maybe<RecurringPayment>>>;
  /** Change a users password. */
  changePassword: User;
  /** Create a new category. Can just be called by an admin. */
  createCategory: Category;
  /** Creates a new group with the given arguments and returns it. */
  createGroup?: Maybe<Group>;
  /** Create a new invite. Need to be logged in. */
  createGroupInvite: Invite;
  /** Creates a new transaction in the specified group with the given arguments and returns it. */
  createGroupTransaction?: Maybe<GroupTransaction>;
  /** Create a new household. Need to be logged. */
  createHousehold: Household;
  /** Create a new invite. Need to be logged in. */
  createInvite: Invite;
  /** Create a new payment. Need to be logged in. */
  createPayment: Payment;
  /** Create a new recurring payment. Need to be logged in. */
  createRecurringPayment: RecurringPayment;
  /** Create a new threshold. Need to be logged in and own group. */
  createThreshold: Threshold;
  /** Delete a existing group. Need to be logged in and owner of the group. */
  deleteGroup: Group;
  /** Remove a invite. Need to be logged in. */
  deleteInvite?: Maybe<Scalars['Boolean']>;
  /** Deletes a user by anonymizing his personal data. Need to be logged in. */
  deleteUser: User;
  /**
   * This mutation takes the email and password of an existing user.
   *       Returns a JWT (JSON-Web-Token) for further authentication with the graphql-api.
   */
  login: AuthToken;
  /** This mutation removes the authToken on the user side. */
  logout?: Maybe<Scalars['String']>;
  /** Remove a new category. Can just be called by an admin. */
  removeCategory: Category;
  /** Remove a member from the specified group. Need to be logged in and own the group. */
  removeGroupMember: Group;
  /** Remove a owner of a group. Need to be logged in and be owner of the group. */
  removeGroupOwner: Group;
  /** Remove a member from the specified household. Need to be logged in and own the household OR Request the removal for your own account. */
  removeHouseholdMember: Household;
  /** Remove a threshold. Need to be logged in and own group. */
  removeThreshold: Threshold;
  /** This mutation creates a otp for a user and sends it to the users email. */
  requestPasswordReset: Scalars['String'];
  /**
   * This mutation takes the values for a new user as arguments.
   *       Saves them and returns a JWT (JSON-Web-Token)
   *       for further authentication with the graphql-api.
   */
  signup: AuthToken;
  /** Update a already existing group. Need to be logged in and be owner of the group. */
  updateGroup: Group;
  /** Update a already existing household. Need to be logged in and owner of the household. */
  updateHousehold: Household;
  /** Update a new recurring payment. Need to be logged in. */
  updateRecurringPayment: RecurringPayment;
  /** Update a existing threshold. Need to be logged in and own group. */
  updateThreshold: Threshold;
  /** Updates a user with the given data. Need to be logged in. */
  updateUser: User;
  /** Use a invite. Logged in user gets added to the household or group specified in the invite. Need to be logged in. */
  useInvite?: Maybe<Invite>;
};


export type MutationAddGroupOwnerArgs = {
  groupId: Scalars['String'];
  ownerId?: Maybe<Scalars['String']>;
};


export type MutationBookRecurringPaymentsArgs = {
  secretKey: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  password: Scalars['String'];
  passwordRepeat: Scalars['String'];
};


export type MutationCreateCategoryArgs = {
  name: Scalars['String'];
};


export type MutationCreateGroupArgs = {
  name: Scalars['String'];
  value?: Maybe<Scalars['Money']>;
};


export type MutationCreateGroupInviteArgs = {
  groupId: Scalars['String'];
  invitedEmail: Scalars['String'];
};


export type MutationCreateGroupTransactionArgs = {
  groupId: Scalars['String'];
  name: Scalars['String'];
  participantIds: Array<Scalars['String']>;
  type: TransactionType;
  value: Scalars['Money'];
};


export type MutationCreateHouseholdArgs = {
  name: Scalars['String'];
};


export type MutationCreateInviteArgs = {
  householdId: Scalars['String'];
  invitedEmail: Scalars['String'];
};


export type MutationCreatePaymentArgs = {
  categoryId: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  householdId: Scalars['String'];
  name: Scalars['String'];
  value: Scalars['Money'];
};


export type MutationCreateRecurringPaymentArgs = {
  categoryId: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['DateTime']>;
  householdId: Scalars['String'];
  interval: Interval;
  name: Scalars['String'];
  startDate: Scalars['DateTime'];
  value: Scalars['Money'];
};


export type MutationCreateThresholdArgs = {
  groupId: Scalars['String'];
  name: Scalars['String'];
  type: ThresholdType;
  value: Scalars['Money'];
};


export type MutationDeleteGroupArgs = {
  groupId: Scalars['String'];
};


export type MutationDeleteInviteArgs = {
  id: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  isOTP?: Maybe<Scalars['Boolean']>;
  password: Scalars['String'];
};


export type MutationRemoveCategoryArgs = {
  name: Scalars['String'];
};


export type MutationRemoveGroupMemberArgs = {
  groupId: Scalars['String'];
  memberId: Scalars['String'];
};


export type MutationRemoveGroupOwnerArgs = {
  groupId: Scalars['String'];
  ownerId?: Maybe<Scalars['String']>;
};


export type MutationRemoveHouseholdMemberArgs = {
  householdId: Scalars['String'];
  memberId: Scalars['String'];
};


export type MutationRemoveThresholdArgs = {
  groupId: Scalars['String'];
  id: Scalars['String'];
};


export type MutationRequestPasswordResetArgs = {
  email: Scalars['String'];
};


export type MutationSignupArgs = {
  email: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUpdateGroupArgs = {
  groupId: Scalars['String'];
  ownerId?: Maybe<Scalars['String']>;
};


export type MutationUpdateHouseholdArgs = {
  householdId: Scalars['String'];
  ownerId?: Maybe<Scalars['String']>;
};


export type MutationUpdateRecurringPaymentArgs = {
  categoryId?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['DateTime']>;
  householdId: Scalars['String'];
  id: Scalars['String'];
  interval?: Maybe<Interval>;
  name?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['DateTime']>;
  value?: Maybe<Scalars['Money']>;
};


export type MutationUpdateThresholdArgs = {
  groupId: Scalars['String'];
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  type?: Maybe<ThresholdType>;
  value?: Maybe<Scalars['Money']>;
};


export type MutationUpdateUserArgs = {
  email?: Maybe<Scalars['String']>;
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  receiveNotifications?: Maybe<Scalars['Boolean']>;
};


export type MutationUseInviteArgs = {
  token: Scalars['String'];
};

/** HelperType: Contains a participant and the value he can take out of the group or has to pay. */
export type Participant = {
  __typename?: 'Participant';
  name: Scalars['String'];
  userId: Scalars['String'];
  value: Scalars['Money'];
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
  userId: Scalars['String'];
  value: Scalars['Money'];
};

export type Query = {
  __typename?: 'Query';
  /**
   * Returns all households available in the database.
   *       Can only be queried by admin accounts.
   */
  allHouseholds?: Maybe<Array<Maybe<Household>>>;
  /** Returns the virtual balances for all members in the given group. */
  calculateMemberBalances?: Maybe<Array<Maybe<Participant>>>;
  /** All available categories. Filterable by id or name via arguments */
  categories?: Maybe<Array<Maybe<Category>>>;
  /** Get a single invite with the given token. Need to be logged in. */
  getInviteByToken?: Maybe<Invite>;
  /** Returns a group by searching for the given id. */
  group?: Maybe<Group>;
  household?: Maybe<Household>;
  households?: Maybe<Array<Maybe<Household>>>;
  /** Returns the data of the currently logged in user. Returns null if no user is logged in */
  me?: Maybe<User>;
};


export type QueryCalculateMemberBalancesArgs = {
  id: Scalars['String'];
};


export type QueryCategoriesArgs = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};


export type QueryGetInviteByTokenArgs = {
  token: Scalars['String'];
};


export type QueryGroupArgs = {
  groupId: Scalars['String'];
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
  userId: Scalars['String'];
  value: Scalars['Money'];
};

export type Threshold = {
  __typename?: 'Threshold';
  createdAt: Scalars['DateTime'];
  /** The group to which this trigger is hooked. */
  group?: Maybe<Group>;
  groupId: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  type: ThresholdType;
  updatedAt: Scalars['DateTime'];
  value: Scalars['Money'];
};

export enum ThresholdType {
  Goal = 'GOAL',
  Max = 'MAX',
  Min = 'MIN'
}

export enum TransactionType {
  Buy = 'BUY',
  TakeOut = 'TAKE_OUT',
  TopUp = 'TOP_UP'
}

/** A user is an account which can join households and create payments */
export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  firstname: Scalars['String'];
  /** The payments which were booked in groups and where payed by the user. */
  groupTransactions?: Maybe<Array<Maybe<GroupTransaction>>>;
  /** All group payments which the user participated in. e.g. user ate some of the bought stuff. */
  groupTransactionsParticipant?: Maybe<Array<Maybe<GroupTransaction>>>;
  /** The group's in which the user is joined. */
  groups?: Maybe<Array<Maybe<Group>>>;
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
  /** When a user forgets his password we can set this one time password for resetting purposes. */
  otp?: Maybe<Scalars['String']>;
  /** The groups's in which the user is the current owner */
  ownedGroups?: Maybe<Array<Maybe<Group>>>;
  /** The household's in which the user is the current owner */
  ownedHouseholds?: Maybe<Array<Maybe<Household>>>;
  /** All payment's which where done by the user. */
  payments?: Maybe<Array<Maybe<Payment>>>;
  /** Toggle to receive any notifications. (e.g. thresholds) */
  receiveNotifications: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
};
