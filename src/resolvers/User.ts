export const User = {
  posts(parent: any, args: any, ctx: any, info: any) {
    return ctx.db.posts.filter((post: any) => {
      return post.author === parent.id;
    });
  },
  comments(parent: any, args: any, ctx: any, info: any) {
    return ctx.db.comments.filter((comment: any) => {
      return comment.author === parent.id;
    });
  }
}