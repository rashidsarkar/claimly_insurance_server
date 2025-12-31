import Appointment from '../appointment/appointment.model';
import NormalUser from '../normalUser/normalUser.model';
import Provider from '../provider/provider.model';

const getDashboardMetaData = async () => {
  const [totalNormalUser, totalProvider, activeAppointment] = await Promise.all(
    [
      NormalUser.countDocuments(),
      Provider.countDocuments(),
      Appointment.countDocuments({
        status: {
          $ne: 'CANCELLED',
        },
      }),
    ],
  );

  return {
    totalNormalUser,
    totalProvider,
    activeAppointment,
  };
};

const getNormalUserChartData = async (year: number) => {
  const startOfYear = new Date(year, 0, 1);

  const endOfYear = new Date(year + 1, 0, 1);

  const chartData = await NormalUser.aggregate([
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

const getProviderChartData = async (year: number) => {
  const startOfYear = new Date(year, 0, 1);

  const endOfYear = new Date(year + 1, 0, 1);

  const chartData = await Provider.aggregate([
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

  const yearsResult = await Provider.aggregate([
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
const MetaService = {
  getDashboardMetaData,
  getNormalUserChartData,
  getProviderChartData,
};

export default MetaService;
