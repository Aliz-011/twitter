import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email' }).min(1),
  username: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, - and _ are allowed'),
  password: z.string().trim().min(8),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().trim().min(1),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const postSchema = z.object({
  content: z.string().trim().min(1),
});
