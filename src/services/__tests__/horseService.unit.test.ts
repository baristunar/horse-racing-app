vi.mock('@utils/helpers/generateHorses', () => ({
  generateShuffledHorses: vi.fn(() => [
    { id: 1, name: 'MockHorse', condition: 42, color: { hex: '#000000', name: 'Black' } },
  ]),
}))

import { describe, it, expect, vi } from 'vitest'
import { getHorses } from '../horseService'
import { generateShuffledHorses } from '@utils/helpers/generateHorses'

describe('horseService.getHorses', () => {
  it('calls generateShuffledHorses and return its value', () => {
    const res = getHorses()

    expect(generateShuffledHorses).toHaveBeenCalled()
    expect(res).toEqual([expect.objectContaining({ id: 1, name: 'MockHorse', condition: 42 })])
  })
})
