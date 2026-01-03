import express, { NextFunction, Request, Response } from 'express';
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
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(insurerValidations.createInsurer),
  insurerController.createInsurer,
);

router.get(
  '/my-insurers',
  auth(USER_ROLE.NORMALUSER),
  validateRequest(insurerValidations.getMyInsurer),
  insurerController.getMyInsurers,
);

export const insurerRoutes = router;
