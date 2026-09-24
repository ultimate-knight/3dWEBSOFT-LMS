"use client"
import { useState, useEffect } from "react"
import Sidebar from "@/Components/Sidebar"
import Overheadbar from "@/Components/Overheadbar"
import api from "@/lib/page"
import { getSkillGaps, getSuggestedRoles } from "@/lib/stats"

export default function Skill() {
  const [role, setRole] = useState("")
  const [analyzed, setAnalyzed] = useState(false)
  const [courses, setCourses] = useState([])
  const [gaps, setGaps] = useState([])

  useEffect(() => {
    async function load() {
      const res = await api.get("/courses")
      setCourses(res.data.data || [])
    }
    load()
  }, [])

  const roleOptions = [
    ...getSuggestedRoles(courses).map((r) => ({ value: r, label: r })),
    { value: "Python developer", label: "Python developer" },
    { value: "Data Analyst", label: "Data Analyst" },
    { value: "SOC Analyst", label: "SOC Analyst" },
    { value: "AI/ML Engineer", label: "AI/ML Engineer" },
    { value: "Web Developer", label: "Web Developer" },
  ]

  const uniqueRoles = roleOptions.filter(
    (r, i, arr) => arr.findIndex((x) => x.value === r.value) === i
  )

  function analyze() {
    setGaps(getSkillGaps(courses, role))
    setAnalyzed(true)
  }

  return (
    <div className="flex bg-white text-black min-h-screen font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full bg-gray-200 min-h-screen">
        <Overheadbar />
        <div className="flex flex-col w-full p-10 gap-10">
          <div className="flex flex-col gap-1">
            <p className="font-bold text-3xl">🎯 Skill Gap Analysis</p>
            <p className="text-gray-600 text-lg">Discover what skills you need for your target role</p>
          </div>

          <div className="w-full flex flex-col gap-5 bg-white border border-black rounded-2xl p-6 shadow-md shadow-gray-400">
            <div className="flex flex-col gap-2">
              <p className="font-bold">Target Job Role</p>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value)
                  setAnalyzed(false)
                }}
                className="w-full border border-black p-2 rounded-2xl bg-white"
              >
                <option value="">Select your target role</option>
                {uniqueRoles.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={analyze}
              disabled={!role}
              className="font-bold text-white rounded-2xl bg-blue-600 p-3 w-full max-w-[220px] disabled:opacity-50"
            >
              Analyze My Skill Gap
            </button>

            <div className="w-full flex flex-col gap-4 p-5 rounded-2xl bg-gray-100">
              <p className="font-bold text-xl">
                {analyzed ? `🎯 Skill Gap for: ${role}` : "🎯 Your Skill Gaps"}
              </p>
              <p>Skills and tools to build for this role:</p>
              {/* {!analyzed && !courses.length && (
                <p className="text-gray-500">No courses enrolled yet — enroll via Admin to see gaps.</p>
              )} */}
              {/* {!analyzed && courses.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {courses.map((c) => (
                    <li key={c.id}>
                      {c.name}: {c.pct || 0}% complete
                      {(c.pct || 0) < 80 ? " — needs more work" : " — on track ✓"}
                    </li>
                  ))}
                </ul>
              )} */}
              {analyzed && (
                <ul className="flex flex-col gap-2">
                  {gaps.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
