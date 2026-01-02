import { z } from 'zod';

export const updateInsurerData = z.object({
  body: z.object({}),
});

const InsurerValidations = { updateInsurerData };
export default InsurerValidations;
