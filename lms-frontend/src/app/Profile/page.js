"use client"
import { useState, useEffect } from "react"
import Sidebar from "@/Components/Sidebar"
import Overheadbar from "@/Components/Overheadbar"
import api from "@/lib/page"
import { fetchStudentStats } from "@/lib/stats"

export default function Profile() {
  const [user1, setUser1] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [meRes, studentStats] = await Promise.all([
          api.get("/me"),
          fetchStudentStats(api),
        ])
        setUser1(meRes.data)
        setStats(studentStats)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const riskColor =
    stats?.placement.overall >= 80
      ? "text-green-700"
      : stats?.placement.overall < 50
        ? "text-red-700"
        : "text-yellow-700"

  const riskLabel =
    stats?.placement.overall >= 80 ? "LOW" : stats?.placement.overall < 50 ? "HIGH" : "MEDIUM"

  return (
    <div className="flex bg-white text-black min-h-screen font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full bg-gray-200 min-h-screen">
        <Overheadbar />
        <div className="flex flex-col w-full p-10 gap-7">
          <div className="flex flex-col gap-1">
            <p className="font-bold text-3xl">My Profile</p>
            <p className="text-gray-600 text-lg">Your student account information</p>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="p-5 flex flex-col gap-5 border border-black rounded-2xl bg-white shadow-md shadow-gray-400">
              <p className="text-2xl font-bold">Personal Information</p>
              {user1 ? (
                <div className="flex flex-col gap-2">
                  <p className="text-lg"><span className="font-bold">Name: </span>{user1.username}</p>
                  <p className="text-lg"><span className="font-bold">Email: </span>{user1.email}</p>
                  <p className="text-lg"><span className="font-bold">Student ID: </span>{user1.id}</p>
                </div>
              ) : (
                <p className="text-gray-500">Loading...</p>
              )}
            </div>

            <div className="p-5 flex flex-col gap-5 border border-black rounded-2xl bg-white shadow-md shadow-gray-400">
              <p className="text-2xl font-bold">Learning Summary</p>
              {loading || !stats ? (
                <p className="text-gray-500">Loading stats...</p>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-lg"><span className="font-bold">Courses Enrolled: </span>{stats.courses.length}</p>
                  <p className="text-lg"><span className="font-bold">Overall Progress: </span>{stats.overallProgress}%</p>
                  <p className="text-lg"><span className="font-bold">Attendance: </span>{stats.attendancePct}%</p>
                  <p className="text-lg"><span className="font-bold">Average Score: </span>{stats.avgScore}%</p>
                  <p className="text-lg">
                    <span className="font-bold">Placement Readiness: </span>{stats.placement.overall}%
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">AI Risk Level: </span>
                    <span className={`font-bold ${riskColor}`}>{riskLabel}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
