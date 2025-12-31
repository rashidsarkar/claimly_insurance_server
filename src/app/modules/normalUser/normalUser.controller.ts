import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import normalUserServices from './normalUser.service';

// const updateUserProfile = catchAsync(async (req, res) => {
//   const { files } = req;
//   if (files && typeof files === 'object' && 'profile_image' in files) {
//     req.body.profile_image = files['profile_image'][0].path;
//   }
//   const result = await normalUserServices.updateUserProfile(
//     req.user.profileId,
//     req.body,
//   );
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Profile updated successfully',
//     data: result,
//   });
// });

const getSingleNormalUserProfile = catchAsync(async (req, res) => {
  const result = await normalUserServices.getSingleNormalUserProfile(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile found successfully',
    data: result,
  });
});
// const getAllNormalUsers = catchAsync(async (req, res) => {
//   const result = await normalUserServices.getAllNormalUsers(req.query);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Profiles found successfully',
//     data: result,
//   });
// });
// const getAllActiveNormalUsers = catchAsync(async (req, res) => {
//   const result = await normalUserServices.getAllActiveNormalUsers(req.query);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Profiles found successfully',
//     data: result,
//   });
// });

const getAllNormalUsers = catchAsync(async (req, res) => {
  const result = await normalUserServices.getAllNormalUsers(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All normal users fetched successfully',
    data: result,
  });
});

const getAllActiveNormalUsers = catchAsync(async (req, res) => {
  const result = await normalUserServices.getAllActiveNormalUsers(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Active normal users fetched successfully',
    data: result,
  });
});

const getAllBlockedNormalUsers = catchAsync(async (req, res) => {
  const result = await normalUserServices.getAllBlockNormalUsers(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Blocked normal users fetched successfully',
    data: result,
  });
});

const NormalUserController = {
  getSingleNormalUserProfile,
  getAllNormalUsers,
  getAllActiveNormalUsers,
  getAllBlockedNormalUsers,
};
export default NormalUserController;
