import { Types } from 'mongoose';
import NormalUser from './normalUser.model';

const getSingleNormalUserProfile = async (profileId: string) => {
  const result = await NormalUser.aggregate([
    {
      $match: { _id: new Types.ObjectId(profileId) },
    },
    {
      $lookup: {
        from: 'users',
        let: { normalUserId: { $toString: '$_id' } },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$profileId', '$$normalUserId'] },
                  // { $eq: ['$isBlocked', true] }, // only active users
                ],
              },
            },
          },
          {
            $project: {
              password: 0,
              verifyEmailOTP: 0,
              verifyEmailOTPExpire: 0,
              isResetOTPVerified: 0,
              __v: 0,
            },
          },
        ],
        as: 'user',
      },
    },
    {
      $lookup: {
        from: 'medicaldocuments',
        localField: '_id',
        foreignField: 'normalUserId',
        as: 'medicalDocument',
      },
    },
  ]);
  return result;
};

const getAllNormalUsers = async (query: Record<string, unknown>) => {
  // 1️⃣ PAGINATION SETUP
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // 2️⃣ GET TOTAL COUNT
  const total = await NormalUser.countDocuments();

  // 3️⃣ GET PAGINATED DATA
  const result = await NormalUser.aggregate([
    {
      $lookup: {
        from: 'medicaldocuments',
        localField: '_id',
        foreignField: 'normalUserId',
        as: 'medicalDocument',
      },
    },
    {
      $lookup: {
        from: 'users',
        let: { normalUserId: { $toString: '$_id' } },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$profileId', '$$normalUserId'],
              },
            },
          },
          {
            $project: {
              password: 0, // ❌ remove password
              verifyEmailOTP: 0,
              verifyEmailOTPExpire: 0,
              isResetOTPVerified: 0,
              __v: 0,
            },
          },
        ],
        as: 'user',
      },
    },
  ])
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); // optional

  const totalPage = Math.ceil(total / limit);

  // 4️⃣ RETURN DATA + META
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

const getAllActiveNormalUsers = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // 1️⃣ Aggregation pipeline with $facet (data + total count in one query)
  const aggResult = await NormalUser.aggregate([
    {
      $lookup: {
        from: 'users',
        let: { normalUserId: { $toString: '$_id' } },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$profileId', '$$normalUserId'] },
                  { $eq: ['$isBlocked', false] }, // only active users
                ],
              },
            },
          },
          {
            $project: {
              password: 0,
              verifyEmailOTP: 0,
              verifyEmailOTPExpire: 0,
              isResetOTPVerified: 0,
              __v: 0,
            },
          },
        ],
        as: 'user',
      },
    },
    { $match: { user: { $ne: [] } } }, // only NormalUsers that have active users
    {
      $lookup: {
        from: 'medicaldocuments',
        localField: '_id',
        foreignField: 'normalUserId',
        as: 'medicalDocument',
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    },
  ]);

  const data = aggResult[0].data;
  const totalCount = aggResult[0].totalCount[0]?.count || 0;
  const totalPage = Math.ceil(totalCount / limit);

  return {
    meta: { page, limit, total: totalCount, totalPage },
    data,
  };
};
const getAllBlockNormalUsers = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // 1️⃣ Aggregation pipeline with $facet (data + total count in one query)
  const aggResult = await NormalUser.aggregate([
    {
      $lookup: {
        from: 'users',
        let: { normalUserId: { $toString: '$_id' } },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$profileId', '$$normalUserId'] },
                  { $eq: ['$isBlocked', true] }, // only active users
                ],
              },
            },
          },
          {
            $project: {
              password: 0,
              verifyEmailOTP: 0,
              verifyEmailOTPExpire: 0,
              isResetOTPVerified: 0,
              __v: 0,
            },
          },
        ],
        as: 'user',
      },
    },
    { $match: { user: { $ne: [] } } }, // only NormalUsers that have active users
    {
      $lookup: {
        from: 'medicaldocuments',
        localField: '_id',
        foreignField: 'normalUserId',
        as: 'medicalDocument',
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    },
  ]);

  const data = aggResult[0].data;
  const totalCount = aggResult[0].totalCount[0]?.count || 0;
  const totalPage = Math.ceil(totalCount / limit);

  return {
    meta: { page, limit, total: totalCount, totalPage },
    data,
  };
};
const NormalUserServices = {
  getSingleNormalUserProfile,
  getAllNormalUsers,
  getAllActiveNormalUsers,
  getAllBlockNormalUsers,
};
export default NormalUserServices;
