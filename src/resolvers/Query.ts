export const Query = {
  users: async (parent: any, args: any, ctx: any, info: any) => {
    if (!args.query) {
      return ctx.prisma.user.findMany({});
    }

    return ctx.prisma.user.findMany({});
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