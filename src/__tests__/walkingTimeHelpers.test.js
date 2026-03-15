import { describe, it, expect } from 'vitest'
import { getWalkingTime, getWalkGapStatus, timeToMinutes } from '../data/walkingTimeHelpers.js'

describe('timeToMinutes', () => {
  it('converts 08:00 to 480', () => expect(timeToMinutes('08:00')).toBe(480))
  it('converts 09:30 to 570', () => expect(timeToMinutes('09:30')).toBe(570))
  it('converts 00:00 to 0', () => expect(timeToMinutes('00:00')).toBe(0))
  it('converts 23:59 to 1439', () => expect(timeToMinutes('23:59')).toBe(1439))
  it('returns null for null input', () => expect(timeToMinutes(null)).toBeNull())
  it('returns null for invalid string', () => expect(timeToMinutes('abc')).toBeNull())
})

describe('getWalkGapStatus', () => {
  it('returns ok when gap >= walk + 15', () => {
    expect(getWalkGapStatus(10, 25)).toBe('ok')
  })

  it('returns ok at exact walk + 15 boundary', () => {
    expect(getWalkGapStatus(10, 25)).toBe('ok')
  })

  it('returns tight when gap equals walk time', () => {
    expect(getWalkGapStatus(10, 10)).toBe('tight')
  })

  it('returns tight when gap is between walk and walk + 15', () => {
    expect(getWalkGapStatus(10, 20)).toBe('tight')
  })

  it('returns impossible when gap is less than walk time', () => {
    expect(getWalkGapStatus(15, 8)).toBe('impossible')
  })

  it('returns impossible when gap is 0', () => {
    expect(getWalkGapStatus(5, 0)).toBe('impossible')
  })
})

describe('getWalkingTime', () => {
  it('returns SAME_AREA_MINUTES (3) for identical areas', () => {
    expect(getWalkingTime('Fantasyland', 'Fantasyland', 'Magic Kingdom')).toBe(3)
  })

  it('looks up direct matrix entry (Fantasyland → Tomorrowland)', () => {
    expect(getWalkingTime('Fantasyland', 'Tomorrowland', 'Magic Kingdom')).toBe(6)
  })

  it('is symmetric (Tomorrowland → Fantasyland equals Fantasyland → Tomorrowland)', () => {
    const a = getWalkingTime('Fantasyland', 'Tomorrowland', 'Magic Kingdom')
    const b = getWalkingTime('Tomorrowland', 'Fantasyland', 'Magic Kingdom')
    expect(a).toBe(b)
  })

  it('looks up entry for EPCOT areas', () => {
    expect(getWalkingTime('World Discovery', 'World Showcase', 'EPCOT')).toBe(12)
  })

  it("looks up entry for Hollywood Studios areas (Galaxy's Edge → Sunset Boulevard)", () => {
    expect(getWalkingTime("Galaxy's Edge", 'Sunset Boulevard', "Disney's Hollywood Studios")).toBe(15)
  })

  it('looks up entry for Animal Kingdom areas (Pandora → DinoLand U.S.A.)', () => {
    expect(getWalkingTime('Pandora', 'DinoLand U.S.A.', "Disney's Animal Kingdom")).toBe(14)
  })

  it('returns fallback (5) for unknown park', () => {
    expect(getWalkingTime('Fantasyland', 'Tomorrowland', 'Unknown Park')).toBe(5)
  })

  it('returns fallback (5) for null fromArea', () => {
    expect(getWalkingTime(null, 'Fantasyland', 'Magic Kingdom')).toBe(5)
  })

  it('returns fallback (5) for null park', () => {
    expect(getWalkingTime('Fantasyland', 'Tomorrowland', null)).toBe(5)
  })

  it('Adventureland to Frontierland is shorter than Adventureland to Tomorrowland', () => {
    const short = getWalkingTime('Adventureland', 'Frontierland', 'Magic Kingdom')
    const longer = getWalkingTime('Adventureland', 'Tomorrowland', 'Magic Kingdom')
    expect(short).toBeLessThan(longer)
  })
})
