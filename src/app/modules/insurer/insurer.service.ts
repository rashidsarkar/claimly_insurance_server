import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { IInsurer } from './insurer.interface';
import Insurer from './insurer.model';
import mongoose from 'mongoose';

const createInsurer = async (userId: string, payload: Partial<IInsurer>) => {
  return await Insurer.create({
    ...payload,
    normalUserId: userId,
  });
};

const getMyInsurers = async (userId: string, status: string) => {
  console.log(userId, status);

  // const result = await Insurer.find({
  //   normalUserId: new mongoose.Types.ObjectId(userId),
  //   status: status,
  // }).sort({
  //   createdAt: -1,
  // });
  const result = await Insurer.find({
    normalUserId: new mongoose.Types.ObjectId(userId),
  });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Insurer record not found');
  }

  return result;
};

const getSingleInsurer = async (id: string) => {
  const insurer = await Insurer.findById(id);
  if (!insurer) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Insurer record not found');
  }
  return insurer;
};

const updateInsurer = async (id: string, payload: Partial<IInsurer>) => {
  if (payload.status === 'failed' && !payload.failureNote) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'failureNote is required when status is failed',
    );
  }

  const insurer = await Insurer.findById(id);
  if (!insurer) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Insurer record not found');
  }

  return await Insurer.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteInsurer = async (id: string) => {
  const insurer = await Insurer.findById(id);
  if (!insurer) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Insurer record not found');
  }
  return await Insurer.findByIdAndDelete(id);
};

const InsurerServices = {
  createInsurer,
  getSingleInsurer,
  updateInsurer,
  deleteInsurer,
  getMyInsurers,
};
export default InsurerServices;
