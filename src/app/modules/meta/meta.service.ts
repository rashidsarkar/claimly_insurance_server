import Insurer from '../insurer/insurer.model';
import NormalUser from '../normalUser/normalUser.model';
import { User } from '../user/user.model';

const getDashboardMetaData = async () => {
  const [totalNormalUser, totalInsurer, totalBlockedUser] = await Promise.all([
    NormalUser.countDocuments(),
    Insurer.countDocuments(),
    User.countDocuments({
      isBlocked: true,
    }),
  ]);

  return {
    totalNormalUser,
    totalInsurer,
    totalBlockedUser,
  };
};

const getNormalUserChartData = async (year: number) => {
  const startOfYear = new Date(year, 0, 1);

  const endOfYear = new Date(year + 1, 0, 1);

  const chartData = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfYear,
          $lt: endOfYear,
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        totalUser: { $sum: 1 },
      },
    },
    {
      $project: {
        month: '$_id',
        totalUser: 1,
        _id: 0,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const data = Array.from({ length: 12 }, (_, index) => ({
    month: months[index],
    totalUser:
      chartData.find((item) => item.month === index + 1)?.totalUser || 0,
  }));

  const yearsResult = await NormalUser.aggregate([
    {
      $group: {
        _id: { $year: '$createdAt' },
      },
    },
    {
      $project: {
        year: '$_id',
        _id: 0,
      },
    },
    {
      $sort: { year: 1 },
    },
  ]);

  const yearsDropdown = yearsResult.map((item: any) => item.year);

  return {
    chartData: data,
    yearsDropdown,
  };
};

// const getProviderChartData = async (year: number) => {
//   const startOfYear = new Date(year, 0, 1);

//   const endOfYear = new Date(year + 1, 0, 1);

//   const chartData = await Provider.aggregate([
//     {
//       $match: {
//         createdAt: {
//           $gte: startOfYear,
//           $lt: endOfYear,
//         },
//       },
//     },
//     {
//       $group: {
//         _id: { $month: '$createdAt' },
//         totalUser: { $sum: 1 },
//       },
//     },
//     {
//       $project: {
//         month: '$_id',
//         totalUser: 1,
//         _id: 0,
//       },
//     },
//     {
//       $sort: { month: 1 },
//     },
//   ]);

//   const months = [
//     'Jan',
//     'Feb',
//     'Mar',
//     'Apr',
//     'May',
//     'Jun',
//     'Jul',
//     'Aug',
//     'Sep',
//     'Oct',
//     'Nov',
//     'Dec',
//   ];

//   const data = Array.from({ length: 12 }, (_, index) => ({
//     month: months[index],
//     totalUser:
//       chartData.find((item) => item.month === index + 1)?.totalUser || 0,
//   }));

//   const yearsResult = await Provider.aggregate([
//     {
//       $group: {
//         _id: { $year: '$createdAt' },
//       },
//     },
//     {
//       $project: {
//         year: '$_id',
//         _id: 0,
//       },
//     },
//     {
//       $sort: { year: 1 },
//     },
//   ]);

//   const yearsDropdown = yearsResult.map((item: any) => item.year);

//   return {
//     chartData: data,
//     yearsDropdown,
//   };
// };
const MetaService = {
  getDashboardMetaData,
  getNormalUserChartData,
  // getProviderChartData,
};

export default MetaService;
