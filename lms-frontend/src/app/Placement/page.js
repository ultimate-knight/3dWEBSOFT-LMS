"use client"
import { useState, useEffect } from "react"
import Sidebar from "@/Components/Sidebar"
import Overheadbar from "@/Components/Overheadbar"
import api from "@/lib/page"
import { fetchStudentStats } from "@/lib/stats"

function ScoreCard({ title, value }) {
  const pct = Math.min(100, Math.max(0, Number(value) || 0))
  return (
    <div className="bg-white flex flex-col gap-2 min-w-0 rounded-2xl border border-black p-5 shadow-md shadow-gray-400 overflow-hidden">
      <p className="font-bold text-xl">{title}</p>
      <p className="font-bold text-3xl">{pct}%</p>
      <div className="w-full border border-black rounded-full bg-gray-300 h-3 overflow-hidden">
        <div style={{ width: `${pct}%` }} className="bg-blue-600 h-full rounded-full transition-all max-w-full" />
      </div>
    </div>
  )
}

export default function Placement() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchStudentStats(api)
        setStats(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="flex bg-white text-black min-w-screen overflow-hidden min-h-screen font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 w-full bg-gray-200 min-h-screen">
        <Overheadbar />
        <div className="flex flex-col w-full p-10 gap-7">
          <div className="flex w-full flex-col gap-1">
            <p className="font-bold text-3xl">💼 Placement Readiness</p>
            <p className="text-gray-600 text-lg">Your personal job readiness score</p>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading placement data...</p>
          ) : (
            <>
              <div className="bg-gradient-to-r from-indigo-700 to-blue-900 rounded-2xl p-6 text-white shadow-lg">
                <p className="text-indigo-200 text-sm">Overall Placement Score</p>
                <p className="text-5xl font-bold">{stats.placement.overall}%</p>
                <p className={`text-xl font-bold mt-2 ${stats.placementLabel.color}`}>
                  {stats.placementLabel.text}
                </p>
              </div>

              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
                <ScoreCard title="Technical Skills" value={stats.placement.technical} />
                <ScoreCard title="Communication" value={stats.placement.communication} />
                <ScoreCard title="Interview Readiness" value={stats.placement.interview} />
              </div>

              <div className="w-full flex flex-col gap-4 rounded-2xl bg-white border border-black p-6 shadow-md shadow-gray-400">
                <p className="text-2xl font-bold">AI Placement Recommendation</p>
                <p className="text-gray-600">
                  Based on your courses ({stats.overallProgress}% progress), exam scores ({stats.avgScore}% avg), and attendance ({stats.attendancePct}%):
                </p>
                <p className={`font-bold text-xl ${stats.placementLabel.color}`}>
                  {stats.placementLabel.text}
                </p>

                <p className="font-bold mt-2">Recommended next steps:</p>
                <ul className="flex flex-col gap-2 pl-5 list-disc text-base">
                  {stats.placementSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>

                <p className="font-bold mt-2">Suggested entry-level roles:</p>
                <ul className="flex flex-col gap-2 pl-5 list-disc text-base">
                  {stats.suggestedRoles.map((role, i) => (
                    <li key={i}>{role}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
