"use client"

import { useParams } from "next/navigation"
import TournamentDetails from "../../../../pages/TournamentDetails"

export default function TournamentDetailsPage() {
  const params = useParams()
  const tournamentId = params.id as string

  return <TournamentDetails tournamentId={tournamentId} />
}
