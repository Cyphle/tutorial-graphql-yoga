import { createSchema, createYoga } from 'graphql-yoga'
import { expressConfig } from './config/express.config';
import { Express } from 'express';

const typeDefs = `
  type Query {
    greeting(name: String, position: String): String!
    add(numbers: [Float!]!): Float!
    grades: [Int!]!
    me: User!
    post: Post!
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
  
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

const resolvers = {
  Query: {
    greeting(parent: any, args: any, ctx: any, info: any) {
      return `Hello, ${args.name} World! You are in ${args.position}`;
    },
    add(parent: any, args: any, ctx: any, info: any) {
      return args.numbers.reduce((accumulator: number, currentValue: number) => {
        return accumulator + currentValue;
      }, 0.0);
    },
    grades(parent: any, args: any, ctx: any, info: any) {
      return [99, 80, 93];
    },
    me() {
      return {
        id: '123098',
        name: 'Mike',
        email: 'mike@example.com',
      }
    },
    post() {
      return {
        id: '092',
        title: 'GraphQL 101',
        body: '',
        published: false
      }
    }
  }
};

export const schema = createSchema({
  typeDefs: typeDefs,
  resolvers: resolvers
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