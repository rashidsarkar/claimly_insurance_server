import { z } from 'zod';
import {
  ENUM_POLICY_TYPE,
  ENUM_COMPLAINT_MADE,
  ENUM_INSURER_STATUS,
} from './insurer.interface';

/**
 * =============================
 * CREATE INSURER
 * =============================
 */
const createInsurer = z.object({
  body: z.object({
    insurerName: z.string().min(1, 'Insurer name is required'),

    policyType: z.nativeEnum(ENUM_POLICY_TYPE),

    incidentDate: z.string().datetime(),
    firstNotifiedDate: z.string().datetime(),

    incidentDescription: z.string().min(1, 'Incident description is required'),

    insurerResponse: z.string().optional(),
    userConcern: z.string().optional(),

    complaintMade: z
      .nativeEnum(ENUM_COMPLAINT_MADE)
      .optional()
      .default(ENUM_COMPLAINT_MADE.NO),

    complaintStatus: z.string().optional(),

    status: z
      .nativeEnum(ENUM_INSURER_STATUS)
      .optional()
      .default(ENUM_INSURER_STATUS.UNDER_REVIEW),
  }),
});

/**
 * =============================
 * UPDATE INSURER
 * =============================
 */
const updateInsurer = z.object({
  body: z
    .object({
      insurerName: z.string().optional(),

      policyType: z.nativeEnum(ENUM_POLICY_TYPE).optional(),

      insurerResponse: z.string().optional(),
      userConcern: z.string().optional(),

      complaintMade: z.nativeEnum(ENUM_COMPLAINT_MADE).optional(),
      complaintStatus: z.string().optional(),

      status: z.nativeEnum(ENUM_INSURER_STATUS).optional(),
      failureNote: z.string().optional(),
    })
    .refine(
      (data) =>
        !(data.status === ENUM_INSURER_STATUS.FAILED && !data.failureNote),
      {
        message: 'failureNote is required when status is FAILED',
        path: ['failureNote'],
      },
    ),
});

const getMyInsurer = z.object({
  body: z.object({
    status: z.nativeEnum(ENUM_INSURER_STATUS),
  }),
});

/**
 * =============================
 * EXPORT
 * =============================
 */
const InsurerValidations = {
  createInsurer,
  updateInsurer,
  getMyInsurer,
};

export default InsurerValidations;
