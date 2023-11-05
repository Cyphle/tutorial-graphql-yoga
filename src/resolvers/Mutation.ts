import { v4 as uuidv4 } from 'uuid';

export const Mutation = {
  createUser: async (parent: any, args: any, ctx: any, info: any) => {
    const emailTaken = await ctx.prisma.users.findUnique({
      where: { email: args.email }
    });

    if (emailTaken) {
      throw new Error('Email taken.');
    }

    return ctx.prisma.user.create({
      data: {
        ...args.data
      },
    });
  },
  deleteUser: async (parent: any, args: any, ctx: any, info: any) => {
    const userIndex = ctx.db.users.findIndex((user: any) => user.id === args.id);

    if (userIndex === -1) {
      throw new Error('User not found.');
    }

    const deletedUsers = ctx.db.users.splice(userIndex, 1);

    ctx.db.posts = ctx.db.posts.filter((post: any) => {
      const match = post.author === args.id;

      if (match) {
        ctx.db.comments = ctx.db.comments.filter((comment: any) => comment.post !== post.id);
      }

      return !match;
    });

    ctx.db.comments = ctx.db.comments.filter((comment: any) => comment.author !== args.id);

    const user = await ctx.prisma.user.delete({
      where: { id: parseInt(args.id) },
    })

    return user;
  },
  updateUser(parent: any, args: any, ctx: any, info: any) {
    const { id, data } = args;
    const user = ctx.db.users.find((user: any) => user.id === id);

    if (!user) {
      throw new Error('User not found.');
    }

    if (typeof data.email === 'string') {
      const emailTaken = ctx.db.users.some((user: any) => user.email === data.email);

      if (emailTaken) {
        throw new Error('Email taken.');
      }

      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age;
    }

    return user;
  },
  createPost(parent: any, args: any, ctx: any, info: any) {
    const userExists = ctx.db.users.some((user: any) => user.id === args.author);

    if (!userExists) {
      throw new Error('User not found.');
    }

    const post = {
      id: uuidv4(),
      ...args.data
    };
    ctx.db.posts.push(post);

    if (post.published) {
      ctx.pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      });
    }

    return post;
  },
  deletePost(parent: any, args: any, ctx: any, info: any) {
    const postIndex = ctx.db.posts.findIndex((post: any) => post.id === args.id);

    if (postIndex === -1) {
      throw new Error('Post not found.');
    }

    const deletedPosts = ctx.db.posts.splice(postIndex, 1);

    ctx.db.comments = ctx.db.comments.filter((comment: any) => comment.post !== args.id);

    if (deletedPosts[0].published) {
      ctx.pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: deletedPosts[0]
        }
      });
    }

    return deletedPosts[0];
  },
  updatePost(parent: any, args: any, ctx: any, info: any) {
    const { id, data } = args;
    const post = ctx.db.posts.find((post: any) => post.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw new Error('Post not found.');
    }

    if (typeof data.title === 'string') {
      post.title = data.title;
    }

    if (typeof data.body === 'string') {
      post.body = data.body;
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        // deleted
        ctx.pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        // created
        ctx.pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        });
      }
    } else if (post.published) {
      // updated
      ctx.pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      });
    }

    return post;
  },
  createComment(parent: any, args: any, ctx: any, info: any) {
    const userExists = ctx.db.users.some((user: any) => user.id === args.author);
    const postExists = ctx.db.posts.some((post: any) => post.id === args.post);

    if (!userExists || !postExists) {
      throw new Error('Unable to find user and post.');
    }

    const comment = {
      id: uuidv4(),
      ...args.data
    }
    ctx.db.comments.push(comment);


    ctx.pubSub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    });

    return comment;
  },
  deleteComment(parent: any, args: any, ctx: any, info: any) {
    const commentIndex = ctx.db.comments.findIndex((comment: any) => comment.id === args.id);

    if (commentIndex === -1) {
      throw new Error('Comment not found.');
    }

    const deletedComments = ctx.db.comments.splice(commentIndex, 1);

    ctx.pubSub.publish(`comment ${deletedComments[0].post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComments[0]
      }
    });

    return deletedComments[0];
  },
  updateComment(parent: any, args: any, ctx: any, info: any) {
    const { id, data } = args;
    const comment = ctx.db.comments.find((comment: any) => comment.id === id);

    if (!comment) {
      throw new Error('Comment not found.');
    }

    if (typeof data.text === 'string') {
      comment.text = data.text;
    }

    ctx.pubSub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    });

    return comment;
  }
}