import { afterAll, beforeAll } from '@jest/globals';
import Connection from './connections';

const connection = new Connection();

beforeAll(async () => {
  await connection.connect();
});

afterAll(async () => {
  await connection.close();
});

export default { connection };
