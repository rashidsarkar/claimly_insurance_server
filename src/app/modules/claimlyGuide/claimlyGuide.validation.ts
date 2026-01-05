import { z } from 'zod';

const createClaimlyGuide = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    details: z.string({ required_error: 'Details are required' }),
  }),
});

const updateClaimlyGuide = z.object({
  body: z.object({
    title: z.string().optional(),
    details: z.string().optional(),
  }),
});

const ClaimlyGuideValidations = {
  createClaimlyGuide,
  updateClaimlyGuide,
};

export default ClaimlyGuideValidations;
