import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { UserValidation } from './user.validation';
import clientInfoParser from '../../middleware/clientInfoParser';
import { UserRole } from './user.interface';
import auth from '../../middleware/auth';

const router = Router();

router.get('/', auth(UserRole.ADMIN), UserController.getAllUser);

router.post(
  '/',
  clientInfoParser,
  validateRequest(UserValidation.userValidationSchema),
  UserController.registerUser,
);

export const UserRoutes = router;
