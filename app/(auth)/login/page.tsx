'use client'

import React from 'react'
import { useForm } from '@/lib/hooks'
import { loginSchema } from '@/lib/validation/schemas'
import { useAuthContext } from '@/lib/context'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/context/UIContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthContext()
  const toast = useToast()

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        const validated = loginSchema.parse(values)
        await login(validated.email, validated.password)
        toast.success('Logged in successfully')
        router.push('/portal/dashboard')
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed'
        toast.error(message)
      }
    },
  })

  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      
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

      <button
        type="submit"
        disabled={form.isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {form.isSubmitting ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register here</a>
      </p>
    </form>
  )
}
