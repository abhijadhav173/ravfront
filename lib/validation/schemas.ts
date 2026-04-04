import { z } from 'zod'

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
  agreed_to_terms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
})

// Contact Form Schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  partner_type: z.enum(['co_producer', 'financier', 'distributor', 'operator', 'creator', 'other']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

// Waitlist Schema
export const waitlistSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  logline: z.string().min(10, 'Logline must be at least 10 characters'),
  portfolio_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

// Confession Schema
export const confessionSchema = z.object({
  body: z.string().min(20, 'Confession must be at least 20 characters').max(5000, 'Confession must be less than 5000 characters'),
  category: z.enum(['tip', 'warning', 'confession', 'question']).optional(),
})

// Article Schema
export const articleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  body: z.string().min(100, 'Body must be at least 100 characters'),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters').optional(),
  status: z.enum(['draft', 'published', 'archived']),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type WaitlistFormData = z.infer<typeof waitlistSchema>
export type ConfessionFormData = z.infer<typeof confessionSchema>
export type ArticleFormData = z.infer<typeof articleSchema>
