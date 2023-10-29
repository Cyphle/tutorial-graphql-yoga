import { createSchema, createYoga } from 'graphql-yoga'
import { expressConfig } from './config/express.config';
import { Express } from 'express';
import { users } from './mocks/users';
import { posts } from './mocks/posts';
import { comments } from './mocks/comments';
import { v4 as uuidv4 } from 'uuid';

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
  }
  
  type Mutation {
    createUser(data: CreateUserInput!): User!
    createPost(data: CreatePostInput!): Post!
    createComment(data: CreateCommentInput!): Comment!
  }
  
  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }
  
  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
   }
  
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }
  
  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
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
  Mutation: {
    createUser(parent: any, args: any, ctx: any, info: any) {
      const emailTaken = users.some((user: any) => user.email === args.email);

      if (emailTaken) {
        throw new Error('Email taken.');
      }

      const user = {
        id: uuidv4(),
        ...args.data
      };

      users.push(user);

      return user;
    },
    createPost(parent: any, args: any, ctx: any, info: any) {
      const userExists = users.some((user: any) => user.id === args.author);

      if (!userExists) {
        throw new Error('User not found.');
      }

      const post = {
        id: uuidv4(),
        ...args.data
      };
      posts.push(post);

      return post;
    },
    createComment(parent: any, args: any, ctx: any, info: any) {
      const userExists = users.some((user: any) => user.id === args.author);
      const postExists = posts.some((post: any) => post.id === args.post && post.published);

      if (!userExists || !postExists) {
        throw new Error('Unable to find user and post.');
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      }
      comments.push(comment);

      return comment;
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