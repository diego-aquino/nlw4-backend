import request from 'supertest';
import { Connection } from 'typeorm';

import app from '../app';
import createConnection from '../database';

const TABLE_NAME = 'users';

interface User {
  name: string;
  email: string;
}

describe('User', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterEach(() => {
    connection.query(`DELETE FROM ${TABLE_NAME}`);
  });

  function expectUserToHaveBeenCreated(
    response: request.Response,
    expectedUser: User,
  ) {
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('created_at');
    expect(response.body).toMatchObject<User>({
      name: expectedUser.name,
      email: expectedUser.email,
    });
  }

  it('should be able to create a new user', async () => {
    const mockUser: User = { name: 'Example User', email: 'user@example.com' };
    const response = await request(app).post('/users').send(mockUser);
    expectUserToHaveBeenCreated(response, mockUser);
  });

  it('should not create a user with existing email', async () => {
    const mockUser: User = { name: 'Example User', email: 'user@example.com' };
    const validCreationResponse = await request(app)
      .post('/users')
      .send(mockUser);
    expectUserToHaveBeenCreated(validCreationResponse, mockUser);

    const mockUserWithSameEmail: User = {
      name: 'Another Example User',
      email: mockUser.email,
    };
    const invalidCreationResponse = await request(app)
      .post('/users')
      .send(mockUserWithSameEmail);
    expect(invalidCreationResponse.status).toBe(400);
  });
});
