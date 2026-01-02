import { Types } from 'mongoose';

export type PolicyType =
  | 'Comprehensive'
  | 'Comprehensive Basic'
  | 'Third Party Fire & Theft'
  | 'Third Party Property Damage'
  | 'Other / Not sure';

export type ComplaintMade = 'no' | 'yesWithInsurer' | 'yesWithAfca';
export type InsurerStatus = 'underReview' | 'reportReady' | 'failed';

export interface IInsurer {
  normalUserId: Types.ObjectId;

  insurerName: string;
  policyType: PolicyType;

  incidentDate: Date;
  firstNotifiedDate: Date;

  incidentDescription: string;
  insurerResponse?: string;
  userConcern?: string;

  complaintMade: ComplaintMade;
  complaintStatus?: string;

  supporting_Documents?: string[];
  report_Document?: string;

  failureNote?: string;
  status: InsurerStatus;
}
