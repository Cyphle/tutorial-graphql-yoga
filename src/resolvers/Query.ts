export const Query = {
  users: async (parent: any, args: any, ctx: any, info: any) => {
    if (!args.query) {
      return ctx.prisma.user.findMany({});
    }

    return ctx.prisma.user.findMany({
      where: {
        name: {
          contains: args.query,
          mode: 'insensitive'
        }
      }
    });
  },
  posts: async (parent: any, args: any, ctx: any, info: any) => {
    if (!args.query) {
      return ctx.prima.post.findMany({});
    }

    return ctx.prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: args.query,
              mode: 'insensitive'
            }
          },
          {
            body: {
              contains: args.query,
              mode: 'insensitive'
            }
          }
        ]
      }
    });
  },
  comments(parent: any, args: any, ctx: any, info: any) {
    return ctx.prisma.comment.findMany({});
  },
  me() {
    return {
      id: '123098',
      name: 'Mike',
      email: 'mike@example.com',
    }
  }
}