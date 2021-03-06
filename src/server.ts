import 'reflect-metadata';

import { SERVER_PORT } from './config';
import app from './app';

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}...`);
});
