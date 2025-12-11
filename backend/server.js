import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { typeDefs } from './src/schema.js';
import { resolvers } from './src/resolvers.js';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const app = express();
const httpServer = createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
});

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const serverCleanup = useServer(
  {
    schema,
    context: () => ({ pubsub }),
  },
  wsServer
);

server.start().then(() => {
  // Configure CORS for production
  const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use('/graphql', cors(corsOptions), express.json(), expressMiddleware(server, {
    context: async ({ req }) => ({ pubsub }),
  }));

  const PORT = process.env.PORT || 4000;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`🚀 WebSocket server ready at ws://localhost:${PORT}/graphql`);
    console.log(`📦 Environment: ${NODE_ENV}`);
    if (process.env.FRONTEND_URL) {
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    }
  });
});

