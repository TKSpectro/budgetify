import { Kind } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { asNexusMethod, scalarType } from 'nexus';

// Because Graphql does not have a date type we add it as a custom type
export const DateTime = asNexusMethod(GraphQLDateTime, 'date');

export const Money = scalarType({
  name: 'Money',
  asNexusMethod: 'money',
  description: 'Money custom scalar type. Converts int to float with 2 decimals.',

  parseValue(value) {
    // Multiply by 100 because we get a input like 10Euro, which we need to convert to 1000
    // instead of just 10
    value *= 100;

    const valueAsString = value.toString();
    return Number(valueAsString.slice(0, -2) + valueAsString.slice(-2));
  },

  serialize(value) {
    const valueAsString: string = value.toString();

    // Need to construct the Number with a different algo as Number cant parse "-.5"
    if (value > -10 && value < 0)
      return Number(valueAsString.slice(0, -1) + '0.' + valueAsString.slice(-1));

    return Number(valueAsString.slice(0, -2) + '.' + valueAsString.slice(-2));
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.FLOAT) {
      const valueAsString = ast.value.toString();
      return Number(valueAsString.slice(0, -2) + valueAsString.slice(-2));
    }
    if (ast.kind === Kind.INT) {
      return Number(ast.value);
    }

    return null;
  },
});

// This would be a custom DateTime implementation but i use the graphql-iso-package
// export const DateTime = scalarType({
//   name: 'DateTime',
//   asNexusMethod: 'dateTime',
//   description: 'Date custom scalar type',
//   parseValue(value) {
//     const date = new Date(value);
//     return date.toISOString();
//   },
//   serialize(value) {
//     return new Date(value);
//   },
//   parseLiteral(ast) {
//     if (ast.kind === Kind.INT) {
//       return new Date(ast.value);
//     }
//     return null;
//   },
// });
