import ClaimlyGuide from './claimlyGuide.model';
import { IClaimlyGuide } from './claimlyGuide.interface';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const createClaimlyGuide = async (payload: IClaimlyGuide) => {
  return await ClaimlyGuide.create(payload);
};

const getAllClaimlyGuides = async () => {
  return await ClaimlyGuide.find().sort({ createdAt: -1 });
};

const getSingleClaimlyGuide = async (id: string) => {
  const guide = await ClaimlyGuide.findById(id);
  if (!guide) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Claimly guide not found');
  }
  return guide;
};

const updateClaimlyGuide = async (
  id: string,
  payload: Partial<IClaimlyGuide>,
) => {
  const guide = await ClaimlyGuide.findById(id);
  if (!guide) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Claimly guide not found');
  }

  return await ClaimlyGuide.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteClaimlyGuide = async (id: string) => {
  const guide = await ClaimlyGuide.findById(id);
  if (!guide) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Claimly guide not found');
  }

  return await ClaimlyGuide.findByIdAndDelete(id);
};

const ClaimlyGuideServices = {
  createClaimlyGuide,
  getAllClaimlyGuides,
  getSingleClaimlyGuide,
  updateClaimlyGuide,
  deleteClaimlyGuide,
};

export default ClaimlyGuideServices;
