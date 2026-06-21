import { celebrate } from 'celebrate';
import { Router } from 'express';
import {
  loginUser,
  refreshUserSession,
  registerUser,
} from '../controllers/authController';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validations/authValidation.js';

const router = Router();

router.post('/auth/register', celebrate(registerUserSchema), registerUser);
router.post('/ayth/login', celebrate(loginUserSchema), loginUser);
router.post('/auth/refresh', refreshUserSession);

export default router;
