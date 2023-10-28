import { createSchema, createYoga } from 'graphql-yoga'
import { expressConfig } from './config/express.config';
import { Express } from 'express';

const users = [
  {
    id: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com'
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com'
  }
];

const posts = [
  {
    id: '10',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: true,
    author: '1'
  },
  {
    id: '11',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: false,
    author: '1'
  },
  {
    id: '12',
    title: 'Programming Music',
    body: '',
    published: false,
    author: '2'
  }
];

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
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
    author: User!
  }
`;

const resolvers = {
  Query: {
    users(parent: any, args: any, ctx: any, info: any) {
      if (!args.query) {
        return users;
      }

      return users.filter((user: any) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent: any, args: any, ctx: any, info: any) {
      if (!args.query) {
        return posts;
      }

      return posts.filter((post: any) => {
        const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
        const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
        return isTitleMatch || isBodyMatch;
      });
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
  },
  Post: {
    author(parent: any, args: any, ctx: any, info: any) {
      return users.find((user: any) => {
        return user.id === parent.author;
      });
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