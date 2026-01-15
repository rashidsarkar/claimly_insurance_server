import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '../user/user.const';

import Notification from './notification.model';
import QueryBuilder from '../../builder/QueryBuilder';
import getAdminNotificationCount from '../../helper/getAdminNotification';
import getNotificationCount from '../../helper/getUnseenNotification';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { getIO } from '../../socket/socket';
import { sendBatchPushNotification } from '../../helper/sendPushNotification';

const getAllNotificationFromDB = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: Record<string, any>,
  user: JwtPayload,
) => {
  if (user?.role === USER_ROLE.ADMIN) {
    const notificationQuery = new QueryBuilder(
      Notification.find({
        $or: [{ receiver: user.profileId }, { receiver: 'all' }],
        deleteBy: { $ne: user.profileId },
      }),
      query,
    )
      .search(['name'])
      .filter()
      .sort()
      .paginate();
    const result = await notificationQuery.modelQuery;
    const meta = await notificationQuery.countTotal();
    return { meta, result };
  } else {
    const notificationQuery = new QueryBuilder(
      Notification.find({
        $or: [{ receiver: user?.profileId }, { receiver: 'all' }],
        deleteBy: { $ne: user?.profileId },
      }),

      query,
    )
      .search(['title'])
      .filter()
      .sort()
      .paginate();

    const result = await notificationQuery.modelQuery;
    const meta = await notificationQuery.countTotal();
    return { meta, result };
  }
};

const seeNotification = async (user: JwtPayload) => {
  let result;
  const io = getIO();

  if (user?.role === USER_ROLE.ADMIN) {
    result = await Notification.updateMany(
      { $or: [{ receiver: user.profileId }, { receiver: 'all' }] },
      { $addToSet: { seenBy: user.profileId } },
      { runValidators: true, new: true },
    );

    const adminUnseenNotificationCount = await getAdminNotificationCount();
    const notificationCount = await getNotificationCount();

    io.emit('admin-notifications', adminUnseenNotificationCount);
    io.emit('notifications', notificationCount);
  }
  if (user?.role !== USER_ROLE.ADMIN) {
    result = await Notification.updateMany(
      { $or: [{ receiver: user.profileId }, { receiver: 'all' }] },
      { $addToSet: { seenBy: user.profileId } },
      { runValidators: true, new: true },
    );
  }
  const notificationCount = await getNotificationCount(user.profileId);
  io.to(user.profileId.toString()).emit('notifications', notificationCount);
  return result;
};

const deleteNotification = async (id: string, profileId: string) => {
  const notification = await Notification.findById(id);
  if (!notification) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Notification not found');
  }
  if (notification.receiver == profileId) {
    const reusult = await Notification.findByIdAndDelete(id);
    return reusult;
  } else if (notification.receiver == 'all') {
    const result = await Notification.findByIdAndUpdate(id, {
      $addToSet: { deleteBy: profileId },
    });
    return result;
  } else {
    return null;
  }
};

const createNotificationAndSend = async (
  receivers: string[], // ["user_id_1", "admin", "all"]
  title: string,
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
) => {
  const io = getIO();

  // ডাটাবেজে নোটিফিকেশন সেভ
  const notifications = await Promise.all(
    receivers.map(async (receiver) => {
      return await Notification.create({
        title,
        message,
        receiver,
        seenBy: [],
        deleteBy: [],
      });
    }),
  );

  // প্রতিটি রিসিভারের জন্য রিয়েল-টাইম আপডেট পাঠানো
  for (const receiver of receivers) {
    if (receiver === 'admin') {
      // অ্যাডমিনের জন্য
      const adminUnseenCount = await getAdminNotificationCount();
      io.emit('admin-notifications', adminUnseenCount);
    } else if (receiver === 'all') {
      // সবাইকে (সকল কানেক্টেড ক্লায়েন্ট)
      io.emit('notifications', {
        title,
        message,
        type: 'broadcast',
      });
    } else {
      // নির্দিষ্ট ইউজারকে (তার রুমে)
      const userNotificationCount = await getNotificationCount(receiver);
      io.to(receiver).emit('notifications', {
        title,
        message,
        count: userNotificationCount.unseenCount,
        data,
      });
    }
  }

  // পুশ নোটিফিকেশন পাঠানো (যদি প্রয়োজন হয়)
  const userReceivers = receivers.filter((r) => r !== 'admin' && r !== 'all');
  if (userReceivers.length > 0) {
    await sendBatchPushNotification(userReceivers, title, message, data);
  }

  return notifications;
};

const createNotification = async (
  receivers: string | string[],
  title: string,
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
) => {
  const io = getIO();

  // Single receiver কে array তে convert
  const receiverArray = Array.isArray(receivers) ? receivers : [receivers];

  const notifications = [];

  for (const receiver of receiverArray) {
    const notification = await Notification.create({
      title,
      message,
      receiver,
      seenBy: [],
      deleteBy: [],
    });
    notifications.push(notification);

    // রিয়েল-টাইম আপডেট পাঠানো
    if (receiver === 'admin') {
      const count = await getAdminNotificationCount();
      io.emit('admin-notifications', count);
    } else if (receiver === 'all') {
      // সব ক্লায়েন্টকে ব্রডকাস্ট
      io.emit('new-notification', {
        title,
        message,
        type: 'broadcast',
      });
    } else {
      // নির্দিষ্ট ইউজারকে
      const count = await getNotificationCount(receiver);
      io.to(receiver).emit('new-notification', {
        title,
        message,
        count: count.unseenCount,
        _id: notification._id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        createdAt: (notification as any).createdAt,
        data,
      });
    }
  }

  return notifications;
};

const notificationService = {
  getAllNotificationFromDB,
  seeNotification,
  deleteNotification,
  createNotificationAndSend,
  createNotification,
};

export default notificationService;
