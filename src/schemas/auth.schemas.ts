import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})
export type LoginForm = z.infer<typeof loginSchema>

export const resetSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})
export type ResetForm = z.infer<typeof resetSchema>

export const registerSchema = z.object({
  choirName: z.string().min(2, 'Choir name is required'),
  adminName: z.string().min(2, 'Your name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
  choirSize: z.string().min(1, 'Select a size'),
  timezone: z.string().min(1, 'Select a timezone'),
})
export type RegisterForm = z.infer<typeof registerSchema>
