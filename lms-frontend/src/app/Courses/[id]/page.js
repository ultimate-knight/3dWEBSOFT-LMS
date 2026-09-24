"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import api from "@/lib/page"
import Sidebar from "@/Components/Sidebar"
import Overheadbar from "@/Components/Overheadbar"
import { BookOpen, CheckCircle2, Circle, ChevronLeft } from "lucide-react"

export default function CourseModules() {
  const { id: courseId } = useParams()
  const [modules, setModules] = useState([])
  const [courseName, setCourseName] = useState("")
  const [pct, setPct] = useState(0)

  useEffect(() => {
    async function load() {
      const [modulesRes, coursesRes, completedRes] = await Promise.all([
        api.get(`/modules?course_id=${courseId}`),
        api.get("/courses"),
        api.get(`/modules/completed?course_id=${courseId}`),
      ])

      const completedIds = completedRes.data.data.map((m) => m.module_id)
      setModules(
        modulesRes.data.data.map((m) => ({
          ...m,
          completed: completedIds.includes(m.id),
        }))
      )

      const course = coursesRes.data.data.find((c) => String(c.id) === String(courseId))
      if (course) {
        setPct(course.pct)
        setCourseName(course.name)
      }
    }
    load()
  }, [courseId])

  const doneCount = modules.filter((m) => m.completed).length

  return (
    <div className="flex bg-white text-black min-h-screen font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-100 min-h-screen">
        <Overheadbar />
        <div className="p-7 flex flex-col gap-6 max-w-4xl mx-auto w-full">
          <Link href="/Courses" className="flex items-center gap-2 text-indigo-600 font-bold w-fit hover:text-indigo-800">
            <ChevronLeft size={20} />
            Back to My Courses
          </Link>

          {/* Course header */}
          <div className="bg-gradient-to-r from-indigo-700 to-blue-900 rounded-2xl p-7 text-white shadow-lg">
            <p className="text-indigo-200 text-sm font-medium mb-1">Course Progress</p>
            <h1 className="text-3xl font-bold mb-1">{courseName || "Course Modules"}</h1>
            <p className="text-indigo-200 mb-4">
              {doneCount} of {modules.length} lessons completed · {pct}% overall
            </p>
            <div className="w-full h-3 bg-indigo-900/50 rounded-full">
              <div
                style={{ width: `${pct}%` }}
                className="h-full bg-white rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Module list */}
          <div className="flex flex-col gap-3">
            <p className="font-bold text-xl text-gray-800">Lessons</p>
            {modules.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
                <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No modules added to this course yet.</p>
              </div>
            ) : (
              modules.map((m, i) => (
                <div
                  key={m.id}
                  className={`bg-white rounded-2xl border p-5 flex items-center justify-between gap-4 shadow-sm transition hover:shadow-md ${
                    m.completed ? "border-green-200" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
                      m.completed ? "bg-green-100 text-green-700" : "bg-indigo-100 text-indigo-700"
                    }`}>
                      {m.completed ? <CheckCircle2 size={20} /> : <span>{i + 1}</span>}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">{m.title}</p>
                      <p className="text-sm text-gray-500">
                        {m.content ? "Lesson available" : "Content coming soon"}
                        {m.completed && " · Completed"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {m.content ? (
                      <Link
                        href={`/Courses/${courseId}/module/${m.id}`}
                        className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-indigo-700 transition"
                      >
                        {m.completed ? "Review" : "Start Lesson"}
                      </Link>
                    ) : (
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <Circle size={14} /> Pending
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
