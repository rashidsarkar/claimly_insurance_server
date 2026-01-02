import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import insurerValidations from './insurer.validation';
import insurerController from './insurer.controller';
import { USER_ROLE } from '../user/user.const';
import { uploadFile } from '../../utils/fileUploader';

const router = express.Router();

router.post(
  '/create-insurer',
  auth(USER_ROLE.NORMALUSER),
  uploadFile(),
  validateRequest(insurerValidations.createInsurer),
  insurerController.createInsurer,
);

export const insurerRoutes = router;
