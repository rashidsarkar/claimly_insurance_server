import express from 'express';
import auth from '../../middlewares/auth';

import MetaController from './meta.controller';
import { USER_ROLE } from '../user/user.const';

const router = express.Router();

router.get(
  '/meta-data',
  auth(USER_ROLE.ADMIN),
  MetaController.getDashboardMetaData,
);
router.get(
  '/user-chart-data',
  auth(USER_ROLE.ADMIN),
  MetaController.getNormalUserChartData,
);
// router.get(
//   '/provider-chart-data',
//   auth(USER_ROLE.ADMIN),
//   MetaController.getProviderChartData,
// );

export const metaRoutes = router;
