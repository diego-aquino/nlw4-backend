import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import SurveysRepository from '../repositories/SurveysRepository';
import SurveyUsersRepository from '../repositories/SurveyUserRepository';
import UsersRepository from '../repositories/UsersRepository';

class SendMailController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { email, surveyId } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveyUsersRepository = getCustomRepository(SurveyUsersRepository);

    const user = await usersRepository.findOne({ email });
    if (!user) {
      return response.status(400).json({ error: 'User not found' });
    }

    const survey = await surveysRepository.findOne({ id: surveyId });
    if (!survey) {
      return response.status(400).json({ error: 'Survey not found' });
    }

    const existingSurveyUser = await surveyUsersRepository.findOne({
      where: [{ user_id: user.id, survey_id: survey.id }],
      relations: ['user', 'survey'],
    });
    if (existingSurveyUser) {
      return response.status(200).json(existingSurveyUser);
    }

    const surveyUser = surveyUsersRepository.create({
      user_id: user.id,
      survey_id: survey.id,
    });
    await surveyUsersRepository.save(surveyUser);

    return response.status(201).json(surveyUser);
  }
}

export default SendMailController;
