import { createSchema, createYoga } from 'graphql-yoga'
import { expressConfig } from './config/express.config';
import { Express } from 'express';
import { users } from './mocks/users';
import { posts } from './mocks/posts';
import { comments } from './mocks/comments';

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }
  
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }
  
  type Comment {
     id: ID!
     text: String!
     author: User!
     post: Post!
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
    comments(parent: any, args: any, ctx: any, info: any) {
      return comments;
    },
    me() {
      return {
        id: '123098',
        name: 'Mike',
        email: 'mike@example.com',
      }
    }
  },
  Post: {
    author(parent: any, args: any, ctx: any, info: any) {
      return users.find((user: any) => {
        return user.id === parent.author;
      });
    },
    comments(parent: any, args: any, ctx: any, info: any) {
      return comments.filter((comment: any) => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts(parent: any, args: any, ctx: any, info: any) {
      return posts.filter((post: any) => {
        return post.author === parent.id;
      });
    },
    comments(parent: any, args: any, ctx: any, info: any) {
      return comments.filter((comment: any) => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent: any, args: any, ctx: any, info: any) {
      return users.find((user: any) => {
        return user.id === parent.author;
      });
    },
    post(parent: any, args: any, ctx: any, info: any) {
      return posts.find((post: any) => {
        return post.id === parent.post;
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