'use client'

import React, { useEffect, useState } from 'react'
import { useAuthContext } from '@/lib/context'
import { usePortalContext } from '@/lib/context'
import { useApi } from '@/lib/hooks'
import { venturesApi } from '@/lib/api/v1'
import { Venture } from '@/lib/types'

export default function PortalDashboard() {
  const { user } = useAuthContext()
  const { ventures, setVentures } = usePortalContext()
  const { data, loading, error, execute } = useApi<Venture[]>()

  useEffect(() => {
    execute(async () => {
      const response = await venturesApi.getPortalVentures(1, 10)
      setVentures(response.data)
      return response.data
    })
  }, [execute, setVentures])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-gray-600">Investor Portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Active Ventures</div>
          <div className="text-3xl font-bold">{ventures.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Capital</div>
          <div className="text-3xl font-bold">
            ${ventures.reduce((sum, v) => sum + (v.capital_raised || 0), 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Equity Allocated</div>
          <div className="text-3xl font-bold">
            {(ventures.reduce((sum, v) => sum + (v.equity_allocated || 0), 0) / ventures.length).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Your Ventures</h2>
        {loading && <p className="text-gray-600">Loading ventures...</p>}
        {error && <p className="text-red-600">Error loading ventures: {error.message}</p>}
        {!loading && ventures.length === 0 && (
          <p className="text-gray-600">No ventures yet</p>
        )}
        {!loading && ventures.length > 0 && (
          <div className="space-y-4">
            {ventures.map((venture) => (
              <div key={venture.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <h3 className="font-bold">{venture.name}</h3>
                <p className="text-sm text-gray-600">{venture.logline}</p>
                <div className="mt-2 flex gap-4 text-sm">
                  <span className="text-gray-500">Type: {venture.type}</span>
                  <span className="text-gray-500">Status: {venture.status}</span>
                  <span className="text-gray-500">Capital: ${(venture.capital_raised || 0).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
