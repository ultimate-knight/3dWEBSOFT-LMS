"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import api from "@/lib/page"
import Sidebar from "@/Components/Sidebar"
import Overheadbar from "@/Components/Overheadbar"
import LessonContent from "@/Components/LessonContent"
import { BookOpen, CheckCircle2, ChevronLeft } from "lucide-react"

export default function ModuleContent() {
  const { id: courseId, moduleId } = useParams()
  const [module, setModule] = useState(null)
  const [courseName, setCourseName] = useState("")
  const [allModules, setAllModules] = useState([])
  const [completed, setCompleted] = useState(false)
  const [pct, setPct] = useState(0)
  const [msg, setMsg] = useState("")

  useEffect(() => {
    async function load() {
      const [modulesRes, coursesRes, completedRes] = await Promise.all([
        api.get(`/modules?course_id=${courseId}`),
        api.get("/courses"),
        api.get(`/modules/completed?course_id=${courseId}`),
      ])

      const list = modulesRes.data.data || []
      setAllModules(list)
      const found = list.find((m) => String(m.id) === String(moduleId))
      setModule(found || null)

      const completedIds = (completedRes.data.data || []).map((m) => String(m.module_id))
      setCompleted(completedIds.includes(String(moduleId)))

      const course = (coursesRes.data.data || []).find((c) => String(c.id) === String(courseId))
      if (course) {
        setPct(course.pct)
        setCourseName(course.name)
      }
    }
    load()
  }, [courseId, moduleId])

  async function markDone() {
    if (completed) return
    setMsg("")
    try {
      const res = await api.post("/modules/completed", { module_id: Number(moduleId) })
      setCompleted(true)
      if (res.data?.pct !== undefined) setPct(res.data.pct)
      setMsg("Great work! Module marked as complete.")
    } catch (err) {
      setMsg(err.response?.data?.error || "Could not mark as done")
    }
  }

  const moduleIndex = allModules.findIndex((m) => String(m.id) === String(moduleId))

  return (
    <div className="flex bg-white text-black min-h-screen font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-100 min-h-screen">
        <Overheadbar />
        <div className="p-7 flex flex-col gap-6 max-w-5xl mx-auto w-full">
          <Link
            href={`/Courses/${courseId}`}
            className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 w-fit"
          >
            <ChevronLeft size={20} />
            Back to {courseName || "Course"}
          </Link>

          {!module ? (
            <p className="text-gray-600">Loading lesson...</p>
          ) : (
            <>
              {/* Hero header */}
              <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-blue-900 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-indigo-200 text-sm font-medium">
                      <BookOpen size={16} />
                      {courseName} · Lesson {moduleIndex + 1} of {allModules.length}
                    </div>
                    <h1 className="text-3xl font-bold">{module.title}</h1>
                    <p className="text-indigo-200">{pct}% of course completed</p>
                  </div>
                  {completed ? (
                    <span className="flex items-center gap-2 bg-green-500/20 border border-green-400 text-green-200 font-bold px-4 py-2 rounded-xl">
                      <CheckCircle2 size={18} />
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={markDone}
                      className="bg-white text-indigo-800 font-bold px-5 py-2 rounded-xl hover:bg-indigo-50 transition"
                    >
                      Mark as Done
                    </button>
                  )}
                </div>
                <div className="mt-4 w-full h-2 bg-indigo-900/50 rounded-full">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-white rounded-full transition-all"
                  />
                </div>
              </div>

              {msg && (
                <p className={`text-sm font-medium px-4 py-2 rounded-xl ${completed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                  {msg}
                </p>
              )}

              {/* Lesson body */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 md:p-10">
                {module.content ? (
                  <LessonContent content={module.content} />
                ) : (
                  <div className="text-center py-12">
                    <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No lesson content added yet.</p>
                    <p className="text-gray-400 text-sm mt-1">Ask your admin to add content from the Admin panel.</p>
                  </div>
                )}
              </div>

              {/* Bottom nav */}
              <div className="flex justify-between items-center gap-4 flex-wrap pb-6">
                {moduleIndex > 0 ? (
                  <Link
                    href={`/Courses/${courseId}/module/${allModules[moduleIndex - 1].id}`}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    ← Previous Lesson
                  </Link>
                ) : <span />}
                {!completed && module.content && (
                  <button
                    onClick={markDone}
                    className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-indigo-700 transition"
                  >
                    Mark as Done & Continue
                  </button>
                )}
                {moduleIndex < allModules.length - 1 ? (
                  <Link
                    href={`/Courses/${courseId}/module/${allModules[moduleIndex + 1].id}`}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Next Lesson →
                  </Link>
                ) : <span />}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
