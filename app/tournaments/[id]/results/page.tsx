"use client"

import { useParams } from "next/navigation"
import Result from "../../../../pages/Result"

export default function TournamentResultsPage() {
  const params = useParams()
  const tournamentId = params.id as string

  return <Result tournamentId={tournamentId} />
}
