import { ApolloServer } from 'apollo-server-micro';
import { schema } from '@/graphql/schema';

const server = new ApolloServer({
  schema,
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
