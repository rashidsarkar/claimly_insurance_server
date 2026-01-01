import { z } from "zod";

export const updateInsurerData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const InsurerValidations = { updateInsurerData };
export default InsurerValidations;