import { GraphQLDateTime } from 'graphql-iso-date';
import { asNexusMethod } from 'nexus';

// Because Graphql does not have a date type we add it as a custom type
export const DateTime = asNexusMethod(GraphQLDateTime, 'date');
