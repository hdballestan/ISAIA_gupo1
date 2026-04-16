const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error?.error?.message || `HTTP ${response.status}`)
  }
  return response.json()
}

async function fetchWithRetry(path, options = {}, retries = 1, delayMs = 1000) {
  try {
    return await apiFetch(path, options)
  } catch (err) {
    const isRetryable = err.message.includes('502') || err.message.includes('503')
    if (retries > 0 && isRetryable) {
      await new Promise((r) => setTimeout(r, delayMs))
      return fetchWithRetry(path, options, retries - 1, delayMs)
    }
    throw err
  }
}

export function getCertificates() {
  return fetchWithRetry('/certificates')
}

export function getCertificateById(id) {
  return apiFetch(`/certificates/${id}`)
}

export function extractCertificates(text) {
  return apiFetch('/extract', { method: 'POST', body: JSON.stringify({ text }) })
}

export function createTicket(data) {
  return apiFetch('/tickets', { method: 'POST', body: JSON.stringify(data) })
}

export function login(email, password) {
  return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
}

export function register(email, password) {
  return apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) })
}

export function getAdminTickets() {
  return apiFetch('/admin/tickets')
}

export function deleteCertificate(id) {
  return apiFetch(`/admin/certificates/${id}`, { method: 'DELETE' })
}

export function updateCertificate(id, data) {
  return apiFetch(`/admin/certificates/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function createCertificate(data) {
  return apiFetch('/admin/certificates', { method: 'POST', body: JSON.stringify(data) })
}
