import { model, Schema } from 'mongoose';
import {
  ENUM_COMPLAINT_MADE,
  ENUM_INSURER_STATUS,
  ENUM_POLICY_TYPE,
  IInsurer,
} from './insurer.interface';

const insurerSchema = new Schema<IInsurer>(
  {
    normalUserId: {
      type: Schema.Types.ObjectId,
      ref: 'NormalUser',
      required: true,
    },

    insurerName: { type: String },
    policyType: {
      type: String,
      enum: Object.values(ENUM_POLICY_TYPE),
    },
    notInsured: { type: Boolean },

    incidentDate: { type: Date, required: true },
    firstNotifiedDate: { type: Date, required: true },

    incidentDescription: { type: String, required: true },
    insurerResponse: String,
    userConcern: String,

    complaintMade: {
      type: String,
      enum: Object.values(ENUM_COMPLAINT_MADE),
      default: ENUM_COMPLAINT_MADE.NO,
    },
    complaintStatus: String,

    supporting_Documents: [String],
    report_Document: [String],

    failureNote: String,
    status: {
      type: String,
      enum: Object.values(ENUM_INSURER_STATUS),
      default: ENUM_INSURER_STATUS.UNDER_REVIEW,
    },
  },
  { timestamps: true },
);

/**
 * 🔒 Business Rule (DB-level safety):
 * If status === 'failed', failureNote must exist
 */
insurerSchema.pre('save', function (next) {
  if (this.status === ENUM_INSURER_STATUS.FAILED && !this.failureNote) {
    return next(new Error('failureNote is required when status is FAILED'));
  } else if (
    this.status === ENUM_INSURER_STATUS.REPORT_READY &&
    !this.report_Document
  ) {
    return next(
      new Error('report_Document is required when status is REPORT_READY'),
    );
  }
  next();
});

const Insurer = model<IInsurer>('Insurer', insurerSchema);
export default Insurer;
