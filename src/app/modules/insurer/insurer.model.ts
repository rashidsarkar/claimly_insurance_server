import { model, Schema } from 'mongoose';
import { IInsurer } from './insurer.interface';

const insurerSchema = new Schema<IInsurer>(
  {
    normalUserId: {
      type: Schema.Types.ObjectId,
      ref: 'NormalUser',
      required: true,
    },

    insurerName: { type: String, required: true },
    policyType: {
      type: String,
      enum: [
        'Comprehensive',
        'Comprehensive Basic',
        'Third Party Fire & Theft',
        'Third Party Property Damage',
        'Other / Not sure',
      ],
      required: true,
    },

    incidentDate: { type: Date, required: true },
    firstNotifiedDate: { type: Date, required: true },

    incidentDescription: { type: String, required: true },
    insurerResponse: String,
    userConcern: String,

    complaintMade: {
      type: String,
      enum: ['no', 'yesWithInsurer', 'yesWithAfca'],
      default: 'no',
    },
    complaintStatus: String,

    supporting_Documents: [String],
    report_Document: String,

    failureNote: String,
    status: {
      type: String,
      enum: ['underReview', 'reportReady', 'failed'],
      default: 'underReview',
    },
  },
  { timestamps: true },
);

/**
 * 🔒 Business Rule (DB-level safety):
 * If status === 'failed', failureNote must exist
 */
insurerSchema.pre('save', function (next) {
  if (this.status === 'failed' && !this.failureNote) {
    return next(new Error('failureNote is required when status is failed'));
  }
  next();
});

const Insurer = model<IInsurer>('Insurer', insurerSchema);
export default Insurer;
