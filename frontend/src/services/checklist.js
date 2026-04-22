const STORAGE_KEY = 'certidoc.checklist'

export function getChecklist() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function toggleItem(key) {
  const current = getChecklist()
  const next = { ...current, [key]: !current[key] }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function clearChecklist() {
  localStorage.removeItem(STORAGE_KEY)
  return {}
}
