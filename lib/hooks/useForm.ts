'use client'

import { useState, useCallback } from 'react'

export interface UseFormOptions<T> {
  initialValues: T
  onSubmit: (values: T) => Promise<void> | void
  onError?: (error: Error) => void
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  onError,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target
      const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

      setValues((prev) => ({
        ...prev,
        [name]: fieldValue,
      }))

      // Clear error on field change
      if (errors[name as keyof T]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }))
      }
    },
    [errors]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }))
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsSubmitting(true)

      try {
        await onSubmit(values)
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error')
        onError?.(err)
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, onSubmit, onError]
  )

  const setFieldValue = useCallback(
    (name: keyof T, value: unknown) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }))
    },
    []
  )

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }, [])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
  }
}
