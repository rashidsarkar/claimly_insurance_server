import { model, Schema } from 'mongoose';
import { IClaimlyGuide } from './claimlyGuide.interface';

const claimlyGuideSchema = new Schema<IClaimlyGuide>(
  {
    title: { type: String, required: true, trim: true },
    details: { type: String, required: true },
  },
  { timestamps: true },
);

const ClaimlyGuide = model<IClaimlyGuide>('ClaimlyGuide', claimlyGuideSchema);
export default ClaimlyGuide;
