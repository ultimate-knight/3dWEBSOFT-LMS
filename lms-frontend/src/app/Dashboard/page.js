"use client"
import { useState, useEffect } from "react"
import Sidebar from "@/Components/Sidebar"
import Searchbar from "@/Components/Searchbar"
import Overheadbar from "@/Components/Overheadbar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import api from "@/lib/page"
import { fetchStudentStats } from "@/lib/stats"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import {
  Users,
  BookOpen,
  BarChart3,
  Briefcase,
  Bot,
} from "lucide-react"

export default function Dashboard() {
  const [student, setStudent] = useState("")
  const [search,setSearch]=useState("")
  const [studenter1, setStudenter1] = useState(0)
  const [courser1, setCourser1] = useState(0)
  const [stats, setStats] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const tokener = localStorage.getItem("token")
    if (!tokener) router.push("/")
    setStudent(localStorage.getItem("studentname") || "")
  }, [])

  useEffect(() => {
    async function load() {
      const [usersRes, coursesCountRes, studentStats] = await Promise.all([
        api.get("/totalusers"),
        api.get("/totalcourses"),
        fetchStudentStats(api),
      ])
      setStudenter1(usersRes.data.detailer)
      setCourser1(coursesCountRes.data.detailer)
      setStats(studentStats)
    }
    load()
  }, [])

  const insightColors = {
    green: "from-green-500 to-green-800",
    yellow: "from-yellow-500 to-yellow-800",
    bulb: "",

  }

  const filtered = (stats?.courses || []).filter((x) =>
    x.name.toLowerCase().includes(search.toLowerCase())
  )

  

  const progressChartData = (filtered || []).map((c) => {
    const name = c.name || "Course"
    return {
      id: c.id,
      name,
      shortName: name.length > 14 ? `${name.slice(0, 12)}…` : name,
      pct: Math.min(100, Math.max(0, Number(c.pct) || 0)),
    }
  })

 
  

  return (
    <div className="flex bg-white text-black min-h-screen font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-200 min-h-screen">
        <Overheadbar search={search} setSearch={setSearch}/>
        <div className="flex flex-col p-7 gap-1">
          <div className="flex gap-2 items-center">
            <p className="font-bold text-3xl">Welcome back, {student}</p>
            <img src="/hibro.jpeg" className="h-10 rounded-lg" alt="" />
          </div>
          <p className="text-gray-600">Learning Management System from 3DWEBSOFT FOUNDATION</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 w-full">
          <div className="p-5 min-h-[120px] shadow-md shadow-gray-500 flex justify-between items-center border rounded-lg bg-white border-gray-900">
            <div className="flex flex-col gap-2">
              <p className="text-gray-600">Total Students</p>
              <p className="text-3xl font-bold">{studenter1}</p>
            </div>
            <Users />
          </div>
          <div className="p-5 min-h-[120px] shadow-md shadow-gray-500 flex justify-between items-center border rounded-lg bg-white border-gray-900">
            <div className="flex flex-col gap-2">
              <p className="text-gray-600">Courses</p>
              <p className="text-3xl font-bold">{courser1}</p>
            </div>
            <BookOpen />
          </div>
          <div className="p-5 min-h-[120px] shadow-md shadow-gray-500 flex justify-between items-center border rounded-lg bg-white border-gray-900">
            <div className="flex flex-col gap-2">
              <p className="text-gray-600">Attendance</p>
              <p className="text-3xl font-bold">{stats ? `${stats.attendancePct}%` : "—"}</p>
            </div>
            <BarChart3 />
          </div>
          <div className="p-5 min-h-[120px] shadow-md shadow-gray-500 flex justify-between items-center border rounded-lg bg-white border-gray-900">
            <div className="flex flex-col gap-2">
              <p className="text-gray-600">Placement</p>
              <p className="text-3xl font-bold">{stats ? `${stats.placement.overall}%` : "—"}</p>
            </div>
            <Briefcase />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 p-5 gap-5 w-full">
          <div className="flex flex-col gap-4 p-5 rounded-2xl border shadow-md shadow-gray-500 border-black bg-white min-h-[300px]">
            <p className="font-bold text-2xl">Your Learning Progress</p>
            {progressChartData.length === 0 ? (
              <p className="text-gray-500 py-8 text-center">No enrolled courses yet.</p>
            ) : (
              <div className="w-full min-h-[280px] h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={progressChartData}
                    margin={{ top: 8, right: 12, left: 0, bottom: 48 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="shortName"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={56}
                    />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} width={40} />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Progress"]}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.name ?? ""
                      }
                    />
                    <Bar dataKey="pct" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={56} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="flex-1 shadow-md shadow-gray-500 flex flex-col gap-4 border-l-4 border-indigo-500 rounded-2xl bg-white p-5 min-h-[300px]">
            <div className="flex gap-4 items-center">
              <Bot size={35} />
              <p className="text-xl font-bold">AI Learning Insights</p>
            </div>
            <p className="text-gray-600">Personalized recommendations based on your activity.</p>
            <div className="w-full h-0.5 bg-gray-300" />
            {(stats?.aiInsights || []).map((insight, i) => (
              <div key={i} className="flex gap-3 items-center">
                {insight.color === "bulb" ? (
                  <img src="/bulber.jpeg" className="w-7 h-7" alt="" />
                ) : (
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-l ${insightColors[insight.color] || insightColors.yellow}`} />
                )}
                <p className="font-bold text-sm">{insight.text}</p>
              </div>
            ))}
            <Link href="/Courses" className="bg-blue-600 text-white text-center font-bold w-[200px] p-2 rounded-lg mt-auto">
              Continue Learning
            </Link>
          </div>
        </div>

        <div className="p-5 w-full">
          <div className="shadow-md p-7 w-full flex flex-col gap-5 shadow-gray-500 min-h-[200px] border border-black bg-white rounded-2xl">
            <p className="font-bold text-2xl">My Courses</p>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-4 font-bold">
                <p>Course</p>
                <p>Duration</p>
                <p>Progress</p>
                <p>Status</p>
              </div>
              <div className="bg-gray-200 h-0.5 w-full" />
              {(stats?.courses || []).map((x) => (
                <div key={x.id} className="grid grid-cols-4 items-center">
                  <p>{x.name}</p>
                  <p>{x.duration} days</p>
                  <p>{x.pct}%</p>
                  <div className={`rounded-full w-24 h-8 flex items-center justify-center text-sm font-bold ${x.pct < 100 ? "bg-yellow-400 text-orange-800" : "bg-green-500 text-white"}`}>
                    {x.pct < 100 ? "Pending" : "Complete"}
                  </div>
                </div>
              ))}
              {stats && !stats.courses.length && (
                <p className="text-gray-500">No courses enrolled.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
