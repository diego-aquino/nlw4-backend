import 'reflect-metadata';
import express from 'express';
import { SERVER_PORT } from './config';

import './database';
import routes from './routes';

const app = express();
app.use(express.json());

app.use(routes);

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}...`);
});
