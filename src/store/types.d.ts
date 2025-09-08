export interface Horse {
  id: number
  name: string
  condition: number
  color: {
    name: string
    hex: string
  }
}

export interface HorseListState {
  data: Horse[]
}

export interface RaceResultItem {
  round: number
  standing: Horse[]
}

export interface RaceResultsState {
  data: RaceResultItem[]
}

export interface RaceScheduleItem {
  id?: number
  round: number
  participants: Horse[]
  distance?: number
}

export interface RaceScheduleState {
  data: RaceScheduleItem[]
}

export interface RaceState {
  isRaceInProgress: boolean
  isRaceFinished: boolean
  currentLap: {
    distance: number
    round: number
  }
  totalRounds: number
  currentRacingHorses: Horse[]
}
