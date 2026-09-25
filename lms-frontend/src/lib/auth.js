const AUTH_ROLE_KEY = "authRole"

function decodeJwtPayload(token) {
  if (!token) return null

  try {
    const payload = token.split(".")[1]
    if (!payload) return null

    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    const pad = base64.length % 4
    if (pad) {
      base64 += "=".repeat(4 - pad)
    }

    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function getTokenRole(token) {
  const payload = decodeJwtPayload(token)
  return payload?.role ?? null
}

export function isAdminToken(token) {
  return getTokenRole(token) === "admin"
}

export function isStudentToken(token) {
  return getTokenRole(token) === "student"
}

export function setAuthSession({ token, role, name }) {
  if (!token || !role) return
  localStorage.setItem("token", token)
  localStorage.setItem(AUTH_ROLE_KEY, role)
  if (name) {
    localStorage.setItem("studentname", name)
  }
}

export function clearAuthSession() {
  localStorage.removeItem("token")
  localStorage.removeItem(AUTH_ROLE_KEY)
  localStorage.removeItem("studentname")
}

/** True when user logged in as admin (local role flag or JWT role). */
export function isAdminSession() {
  const token = localStorage.getItem("token")
  if (!token || token === "undefined") return false

  if (localStorage.getItem(AUTH_ROLE_KEY) === "admin") {
    return true
  }

  return isAdminToken(token)
}

export function isStudentSession() {
  const token = localStorage.getItem("token")
  if (!token || token === "undefined") return false

  if (localStorage.getItem(AUTH_ROLE_KEY) === "student") {
    return true
  }

  return isStudentToken(token)
}
