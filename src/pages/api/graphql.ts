import { context } from '@/graphql/context';
import { schema } from '@/graphql/schema';
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { ApolloError, ApolloServer } from 'apollo-server-micro';

// Check if the secret used for the JWT encryption was set in the .env file
if (!process.env.JWT_SECRET) {
  throw new ApolloError('Server is not setup correctly');
}

const server = new ApolloServer({
  schema,
  context,
  // As of apollo-server-micro@3.0 we need to manually activate the old GraphqlQLPlayground
  // instead of the new LandingPage
  // TODO: Look into the LandingPage (is there the same functionality possible with? etc.)
  plugins: [
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
  // Enable performance tracing for development -> This is deprecated with apollo-server-micro@3.0
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
