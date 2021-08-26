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
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
  Interval: "DAILY" | "MONTHLY" | "QUARTERLY" | "WEEKLY" | "YEARLY"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
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
  Household: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    name: string; // String!
    ownerId: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Invite: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    householdId: string; // String!
    id: string; // String!
    invitedEmail: string; // String!
    link: string; // String!
    senderId: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    validUntil: NexusGenScalars['DateTime']; // DateTime!
    wasUsed: boolean; // Boolean!
  }
  Mutation: {};
  Payment: { // root type
    categoryId: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description?: string | null; // String
    householdId: string; // String!
    id: string; // String!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userId?: string | null; // String
    value: number; // Float!
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
    userId?: string | null; // String
    value: number; // Float!
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
    household: NexusGenRootTypes['Household'] | null; // Household
    householdId: string; // String!
    id: string; // String!
    invitedEmail: string; // String!
    link: string; // String!
    sender: NexusGenRootTypes['User'] | null; // User
    senderId: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    validUntil: NexusGenScalars['DateTime']; // DateTime!
    wasUsed: boolean; // Boolean!
  }
  Mutation: { // field return type
    bookRecurringPayments: Array<NexusGenRootTypes['RecurringPayment'] | null> | null; // [RecurringPayment]
    createCategory: NexusGenRootTypes['Category']; // Category!
    createPayment: NexusGenRootTypes['Payment']; // Payment!
    createRecurringPayment: NexusGenRootTypes['RecurringPayment']; // RecurringPayment!
    deleteUser: NexusGenRootTypes['User']; // User!
    login: NexusGenRootTypes['AuthToken']; // AuthToken!
    logout: string | null; // String
    removeCategory: NexusGenRootTypes['Category']; // Category!
    signup: NexusGenRootTypes['AuthToken']; // AuthToken!
    updateRecurringPayment: NexusGenRootTypes['RecurringPayment']; // RecurringPayment!
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
    userId: string | null; // String
    value: number; // Float!
  }
  Query: { // field return type
    allHouseholds: Array<NexusGenRootTypes['Household'] | null> | null; // [Household]
    categories: Array<NexusGenRootTypes['Category'] | null> | null; // [Category]
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
    userId: string | null; // String
    value: number; // Float!
  }
  User: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    email: string; // String!
    firstname: string; // String!
    hashedPassword: string; // String!
    households: Array<NexusGenRootTypes['Household'] | null> | null; // [Household]
    id: string; // String!
    invites: Array<NexusGenRootTypes['Invite'] | null> | null; // [Invite]
    isAdmin: boolean; // Boolean!
    lastname: string; // String!
    name: string; // String!
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
    household: 'Household'
    householdId: 'String'
    id: 'String'
    invitedEmail: 'String'
    link: 'String'
    sender: 'User'
    senderId: 'String'
    updatedAt: 'DateTime'
    validUntil: 'DateTime'
    wasUsed: 'Boolean'
  }
  Mutation: { // field return type name
    bookRecurringPayments: 'RecurringPayment'
    createCategory: 'Category'
    createPayment: 'Payment'
    createRecurringPayment: 'RecurringPayment'
    deleteUser: 'User'
    login: 'AuthToken'
    logout: 'String'
    removeCategory: 'Category'
    signup: 'AuthToken'
    updateRecurringPayment: 'RecurringPayment'
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
    value: 'Float'
  }
  Query: { // field return type name
    allHouseholds: 'Household'
    categories: 'Category'
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
    value: 'Float'
  }
  User: { // field return type name
    createdAt: 'DateTime'
    email: 'String'
    firstname: 'String'
    hashedPassword: 'String'
    households: 'Household'
    id: 'String'
    invites: 'Invite'
    isAdmin: 'Boolean'
    lastname: 'String'
    name: 'String'
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
    bookRecurringPayments: { // args
      secretKey: string; // String!
    }
    createCategory: { // args
      name: string; // String!
    }
    createPayment: { // args
      categoryId: string; // String!
      description?: string | null; // String
      householdId: string; // String!
      name: string; // String!
      value: number; // Float!
    }
    createRecurringPayment: { // args
      categoryId: string; // String!
      description?: string | null; // String
      endDate?: NexusGenScalars['DateTime'] | null; // DateTime
      householdId: string; // String!
      interval: NexusGenEnums['Interval']; // Interval!
      name: string; // String!
      startDate: NexusGenScalars['DateTime']; // DateTime!
      value: number; // Float!
    }
    login: { // args
      email: string; // String!
      password: string; // String!
    }
    removeCategory: { // args
      name: string; // String!
    }
    signup: { // args
      email: string; // String!
      firstname: string; // String!
      lastname: string; // String!
      password: string; // String!
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
      value?: number | null; // Float
    }
  }
  Query: {
    categories: { // args
      id?: string | null; // String
      name?: string | null; // String
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