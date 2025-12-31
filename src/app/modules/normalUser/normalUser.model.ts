import { model, Schema } from 'mongoose';
import { INormalUser } from './normalUser.interface';

const normalUserSchema = new Schema<INormalUser>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    profile_image: { type: String },
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE'],
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      required: true,
    },
    membershipId: { type: String, required: true },
    address: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    identificationNumber: { type: String, required: true },
  },
  { timestamps: true },
);

const NormalUser = model<INormalUser>('NormalUser', normalUserSchema);
export default NormalUser;
