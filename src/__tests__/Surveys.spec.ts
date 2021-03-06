import request from 'supertest';
import { Connection } from 'typeorm';

import app from '../app';
import createConnection from '../database';

const TABLE_NAME = 'surveys';

interface Survey {
  title: string;
  description: string;
}

describe('Survey', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterEach(() => {
    connection.query(`DELETE FROM ${TABLE_NAME}`);
  });

  function expectSurveyToHaveBeenCreated(
    response: request.Response,
    expectedSurvey: Survey,
  ) {
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('created_at');
    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject<Survey>({
      title: expectedSurvey.title,
      description: expectedSurvey.description,
    });
  }

  it('should be able to create a new survey', async () => {
    const mockSurvey: Survey = {
      title: 'Example Survey',
      description: 'Survey description',
    };

    const response = await request(app).post('/surveys').send(mockSurvey);
    expectSurveyToHaveBeenCreated(response, mockSurvey);
  });

  it('should be able to list all surveys', async () => {
    const mockSurveys: Survey[] = [
      {
        title: 'Example Survey',
        description: 'Survey description',
      },
      {
        title: 'Example Survey 2',
        description: 'Survey description 2',
      },
    ];

    await Promise.all(
      mockSurveys.map((survey) => request(app).post('/surveys').send(survey)),
    );

    const response = await request(app).get('/surveys');

    expect(response.body.length).toBe(2);
    expect(response.body).toEqual(
      expect.arrayContaining(
        mockSurveys.map((survey) => expect.objectContaining(survey)),
      ),
    );
  });
});
