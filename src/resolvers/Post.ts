export const Post = {
  author(parent: any, args: any, ctx: any, info: any) {
    return ctx.db.users.find((user: any) => {
      return user.id === parent.author;
    });
  },
  comments(parent: any, args: any, ctx: any, info: any) {
    return ctx.db.comments.filter((comment: any) => {
      return comment.post === parent.id;
    });
  }
}