export const Comment = {
  author(parent: any, args: any, ctx: any, info: any) {
    return ctx.db.users.find((user: any) => {
      return user.id === parent.author;
    });
  },
  post(parent: any, args: any, ctx: any, info: any) {
    return ctx.db.posts.find((post: any) => {
      return post.id === parent.post;
    });
  }
}