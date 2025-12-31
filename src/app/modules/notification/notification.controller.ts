import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import notificationService from './notification.services';

const getAllNotification = catchAsync(async (req, res) => {
  const result = await notificationService.getAllNotificationFromDB(
    req?.query,
    req?.user,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Notification retrieved successfully',
    data: result,
  });
});

const seeNotification = catchAsync(async (req, res) => {
  const result = await notificationService.seeNotification(req?.user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Notification seen successfully',
    data: result,
  });
});

const deleteNotification = catchAsync(async (req, res) => {
  const result = await notificationService.deleteNotification(
    req.params.id,
    req.user.profileId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Notification removed',
    data: result,
  });
});

// const createNotification = async (req: Request, res: Response) => {
//   try {
//     const { receivers, title, message, data } = req.body;

//     const notifications = await notificationService.createNotification(
//       receivers,
//       title,
//       message,
//       data
//     );

//     res.status(201).json({
//       success: true,
//       message: 'Notification sent successfully',
//       data: notifications
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to send notification'
//     });
//   }
// };
const createNotification = catchAsync(async (req, res) => {
  const { receivers, title, message, data } = req.body;

  const result = await notificationService.createNotificationAndSend(
    receivers,
    title,
    message,
    data,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Notification sent successfully',
    data: result,
  });
});

const notificationController = {
  getAllNotification,
  seeNotification,
  deleteNotification,
  createNotification,
};

export default notificationController;
