function toNum(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function clampPct(value) {
  return Math.min(100, Math.max(0, Math.round(toNum(value))))
}

export function calcAttendancePct(attendance = []) {
  if (!attendance.length) return 0
  const present = attendance.filter((x) => x.status === "present").length
  return clampPct((present / attendance.length) * 100)
}

export function calcAvgScore(results = []) {
  if (!results.length) return 0
  const total = results.reduce((s, r) => s + toNum(r.score), 0)
  return clampPct(total / results.length)
}

export function calcOverallProgress(courses = []) {
  if (!courses.length) return 0
  const total = courses.reduce((s, c) => s + toNum(c.pct), 0)
  return clampPct(total / courses.length)
}

export function calcPlacementReadiness(courses = [], results = [], attendance = []) {
  const courseProgress = calcOverallProgress(courses)
  const avgScore = calcAvgScore(results)
  const attendancePct = calcAttendancePct(attendance)

  const technical = results.length
    ? clampPct((courseProgress + avgScore) / 2)
    : courseProgress

  const communication = attendancePct
  const interview = clampPct((technical + communication + avgScore) / 3)
  const overall = clampPct((technical + communication + interview) / 3)

  return { technical, communication, interview, overall }
}

export function getPlacementLabel(score) {
  if (score >= 80) return { text: "🟢 Ready for Placement", color: "text-green-600" }
  if (score >= 60) return { text: "🟡 Almost Ready", color: "text-yellow-600" }
  return { text: "🔴 Needs Improvement", color: "text-red-600" }
}

export function getPlacementSteps(courses = [], results = [], attendance = []) {
  const steps = []
  courses
    .filter((c) => toNum(c.pct) < 70)
    .forEach((c) => steps.push(`Complete remaining modules in ${c.name} (${clampPct(c.pct)}% done)`))

  results
    .filter((r) => r.status === "Fail" || toNum(r.score) < 50)
    .forEach((r) =>
      steps.push(`Improve score in ${r.assesment || r.name || "assessment"} (${clampPct(r.score)}%)`)
    )

  const att = calcAttendancePct(attendance)
  if (attendance.length && att < 75) steps.push(`Improve attendance (currently ${att}%)`)

  if (!steps.length) {
    steps.push("Practice mock interviews", "Build 1–2 portfolio projects", "Apply to recommended roles")
  }
  return steps.slice(0, 5)
}

export function getSuggestedRoles(courses = []) {
  if (!courses.length) return ["Enroll in a course to unlock role suggestions"]
  const roles = courses.map((c) => {
    const name = (c.name || "").toLowerCase()
    if (/python|fullstack|web/.test(name)) return "Junior Python Developer"
    if (/data|analytics/.test(name)) return "Data Analyst Trainee"
    if (/ai|ml|machine/.test(name)) return "AI/ML Intern"
    if (/cyber|security|soc/.test(name)) return "SOC Analyst Trainee"
    return `Junior ${c.name} Specialist`
  })
  return [...new Set(roles)].slice(0, 4)
}

export function getAIInsights(courses = [], results = [], attendance = []) {
  const insights = []
  if (!courses.length && !results.length) {
    return [{ color: "yellow", text: "Enroll in a course to get personalized insights" }]
  }

  if (courses.length) {
    const best = courses.reduce((a, b) => (toNum(a.pct) > toNum(b.pct) ? a : b))
    const worst = courses.reduce((a, b) => (toNum(a.pct) < toNum(b.pct) ? a : b))
    if (best) insights.push({ color: "green", text: `Performing well in ${best.name} (${clampPct(best.pct)}%)` })
    if (worst && toNum(worst.pct) < 80)
      insights.push({ color: "yellow", text: `Focus more on ${worst.name} (${clampPct(worst.pct)}% complete)` })
  }

  results
    .filter((r) => r.status === "Fail")
    .forEach((r) =>
      insights.push({ color: "yellow", text: `Retake: ${r.assesment || "assessment"} (${clampPct(r.score)}%)` })
    )

  const att = calcAttendancePct(attendance)
  if (attendance.length && att < 70)
    insights.push({ color: "yellow", text: `Attendance is ${att}% — aim for 75%+` })

  const pending = courses.find((c) => toNum(c.pct) < 100)
  if (pending)
    insights.push({ color: "bulb", text: `Continue ${pending.name} — ${clampPct(pending.pct)}% done` })

  return insights.slice(0, 4)
}

const ROLE_SKILLS = {
  "Python developer": ["Advanced Python", "SQL", "Git/GitHub", "REST API", "Testing"],
  "Data Analyst": ["Advanced SQL", "Power BI", "Statistics", "Python Pandas", "Data Visualization"],
  "AI/ML Engineer": ["Python", "Statistics", "Machine Learning", "Deep Learning", "MLOps"],
  "SOC Analyst": ["Networking", "Linux", "SIEM", "Incident Response", "Threat Intelligence"],
  "Web Developer": ["JavaScript", "React", "REST API", "Git", "Database"],
}

/** Maps dropdown labels from course suggestions to ROLE_SKILLS keys */
const ROLE_ALIASES = {
  "Junior Python Developer": "Python developer",
  "Data Analyst Trainee": "Data Analyst",
  "AI/ML Intern": "AI/ML Engineer",
  "SOC Analyst Trainee": "SOC Analyst",
}

function resolveRoleSkillsKey(role = "") {
  if (ROLE_SKILLS[role]) return role
  if (ROLE_ALIASES[role]) return ROLE_ALIASES[role]
  return role
}

/** Tools/skills to learn for a target role (not enrolled LMS course names). */
export function getSkillGaps(_courses = [], role = "") {
  const key = resolveRoleSkillsKey(role)
  const roleSkills = ROLE_SKILLS[key] || []

  if (!roleSkills.length) {
    return ["No skill list for this role yet — choose Python developer, Data Analyst, AI/ML Engineer, SOC Analyst, or Web Developer."]
  }

  return roleSkills.map((skill) => `⚡ ${skill}`)
}

export function getTrackLabel(courses = []) {
  if (!courses.length) return "Student"
  if (courses.length === 1) return `Student · ${courses[0].name}`
  return `Student · ${courses[0].name} +${courses.length - 1} more`
}

export async function fetchStudentStats(api) {
  const [coursesRes, attendRes, resultRes] = await Promise.all([
    api.get("/courses"),
    api.get("/attendance"),
    api.get("/result"),
  ])

  const courses = coursesRes.data.data || []
  const attendance = attendRes.data.data || []
  const results = resultRes.data.data || []

  const placement = calcPlacementReadiness(courses, results, attendance)

  return {
    courses,
    attendance,
    results,
    attendancePct: calcAttendancePct(attendance),
    avgScore: calcAvgScore(results),
    overallProgress: calcOverallProgress(courses),
    placement,
    placementLabel: getPlacementLabel(placement.overall),
    placementSteps: getPlacementSteps(courses, results, attendance),
    suggestedRoles: getSuggestedRoles(courses),
    aiInsights: getAIInsights(courses, results, attendance),
    trackLabel: getTrackLabel(courses),
  }
}
