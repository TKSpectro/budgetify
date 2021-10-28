import { Kind } from 'graphql';
import { scalarType } from 'nexus';

export const DateTime = scalarType({
  name: 'DateTime',
  asNexusMethod: 'date',
  description: 'Date custom scalar type',
  serialize(value) {
    return value.getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});

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

    // Need to construct the Number with a different algo as Number cant parse "-5" to "-.05"
    if (value > -10 && value < 0)
      return Number(valueAsString.slice(0, -1) + '0.0' + valueAsString.slice(-1));

    // Need to construct the Number with a different algo as Number cant parse "5" to ".05"
    if (value > 0 && value < 10)
      return Number(valueAsString.slice(0, -1) + '0.0' + valueAsString.slice(-1));

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
