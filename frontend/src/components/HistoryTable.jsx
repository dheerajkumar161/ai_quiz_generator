import React from "react";

export default function HistoryTable({ history, onDetails, onDelete, loading = false }) {
  return (
    <div className="overflow-x-auto">
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="px-4 py-3 text-left font-semibold w-[30%]">Article Title</th>
              <th className="px-4 py-3 text-left font-semibold w-[35%]">URL</th>
              <th className="px-4 py-3 text-left font-semibold w-[20%]">Date Generated</th>
              <th className="px-4 py-3 text-right font-semibold w-[15%]">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white text-sm divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Loading
                  </div>
                </td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No quizzes generated yet.</td>
              </tr>
            ) : (
              history.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 break-words">{row.title}</td>
                  <td className="px-4 py-3">
                    <a 
                      href={row.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-blue-600 hover:underline break-all text-xs"
                      title={row.url}
                    >
                      {row.url.length > 50 ? `${row.url.substring(0, 50)}...` : row.url}
                      <svg className="inline ml-1 h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586L7.293 11.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/></svg>
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2a2 2 0 00-2 2v1h16V4a2 2 0 00-2-2H6z"/><path d="M20 7H4v13a2 2 0 002 2h12a2 2 0 002-2V7zM8 11h3v3H8v-3z"/></svg>
                      {row.date_generated ? new Date(row.date_generated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Not available"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onDetails(row.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs hover:bg-blue-700 transition-colors"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z"/></svg>
                        View
                      </button>
                      <button
                        onClick={() => onDelete(row.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-600 text-white text-xs hover:bg-red-700 transition-colors"
                        title="Delete quiz"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

