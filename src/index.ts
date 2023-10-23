import { createSchema, createYoga } from 'graphql-yoga'
import { expressConfig } from './config/express.config';
import { Express } from 'express';

export const schema = createSchema({
  typeDefs: `
    type Query {
      id: ID!
      name: String!
      age: Int!
      employed: Boolean!
      gpa: Float
    }
  `,
  resolvers: {
    Query: {
      id: () => 'abc123',
      name: () => 'John Doe',
      age: () => 21,
      employed: () => true,
      gpa: () => null
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