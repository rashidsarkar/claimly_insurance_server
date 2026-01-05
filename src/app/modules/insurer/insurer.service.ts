import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { IInsurer } from './insurer.interface';
import Insurer from './insurer.model';
import mongoose from 'mongoose';
import unlinkFile from '../../utils/unLinkFile';

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

const getAllInsurers = async (query: Record<string, unknown>) => {
  /**
   * =============================
   * PAGINATION
   * =============================
   */
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  /**
   * =============================
   * =============================
   * DB QUERIES
   * =============================
   */
  const total = await Insurer.countDocuments();

  const result = await Insurer.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate('normalUserId');

  const totalPage = Math.ceil(total / limit);

  /**
   * =============================
   * RESPONSE
   * =============================
   */
  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

const getSingleInsurer = async (id: string) => {
  const insurer = await Insurer.findById(id).populate('normalUserId');
  if (!insurer) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Insurer record not found');
  }
  return insurer;
};

const updateInsurer = async (id: string, payload: Partial<IInsurer>) => {
  // if (payload.status === ENUM_INSURER_STATUS.FAILED && !payload.failureNote) {
  //   throw new AppError(
  //     StatusCodes.BAD_REQUEST,
  //     'failureNote is required when status is failed',
  //   );
  // }

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

  if (insurer.supporting_Documents) {
    if (insurer.supporting_Documents.length > 0) {
      for (const image of insurer.supporting_Documents) {
        unlinkFile(image);
      }
    }
  }

  if (insurer.report_Document) {
    if (insurer.report_Document?.length > 0) {
      for (const image of insurer.report_Document) {
        unlinkFile(image);
      }
    }
  }
  //   // delete files from storage
  // for (const image of insurer.supporting_Documents) {
  //   unlinkFile(image);
  // }

  return await Insurer.findByIdAndDelete(id);
};

const InsurerServices = {
  createInsurer,
  getSingleInsurer,
  updateInsurer,
  deleteInsurer,
  getMyInsurers,
  getAllInsurers,
};
export default InsurerServices;
