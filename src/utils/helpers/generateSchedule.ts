import type { Horse } from '@/store/types'

export const generateSchedule = ({
  horseList,
  rounds = 6,
  participantsPerRound = 10,
}: {
  horseList: Horse[]
  rounds?: number
  participantsPerRound?: number
}) => {
  if (!horseList?.length) return []

  const raceDistancesPerRound = [1200, 1400, 1600, 1800, 2000, 2200]

  const schedule = []
  const totalHorses = horseList?.length

  for (let round = 1; round <= rounds; round++) {
    const participants: Horse[] = []
    const usedIndices = new Set<number>()

    while (participants.length < participantsPerRound) {
      const randomIndex = Math.floor(Math.random() * totalHorses)
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex)
        participants.push(horseList[randomIndex])
      }
    }

    schedule.push({
      id: round,
      round,
      participants,
      distance: raceDistancesPerRound[round - 1],
    })
  }

  return schedule
}
