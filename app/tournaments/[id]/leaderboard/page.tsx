"use client"

import { useParams } from "next/navigation"
import Leaderboard from "../../../../pages/Leaderboard"

export default function TournamentLeaderboardPage() {
  const params = useParams()
  const tournamentId = params.id as string

  return <Leaderboard tournamentId={tournamentId} />
}
