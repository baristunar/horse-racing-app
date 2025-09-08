import { describe, it, expect } from 'vitest'
import { generateSchedule } from '../generateSchedule'
import { generateShuffledHorses } from '../generateHorses'

describe('generateSchedule', () => {
  it('returns empty array when horseList is empty or not provided', () => {
    expect(generateSchedule({ horseList: [] })).toEqual([])
  })

  it('return a valid schedule when horseList is provided', () => {
    const horses = generateShuffledHorses()
    const schedule = generateSchedule({ horseList: horses })

    expect(schedule).toBeDefined()
    expect(Array.isArray(schedule)).toBe(true)
  })

  it('returns 6 rounds by default and participants per round', () => {
    const horses = generateShuffledHorses()
    const schedule = generateSchedule({ horseList: horses })

    expect(schedule).toHaveLength(6)
    expect(schedule[0].participants).toHaveLength(10)
  })
})
