export interface LeaderboardRecord {
  started: boolean
  teamsTop1: Leaderboard[]
  teamsTop2: Leaderboard[]
  teamsTop3: Leaderboard[]
  leaderBoard: Leaderboard[]
  matches: MatchForLeaderboard[]
}
export interface Leaderboard {
  teamId: number
  teamName: string
  score: number
  group: string
  totalMatches: number
  goalsAgainst: number
  goalsFor: number
  goalDifference: number
  rank: number
  last5: MatchForLeaderboard[]
}
export interface MatchForLeaderboard {
  matchId: number
  teamOneId: number
  teamOneName: string
  teamTwoId: number
  teamTwoName: string
  teamOneResult?: number
  teamTwoResult?: number
  date?: string
  startTime?: string
  endTime?: string
  teamWinId: number
}
