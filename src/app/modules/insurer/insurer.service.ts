import httpStatus from "http-status";
import AppError from "../../error/appError";
import { IInsurer } from "./insurer.interface";
import Insurer from "./insurer.model";

const updateUserProfile = async (id: string, payload: Partial<IInsurer>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await Insurer.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await Insurer.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const InsurerServices = { updateUserProfile };
export default InsurerServices;