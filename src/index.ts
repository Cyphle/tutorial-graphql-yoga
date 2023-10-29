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
    deleteUser(id: ID!): User!
    
    createPost(data: CreatePostInput!): Post!
    deletePost(id: ID!): Post!
    
    createComment(data: CreateCommentInput!): Comment!
    deleteComment(id: ID!): Comment!
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
    deleteUser(parent: any, args: any, ctx: any, info: any) {
      const userIndex = users.findIndex((user: any) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User not found.');
      }

      const deletedUsers = users.splice(userIndex, 1);

      // posts = posts.filter((post: any) => {
      //   const match = post.author === args.id;
      //
      //   if (match) {
      //     comments = comments.filter((comment: any) => comment.post !== post.id);
      //   }
      //
      //   return !match;
      // });

      // comments = comments.filter((comment: any) => comment.author !== args.id);

      return deletedUsers[0];
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
    deletePost(parent: any, args: any, ctx: any, info: any) {
      const postIndex = posts.findIndex((post: any) => post.id === args.id);

      if (postIndex === -1) {
        throw new Error('Post not found.');
      }

      const deletedPosts = posts.splice(postIndex, 1);

      // comments = comments.filter((comment: any) => comment.post !== args.id);

      return deletedPosts[0];
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
    },
    deleteComment(parent: any, args: any, ctx: any, info: any) {
      const commentIndex = comments.findIndex((comment: any) => comment.id === args.id);

      if (commentIndex === -1) {
        throw new Error('Comment not found.');
      }

      const deletedComments = comments.splice(commentIndex, 1);

      return deletedComments[0];
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