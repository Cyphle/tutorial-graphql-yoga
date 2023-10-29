import { v4 as uuidv4 } from 'uuid';

export const Mutation = {
  createUser(parent: any, args: any, ctx: any, info: any) {
    const emailTaken = ctx.db.users.some((user: any) => user.email === args.email);

    if (emailTaken) {
      throw new Error('Email taken.');
    }

    const user = {
      id: uuidv4(),
      ...args.data
    };

    ctx.db.users.push(user);

    return user;
  },
  deleteUser(parent: any, args: any, ctx: any, info: any) {
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

    return deletedUsers[0];
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

    return post;
  },
  deletePost(parent: any, args: any, ctx: any, info: any) {
    const postIndex = ctx.db.posts.findIndex((post: any) => post.id === args.id);

    if (postIndex === -1) {
      throw new Error('Post not found.');
    }

    const deletedPosts = ctx.db.posts.splice(postIndex, 1);

    ctx.db.comments = ctx.db.comments.filter((comment: any) => comment.post !== args.id);

    return deletedPosts[0];
  },
  createComment(parent: any, args: any, ctx: any, info: any) {
    const userExists = ctx.db.users.some((user: any) => user.id === args.author);
    const postExists = ctx.db.posts.some((post: any) => post.id === args.post && post.published);

    if (!userExists || !postExists) {
      throw new Error('Unable to find user and post.');
    }

    const comment = {
      id: uuidv4(),
      ...args.data
    }
    ctx.db.comments.push(comment);

    return comment;
  },
  deleteComment(parent: any, args: any, ctx: any, info: any) {
    const commentIndex = ctx.db.comments.findIndex((comment: any) => comment.id === args.id);

    if (commentIndex === -1) {
      throw new Error('Comment not found.');
    }

    const deletedComments = ctx.db.comments.splice(commentIndex, 1);

    return deletedComments[0];
  }
}