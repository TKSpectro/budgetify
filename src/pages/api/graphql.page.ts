import {
  ApolloError,
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { ServerResponse } from 'http';
import { context } from '~/graphql/context';
import { schema } from '~/graphql/schema';

// Check if the secret used for the JWT encryption was set in the .env file
if (!process.env.JWT_SECRET) {
  throw new Error('Server is not setup correctly');
}

// Create a apollo server instance with custom error handling and plugins
const server = new ApolloServer({
  schema,
  context,
  formatError: (err) => {
    if (err.extensions?.code === 'UNAUTHENTICATED') {
      return new ApolloError(err.message);
    }
    if (err.extensions?.code === 'INTERNAL_SERVER_ERROR' && err.message === 'Not authorized') {
      return new ApolloError('errorNotAuthorized');
    }
    return err;
  },
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
});

const startServer = server.start();

// As of apollo-server-micro@3.0 we need to call the start method on the server instance and
// await it before returning the handler
export default async function handler(req: MicroRequest, res: ServerResponse) {
  // As of apollo-server-micro@3... we need to await the start of the server
  await startServer;
  await server.createHandler({ path: '/api/graphql' })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
