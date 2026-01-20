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
  body: z
    .object({
      // notInsured: z.boolean(),
      notInsured: z.preprocess((val) => val === 'true', z.boolean()),

      insurerName: z.string().optional(),
      policyType: z.nativeEnum(ENUM_POLICY_TYPE).optional(),

      incidentDate: z.string().datetime(),
      firstNotifiedDate: z.string().datetime(),

      incidentDescription: z
        .string()
        .min(1, 'Incident description is required'),

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
    })
    .superRefine((data, ctx) => {
      if (data.notInsured === false) {
        // insurerName required
        if (!data.insurerName || data.insurerName.trim() === '') {
          ctx.addIssue({
            path: ['insurerName'],
            message: 'Insurer name is required when not insured',
            code: z.ZodIssueCode.custom,
          });
        }

        // policyType required
        if (!data.policyType) {
          ctx.addIssue({
            path: ['policyType'],
            message: 'Policy type is required when not insured',
            code: z.ZodIssueCode.custom,
          });
        }
      }
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
      status: z.nativeEnum(ENUM_INSURER_STATUS),
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
  // .refine(
  //   (data) =>
  //     !(
  //       data.status === ENUM_INSURER_STATUS.REPORT_READY &&
  //       !data.report_Document
  //     ),
  //   {
  //     message: 'report_Document is required when status is REPORT_READY',
  //     path: ['report_Document'],
  //   },
  // ),
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
