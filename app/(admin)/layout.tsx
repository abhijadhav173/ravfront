'use client'

import React from 'react'
import { useAuthContext, ProtectedRoute } from '@/lib/context'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isAdmin, loading } = useAuthContext()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAdmin) {
    return <div className="flex items-center justify-center min-h-screen">Admin access required</div>
  }

  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar will go here */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
