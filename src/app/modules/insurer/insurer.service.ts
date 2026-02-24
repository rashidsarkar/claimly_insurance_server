import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { IInsurer } from './insurer.interface';
import Insurer from './insurer.model';
import mongoose from 'mongoose';
import unlinkFile from '../../utils/unLinkFile';
import config from '../../config';
import { emailSender } from '../../utils/emailSender';
import notificationService from '../notification/notification.services';
import { USER_ROLE } from '../user/user.const';
import NormalUser from '../normalUser/normalUser.model';
const adminEmail = config.admin_email;

// const createInsurer = async (
//   userId: string,
//   payload: Partial<IInsurer>,
//   email: string,
// ) => {
//   return await Insurer.create({
//     ...payload,
//     normalUserId: userId,
//   });
//   const adminEmail = config.admin_email;
// };
const createInsurer = async (userId: string, payload: Partial<IInsurer>) => {
  // 1. Create the Insurer in Database
  const result = await Insurer.create({
    ...payload,
    normalUserId: userId,
  });

  // // 2. Create Notifications (Database only)
  // // Notification for User
  // await notificationService.createNotification(
  //   userId, // Assuming userId is the profileId/receiver
  //   'Insurer Profile Created',
  //   'Your insurer profile has been successfully created at Claimly.',
  // );

  // Notification for Admin
  await notificationService.createNotification(
    USER_ROLE.ADMIN, // Or the specific Admin ID
    'New Claimly submitted',
    `A new claim has been submitted`,
    //     New Claimly submitted

    // A new claim has been submitted
  );

  // 3. Send Emails (Microsoft Graph API)
  try {
    // // Email to User
    // const userHtml = `
    //   <h1>Welcome to Claimly</h1>
    //   <p>Hello,</p>
    //   <p>Your insurer profile has been successfully created. You can now manage your claims.</p>
    // `;
    // emailSender(userEmail, userHtml);

    // Email to Admin
    const adminHtml = `
      <h1>New Insurer Alert</h1>
      <p>New insurer registered on the platform.</p>
   
    `;
    if (adminEmail) {
      await emailSender(adminEmail, adminHtml);
    }
  } catch (error) {
    // We log the error but don't necessarily want to crash the whole process
    // if the insurer was already saved successfully.
    console.error('Email sending failed:', error);
  }

  return result;
};

const getMyInsurers = async (userId: string, status?: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid user id');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {
    normalUserId: new mongoose.Types.ObjectId(userId),
  };

  if (status) {
    query.status = status;
  }

  const result = await Insurer.find(query)
    .sort({ createdAt: -1 })
    .populate('normalUserId');

  // if (result.length === 0) {
  //   throw new AppError(StatusCodes.NOT_FOUND, 'No insurer record found');
  // }

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
  // ১. ইনস্যুরার খুঁজে বের করা এবং ইউজার পপুলেট করা
  const insurer = await Insurer.findById(id).populate('normalUserId');

  if (!insurer) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Insurer record not found');
  }

  // ২. পপুলেটেড অবজেক্ট থেকে ইমেইল সংগ্রহ করা
  // পপুলেট করার পর normalUserId আর শুধু আইডি থাকে না, এটি একটি অবজেক্ট হয়ে যায়।
  const userData = insurer.normalUserId as any;
  const targetEmail = userData?.email;
  const targetName = userData?.fullName || 'User';

  // ৩. ইমেইল পাঠানো (যদি স্ট্যাটাস আপডেট হয়)
  if (targetEmail && payload.status) {
    try {
      const reportLink = `https://claimly-with-api.vercel.app/my_claims`;
      // const userHtml = `
      //   <h1>Your Insurer  Has Been Updated</h1>
      //   <p>Hello,${targetName}</p>
      //   <p>Your insurer  has been updated. Current status: <strong>${payload.status}</strong></p>
      // `;
      const userHtml = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
    
    <p>Hello ${targetName},</p>

    <p>
      There was an update with your Claimly report..
    </p>

      <p>
      <a href="${reportLink}" 
         style="
           background-color: #2563eb;
           color: white;
           padding: 10px 18px;
           text-decoration: none;
           border-radius: 6px;
           display: inline-block;
         ">
         View My Report
      </a>
    </p>

    <p>
      If you have any questions, feel free to reply to this email.
    </p>

    <p>
      Warm Regards,<br/>
      Claimly Support.
    </p>

  </div>
`;

      await emailSender(targetEmail, userHtml);
      console.log(`Email sent to: ${targetEmail}`);
    } catch (error) {
      console.error('Email sending failed:', error);
      // ইমেইল না গেলে পুরো প্রসেস থামিয়ে দিতে চাইলে throw করতে পারেন,
      // নাহলে শুধু লগ করে রাখতে পারেন।
    }
  }

  // ৪. ডাটাবেজ আপডেট করা
  const result = await Insurer.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};
const deleteInsurer = async (id: string) => {
  const insurer = await Insurer.findById(id);
  if (!insurer) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Insurer record not found');
  }

  if (insurer.supporting_Documents) {
    if (insurer.supporting_Documents.length > 0) {
      for (const image of insurer.supporting_Documents) {
        console.log(image + ' this is deleted');
        unlinkFile(image);
      }
    }
  }

  if (insurer.report_Document) {
    if (insurer.report_Document?.length > 0) {
      for (const image of insurer.report_Document) {
        console.log(image + ' this is deleted');
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
