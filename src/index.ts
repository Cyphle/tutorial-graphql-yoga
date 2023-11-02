import { createPubSub, createSchema, createYoga, PubSub } from 'graphql-yoga';
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
import { Subscription } from './resolvers/Subscription';
import { PrismaClient } from '@prisma/client';

const pubSub = createPubSub();
const prisma = new PrismaClient();

export const schema = createSchema({
  typeDefs: fs.readFileSync(
      path.join(__dirname, './assets/schema.graphql'),
      'utf8'
  ),
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Post,
    User,
    Comment
  },
});

// GraphQL Yoga
const yoga = createYoga({
  schema,
  context: {
    db,
    pubSub
  }
});


async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
    },
  })
  console.log(user)
}

const launchServer = (app: Express) => {
  app.use(yoga.graphqlEndpoint, yoga);

  main()
      .then(async () => {
        await prisma.$disconnect()
      })
      .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
      })
}

(function main() {
  const app = expressConfig();
  app.listen(4000, () => {
    console.info(`Server started on port 4000`);
    launchServer(app);
  });
})();