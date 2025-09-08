import { HORSE_COLORS, HORSE_NAMES } from '@utils/constants/index'
import { shuffleArray } from '@utils/helpers/index'

export const generateShuffledHorses = () => {
  const shuffledNames = shuffleArray(HORSE_NAMES)
  const shuffledColors = shuffleArray(HORSE_COLORS)

  return shuffledNames.map((name, index) => ({
    id: index + 1,
    name,
    condition: Math.floor(Math.random() * 100) + 1,
    color: shuffledColors[index % shuffledColors.length],
  }))
}
