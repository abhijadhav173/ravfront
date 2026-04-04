'use client'

import React from 'react'
import { useForm } from '@/lib/hooks'
import { registerSchema } from '@/lib/validation/schemas'
import { useAuthContext } from '@/lib/context'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/context/UIContext'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuthContext()
  const toast = useToast()

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      agreed_to_terms: false,
    },
    onSubmit: async (values) => {
      try {
        const validated = registerSchema.parse(values)
        await register({
          name: validated.name,
          email: validated.email,
          password: validated.password,
        })
        toast.success('Registration successful')
        router.push('/portal/dashboard')
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed'
        toast.error(message)
      }
    },
  })

  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold">Register</h1>

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.values.name}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="John Doe"
        />
        {form.touched.name && form.errors.name && (
          <p className="text-red-500 text-sm mt-1">{form.errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.values.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="you@example.com"
        />
        {form.touched.email && form.errors.email && (
          <p className="text-red-500 text-sm mt-1">{form.errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.values.password}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="••••••••"
        />
        {form.touched.password && form.errors.password && (
          <p className="text-red-500 text-sm mt-1">{form.errors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="password_confirmation" className="block text-sm font-medium mb-1">
          Confirm Password
        </label>
        <input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          value={form.values.password_confirmation}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="••••••••"
        />
        {form.touched.password_confirmation && form.errors.password_confirmation && (
          <p className="text-red-500 text-sm mt-1">{form.errors.password_confirmation}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="agreed_to_terms"
          name="agreed_to_terms"
          type="checkbox"
          checked={form.values.agreed_to_terms}
          onChange={form.handleChange}
          className="w-4 h-4 border rounded"
        />
        <label htmlFor="agreed_to_terms" className="ml-2 text-sm">
          I agree to the Terms and Conditions
        </label>
      </div>
      {form.touched.agreed_to_terms && form.errors.agreed_to_terms && (
        <p className="text-red-500 text-sm">{form.errors.agreed_to_terms}</p>
      )}

      <button
        type="submit"
        disabled={form.isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {form.isSubmitting ? 'Registering...' : 'Register'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login here</a>
      </p>
    </form>
  )
}
