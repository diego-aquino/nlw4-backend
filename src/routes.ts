import { Router } from 'express';
import SurveysController from './controllers/SurveysController';
import UserController from './controllers/UserController';

const router = Router();

const userController = new UserController();
router.post('/users', userController.create);

const surveyController = new SurveysController();
router.post('/surveys', surveyController.create);

export default router;
