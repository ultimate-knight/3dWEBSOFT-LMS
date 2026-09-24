"use client"
import { useState, useEffect } from "react"
import Sidebar from "@/Components/Sidebar"
import Overheadbar from "@/Components/Overheadbar"
import Link from "next/link"
import api from "@/lib/page"

export default function Exams() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/exam")
        setExams(res.data.data || [])
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
        <div className="flex flex-col w-full p-7 gap-7">
          <div className="flex flex-col gap-1">
            <p className="font-bold text-3xl">Available Exams</p>
            <p className="text-gray-600 text-lg">Take assessments and track your performance</p>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading exams...</p>
          ) : !exams.length ? (
            <div className="bg-white border border-black rounded-2xl p-6">
              <p className="text-gray-600">No exams available for your enrolled courses yet.</p>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-5 border border-black bg-white rounded-2xl flex flex-col gap-4 shadow-md shadow-gray-500"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-xl">{exam.name}</p>
                    <p className="text-gray-600">
                      {exam.questionumbers} Questions · {exam.duration} Minutes
                    </p>
                  </div>
                  <p className="text-green-700 font-medium">Available</p>
                  <Link
                    href={`/Exams/${exam.id}`}
                    className="font-bold text-white rounded-2xl w-full text-center max-w-[150px] bg-blue-600 p-2"
                  >
                    Start Exam
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
