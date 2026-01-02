import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { IInsurer } from './insurer.interface';
import Insurer from './insurer.model';

const createInsurer = async (userId: string, payload: Partial<IInsurer>) => {
  return await Insurer.create({
    ...payload,
    normalUserId: userId,
  });
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
};
export default InsurerServices;
