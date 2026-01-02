import { z } from 'zod';

const createInsurer = z.object({
  body: z.object({
    insurerName: z.string(),
    policyType: z.enum([
      'Comprehensive',
      'Comprehensive Basic',
      'Third Party Fire & Theft',
      'Third Party Property Damage',
      'Other / Not sure',
    ]),
    incidentDate: z.string(),
    firstNotifiedDate: z.string(),
    incidentDescription: z.string(),

    insurerResponse: z.string().optional(),
    userConcern: z.string().optional(),

    complaintMade: z.enum(['no', 'yesWithInsurer', 'yesWithAfca']).optional(),
    complaintStatus: z.string().optional(),

    status: z.enum(['underReview']).optional(),
  }),
});

const updateInsurer = z.object({
  body: z
    .object({
      insurerName: z.string().optional(),
      policyType: z
        .enum([
          'Comprehensive',
          'Comprehensive Basic',
          'Third Party Fire & Theft',
          'Third Party Property Damage',
          'Other / Not sure',
        ])
        .optional(),

      insurerResponse: z.string().optional(),
      userConcern: z.string().optional(),

      complaintMade: z.enum(['no', 'yesWithInsurer', 'yesWithAfca']).optional(),
      complaintStatus: z.string().optional(),

      status: z.enum(['underReview', 'reportReady', 'failed']).optional(),
      failureNote: z.string().optional(),
    })
    .refine((data) => !(data.status === 'failed' && !data.failureNote), {
      message: 'failureNote is required when status is failed',
      path: ['failureNote'],
    }),
});

const InsurerValidations = {
  createInsurer,
  updateInsurer,
};

export default InsurerValidations;
