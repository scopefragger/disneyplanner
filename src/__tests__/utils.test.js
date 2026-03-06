import { describe, it, expect } from 'vitest'
import { fuzzyMatch } from '../utils.js'

describe('fuzzyMatch', () => {
  it('returns true when query is empty', () => {
    expect(fuzzyMatch('', 'Frozen')).toBe(true)
    expect(fuzzyMatch('', '')).toBe(true)
  })

  it('returns true for exact substring match', () => {
    expect(fuzzyMatch('frozen', 'Frozen')).toBe(true)
    expect(fuzzyMatch('star', 'Star Wars')).toBe(true)
    expect(fuzzyMatch('meet', 'Character Meet & Greets')).toBe(true)
  })

  it('is case-insensitive', () => {
    expect(fuzzyMatch('FROZEN', 'Frozen')).toBe(true)
    expect(fuzzyMatch('Moana', 'moana')).toBe(true)
  })

  it('returns true for fuzzy character-order match', () => {
    expect(fuzzyMatch('frzn', 'Frozen')).toBe(true)
    expect(fuzzyMatch('stws', 'Star Wars')).toBe(true)
    expect(fuzzyMatch('mrvl', 'Marvel')).toBe(true)
  })

  it('returns false when characters are not present in order', () => {
    expect(fuzzyMatch('xyz', 'Frozen')).toBe(false)
    expect(fuzzyMatch('zzz', 'Star Wars')).toBe(false)
  })

  it('returns false when query has characters in wrong order', () => {
    expect(fuzzyMatch('nzorf', 'Frozen')).toBe(false)
  })

  it('handles single character queries', () => {
    expect(fuzzyMatch('f', 'Frozen')).toBe(true)
    expect(fuzzyMatch('z', 'Frozen')).toBe(true)
    expect(fuzzyMatch('q', 'Frozen')).toBe(false)
  })
})
