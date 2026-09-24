/** Client-side course search (Option 1 — no backend route). */
export function filterCoursesByQuery(courses = [], query = "") {
  const needle = String(query).trim().toLowerCase()
  if (!needle) return courses

  return courses.filter((c) => {
    const name = (c.name || "").toLowerCase()
    const description = (c.description || "").toLowerCase()
    return name.includes(needle) || description.includes(needle)
  })
}
