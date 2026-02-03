/* eslint-disable no-unused-vars */
import { Types } from 'mongoose';

export enum ENUM_POLICY_TYPE {
  COMPREHENSIVE = 'COMPREHENSIVE',
  COMPREHENSIVE_BASIC = 'COMPREHENSIVE_BASIC',
  THIRD_PARTY_FIRE_AND_THEFT = 'THIRD_PARTY_FIRE_AND_THEFT',
  THIRD_PARTY_PROPERTY_DAMAGE = 'THIRD_PARTY_PROPERTY_DAMAGE',
  OTHER = 'OTHER',
}

export enum ENUM_COMPLAINT_MADE {
  NO = 'NO',
  YES_WITH_INSURER = 'YES_WITH_INSURER',
  YES_WITH_AFCA = 'YES_WITH_AFCA',
}

export enum ENUM_INSURER_STATUS {
  UNDER_REVIEW = 'UNDER_REVIEW',
  REPORT_READY = 'REPORT_READY',
  FAILED = 'FAILED',
}

export enum ENUM_INSURER_NAME {
  NRMA = 'NRMA',
  AAMI = 'AAMI',
  ALLIANZ = 'Allianz',
  BUDGET_DIRECT = 'Budget Direct',
  SUNCORP = 'Suncorp',
  OTHER = 'Other',
}

export interface IInsurer {
  normalUserId: Types.ObjectId;

  insurerName: ENUM_INSURER_NAME;
  policyType: ENUM_POLICY_TYPE;
  notInsured: boolean;

  incidentDate: Date;
  firstNotifiedDate: Date;

  incidentDescription: string;
  insurerResponse?: string;
  userConcern?: string;

  complaintMade: ENUM_COMPLAINT_MADE;
  complaintStatus?: string;

  supporting_Documents?: string[];
  report_Document?: string;

  failureNote?: string;
  status: ENUM_INSURER_STATUS;
}
