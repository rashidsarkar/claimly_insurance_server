import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '../user/user.const';
import Notification from './notification.model';
import QueryBuilder from '../../builder/QueryBuilder';

const getAllNotificationFromDB = async (
  query: Record<string, any>,
  user: JwtPayload,
) => {
  const searchField = user?.role === USER_ROLE.ADMIN ? 'name' : 'title';

  const notificationQuery = new QueryBuilder(
    Notification.find({
      $or: [{ receiver: user.profileId }, { receiver: 'all' }],
      deleteBy: { $ne: user.profileId },
    }),
    query,
  )
    .search([searchField])
    .filter()
    .sort()
    .paginate();

  const result = await notificationQuery.modelQuery;
  const meta = await notificationQuery.countTotal();
  return { meta, result };
};

const seeNotification = async (user: JwtPayload) => {
  const result = await Notification.updateMany(
    {
      $or: [{ receiver: user.profileId }, { receiver: 'all' }],
      seenBy: { $ne: user.profileId }, // Only update those not seen yet
    },
    { $addToSet: { seenBy: user.profileId } },
    { runValidators: true },
  );
  return result;
};

const deleteNotification = async (id: string, profileId: string) => {
  const notification = await Notification.findById(id);

  if (!notification) {
    return null;
  }

  // If it's a direct notification to one person, delete it completely
  if (notification.receiver === profileId) {
    return await Notification.findByIdAndDelete(id);
  }

  // If it's a broadcast ('all'), just add the user to deleteBy list
  if (notification.receiver === 'all') {
    return await Notification.findByIdAndUpdate(
      id,
      {
        $addToSet: { deleteBy: profileId },
      },
      { new: true },
    );
  }

  return null;
};

const createNotification = async (
  receivers: string | string[],
  title: string,
  message: string,
) => {
  const receiverArray = Array.isArray(receivers) ? receivers : [receivers];

  const notifications = await Promise.all(
    receiverArray.map((receiver) =>
      Notification.create({
        title,
        message,
        receiver,
        seenBy: [],
        deleteBy: [],
      }),
    ),
  );

  return notifications;
};

const notificationService = {
  getAllNotificationFromDB,
  seeNotification,
  deleteNotification,
  createNotification,
};

export default notificationService;
