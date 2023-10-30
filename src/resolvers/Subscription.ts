export const Subscription = {
  countdown: {
    // This will return the value on every 1 sec until it reaches 0
    subscribe: async function* (_: any, { from }: any) {
      for (let i = from; i >= 0; i--) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        yield { countdown: i }
      }
    }
  },
  count: {
    subscribe: (parent: any, args: any, ctx: any, info: any) => {
      let count = 0;

      setInterval(() => {
        count++;
        ctx.pubSub.publish('count', {
          count
        });
      }, 1000);

      return ctx.pubSub.subscribe('count');
    }
  }
}