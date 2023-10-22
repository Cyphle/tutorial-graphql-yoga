import * as express from 'express';

export const expressConfig = () => {
  // @ts-ignore
  const app = express();
  // app.use(bodyParser.json({ limit: '50mb' }));
  // app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  // app.use(cors());

  return app;
};
