"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Sidebar from "@/Components/Sidebar"
import Overheadbar from "@/Components/Overheadbar"
import api from "@/lib/page"
import { isAdminSession, clearAuthSession } from "@/lib/auth"


function Section({ title, children }) {
  return (
    <div className="bg-white border border-black rounded-2xl p-5 flex flex-col gap-4 shadow-md shadow-gray-500">
      <p className="text-xl font-bold">{title}</p>
      {children}
    </div>
  )
}


function DataTable({
  rows,
  emptyText = "No data yet",
  pageSize = 10,
  onDelete,
  deletingId
}) {
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [rows.length])

  if (!rows || rows.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        {emptyText}
      </p>
    )
  }

  const hiddenColumns = ["password", "_rowKey"]

  const columns = Object.keys(rows[0]).filter(
    (column) => !hiddenColumns.includes(column)
  )

  const totalPages = Math.ceil(rows.length / pageSize)

  if (page > totalPages) {
    setPage(totalPages)
  }

  const start = (page - 1) * pageSize

  const pageRows = rows.slice(
    start,
    start + pageSize
  )

  return (
    <div className="flex flex-col gap-3">

      <div className="overflow-x-auto w-full border border-gray-200 rounded-xl">

        <table className="w-full text-sm border-collapse">

          <thead className="bg-gray-100">

            <tr>

              {columns.map((column) => (
                <th
                  key={column}
                  className="text-left p-2 font-bold capitalize whitespace-nowrap"
                >
                  {column.replace(/_/g, " ")}
                </th>
              ))}

              {onDelete && (
                <th className="text-left p-2 font-bold">
                  Actions
                </th>
              )}

            </tr>

          </thead>

          <tbody>

            {pageRows.map((row, index) => {

              const rowKey =
                row._rowKey ??
                row.id ??
                start + index

              const isDeleting =
                deletingId != null &&
                String(deletingId) === String(rowKey)

              return (
                <tr
                  key={`${rowKey}-${start + index}`}
                  className="border-t border-gray-200"
                >

                  {columns.map((column) => (
                    <td
                      key={column}
                      className="p-2 align-top max-w-[240px]"
                    >
                      {row[column] != null
                        ? String(row[column]).slice(0, 120)
                        : "-"}
                    </td>
                  ))}

                  {onDelete && (
                    <td className="p-2 align-top">

                      <button
                        type="button"
                        onClick={() => onDelete(row)}
                        disabled={isDeleting}
                        className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold disabled:opacity-50"
                      >
                        {isDeleting
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </td>
                  )}

                </tr>
              )
            })}

          </tbody>

        </table>

      </div>


      {rows.length > pageSize && (

        <div className="flex items-center justify-between gap-2 text-sm">

          <p className="text-gray-600">
            Showing {start + 1}-
            {Math.min(start + pageSize, rows.length)}
            {" "}of {rows.length}
          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                setPage(page - 1)
              }
              disabled={page === 1}
              className="px-3 py-1 rounded-lg border border-gray-400 disabled:opacity-40"
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setPage(page + 1)
              }
              disabled={page === totalPages}
              className="px-3 py-1 rounded-lg border border-gray-400 disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </div>

      )}

    </div>
  )
}


function FieldLabel({ children }) {
  return (
    <label className="text-sm font-medium">
      {children}
    </label>
  )
}


function InputField({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">

      <FieldLabel>
        {label}
      </FieldLabel>

      <input
        className="border border-gray-400 rounded-lg p-2"
        {...props}
      />

    </div>
  )
}


function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  placeholder = "Select..."
}) {
  return (
    <div className="flex flex-col gap-1">

      <FieldLabel>
        {label}
      </FieldLabel>

      <select
        className="border border-gray-400 rounded-lg p-2 bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={options.length === 0}
      >

        <option value="">
          {options.length
            ? placeholder
            : "No options"}
        </option>

        {options.map((option) => (
          <option
            key={String(option.value)}
            value={String(option.value)}
          >
            {option.label}
          </option>
        ))}

      </select>

    </div>
  )
}


function TextAreaField({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1 col-span-full">

      <FieldLabel>
        {label}
      </FieldLabel>

      <textarea
        className="border border-gray-400 rounded-lg p-2 min-h-[100px]"
        {...props}
      />

    </div>
  )
}


function Msg({ text, ok }) {
  if (!text) return null

  return (
    <p
      className={
        ok
          ? "text-sm text-green-700"
          : "text-sm text-red-600"
      }
    >
      {text}
    </p>
  )
}


function generatePassword() {

  const chars =
    "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"

  let password = ""

  for (let i = 0; i < 10; i++) {
    password +=
      chars[Math.floor(Math.random() * chars.length)]
  }

  return password
}


function formatCredentials(credentials) {

  return `LMS Portal Login Details

--------------------------

Name: ${credentials.username}

Email: ${credentials.email}

Password: ${credentials.password}

Login URL: ${
    typeof window !== "undefined"
      ? window.location.origin
      : ""
  }/`
}


function CredentialSharePanel({
  credentials,
  onDismiss
}) {

  const [copied, setCopied] = useState("")

  async function copyText(text, label) {

    try {

      await navigator.clipboard.writeText(text)

      setCopied(label)

      setTimeout(() => {
        setCopied("")
      }, 2000)

    } catch {

      alert(
        "Could not copy. Please copy manually."
      )

    }
  }

  const fullText =
    formatCredentials(credentials)

  const mailto =
    `mailto:${credentials.email}` +
    `?subject=${encodeURIComponent(
      "Your LMS Portal Login"
    )}` +
    `&body=${encodeURIComponent(fullText)}`

  return (

    <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 flex flex-col gap-3">

      <div className="flex justify-between">

        <p className="font-bold text-green-800">
          Share these login details with the candidate
        </p>

        <button
          type="button"
          onClick={onDismiss}
          className="text-sm text-gray-600"
        >
          Dismiss
        </button>

      </div>

      <div className="bg-white border border-green-300 rounded-lg p-3 font-mono text-sm whitespace-pre-wrap">
        {fullText}
      </div>

      <div className="flex gap-2">

        <button
          type="button"
          onClick={() =>
            copyText(
              credentials.password,
              "password"
            )
          }
          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-bold"
        >
          {copied === "password"
            ? "Password copied!"
            : "Copy password"}
        </button>

        <button
          type="button"
          onClick={() =>
            copyText(fullText, "all")
          }
          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-bold"
        >
          {copied === "all"
            ? "All copied!"
            : "Copy all details"}
        </button>

        <a
          href={mailto}
          className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm font-bold"
        >
          Email candidate
        </a>

      </div>

      <p className="text-xs text-gray-600">
        Passwords are hashed in the database and
        cannot be retrieved later. Save these
        details now.
      </p>

    </div>
  )
}


export default function Admin() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    if (!isAdminSession()) {
      clearAuthSession()
      router.replace("/Adminlogin")
      return
    }
    setAuthChecked(true)
  }, [router])

  // =========================
  // DATA
  // =========================

  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [attendance, setAttendance] = useState([])
  const [results, setResults] = useState([])
  const [exams, setExams] = useState([])
  const [modules, setModules] = useState([])
  const [questions, setQuestions] = useState([])
  const [optionsList, setOptionsList] = useState([])
  const [enrollments, setEnrollments] = useState([])

  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState("")
  const [deletingId, setDeletingId] = useState(null)


  // =========================
  // STUDENT
  // =========================

  const [stu, setStu] = useState({
    username: "",
    email: "",
    password: "",
    // role: "",
    joined: ""
  })

  const [stuMsg, setStuMsg] = useState({
    text: "",
    ok: false
  })

  const [showStuPassword, setShowStuPassword] =
    useState(false)

  const [sharedCredentials, setSharedCredentials] =
    useState(null)


  // =========================
  // COURSE
  // =========================

  const [crs, setCrs] = useState({
    student_id: "",
    name: "",
    description: "",
    duration: "",
    icon: "/data.png"
  })

  const [crsMsg, setCrsMsg] = useState({
    text: "",
    ok: false
  })


  // =========================
  // ENROLLMENT
  // =========================

  const [enroll, setEnroll] = useState({
    student_id: "",
    course_id: ""
  })

  const [enrollMsg, setEnrollMsg] = useState({
    text: "",
    ok: false
  })


  // =========================
  // ATTENDANCE
  // =========================

  const [att, setAtt] = useState({
    student_id: "",
    course_id: "",
    Date: "",
    status: "present"
  })

  const [attMsg, setAttMsg] = useState({
    text: "",
    ok: false
  })


  // =========================
  // RESULTS
  // =========================

  const [resForm, setResForm] = useState({
    student_id: "",
    course_id: "",
    assesment: "",
    score: "",
    grade: "",
    status: "Pass"
  })

  const [resMsg, setResMsg] = useState({
    text: "",
    ok: false
  })


  // =========================
  // EXAM
  // =========================

  const [exam, setExam] = useState({
    course_id: "",
    questionumbers: "",
    duration: ""
  })

  const [examMsg, setExamMsg] = useState({
    text: "",
    ok: false
  })


  // =========================
  // QUESTIONS
  // =========================

  const [ques, setQues] = useState({
    exam_id: "",
    question: ""
  })

  const [quesMsg, setQuesMsg] = useState({
    text: "",
    ok: false
  })


  // =========================
  // OPTIONS
  // =========================

  const [opts, setOpts] = useState({
    question_id: "",
    choice: "",
    ischoice: false
  })

  const [optMsg, setOptMsg] = useState({
    text: "",
    ok: false
  })


  // =========================
  // MODULE
  // =========================

  const [mod, setMod] = useState({
    course_id: "",
    title: "",
    content: ""
  })

  const [modMsg, setModMsg] = useState({
    text: "",
    ok: false
  })

  const [editModId, setEditModId] =
    useState("")

  const [editContent, setEditContent] =
    useState("")

  const [editModMsg, setEditModMsg] =
    useState({
      text: "",
      ok: false
    })


  // =========================
  // GET DATA
  // =========================

  async function safeGet(url) {

    try {

      const response = await api.get(url)

      return {
        success: true,
        data: response.data?.data || []
      }

    } catch (error) {

      console.log(
        "GET ERROR:",
        url,
        error.response?.data
      )

      return {
        success: false,
        data: []
      }
    }
  }


  async function loadAll() {

    setLoading(true)
    setLoadError("")

    const usersData =
      await safeGet("/totalusers")

    const coursesData =
      await safeGet("/totalcourses")

    const attendanceData =
      await safeGet("/admin/attendance")

    const resultsData =
      await safeGet("/admin/results")

    const examsData =
      await safeGet("/admin/exams")

    const modulesData =
      await safeGet("/admin/modules")

    const questionsData =
      await safeGet("/admin/questions")

    const optionsData =
      await safeGet("/admin/options")

    const enrollmentsData =
      await safeGet("/admin/enrollments")


    setUsers(usersData.data)
    setCourses(coursesData.data)
    setAttendance(attendanceData.data)
    setResults(resultsData.data)
    setExams(examsData.data)
    setModules(modulesData.data)
    setQuestions(questionsData.data)
    setOptionsList(optionsData.data)
    setEnrollments(enrollmentsData.data)


    if (
      !usersData.success ||
      !coursesData.success ||
      !attendanceData.success ||
      !resultsData.success ||
      !examsData.success ||
      !modulesData.success ||
      !questionsData.success
    ) {

      setLoadError(
        "Some data could not be loaded. Check your backend routes."
      )
    }

    setLoading(false)
  }


  // Load data when page opens

  useEffect(() => {
    if (!authChecked) return
    loadAll()
  }, [authChecked])


  // =========================
  // EDIT MODULE
  // =========================

  useEffect(() => {

    if (!editModId) {
      setEditContent("")
      return
    }

    const module = modules.find(
      (item) =>
        String(item.id) ===
        String(editModId)
    )

    if (module) {
      setEditContent(module.content || "")
    }

  }, [editModId, modules])


  // =========================
  // POST
  // =========================

  async function handlePost(
    url,
    body,
    setMessage,
    reset
  ) {

    setMessage({
      text: "",
      ok: false
    })

    try {

      const response =
        await api.post(url, body)

      setMessage({
        text:
          response.data?.message ||
          "Created successfully",
        ok: true
      })

      if (reset) {
        reset()
      }

      await loadAll()

    } catch (error) {

      setMessage({
        text:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Request failed",
        ok: false
      })
    }
  }


  // =========================
  // DELETE
  // =========================

  async function handleDelete(
    url,
    rowId,
    name,
    body
  ) {

    const confirmed =
      window.confirm(
        `Delete this ${name}? This cannot be undone.`
      )

    if (!confirmed) return

    setDeletingId(rowId)

    try {

      if (body) {
        await api.delete(url, {
          data: body
        })
      } else {
        await api.delete(url)
      }

      await loadAll()

    } catch (error) {

      alert(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Delete failed"
      )

    } finally {

      setDeletingId(null)
    }
  }


  // =========================
  // REGISTER STUDENT
  // =========================

  async function handleRegisterStudent(e) {

    e.preventDefault()

    setStuMsg({
      text: "",
      ok: false
    })

    try {

      const response =
        await api.post("/register", stu)

      const credentials =
        response.data?.credentials || {
          username: stu.username,
          email: stu.email,
          password: stu.password
        }

      setSharedCredentials(credentials)

      setStuMsg({
        text:
          response.data?.message ||
          "Student registered",
        ok: true
      })

      setStu({
        username: "",
        email: "",
        password: "",
        role: "student",
        joined: ""
      })

      setShowStuPassword(false)

      await loadAll()

    } catch (error) {

      setStuMsg({
        text:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed",
        ok: false
      })
    }
  }

  if (!authChecked) {
    return null
  }

  return (

    <div className="flex flex-col gap-10 bg-white p-10 text-black min-w-screen overflow-hidden min-h-screen font-sans">
 <button
          type="button"
          onClick={() => {
            clearAuthSession()
            router.replace("/Adminlogin")
          }}
          className="p-2 w-full max-w-[100px] bg-blue-500 text-center rounded-xl font-bold text-white ml-auto"
        >
          Logout
        </button>
      {/* <Sidebar /> */}

      <div className="flex flex-col flex-1 min-w-0 bg-gray-200 p-3 min-h-screen">
       

        {/* <Overheadbar /> */}

        <div className="flex flex-col w-full p-7 gap-7">


          {/* ========================= */}
          {/* HEADER */}
          {/* ========================= */}

          <div className="flex justify-between items-center">

            <div>

              <p className="font-bold text-3xl">
                Admin Panel
              </p>

              <p className="text-gray-600">
                Select names from dropdowns —
                IDs are filled automatically
              </p>

            </div>

            <button
              onClick={loadAll}
              disabled={loading}
              className="bg-blue-950 text-white font-bold px-4 py-2 rounded-lg"
            >
              {loading
                ? "Refreshing..."
                : "Refresh All"}
            </button>

          </div>


          {loadError && (

            <div className="bg-red-100 border border-red-400 text-red-800 p-3 rounded-xl">
              {loadError}
            </div>

          )}


          {/* ========================= */}
          {/* STUDENTS */}
          {/* ========================= */}

          <Section title="Students">

            <p className="text-sm text-gray-600">
              Generate a password or type one,
              register the candidate, then copy
              or email the login details.
            </p>

            <form
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              onSubmit={handleRegisterStudent}
            >

              <InputField
                label="Username"
                required
                value={stu.username}
                onChange={(e) =>
                  setStu({
                    ...stu,
                    username: e.target.value
                  })
                }
              />

              <InputField
                label="Email"
                type="email"
                required
                value={stu.email}
                onChange={(e) =>
                  setStu({
                    ...stu,
                    email: e.target.value
                  })
                }
              />

             

              <InputField
                label="Joined"
                type="date"
                required
                value={stu.joined}
                onChange={(e) =>
                  setStu({
                    ...stu,
                    joined: e.target.value
                  })
                }
              />


              <div className="flex flex-col gap-1">

                <FieldLabel>
                  Password
                </FieldLabel>

                <div className="flex gap-2">

                  <input
                    className="border border-gray-400 rounded-lg p-2 flex-1"
                    type={
                      showStuPassword
                        ? "text"
                        : "password"
                    }
                    required
                    value={stu.password}
                    onChange={(e) =>
                      setStu({
                        ...stu,
                        password: e.target.value
                      })
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowStuPassword(
                        !showStuPassword
                      )
                    }
                    className="px-3 py-2 border border-gray-400 rounded-lg"
                  >
                    {showStuPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>


              <div className="col-span-full flex items-center gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setStu({
                      ...stu,
                      password:
                        generatePassword()
                    })
                  }
                  className="bg-gray-700 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Generate Password
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Register Student
                </button>

                <Msg {...stuMsg} />

              </div>

            </form>


            {sharedCredentials && (

              <CredentialSharePanel
                credentials={sharedCredentials}
                onDismiss={() =>
                  setSharedCredentials(null)
                }
              />

            )}


            <DataTable
              rows={users.map((user) => ({
                id: user.id,
                username: user.username,
                // role: user.role,
                email: user.email
              }))}
              onDelete={(row) =>
                handleDelete(
                  `/admin/students/${row.id}`,
                  row.id,
                  "student"
                )
              }
              deletingId={deletingId}
            />

          </Section>


          {/* ========================= */}
          {/* COURSES */}
          {/* ========================= */}

          <Section title="Courses — Add Course for Student">

            <form
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              onSubmit={(e) => {

                e.preventDefault()

                handlePost(
                  "/courses",
                  {
                    student_id:
                      Number(crs.student_id),

                    name: crs.name,

                    description:
                      crs.description,

                    duration:
                      Number(crs.duration),

                    icon: crs.icon
                  },
                  setCrsMsg,
                  () =>
                    setCrs({
                      student_id: "",
                      name: "",
                      description: "",
                      duration: "",
                      icon: "/data.png"
                    })
                )
              }}
            >

              <SelectField
                label="Assign to Student"
                required
                value={crs.student_id}
                onChange={(value) =>
                  setCrs({
                    ...crs,
                    student_id: value
                  })
                }
                options={users.map((user) => ({
                  value: user.id,
                  label:
                    `${user.username} (${user.email})`
                }))}
                placeholder="Select student..."
              />

              <InputField
                label="Course Name"
                required
                value={crs.name}
                onChange={(e) =>
                  setCrs({
                    ...crs,
                    name: e.target.value
                  })
                }
              />

              <InputField
                label="Description"
                required
                value={crs.description}
                onChange={(e) =>
                  setCrs({
                    ...crs,
                    description: e.target.value
                  })
                }
              />

              <InputField
                label="Duration (days)"
                type="number"
                required
                value={crs.duration}
                onChange={(e) =>
                  setCrs({
                    ...crs,
                    duration: e.target.value
                  })
                }
              />

              <InputField
                label="Icon URL"
                required
                value={crs.icon}
                onChange={(e) =>
                  setCrs({
                    ...crs,
                    icon: e.target.value
                  })
                }
              />

              <div className="col-span-full flex gap-3">

                <button
                  type="submit"
                  className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Create & Assign Course
                </button>

                <Msg {...crsMsg} />

              </div>

            </form>


            <p className="text-sm font-medium">
              All courses in catalog:
            </p>

            <DataTable
              rows={courses}
              onDelete={(row) =>
                handleDelete(
                  `/admin/courses/${row.id}`,
                  row.id,
                  "course"
                )
              }
              deletingId={deletingId}
            />


            <p className="text-sm font-medium">
              Who is enrolled in what:
            </p>

            <DataTable
              rows={enrollments.map((item) => ({
                id: item.id,
                student: item.username,
                email: item.email,
                course: item.course_name,
                progress: `${item.pct}%`
              }))}
              emptyText="No enrollments yet"
              onDelete={(row) =>
                handleDelete(
                  `/admin/enrollments/${row.id}`,
                  row.id,
                  "enrollment"
                )
              }
              deletingId={deletingId}
            />

          </Section>


          {/* ========================= */}
          {/* ENROLLMENT */}
          {/* ========================= */}

          <Section title="Assign Existing Course to Another Student">

            <form
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              onSubmit={(e) => {

                e.preventDefault()

                handlePost(
                  "/enrollment",
                  {
                    student_id:
                      Number(enroll.student_id),

                    course_id:
                      Number(enroll.course_id)
                  },
                  setEnrollMsg,
                  () =>
                    setEnroll({
                      student_id: "",
                      course_id: ""
                    })
                )

              }}
            >

              <SelectField
                label="Student"
                required
                value={enroll.student_id}
                onChange={(value) =>
                  setEnroll({
                    ...enroll,
                    student_id: value
                  })
                }
                options={users.map((user) => ({
                  value: user.id,
                  label:
                    `${user.username} (${user.email})`
                }))}
              />

              <SelectField
                label="Course"
                required
                value={enroll.course_id}
                onChange={(value) =>
                  setEnroll({
                    ...enroll,
                    course_id: value
                  })
                }
                options={courses.map((course) => ({
                  value: course.id,
                  label: course.name
                }))}
              />

              <div className="col-span-full flex gap-3">

                <button
                  type="submit"
                  className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Enroll Student
                </button>

                <Msg {...enrollMsg} />

              </div>

            </form>

          </Section>


          {/* ========================= */}
          {/* ATTENDANCE */}
          {/* ========================= */}

          <Section title="Attendance">

            <form
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              onSubmit={(e) => {

                e.preventDefault()

                handlePost(
                  "/attendance",
                  {
                    student_id:
                      Number(att.student_id),

                    course_id:
                      Number(att.course_id),

                    Date: att.Date,

                    status: att.status
                  },
                  setAttMsg,
                  () =>
                    setAtt({
                      student_id: "",
                      course_id: "",
                      Date: "",
                      status: "present"
                    })
                )

              }}
            >

              <SelectField
                label="Student"
                required
                value={att.student_id}
                onChange={(value) =>
                  setAtt({
                    ...att,
                    student_id: value
                  })
                }
                options={users.map((user) => ({
                  value: user.id,
                  label:
                    `${user.username} (${user.email})`
                }))}
              />

              <SelectField
                label="Course"
                required
                value={att.course_id}
                onChange={(value) =>
                  setAtt({
                    ...att,
                    course_id: value
                  })
                }
                options={courses.map((course) => ({
                  value: course.id,
                  label: course.name
                }))}
              />

              <InputField
                label="Date"
                type="date"
                required
                value={att.Date}
                onChange={(e) =>
                  setAtt({
                    ...att,
                    Date: e.target.value
                  })
                }
              />

              <SelectField
                label="Status"
                value={att.status}
                onChange={(value) =>
                  setAtt({
                    ...att,
                    status: value
                  })
                }
                options={[
                  {
                    value: "present",
                    label: "present"
                  },
                  {
                    value: "absent",
                    label: "absent"
                  }
                ]}
              />

              <div className="col-span-full flex gap-3">

                <button
                  type="submit"
                  className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Mark Attendance
                </button>

                <Msg {...attMsg} />

              </div>

            </form>


            <DataTable
              rows={attendance.map(
                (row, index) => ({
                  ...row,
                  _rowKey:
                    `${row.student_id}-${row.course_id}-${row.Date}-${index}`
                })
              )}
              onDelete={(row) =>
                handleDelete(
                  "/admin/attendance",
                  row._rowKey,
                  "attendance record",
                  {
                    student_id:
                      row.student_id,

                    course_id:
                      row.course_id,

                    Date: row.Date
                  }
                )
              }
              deletingId={deletingId}
            />

          </Section>


          {/* ========================= */}
          {/* RESULTS */}
          {/* ========================= */}

          <Section title="Results">

            <form
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              onSubmit={(e) => {

                e.preventDefault()

                handlePost(
                  "/result",
                  {
                    student_id:
                      Number(resForm.student_id),

                    course_id:
                      Number(resForm.course_id),

                    assesment:
                      resForm.assesment,

                    score:
                      Number(resForm.score),

                    grade:
                      resForm.grade,

                    status:
                      resForm.status
                  },
                  setResMsg,
                  () =>
                    setResForm({
                      student_id: "",
                      course_id: "",
                      assesment: "",
                      score: "",
                      grade: "",
                      status: "Pass"
                    })
                )

              }}
            >

              <SelectField
                label="Student"
                required
                value={resForm.student_id}
                onChange={(value) =>
                  setResForm({
                    ...resForm,
                    student_id: value
                  })
                }
                options={users.map((user) => ({
                  value: user.id,
                  label:
                    `${user.username} (${user.email})`
                }))}
              />

              <SelectField
                label="Course"
                required
                value={resForm.course_id}
                onChange={(value) =>
                  setResForm({
                    ...resForm,
                    course_id: value
                  })
                }
                options={courses.map((course) => ({
                  value: course.id,
                  label: course.name
                }))}
              />

              <InputField
                label="Assessment Name"
                required
                value={resForm.assesment}
                onChange={(e) =>
                  setResForm({
                    ...resForm,
                    assesment: e.target.value
                  })
                }
              />

              <InputField
                label="Score"
                type="number"
                required
                value={resForm.score}
                onChange={(e) =>
                  setResForm({
                    ...resForm,
                    score: e.target.value
                  })
                }
              />

              <InputField
                label="Grade"
                required
                placeholder="A"
                value={resForm.grade}
                onChange={(e) =>
                  setResForm({
                    ...resForm,
                    grade: e.target.value
                  })
                }
              />

              <SelectField
                label="Status"
                value={resForm.status}
                onChange={(value) =>
                  setResForm({
                    ...resForm,
                    status: value
                  })
                }
                options={[
                  {
                    value: "Pass",
                    label: "Pass"
                  },
                  {
                    value: "Fail",
                    label: "Fail"
                  }
                ]}
              />

              <div className="col-span-full flex gap-3">

                <button
                  type="submit"
                  className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Add Result
                </button>

                <Msg {...resMsg} />

              </div>

            </form>


            <DataTable
              rows={results.map(
                (row, index) => ({
                  ...row,
                  _rowKey:
                    row.id ||
                    `result-${row.student_id}-${row.course_id}-${index}`
                })
              )}
              onDelete={(row) => {

                if (row.id) {

                  handleDelete(
                    `/admin/results/${row.id}`,
                    row._rowKey,
                    "result"
                  )

                } else {

                  handleDelete(
                    "/admin/results",
                    row._rowKey,
                    "result",
                    {
                      course_id:
                        row.course_id,

                      student_id:
                        row.student_id,

                      assesment:
                        row.assesment,

                      score:
                        row.score
                    }
                  )

                }

              }}
              deletingId={deletingId}
            />

          </Section>


          {/* ========================= */}
          {/* EXAMS */}
          {/* ========================= */}

          <Section title="Exams">

            <form
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              onSubmit={(e) => {

                e.preventDefault()

                handlePost(
                  "/exam",
                  {
                    course_id:
                      Number(exam.course_id),

                    questionumbers:
                      Number(
                        exam.questionumbers
                      ),

                    duration:
                      Number(exam.duration)
                  },
                  setExamMsg,
                  () =>
                    setExam({
                      course_id: "",
                      questionumbers: "",
                      duration: ""
                    })
                )

              }}
            >

              <SelectField
                label="Course"
                required
                value={exam.course_id}
                onChange={(value) =>
                  setExam({
                    ...exam,
                    course_id: value
                  })
                }
                options={courses.map((course) => ({
                  value: course.id,
                  label: course.name
                }))}
              />

              <InputField
                label="Number of Questions"
                type="number"
                required
                value={exam.questionumbers}
                onChange={(e) =>
                  setExam({
                    ...exam,
                    questionumbers:
                      e.target.value
                  })
                }
              />

              <InputField
                label="Duration (minutes)"
                type="number"
                required
                value={exam.duration}
                onChange={(e) =>
                  setExam({
                    ...exam,
                    duration:
                      e.target.value
                  })
                }
              />

              <div className="col-span-full flex gap-3">

                <button
                  type="submit"
                  className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Create Exam
                </button>

                <Msg {...examMsg} />

              </div>

            </form>


            <DataTable
              rows={exams}
              onDelete={(row) =>
                handleDelete(
                  `/admin/exams/${row.id}`,
                  row.id,
                  "exam"
                )
              }
              deletingId={deletingId}
            />

          </Section>


          {/* ========================= */}
          {/* QUESTIONS */}
          {/* ========================= */}

          <Section title="Questions">

            <form
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              onSubmit={(e) => {

                e.preventDefault()

                handlePost(
                  "/questions",
                  {
                    exam_id:
                      Number(ques.exam_id),

                    question:
                      ques.question
                  },
                  setQuesMsg,
                  () =>
                    setQues({
                      exam_id: "",
                      question: ""
                    })
                )

              }}
            >

              <SelectField
                label="Exam"
                required
                value={ques.exam_id}
                onChange={(value) =>
                  setQues({
                    ...ques,
                    exam_id: value
                  })
                }
                options={exams.map((exam) => ({
                  value: exam.id,
                  label:
                    `${exam.course_name || "Course"} — Exam #${exam.id}`
                }))}
              />

              <InputField
                label="Question Text"
                required
                value={ques.question}
                onChange={(e) =>
                  setQues({
                    ...ques,
                    question:
                      e.target.value
                  })
                }
              />

              <div className="col-span-full flex gap-3">

                <button
                  type="submit"
                  className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Add Question
                </button>

                <Msg {...quesMsg} />

              </div>

            </form>


            <DataTable
              rows={questions}
              onDelete={(row) =>
                handleDelete(
                  `/admin/questions/${row.id}`,
                  row.id,
                  "question"
                )
              }
              deletingId={deletingId}
            />

          </Section>


          {/* ========================= */}
          {/* OPTIONS */}
          {/* ========================= */}

          <Section title="Answer Options">

            <p className="text-sm text-gray-600">
              Add 3–4 options per question.
              Mark one as the correct answer.
            </p>

            <form
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              onSubmit={(e) => {

                e.preventDefault()

                handlePost(
                  "/options",
                  {
                    question_id:
                      Number(opts.question_id),

                    choice:
                      opts.choice,

                    ischoice:
                      opts.ischoice
                  },
                  setOptMsg,
                  () =>
                    setOpts({
                      question_id:
                        opts.question_id,

                      choice: "",

                      ischoice: false
                    })
                )

              }}
            >

              <SelectField
                label="Question"
                required
                value={opts.question_id}
                onChange={(value) =>
                  setOpts({
                    ...opts,
                    question_id: value
                  })
                }
                options={questions.map((question) => ({
                  value: question.id,
                  label:
                    (
                      question.question ||
                      `Question #${question.id}`
                    ).slice(0, 100)
                }))}
              />

              <InputField
                label="Option Text"
                required
                value={opts.choice}
                onChange={(e) =>
                  setOpts({
                    ...opts,
                    choice:
                      e.target.value
                  })
                }
              />

              <div className="flex flex-col gap-1">

                <FieldLabel>
                  Correct answer?
                </FieldLabel>

                <label className="flex gap-2 p-2 border border-gray-400 rounded-lg">

                  <input
                    type="checkbox"
                    checked={opts.ischoice}
                    onChange={(e) =>
                      setOpts({
                        ...opts,
                        ischoice:
                          e.target.checked
                      })
                    }
                  />

                  <span>
                    This is the correct option
                  </span>

                </label>

              </div>


              <div className="col-span-full flex gap-3">

                <button
                  type="submit"
                  className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Add Option
                </button>

                <Msg {...optMsg} />

              </div>

            </form>


            <DataTable
              rows={optionsList}
              onDelete={(row) =>
                handleDelete(
                  `/admin/options/${row.id}`,
                  row.id,
                  "option"
                )
              }
              deletingId={deletingId}
            />

          </Section>


          {/* ========================= */}
          {/* ADD MODULE */}
          {/* ========================= */}

          <Section title="Modules — Add New">

            <form
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              onSubmit={(e) => {

                e.preventDefault()

                let position = 1

                for (let i = 0; i < modules.length; i++) {

                  if (
                    String(modules[i].course_id) ===
                    String(mod.course_id)
                  ) {
                    position++
                  }

                }

                handlePost(
                  "/modules",
                  {
                    course_id:
                      Number(mod.course_id),

                    title:
                      mod.title,

                    content:
                      mod.content,

                    position:
                      position
                  },
                  setModMsg,
                  () =>
                    setMod({
                      course_id:
                        mod.course_id,

                      title: "",

                      content: ""
                    })
                )

              }}
            >

              <SelectField
                label="Course"
                required
                value={mod.course_id}
                onChange={(value) =>
                  setMod({
                    ...mod,
                    course_id: value
                  })
                }
                options={courses.map((course) => ({
                  value: course.id,
                  label: course.name
                }))}
              />

              <InputField
                label="Module Title"
                required
                value={mod.title}
                onChange={(e) =>
                  setMod({
                    ...mod,
                    title:
                      e.target.value
                  })
                }
              />

              <InputField
                label="Position"
                value={
                  modules.filter(
                    (item) =>
                      String(item.course_id) ===
                      String(mod.course_id)
                  ).length + 1
                }
                readOnly
              />

              <TextAreaField
                label="Module Content"
                required
                value={mod.content}
                onChange={(e) =>
                  setMod({
                    ...mod,
                    content:
                      e.target.value
                  })
                }
              />

              <div className="col-span-full flex gap-3">

                <button
                  type="submit"
                  className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Add Module
                </button>

                <Msg {...modMsg} />

              </div>

            </form>

          </Section>


          {/* ========================= */}
          {/* EDIT MODULE */}
          {/* ========================= */}

          <Section title="Modules — Update Content">

            <p className="text-sm text-gray-600">
              Select an existing module and update
              its lesson content.
            </p>

            <form
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              onSubmit={async (e) => {

                e.preventDefault()

                setEditModMsg({
                  text: "",
                  ok: false
                })

                try {

                  const response =
                    await api.put(
                      `/modules/${editModId}`,
                      {
                        content:
                          editContent
                      }
                    )

                  setEditModMsg({
                    text:
                      response.data?.message ||
                      "Content saved",
                    ok: true
                  })

                  await loadAll()

                } catch (error) {

                  setEditModMsg({
                    text:
                      error.response?.data?.error ||
                      error.response?.data?.message ||
                      "Failed to save content",
                    ok: false
                  })

                }

              }}
            >

              <SelectField
                label="Existing Module"
                required
                value={editModId}
                onChange={setEditModId}
                options={modules.map((module) => ({
                  value: module.id,
                  label:
                    `${module.course_name || "Course"} — ${module.title}`
                }))}
              />

              <TextAreaField
                label="Lesson Content"
                required
                value={editContent}
                onChange={(e) =>
                  setEditContent(
                    e.target.value
                  )
                }
              />

              <div className="col-span-full flex gap-3">

                <button
                  type="submit"
                  className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Save Content
                </button>

                <Msg {...editModMsg} />

              </div>

            </form>


            <DataTable
              rows={modules}
              onDelete={(row) =>
                handleDelete(
                  `/admin/modules/${row.id}`,
                  row.id,
                  "module"
                )
              }
              deletingId={deletingId}
            />

          </Section>

        </div>

      </div>

    </div>
  )
}