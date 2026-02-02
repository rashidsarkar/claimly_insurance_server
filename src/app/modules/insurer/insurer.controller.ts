import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import InsurerServices from './insurer.service';
import sendResponse from '../../utils/sendResponse';
import { getCloudFrontUrl } from '../../utils/multer-s3-uploader';

const createInsurer = catchAsync(async (req, res) => {
  // const { files } = req;

  // if (files && typeof files === 'object') {
  //   if ('supporting_Documents' in files) {
  //     req.body.supporting_Documents = files['supporting_Documents'].map(
  //       (file) => file.path,
  //     );
  //   }
  // }

  const file: any = req.files?.supporting_Documents;

  if (req.files?.supporting_Documents) {
    req.body.supporting_Documents = getCloudFrontUrl(file[0].key);
  }

  console.log(req.body);

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
  // const { files } = req;

  // if (files && typeof files === 'object') {
  //   if ('report_Document' in files) {
  //     req.body.report_Document = files['report_Document'].map(
  //       (file) => file.path,
  //     );
  //   }
  // }
  const file: any = req.files?.report_Document;

  if (req.files?.report_Document) {
    req.body.report_Document = getCloudFrontUrl(file[0].key);
  }

  const result = await InsurerServices.updateInsurer(req.params.id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Insurer record updated successfully',
    data: result,
  });
});

const deleteInsurer = catchAsync(async (req, res) => {
  const result = await InsurerServices.deleteInsurer(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Insurer record deleted successfully',
    data: result,
  });
});

const getMyInsurers = catchAsync(async (req, res) => {
  const result = await InsurerServices.getMyInsurers(
    req.user.profileId,
    req.params.status,
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
  deleteInsurer,
};
export default InsurerController;
