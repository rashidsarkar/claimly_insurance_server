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

const updateInsurer = catchAsync(async (req, res) => {
  const { files } = req;

  if (files && typeof files === 'object') {
    if ('report_Document' in files) {
      req.body.report_Document = files['report_Document'].map(
        (file) => file.path,
      );
    }
  }

  const result = await InsurerServices.updateInsurer(req.params.id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Insurer record updated successfully',
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

const getAllInsurers = catchAsync(async (req, res) => {
  const result = await InsurerServices.getAllInsurers(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Insurer records fetched',
    data: result,
  });
});

const getSingleInsurer = catchAsync(async (req, res) => {
  const result = await InsurerServices.getSingleInsurer(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Insurer record fetched',
    data: result,
  });
});

const InsurerController = {
  createInsurer,
  getMyInsurers,
  getAllInsurers,
  getSingleInsurer,
  updateInsurer,
};
export default InsurerController;
