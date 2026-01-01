import { model, Schema } from "mongoose";
import { IInsurer } from "./insurer.interface";

const insurerSchema = new Schema<IInsurer>({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    profile_image: { type: String, default: "" },
    totalAmount: { type: Number, default: 0 },
    totalPoint: { type: Number, default: 0 }
}, { timestamps: true });

const Insurer = model<IInsurer>("Insurer", insurerSchema);
export default Insurer;