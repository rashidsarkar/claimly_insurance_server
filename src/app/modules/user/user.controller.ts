import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';

import { StatusCodes } from 'http-status-codes';
import { updateUserValidationSchema } from './user.validation';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { files } = req;
  if (files && typeof files === 'object' && 'profile_image' in files) {
    req.body.profile_image = files['profile_image'][0].path;
  }

  const result = await UserServices.createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message:
      'User registered successfully and verification email sent successfully',
    data: result,
  });
});
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const { files } = req;
  updateUserValidationSchema.parse({ body: req.body });
  // 1️⃣ Handle profile image upload
  if (files && typeof files === 'object' && 'profile_image' in files) {
    req.body.profile_image = files['profile_image'][0].path;
  }

  const result = await UserServices.updateMyProfileIntoDB(
    req.user.profileId,
    req.user.role,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

const getUsers = catchAsync(async (req, res) => {
  // console.log('test', req.tokenUser);
  const result = await UserServices.getUserFromDb();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User found',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const result = await UserServices.getMeFromDb(req.user?.email as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User found',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getMe,
  getUsers,
  updateMyProfile,
};
