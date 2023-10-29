import { createSchema, createYoga } from 'graphql-yoga';
import { expressConfig } from './config/express.config';
import { Express } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { db } from './mocks/db';
import { Query } from './resolvers/Query';
import { Mutation } from './resolvers/Mutation';
import { Post } from './resolvers/Post';
import { User } from './resolvers/User';
import { Comment } from './resolvers/Comment';

export const schema = createSchema({
  typeDefs: fs.readFileSync(
      path.join(__dirname, './assets/schema.graphql'),
      'utf8'
  ),
  resolvers: {
    Query,
    Mutation,
    Post,
    User,
    Comment
  },
});

// GraphQL Yoga
const yoga = createYoga({
  schema,
  context: {
    db
  }
});

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