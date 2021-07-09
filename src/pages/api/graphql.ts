import { ApolloServer } from 'apollo-server-micro';
import { schema } from '@/graphql/schema';
import { context } from '@/graphql/context';

const server = new ApolloServer({
  schema,
  context,
  // Enable performance tracing for development
  tracing: process.env.NODE_ENV === 'development',
});
const handler = server.createHandler({ path: '/api/graphql' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
