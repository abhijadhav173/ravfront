'use client'

import React from 'react'
import { useAuthContext, ProtectedRoute } from '@/lib/context'

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isInvestor, loading } = useAuthContext()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        {/* Portal Sidebar will go here */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
