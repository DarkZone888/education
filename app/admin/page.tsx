'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface ResultRow {
  id: string
  created_at: string
  answers: unknown[]
  result_key: string
}

export default function ResultsTable() {
  const [accessGranted, setAccessGranted] = useState(false)
  const [password, setPassword] = useState('')
  const [data, setData] = useState<ResultRow[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const rowsPerPage = 100
  const correctPassword = 'gen111pass'

  useEffect(() => {
    if (!accessGranted) return
    fetch('/api/result')
      .then((res) => res.json())
      .then(setData)
  }, [accessGranted])

  if (!accessGranted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">🔒 Enter Password</h2>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => {
              if (password === correctPassword) setAccessGranted(true)
              else alert('Incorrect password.')
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Submit
          </button>
        </div>
      </main>
    )
  }

  const filtered = data.filter((r) =>
    r.result_key.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / rowsPerPage)
  const paged = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const resultKeyCounts = Object.entries(
    filtered.reduce((acc: Record<string, number>, row) => {
      acc[row.result_key] = (acc[row.result_key] || 0) + 1
      return acc
    }, {})
  ).map(([key, count]) => ({ key, count }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-center text-3xl font-bold text-gray-800">📊 Results Dashboard</h1>
          <p className="text-center text-gray-500 text-sm mt-1">Total Records: {filtered.length.toLocaleString()}</p>
        </header>

        <div className="mb-8 h-80 w-full bg-white border rounded-xl p-4 shadow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resultKeyCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="key" tick={{ fontSize: 12 }} interval={0} angle={-30} textAnchor="end" height={80} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search result_key..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages} ({paged.length} shown)
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 text-gray-700 font-medium">Created</th>
                <th className="text-left px-4 py-2 text-gray-700 font-medium">Key</th>
                <th className="text-left px-4 py-2 text-gray-700 font-medium">Answers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2 text-indigo-600 break-all max-w-xs sm:max-w-sm truncate">{r.result_key}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {Array.isArray(r.answers)
                      ? <ul className="list-disc list-inside space-y-1">
                          {r.answers.map((a, i) => <li key={i}>{typeof a === 'string' ? a : JSON.stringify(a)}</li>)}
                        </ul>
                      : JSON.stringify(r.answers)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <nav className="mt-6 flex justify-between items-center text-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-white border shadow-sm hover:bg-gray-100 disabled:opacity-50"
          >
            ← Prev
          </button>
          <span className="text-gray-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-white border shadow-sm hover:bg-gray-100 disabled:opacity-50"
          >
            Next →
          </button>
        </nav>
      </div>
    </main>
  )
}