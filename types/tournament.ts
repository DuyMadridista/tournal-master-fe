// Core types for the tournament management application

export type TournamentFormat = "GROUP_STAGE" | "ROUND_ROBIN" | "SINGLE_ELIMINATION"

export interface Tournament {
  id: string
  title: string
  category: string
  organizer: Organizer[]
  format: TournamentFormat
  location: string
  description: string
  startDate: Date
  endDate: Date
  numberOfPlayers?: number
  groupStageSettings?: GroupStageSettings
  matchDays?: MatchDay[]
}

export interface GroupStageSettings {
  numberOfGroups: number
  teamsPerGroup: number
  advancePerGroup: number
}

export interface MatchDay {
  id: string
  date: Date
  name: string
  isActive: boolean
  notes?: string
}

export interface Organizer {
  id: string
  fullName: string
  email: string
  role?: string
}

export interface Team {
  id: string
  name: string
  tier?: number
  group?: string
  leaderName: string
  leaderEmail: string
  phoneNumber: string
  playerCount: number
}

export interface Player {
  id: string
  name: string
  number: number
  position: string
  age: number
  nationality: string
  status: "active" | "injured" | "suspended"
}

export interface MatchEvent {
  id: string
  type: "goal" | "yellow-card" | "red-card" | "substitution"
  minute: number
  playerId: string
  playerName: string
  playerNumber: number
  teamId: string
  teamName: string
  additionalInfo?: {
    substituteId?: string
    substituteName?: string
    substituteNumber?: number
  }
}

export interface LineupPlayer {
  id: string
  name: string
  number: number
  position: string
  isCaptain?: boolean
}

export interface Lineup {
  startingXI: LineupPlayer[]
  substitutes: LineupPlayer[]
}

export interface Match {
  id: string
  date: Date
  startTime: string
  endTime: string
  team1: Team
  team2: Team
  venue?: string
  score1?: number
  score2?: number
  round?: string
  group?: string
  completed: boolean
  matchDayId?: string
  events?: MatchEvent[]
  lineups?: {
    team1: Lineup
    team2: Lineup
  }
}

export interface Standing {
  position: number
  team: Team
  matchesPlayed: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form?: ("W" | "D" | "L")[]
}
