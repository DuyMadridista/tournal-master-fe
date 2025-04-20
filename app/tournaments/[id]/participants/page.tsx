"use client"

import { useParams } from "next/navigation"
import Participants from "../../../../pages/Participants"

export default function TournamentParticipantsPage() {
  const params = useParams()
  const tournamentId = params.id as string

  return <Participants tournamentId={tournamentId} />
}
