const express = require('express');

export const expressConfig = () => {
  const app = express();
  // app.use(bodyParser.json({ limit: '50mb' }));
  // app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  // app.use(cors());

  return app;
};
