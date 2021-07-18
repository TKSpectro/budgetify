import { context } from '@/graphql/context';
import { schema } from '@/graphql/schema';
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';

const server = new ApolloServer({
  schema,
  context,
  plugins: [
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
  // Enable performance tracing for development
  //tracing: process.env.NODE_ENV === 'development',
});
// As of apollo-server-micro@3... we need to await the start of the server
await server.start();

const handler = server.createHandler({ path: '/api/graphql' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
