import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import ClaimlyGuideServices from './claimlyGuide.service';

const createClaimlyGuide = catchAsync(async (req, res) => {
  const result = await ClaimlyGuideServices.createClaimlyGuide(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Claimly guide created successfully',
    data: result,
  });
});

const getAllClaimlyGuides = catchAsync(async (_req, res) => {
  const result = await ClaimlyGuideServices.getAllClaimlyGuides();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Claimly guides fetched successfully',
    data: result,
  });
});

const getSingleClaimlyGuide = catchAsync(async (req, res) => {
  const result = await ClaimlyGuideServices.getSingleClaimlyGuide(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    data: result,
  });
});

const updateClaimlyGuide = catchAsync(async (req, res) => {
  const result = await ClaimlyGuideServices.updateClaimlyGuide(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Claimly guide updated successfully',
    data: result,
  });
});

const deleteClaimlyGuide = catchAsync(async (req, res) => {
  const result = await ClaimlyGuideServices.deleteClaimlyGuide(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Claimly guide deleted successfully',
    data: result,
  });
});

const ClaimlyGuideController = {
  createClaimlyGuide,
  getAllClaimlyGuides,
  getSingleClaimlyGuide,
  updateClaimlyGuide,
  deleteClaimlyGuide,
};

export default ClaimlyGuideController;
