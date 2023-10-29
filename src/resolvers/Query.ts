export const Query = {
  users(parent: any, args: any, ctx: any, info: any) {
    if (!args.query) {
      return ctx.db.users;
    }

    return ctx.db.users.filter((user: any) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  posts(parent: any, args: any, ctx: any, info: any) {
    if (!args.query) {
      return ctx.db.posts;
    }

    return ctx.db.posts.filter((post: any) => {
      const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
      const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
      return isTitleMatch || isBodyMatch;
    });
  },
  comments(parent: any, args: any, ctx: any, info: any) {
    return ctx.db.comments;
  },
  me() {
    return {
      id: '123098',
      name: 'Mike',
      email: 'mike@example.com',
    }
  }
}