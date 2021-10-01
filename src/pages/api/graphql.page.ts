import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import { ApolloError, ApolloServer } from 'apollo-server-micro';
import { context } from '~/graphql/context';
import { schema } from '~/graphql/schema';

// Check if the secret used for the JWT encryption was set in the .env file
if (!process.env.JWT_SECRET) {
  throw new ApolloError('Server is not setup correctly');
}

const server = new ApolloServer({
  schema,
  context,
  // As of apollo-server-micro@3.0 we need to manually activate the old GraphqlQLPlayground
  // instead of the new LandingPage
  // The new landing page uses apollo studio explorer which needs quite some more setup
  // which is currently not well documented, so we use the old graphqlPlayground
  plugins: [
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
      : ApolloServerPluginLandingPageGraphQLPlayground({
          settings: { 'request.credentials': 'include' },
        }),
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
