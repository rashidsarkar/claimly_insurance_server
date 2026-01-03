import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import InsurerServices from './insurer.service';
import sendResponse from '../../utils/sendResponse';

const createInsurer = catchAsync(async (req, res) => {
  const { files } = req;

  if (files && typeof files === 'object') {
    if ('supporting_Documents' in files) {
      req.body.supporting_Documents = files['supporting_Documents'].map(
        (file) => file.path,
      );
    }
  }

  const result = await InsurerServices.createInsurer(
    req.user.profileId,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Insurer record created successfully',
    data: result,
  });
});

const getMyInsurers = catchAsync(async (req, res) => {
  const result = await InsurerServices.getMyInsurers(
    req.user.profileId,
    req.body.status,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Insurer records fetched',
    data: result,
  });
});

const InsurerController = { createInsurer, getMyInsurers };
export default InsurerController;
