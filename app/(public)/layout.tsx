import React from 'react'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Public Header will go here */}
      <main className="flex-1">
        {children}
      </main>
      {/* Public Footer will go here */}
    </div>
  )
}
