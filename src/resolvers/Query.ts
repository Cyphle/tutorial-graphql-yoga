export const Query = {
  users: async (parent: any, args: any, ctx: any, info: any) => {
    const requestForPosts = info
        .fieldNodes
        .find((node: any) => node.name.value === 'users')
        ?.selectionSet
        .selections
        .map((selection: any) => selection.name.value)
        .includes('posts');

    if (!args.query) {
      let findMany1 = await ctx.prisma.user.findMany({
        include: {
          posts: requestForPosts
        },
      });

      return findMany1;
    }

    let findMany = await ctx.prisma.user.findMany({
      where: {
        name: {
          contains: args.query,
          mode: 'insensitive'
        }
      }
    });

    console.log(findMany);
    return findMany;
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