import { z } from 'zod';

export const createNormalUserData = z.object({
  body: z.object({
    userId: z.string().optional(),
    profile_image: z.string().optional(),
    fullName: z.string().min(1, 'Full name is required'),
    dateOfBirth: z.string().datetime({ message: 'Invalid date' }),
    gender: z.enum(['MALE', 'FEMALE']),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
    membershipId: z.string(),
    address: z.string(),
    emergencyContact: z.string(),
    identificationNumber: z.string(),
    playerId: z.string().optional(),
  }),
});

const NormalUserValidations = { createNormalUserData };
export default NormalUserValidations;
