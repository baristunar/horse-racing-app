import { HORSE_COLORS, HORSE_NAMES } from '@utils/constants/index'

function shuffleArray<T>(array: T[]): T[] {
  const arr = array.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

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
