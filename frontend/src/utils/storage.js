const KEY = 'token'

function normalizeToken(value) {
  if (value == null) return ''
  let s = typeof value === 'string' ? value.trim() : String(value).trim()
  s = s.replace(/^Bearer\s+/i, '')
  return s
}

export function getToken() {
  const raw = localStorage.getItem(KEY)
  return normalizeToken(raw)
}

export function setToken(value) {
  const s = normalizeToken(value)
  if (!s) return
  localStorage.setItem(KEY, s)
}

export function clearToken() {
  localStorage.removeItem(KEY)
}
