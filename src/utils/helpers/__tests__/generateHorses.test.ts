import { describe, it, expect, vi, afterEach } from 'vitest'
import { generateShuffledHorses } from '../generateHorses'
import { HORSE_NAMES, HORSE_COLORS } from '@utils/constants/index'

describe('generateShuffledHorses', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the expected number of horses with required fields', () => {
    vi.spyOn(Math, 'random').mockImplementation(() => 0.5)

    const horses = generateShuffledHorses()

    expect(horses).toHaveLength(HORSE_NAMES.length)

    const ids = new Set(horses.map((h) => h.id))
    expect(ids.size).toBe(HORSE_NAMES.length)

    horses.forEach((horse) => {
      expect(typeof horse.name).toBe('string')
      expect(typeof horse.id).toBe('number')
      expect(typeof horse.condition).toBe('number')
      expect(horse.condition).toBeGreaterThanOrEqual(1)
      expect(horse.condition).toBeLessThanOrEqual(100)

      const isExistingColor = HORSE_COLORS.find(
        (color) => color.hex === horse.color.hex && color.name === horse.color.name,
      )

      expect(isExistingColor).toBeTruthy()
    })
  })
})
