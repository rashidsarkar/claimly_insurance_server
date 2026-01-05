import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';
import validateRequest from '../../middlewares/validateRequest';
import ClaimlyGuideValidations from './claimlyGuide.validation';
import ClaimlyGuideController from './claimlyGuide.controller';
const router = express.Router();

/**
 * Admin only
 */
router.post(
  '/',
  auth(USER_ROLE.ADMIN),
  validateRequest(ClaimlyGuideValidations.createClaimlyGuide),
  ClaimlyGuideController.createClaimlyGuide,
);

router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN),
  validateRequest(ClaimlyGuideValidations.updateClaimlyGuide),
  ClaimlyGuideController.updateClaimlyGuide,
);

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  ClaimlyGuideController.deleteClaimlyGuide,
);

/**
 * Public / User
 */
router.get('/', ClaimlyGuideController.getAllClaimlyGuides);
router.get('/:id', ClaimlyGuideController.getSingleClaimlyGuide);

export const claimlyGuideRoutes = router;
