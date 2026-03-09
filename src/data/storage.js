// Persistence helpers — localStorage read/write, project management (TD-032)
import { normalizePlan } from './planHelpers.js'

export const STORAGE_KEY = 'disney-holiday-planner'
export const PROJECTS_KEY = 'disney-holiday-projects'

export function generateId() {
  return `proj-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function loadAllProjects() {
  const saved = localStorage.getItem(PROJECTS_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {}
      return parsed
    } catch { return {} }
  }
  // Migrate old single-plan format
  const old = localStorage.getItem(STORAGE_KEY)
  if (old) {
    try {
      const plan = normalizePlan(JSON.parse(old))
      const id = generateId()
      const projects = { [id]: { id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), plan } }
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
      localStorage.removeItem(STORAGE_KEY)
      return projects
    } catch { return {} }
  }
  return {}
}
