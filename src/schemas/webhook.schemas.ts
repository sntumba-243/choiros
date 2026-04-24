import { z } from 'zod'

export const checkoutSessionMetadataSchema = z.object({
  choirName: z.string().optional(),
  adminName: z.string().optional(),
  email: z.string().optional(),
  choirSize: z.string().optional(),
  timezone: z.string().optional(),
  plan: z.enum(['starter', 'growth', 'network']).optional(),
})
export type CheckoutSessionMetadata = z.infer<typeof checkoutSessionMetadataSchema>
