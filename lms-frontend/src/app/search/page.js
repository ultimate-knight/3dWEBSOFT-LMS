"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Sidebar from "@/Components/Sidebar"
import Overheadbar from "@/Components/Overheadbar"
import api from "@/lib/page"
import { filterCoursesByQuery } from "@/lib/searchCourses"

function SearchResults() {
  const searchParams = useSearchParams()
  const q = (searchParams.get("q") || "").trim()

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError("")
      try {
        const res = await api.get("/courses")
        setCourses(res.data.data || [])
      } catch (err) {
        setError(err.response?.data?.error || "Could not load courses")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const results = filterCoursesByQuery(courses, q)

  return (
    <div className="flex flex-col w-full p-10 gap-6">
      <div className="flex flex-col gap-1">
        <p className="font-bold text-3xl">Search</p>
        <p className="text-gray-600 text-lg">
          {q ? (
            <>
              Results for <span className="font-bold text-black">&quot;{q}&quot;</span>
            </>
          ) : (
            "Type a course name in the header and press Enter or Search."
          )}
        </p>
      </div>

      {loading && <p className="text-gray-600">Loading courses...</p>}
      {error && <p className="text-red-600 font-bold">{error}</p>}

      {!loading && !error && q && results.length === 0 && (
        <p className="text-gray-600">No courses match &quot;{q}&quot;.</p>
      )}

      {!loading && !error && results.length > 0 && (
        <ul className="flex flex-col gap-3">
          {results.map((c) => (
            <li
              key={c.id}
              className="bg-white border border-black rounded-2xl p-5 shadow-md shadow-gray-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <p className="font-bold text-xl">{c.name}</p>
                {c.description && (
                  <p className="text-gray-600 line-clamp-2">{c.description}</p>
                )}
                <p className="text-sm text-gray-500">{c.pct ?? 0}% complete</p>
              </div>
              <Link
                href={`/Courses/${c.id}`}
                className="text-center font-bold bg-blue-600 text-white px-4 py-2 rounded-xl shrink-0"
              >
                Open course
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && !q && courses.length > 0 && (
        <p className="text-gray-500 text-sm">
          Tip: use the search bar above (e.g. &quot;python&quot;, &quot;service&quot;).
        </p>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="flex bg-white text-black min-h-screen font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-200 min-h-screen">
        <Overheadbar />
        <Suspense fallback={<p className="p-10 text-gray-600">Loading search...</p>}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  )
}
