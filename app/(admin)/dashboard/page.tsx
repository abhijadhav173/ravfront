'use client'

import React, { useEffect } from 'react'
import { useAuthContext } from '@/lib/context'
import { useApi } from '@/lib/hooks'
import { venturesApi } from '@/lib/api/v1'
import { Venture, PaginatedResponse } from '@/lib/types'

export default function AdminDashboard() {
  const { user } = useAuthContext()
  const { data, loading, error, execute } = useApi<PaginatedResponse<Venture>>()

  useEffect(() => {
    execute(async () => {
      return venturesApi.getAdminVentures(1, 10)
    })
  }, [execute])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Manage Ravok Studios platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Ventures</div>
          <div className="text-3xl font-bold">{data?.pagination.total || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Pages</div>
          <div className="text-3xl font-bold">{data?.pagination.last_page || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Per Page</div>
          <div className="text-3xl font-bold">{data?.pagination.per_page || 10}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Current Page</div>
          <div className="text-3xl font-bold">{data?.pagination.current_page || 1}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">All Ventures</h2>
        {loading && <p className="text-gray-600">Loading ventures...</p>}
        {error && <p className="text-red-600">Error: {error.message}</p>}
        {!loading && data && data.data.length === 0 && (
          <p className="text-gray-600">No ventures found</p>
        )}
        {!loading && data && data.data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Capital Raised</th>
                  <th className="text-left py-2">Equity</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((venture) => (
                  <tr key={venture.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{venture.name}</td>
                    <td className="py-2 text-sm">{venture.type}</td>
                    <td className="py-2 text-sm">{venture.status}</td>
                    <td className="py-2 text-sm">${(venture.capital_raised || 0).toLocaleString()}</td>
                    <td className="py-2 text-sm">{venture.equity_allocated}%</td>
                    <td className="py-2 text-sm">
                      <button className="text-blue-600 hover:underline mr-2">Edit</button>
                      <button className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
