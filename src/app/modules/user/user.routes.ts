import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { UserValidation } from './user.validation';
import clientInfoParser from '../../middleware/clientInfoParser';

const router = Router();

router.post(
  '/',
  clientInfoParser,
  validateRequest(UserValidation.userValidationSchema),
  UserController.registerUser,
);

export const UserRoutes = router;
