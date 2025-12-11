import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

// Get GraphQL URL from environment variable (for production) or use localhost (for development)
const GRAPHQL_HTTP_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000';

// Convert HTTP URL to WebSocket URL
// https://example.com -> wss://example.com
// http://example.com -> ws://example.com
const GRAPHQL_WS_URL = import.meta.env.VITE_GRAPHQL_URL
  ? import.meta.env.VITE_GRAPHQL_URL.replace('https://', 'wss://').replace('http://', 'ws://')
  : 'ws://localhost:4000';

const httpLink = new HttpLink({
  uri: `${GRAPHQL_HTTP_URL}/graphql`,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `${GRAPHQL_WS_URL}/graphql`,
    // Add reconnection options for production stability
    connectionParams: () => ({}),
    shouldRetry: () => true,
    retryAttempts: 5,
    retryWait: async (retries: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1)));
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

