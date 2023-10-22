import { createSchema, createYoga } from 'graphql-yoga'
import { expressConfig } from './config/express.config';
import { Express } from 'express';

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      hello: String!
      name: String!
    }
  `,
  resolvers: {
    Query: {
      hello: () => 'Hello world pouetpouet!',
      name: () => 'John Doe'
    }
  }
});

// GraphQL Yoga
const yoga = createYoga({ schema });

const launchServer = (app: Express) => {
  app.use(yoga.graphqlEndpoint, yoga)
}

(function main() {
  const app = expressConfig();
  app.listen(4000, () => {
    console.info(`Server started on port 4000`);
    launchServer(app);
  });
})();