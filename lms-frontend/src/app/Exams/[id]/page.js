"use client"
import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import api from "@/lib/page"
import Sidebar from "@/Components/Sidebar"
import Overheadbar from "@/Components/Overheadbar"

function groupQuestions(rows) {
  const map = {}
  rows.forEach((row) => {
    if (!map[row.id]) {
      map[row.id] = { id: row.id, question: row.question, options: [] }
    }
    if (row.options_id) {
      map[row.id].options.push({ id: row.options_id, choice: row.choice })
    }
  })
  return Object.values(map)
}

export default function TakeExam() {
  const { id: examId } = useParams()
  const [exam, setExam] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [secondsLeft, setSecondsLeft] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const [examRes, qRes] = await Promise.all([
          api.get("/exam"),
          api.get(`/questions?exam_id=${examId}`),
        ])
        const found = (examRes.data.data || []).find((e) => String(e.id) === String(examId))
        setExam(found || null)
        const grouped = groupQuestions(qRes.data.data || [])
        setQuestions(grouped)
        if (found?.duration) setSecondsLeft(found.duration * 60)
      } catch (err) {
        setError("Could not load exam")
        console.error(err)
      }
    }
    load()
  }, [examId])

  useEffect(() => {
    if (result || secondsLeft === null || secondsLeft <= 0) return
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [secondsLeft, result])

  useEffect(() => {
    if (secondsLeft === 0 && !result && questions.length && !submitting) {
      const allAnswered = questions.every((q) => answers[q.id])
      if (allAnswered) submitExam()
      else setError("Time is up! Not all questions were answered.")
    }
  }, [secondsLeft, result, questions, answers, submitting])

  const timeLabel = useMemo(() => {
    if (secondsLeft === null) return "--:--"
    const m = Math.floor(secondsLeft / 60)
    const s = secondsLeft % 60
    return `${m}:${String(s).padStart(2, "0")}`
  }, [secondsLeft])

  function pick(questionId, optionId) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  async function submitExam() {
    if (submitting || result) return
    if (questions.length === 0) {
      setError("This exam has no questions yet.")
      return
    }
    const unanswered = questions.filter((q) => !answers[q.id])
    if (unanswered.length) {
      setError(`Please answer all questions (${unanswered.length} remaining)`)
      return
    }

    setSubmitting(true)
    setError("")
    try {
      const payload = {
        exam_id: Number(examId),
        answers: questions.map((q) => ({ options_id: answers[q.id] })),
      }
      const res = await api.post("/submit", payload)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Submit failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (!exam && !error) {
    return (
      <div className="flex bg-white min-h-screen font-sans">
        <Sidebar />
        <div className="flex-1 bg-gray-200 p-7">Loading exam...</div>
      </div>
    )
  }

  if (result) {
    return (
      <div className="flex bg-white text-black min-h-screen font-sans">
        <Sidebar />
        <div className="flex flex-col flex-1 bg-gray-200 min-h-screen">
          <Overheadbar />
          <div className="p-7 flex flex-col gap-6 max-w-xl">
            <p className="font-bold text-3xl">Exam Submitted</p>
            <div className="bg-white border border-black rounded-2xl p-6 flex flex-col gap-3 shadow-md shadow-gray-500">
              <p className="text-lg"><span className="font-bold">Score:</span> {result.score}%</p>
              <p className="text-lg"><span className="font-bold">Grade:</span> {result.grade}</p>
              <p className="text-lg"><span className="font-bold">Status:</span> {result.status}</p>
              {result.correct != null && (
                <p className="text-gray-600">{result.correct} / {result.total} correct</p>
              )}
            </div>
            <div className="flex gap-3">
              <Link href="/Results" className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl">
                View Results
              </Link>
              <Link href="/Exams" className="bg-gray-300 text-black font-bold px-4 py-2 rounded-xl">
                Back to Exams
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex bg-white text-black min-h-screen font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-200 min-h-screen">
        <Overheadbar />
        <div className="p-7 flex flex-col gap-6 max-w-3xl">
          <Link href="/Exams" className="text-blue-600 font-bold">← Back to Exams</Link>

          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div>
              <p className="font-bold text-3xl">{exam?.name || "Exam"}</p>
              <p className="text-gray-600">{questions.length} questions</p>
            </div>
            <div className={`font-bold text-xl px-4 py-2 rounded-xl bg-white border border-black ${secondsLeft !== null && secondsLeft < 60 ? "text-red-600" : ""}`}>
              ⏱ {timeLabel}
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          {questions.length === 0 ? (
            <div className="bg-white border border-black rounded-2xl p-6">
              <p className="text-gray-600">No questions added to this exam yet. Ask admin to add questions and options.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {questions.map((q, i) => (
                <div key={q.id} className="bg-white border border-black rounded-2xl p-5 flex flex-col gap-3 shadow-md shadow-gray-400">
                  <p className="font-bold">{i + 1}. {q.question}</p>
                  {q.options.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No options for this question</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {q.options.map((opt) => (
                        <label
                          key={opt.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                            answers[q.id] === opt.id ? "border-blue-600 bg-blue-50" : "border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            checked={answers[q.id] === opt.id}
                            onChange={() => pick(q.id, opt.id)}
                          />
                          <span>{opt.choice}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={submitExam}
                disabled={submitting}
                className="bg-blue-600 text-white font-bold px-6 py-3 rounded-2xl w-fit disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Exam"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
