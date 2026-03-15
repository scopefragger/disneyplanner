import { describe, it, expect } from 'vitest'
import { getSeasonFromDate, getTimeSlotFromTime, getTypicalWait } from '../data/waitTimeHelpers.js'

describe('getSeasonFromDate', () => {
  it('returns low for January', () => expect(getSeasonFromDate('2026-01-15')).toBe('low'))
  it('returns low for February', () => expect(getSeasonFromDate('2026-02-10')).toBe('low'))
  it('returns value for March', () => expect(getSeasonFromDate('2026-03-20')).toBe('value'))
  it('returns value for April', () => expect(getSeasonFromDate('2026-04-01')).toBe('value'))
  it('returns moderate for May', () => expect(getSeasonFromDate('2026-05-15')).toBe('moderate'))
  it('returns peak for July', () => expect(getSeasonFromDate('2026-07-04')).toBe('peak'))
  it('returns peak for August', () => expect(getSeasonFromDate('2026-08-20')).toBe('peak'))
  it('returns low for September', () => expect(getSeasonFromDate('2026-09-01')).toBe('low'))
  it('returns value for October', () => expect(getSeasonFromDate('2026-10-31')).toBe('value'))
  it('returns low for November', () => expect(getSeasonFromDate('2026-11-10')).toBe('low'))
  it('returns peak for December', () => expect(getSeasonFromDate('2026-12-25')).toBe('peak'))
  it('returns moderate for missing input', () => expect(getSeasonFromDate(null)).toBe('moderate'))
  it('returns moderate for invalid string', () => expect(getSeasonFromDate('not-a-date')).toBe('moderate'))
})

describe('getTimeSlotFromTime', () => {
  it('returns opening for 08:00', () => expect(getTimeSlotFromTime('08:00')).toBe('opening'))
  it('returns opening for 09:59', () => expect(getTimeSlotFromTime('09:59')).toBe('opening'))
  it('returns morning for 10:00', () => expect(getTimeSlotFromTime('10:00')).toBe('morning'))
  it('returns morning for 11:30', () => expect(getTimeSlotFromTime('11:30')).toBe('morning'))
  it('returns midday for 12:00', () => expect(getTimeSlotFromTime('12:00')).toBe('midday'))
  it('returns midday for 14:45', () => expect(getTimeSlotFromTime('14:45')).toBe('midday'))
  it('returns afternoon for 15:00', () => expect(getTimeSlotFromTime('15:00')).toBe('afternoon'))
  it('returns afternoon for 17:59', () => expect(getTimeSlotFromTime('17:59')).toBe('afternoon'))
  it('returns evening for 18:00', () => expect(getTimeSlotFromTime('18:00')).toBe('evening'))
  it('returns evening for 21:30', () => expect(getTimeSlotFromTime('21:30')).toBe('evening'))
  it('returns midday for missing input', () => expect(getTimeSlotFromTime(null)).toBe('midday'))
  it('returns midday for invalid string', () => expect(getTimeSlotFromTime('abc')).toBe('midday'))
})

describe('getTypicalWait', () => {
  it('returns null for unknown demand', () => {
    expect(getTypicalWait('unknown', '2026-07-04', '14:00')).toBeNull()
  })

  it('returns null for missing demand', () => {
    expect(getTypicalWait(null, '2026-07-04', '14:00')).toBeNull()
  })

  it('returns a number rounded to nearest 5', () => {
    const result = getTypicalWait('high', '2026-07-04', '14:00')
    expect(result).toBeTypeOf('number')
    expect(result % 5).toBe(0)
  })

  it('peak July midday is higher than low-season January midday for same ride', () => {
    const peakWait = getTypicalWait('high', '2026-07-04', '14:00')
    const lowWait  = getTypicalWait('high', '2026-01-15', '14:00')
    expect(peakWait).toBeGreaterThan(lowWait)
  })

  it('very_high demand is always higher than low demand', () => {
    const vhWait = getTypicalWait('very_high', '2026-07-04', '14:00')
    const loWait = getTypicalWait('low', '2026-07-04', '14:00')
    expect(vhWait).toBeGreaterThan(loWait)
  })

  it('midday slot is higher than opening slot for the same ride/season', () => {
    const midday  = getTypicalWait('high', '2026-07-04', '13:00')
    const opening = getTypicalWait('high', '2026-07-04', '08:30')
    expect(midday).toBeGreaterThan(opening)
  })

  it('minimum returned is 5', () => {
    const result = getTypicalWait('low', '2026-01-15', '08:00')
    expect(result).toBeGreaterThanOrEqual(5)
  })
})
