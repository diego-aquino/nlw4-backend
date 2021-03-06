import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import SurveysRepository from '../repositories/SurveysRepository';

class SurveysController {
  async create(request: Request, response: Response): Promise<Response> {
    const { title, description } = request.body;

    const surveysRepository = getCustomRepository(SurveysRepository);

    const survey = surveysRepository.create({ title, description });
    await surveysRepository.save(survey);

    return response.status(201).json(survey);
  }

  async list(_request: Request, response: Response): Promise<Response> {
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveys = await surveysRepository.find({});

    return response.status(200).json(surveys);
  }
}

export default SurveysController;
