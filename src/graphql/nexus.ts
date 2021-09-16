/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
    /**
     * Money custom scalar type. Converts int to float with 2 decimals.
     */
    money<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Money";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
    /**
     * Money custom scalar type. Converts int to float with 2 decimals.
     */
    money<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Money";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
  Interval: "DAILY" | "MONTHLY" | "QUARTERLY" | "WEEKLY" | "YEARLY"
  ThresholdType: "GOAL" | "MAX" | "MIN"
  TransactionType: "BUY" | "TAKE_OUT" | "TOP_UP"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
  Money: any
}

export interface NexusGenObjects {
  AuthToken: { // root type
    token: string; // String!
  }
  Category: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Group: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    value: NexusGenScalars['Money']; // Money!
  }
  GroupTransaction: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    groupId: string; // String!
    id: string; // String!
    name: string; // String!
    type: NexusGenEnums['TransactionType']; // TransactionType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userId: string; // String!
    value: NexusGenScalars['Money']; // Money!
  }
  Household: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    name: string; // String!
    ownerId: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Invite: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    groupId?: string | null; // String
    householdId?: string | null; // String
    id: string; // String!
    invitedEmail: string; // String!
    senderId: string; // String!
    token: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    validUntil: NexusGenScalars['DateTime']; // DateTime!
    wasUsed: boolean; // Boolean!
  }
  Mutation: {};
  Participant: { // root type
    name: string; // String!
    userId: string; // String!
    value: NexusGenScalars['Money']; // Money!
  }
  Payment: { // root type
    categoryId: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description?: string | null; // String
    householdId: string; // String!
    id: string; // String!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userId: string; // String!
    value: NexusGenScalars['Money']; // Money!
  }
  Query: {};
  RecurringPayment: { // root type
    categoryId: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description?: string | null; // String
    endDate?: NexusGenScalars['DateTime'] | null; // DateTime
    householdId: string; // String!
    id: string; // String!
    interval: NexusGenEnums['Interval']; // Interval!
    lastBooking?: NexusGenScalars['DateTime'] | null; // DateTime
    name: string; // String!
    nextBooking?: NexusGenScalars['DateTime'] | null; // DateTime
    startDate: NexusGenScalars['DateTime']; // DateTime!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userId: string; // String!
    value: NexusGenScalars['Money']; // Money!
  }
  Threshold: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    groupId: string; // String!
    id: string; // String!
    name: string; // String!
    type: NexusGenEnums['ThresholdType']; // ThresholdType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    value: NexusGenScalars['Money']; // Money!
  }
  User: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    email: string; // String!
    firstname: string; // String!
    hashedPassword: string; // String!
    id: string; // String!
    isAdmin: boolean; // Boolean!
    lastname: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  AuthToken: { // field return type
    token: string; // String!
  }
  Category: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Group: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    invites: Array<NexusGenRootTypes['Invite'] | null> | null; // [Invite]
    members: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    name: string; // String!
    owners: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    thresholds: Array<NexusGenRootTypes['Threshold'] | null> | null; // [Threshold]
    transactions: Array<NexusGenRootTypes['GroupTransaction'] | null> | null; // [GroupTransaction]
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    value: NexusGenScalars['Money']; // Money!
  }
  GroupTransaction: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    group: NexusGenRootTypes['Group'] | null; // Group
    groupId: string; // String!
    id: string; // String!
    name: string; // String!
    participants: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    type: NexusGenEnums['TransactionType']; // TransactionType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User'] | null; // User
    userId: string; // String!
    value: NexusGenScalars['Money']; // Money!
  }
  Household: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    invites: Array<NexusGenRootTypes['Invite'] | null> | null; // [Invite]
    members: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    name: string; // String!
    owner: NexusGenRootTypes['User'] | null; // User
    ownerId: string; // String!
    payments: Array<NexusGenRootTypes['Payment'] | null> | null; // [Payment]
    recurringPayments: Array<NexusGenRootTypes['RecurringPayment'] | null> | null; // [RecurringPayment]
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Invite: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    group: NexusGenRootTypes['Group'] | null; // Group
    groupId: string | null; // String
    household: NexusGenRootTypes['Household'] | null; // Household
    householdId: string | null; // String
    id: string; // String!
    invitedEmail: string; // String!
    sender: NexusGenRootTypes['User'] | null; // User
    senderId: string; // String!
    token: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    validUntil: NexusGenScalars['DateTime']; // DateTime!
    wasUsed: boolean; // Boolean!
  }
  Mutation: { // field return type
    addGroupOwner: NexusGenRootTypes['Group']; // Group!
    bookRecurringPayments: Array<NexusGenRootTypes['RecurringPayment'] | null> | null; // [RecurringPayment]
    createCategory: NexusGenRootTypes['Category']; // Category!
    createGroup: NexusGenRootTypes['Group'] | null; // Group
    createGroupInvite: NexusGenRootTypes['Invite']; // Invite!
    createGroupTransaction: NexusGenRootTypes['GroupTransaction'] | null; // GroupTransaction
    createInvite: NexusGenRootTypes['Invite']; // Invite!
    createPayment: NexusGenRootTypes['Payment']; // Payment!
    createRecurringPayment: NexusGenRootTypes['RecurringPayment']; // RecurringPayment!
    createThreshold: NexusGenRootTypes['Threshold']; // Threshold!
    deleteInvite: boolean | null; // Boolean
    deleteUser: NexusGenRootTypes['User']; // User!
    login: NexusGenRootTypes['AuthToken']; // AuthToken!
    logout: string | null; // String
    removeCategory: NexusGenRootTypes['Category']; // Category!
    removeGroupMember: NexusGenRootTypes['Group']; // Group!
    removeGroupOwner: NexusGenRootTypes['Group']; // Group!
    removeHouseholdMember: NexusGenRootTypes['Household']; // Household!
    signup: NexusGenRootTypes['AuthToken']; // AuthToken!
    updateGroup: NexusGenRootTypes['Group']; // Group!
    updateHousehold: NexusGenRootTypes['Household']; // Household!
    updateRecurringPayment: NexusGenRootTypes['RecurringPayment']; // RecurringPayment!
    useInvite: NexusGenRootTypes['Invite'] | null; // Invite
  }
  Participant: { // field return type
    name: string; // String!
    userId: string; // String!
    value: NexusGenScalars['Money']; // Money!
  }
  Payment: { // field return type
    category: NexusGenRootTypes['Category'] | null; // Category
    categoryId: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description: string | null; // String
    household: NexusGenRootTypes['Household'] | null; // Household
    householdId: string; // String!
    id: string; // String!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User'] | null; // User
    userId: string; // String!
    value: NexusGenScalars['Money']; // Money!
  }
  Query: { // field return type
    allHouseholds: Array<NexusGenRootTypes['Household'] | null> | null; // [Household]
    calculateMemberBalances: Array<NexusGenRootTypes['Participant'] | null> | null; // [Participant]
    categories: Array<NexusGenRootTypes['Category'] | null> | null; // [Category]
    group: NexusGenRootTypes['Group'] | null; // Group
    household: NexusGenRootTypes['Household'] | null; // Household
    households: Array<NexusGenRootTypes['Household'] | null> | null; // [Household]
    me: NexusGenRootTypes['User'] | null; // User
    recurringPayments: Array<NexusGenRootTypes['RecurringPayment'] | null> | null; // [RecurringPayment]
  }
  RecurringPayment: { // field return type
    category: NexusGenRootTypes['Category'] | null; // Category
    categoryId: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description: string | null; // String
    endDate: NexusGenScalars['DateTime'] | null; // DateTime
    household: NexusGenRootTypes['Household'] | null; // Household
    householdId: string; // String!
    id: string; // String!
    interval: NexusGenEnums['Interval']; // Interval!
    lastBooking: NexusGenScalars['DateTime'] | null; // DateTime
    name: string; // String!
    nextBooking: NexusGenScalars['DateTime'] | null; // DateTime
    payments: Array<NexusGenRootTypes['Payment'] | null> | null; // [Payment]
    startDate: NexusGenScalars['DateTime']; // DateTime!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User'] | null; // User
    userId: string; // String!
    value: NexusGenScalars['Money']; // Money!
  }
  Threshold: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    group: NexusGenRootTypes['Group'] | null; // Group
    groupId: string; // String!
    id: string; // String!
    name: string; // String!
    type: NexusGenEnums['ThresholdType']; // ThresholdType!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    value: NexusGenScalars['Money']; // Money!
  }
  User: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    email: string; // String!
    firstname: string; // String!
    groupTransactions: Array<NexusGenRootTypes['GroupTransaction'] | null> | null; // [GroupTransaction]
    groupTransactionsParticipant: Array<NexusGenRootTypes['GroupTransaction'] | null> | null; // [GroupTransaction]
    groups: Array<NexusGenRootTypes['Group'] | null> | null; // [Group]
    hashedPassword: string; // String!
    households: Array<NexusGenRootTypes['Household'] | null> | null; // [Household]
    id: string; // String!
    invites: Array<NexusGenRootTypes['Invite'] | null> | null; // [Invite]
    isAdmin: boolean; // Boolean!
    lastname: string; // String!
    name: string; // String!
    ownedGroups: Array<NexusGenRootTypes['Group'] | null> | null; // [Group]
    ownedHouseholds: Array<NexusGenRootTypes['Household'] | null> | null; // [Household]
    payments: Array<NexusGenRootTypes['Payment'] | null> | null; // [Payment]
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
}

export interface NexusGenFieldTypeNames {
  AuthToken: { // field return type name
    token: 'String'
  }
  Category: { // field return type name
    createdAt: 'DateTime'
    id: 'String'
    name: 'String'
    updatedAt: 'DateTime'
  }
  Group: { // field return type name
    createdAt: 'DateTime'
    id: 'String'
    invites: 'Invite'
    members: 'User'
    name: 'String'
    owners: 'User'
    thresholds: 'Threshold'
    transactions: 'GroupTransaction'
    updatedAt: 'DateTime'
    value: 'Money'
  }
  GroupTransaction: { // field return type name
    createdAt: 'DateTime'
    group: 'Group'
    groupId: 'String'
    id: 'String'
    name: 'String'
    participants: 'User'
    type: 'TransactionType'
    updatedAt: 'DateTime'
    user: 'User'
    userId: 'String'
    value: 'Money'
  }
  Household: { // field return type name
    createdAt: 'DateTime'
    id: 'String'
    invites: 'Invite'
    members: 'User'
    name: 'String'
    owner: 'User'
    ownerId: 'String'
    payments: 'Payment'
    recurringPayments: 'RecurringPayment'
    updatedAt: 'DateTime'
  }
  Invite: { // field return type name
    createdAt: 'DateTime'
    group: 'Group'
    groupId: 'String'
    household: 'Household'
    householdId: 'String'
    id: 'String'
    invitedEmail: 'String'
    sender: 'User'
    senderId: 'String'
    token: 'String'
    updatedAt: 'DateTime'
    validUntil: 'DateTime'
    wasUsed: 'Boolean'
  }
  Mutation: { // field return type name
    addGroupOwner: 'Group'
    bookRecurringPayments: 'RecurringPayment'
    createCategory: 'Category'
    createGroup: 'Group'
    createGroupInvite: 'Invite'
    createGroupTransaction: 'GroupTransaction'
    createInvite: 'Invite'
    createPayment: 'Payment'
    createRecurringPayment: 'RecurringPayment'
    createThreshold: 'Threshold'
    deleteInvite: 'Boolean'
    deleteUser: 'User'
    login: 'AuthToken'
    logout: 'String'
    removeCategory: 'Category'
    removeGroupMember: 'Group'
    removeGroupOwner: 'Group'
    removeHouseholdMember: 'Household'
    signup: 'AuthToken'
    updateGroup: 'Group'
    updateHousehold: 'Household'
    updateRecurringPayment: 'RecurringPayment'
    useInvite: 'Invite'
  }
  Participant: { // field return type name
    name: 'String'
    userId: 'String'
    value: 'Money'
  }
  Payment: { // field return type name
    category: 'Category'
    categoryId: 'String'
    createdAt: 'DateTime'
    description: 'String'
    household: 'Household'
    householdId: 'String'
    id: 'String'
    name: 'String'
    updatedAt: 'DateTime'
    user: 'User'
    userId: 'String'
    value: 'Money'
  }
  Query: { // field return type name
    allHouseholds: 'Household'
    calculateMemberBalances: 'Participant'
    categories: 'Category'
    group: 'Group'
    household: 'Household'
    households: 'Household'
    me: 'User'
    recurringPayments: 'RecurringPayment'
  }
  RecurringPayment: { // field return type name
    category: 'Category'
    categoryId: 'String'
    createdAt: 'DateTime'
    description: 'String'
    endDate: 'DateTime'
    household: 'Household'
    householdId: 'String'
    id: 'String'
    interval: 'Interval'
    lastBooking: 'DateTime'
    name: 'String'
    nextBooking: 'DateTime'
    payments: 'Payment'
    startDate: 'DateTime'
    updatedAt: 'DateTime'
    user: 'User'
    userId: 'String'
    value: 'Money'
  }
  Threshold: { // field return type name
    createdAt: 'DateTime'
    group: 'Group'
    groupId: 'String'
    id: 'String'
    name: 'String'
    type: 'ThresholdType'
    updatedAt: 'DateTime'
    value: 'Money'
  }
  User: { // field return type name
    createdAt: 'DateTime'
    email: 'String'
    firstname: 'String'
    groupTransactions: 'GroupTransaction'
    groupTransactionsParticipant: 'GroupTransaction'
    groups: 'Group'
    hashedPassword: 'String'
    households: 'Household'
    id: 'String'
    invites: 'Invite'
    isAdmin: 'Boolean'
    lastname: 'String'
    name: 'String'
    ownedGroups: 'Group'
    ownedHouseholds: 'Household'
    payments: 'Payment'
    updatedAt: 'DateTime'
  }
}

export interface NexusGenArgTypes {
  Household: {
    payments: { // args
      endDate?: string | null; // String
      limit?: number | null; // Int
      skip?: number | null; // Int
      startDate?: string | null; // String
    }
    recurringPayments: { // args
      id?: string | null; // String
      limit?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  Mutation: {
    addGroupOwner: { // args
      id: string; // String!
      ownerId?: string | null; // String
    }
    bookRecurringPayments: { // args
      secretKey: string; // String!
    }
    createCategory: { // args
      name: string; // String!
    }
    createGroup: { // args
      name: string; // String!
      value?: NexusGenScalars['Money'] | null; // Money
    }
    createGroupInvite: { // args
      groupId: string; // String!
      invitedEmail: string; // String!
    }
    createGroupTransaction: { // args
      groupId: string; // String!
      name: string; // String!
      participantIds: string[]; // [String!]!
      type: NexusGenEnums['TransactionType']; // TransactionType!
      value: NexusGenScalars['Money']; // Money!
    }
    createInvite: { // args
      householdId: string; // String!
      invitedEmail: string; // String!
    }
    createPayment: { // args
      categoryId: string; // String!
      description?: string | null; // String
      householdId: string; // String!
      name: string; // String!
      value: NexusGenScalars['Money']; // Money!
    }
    createRecurringPayment: { // args
      categoryId: string; // String!
      description?: string | null; // String
      endDate?: NexusGenScalars['DateTime'] | null; // DateTime
      householdId: string; // String!
      interval: NexusGenEnums['Interval']; // Interval!
      name: string; // String!
      startDate: NexusGenScalars['DateTime']; // DateTime!
      value: NexusGenScalars['Money']; // Money!
    }
    createThreshold: { // args
      groupId: string; // String!
      name: string; // String!
      type: NexusGenEnums['ThresholdType']; // ThresholdType!
      value: NexusGenScalars['Money']; // Money!
    }
    deleteInvite: { // args
      id: string; // String!
    }
    login: { // args
      email: string; // String!
      password: string; // String!
    }
    removeCategory: { // args
      name: string; // String!
    }
    removeGroupMember: { // args
      id: string; // String!
      memberId: string; // String!
    }
    removeGroupOwner: { // args
      id: string; // String!
      ownerId?: string | null; // String
    }
    removeHouseholdMember: { // args
      id: string; // String!
      memberId: string; // String!
    }
    signup: { // args
      email: string; // String!
      firstname: string; // String!
      lastname: string; // String!
      password: string; // String!
    }
    updateGroup: { // args
      id: string; // String!
      ownerId?: string | null; // String
    }
    updateHousehold: { // args
      id: string; // String!
      ownerId?: string | null; // String
    }
    updateRecurringPayment: { // args
      categoryId?: string | null; // String
      description?: string | null; // String
      endDate?: NexusGenScalars['DateTime'] | null; // DateTime
      householdId: string; // String!
      id: string; // String!
      interval?: NexusGenEnums['Interval'] | null; // Interval
      name?: string | null; // String
      startDate?: NexusGenScalars['DateTime'] | null; // DateTime
      value?: NexusGenScalars['Money'] | null; // Money
    }
    useInvite: { // args
      token: string; // String!
    }
  }
  Query: {
    calculateMemberBalances: { // args
      id: string; // String!
    }
    categories: { // args
      id?: string | null; // String
      name?: string | null; // String
    }
    group: { // args
      id: string; // String!
    }
    household: { // args
      id?: string | null; // String
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}