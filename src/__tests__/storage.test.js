import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateId, loadAllProjects, STORAGE_KEY, PROJECTS_KEY } from '../data/storage.js'
import { DEFAULT_PLAN } from '../data/planHelpers.js'

// Minimal localStorage mock — jsdom's implementation may not expose clear() in all envs
function makeLocalStorage() {
  const store = {}
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value) },
    removeItem: (key) => { delete store[key] },
    clear: () => { Object.keys(store).forEach(k => delete store[k]) },
  }
}

const ls = makeLocalStorage()
vi.stubGlobal('localStorage', ls)

beforeEach(() => ls.clear())

// ── generateId ────────────────────────────────────────────────────────────────

describe('generateId', () => {
  it('returns a string starting with "proj-"', () => {
    expect(generateId()).toMatch(/^proj-/)
  })

  it('returns unique IDs on successive calls', () => {
    const ids = new Set(Array.from({ length: 20 }, () => generateId()))
    expect(ids.size).toBe(20)
  })
})

// ── loadAllProjects ───────────────────────────────────────────────────────────

describe('loadAllProjects', () => {
  it('returns {} when localStorage is empty', () => {
    expect(loadAllProjects()).toEqual({})
  })

  it('returns parsed projects when PROJECTS_KEY exists', () => {
    const projects = {
      'proj-abc': { id: 'proj-abc', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', plan: DEFAULT_PLAN }
    }
    ls.setItem(PROJECTS_KEY, JSON.stringify(projects))
    expect(loadAllProjects()).toEqual(projects)
  })

  it('returns {} when PROJECTS_KEY contains invalid JSON', () => {
    ls.setItem(PROJECTS_KEY, 'not-json{{{')
    expect(loadAllProjects()).toEqual({})
  })

  it('migrates old single-plan format from STORAGE_KEY into PROJECTS_KEY', () => {
    const oldPlan = { ...DEFAULT_PLAN, tripName: 'Old Trip', startDate: '2026-06-01', endDate: '2026-06-07' }
    ls.setItem(STORAGE_KEY, JSON.stringify(oldPlan))

    const result = loadAllProjects()

    const projectValues = Object.values(result)
    expect(projectValues).toHaveLength(1)
    expect(projectValues[0].plan.tripName).toBe('Old Trip')

    // Old key removed; new key saved
    expect(ls.getItem(STORAGE_KEY)).toBeNull()
    expect(ls.getItem(PROJECTS_KEY)).not.toBeNull()
  })

  it('returns {} when STORAGE_KEY contains invalid JSON', () => {
    ls.setItem(STORAGE_KEY, 'bad{{{')
    expect(loadAllProjects()).toEqual({})
  })
})
