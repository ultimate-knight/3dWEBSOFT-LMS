export function getTokenRole(token) {
  if (!token) return null

  try {
    const payload = token.split(".")[1]
    if (!payload) return null
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))
    return decoded.role ?? null
  } catch {
    return null
  }
}

export function isAdminToken(token) {
  return getTokenRole(token) === "admin"
}
