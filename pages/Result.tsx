"use client"

import { useState, useEffect } from "react"
import type { Match, Team, Tournament } from "../types/tournament"
import ActionToolbar from "../components/ui-elements/ActionToolbar"
import { FileDown, Calendar, Clock, MapPin, Trophy, Eye } from "lucide-react"
import MatchDetailTabs from "../components/match-details/MatchDetailTabs"
import { useDataFetching } from "../context/DataFetchingContext"
import LoadingSpinner from "../components/ui-elements/LoadingSpinner"
import { getTournamentById } from "@/apis/api"
import PDFResult from "../utils/pdfResult"
import { PDFDownloadLink } from '@react-pdf/renderer'
import PDFDateResult from "../utils/PDFDateResult"

// API response types
interface ApiMatch {
  id: number;
  teamOneId: number;
  teamTwoId: number;
  teamOneName: string;
  teamTwoName: string;
  teamOneResult: number | null;
  teamTwoResult: number | null;
  startTime: string;
  endTime: string;
  eventDateId: number;
  title: string;
  type: string;
}
interface ApiMatchGroup {
  date: string;
  matches: ApiMatch[];
}
interface ApiMatchResponse {
  success: boolean;
  total: number;
  statusCode: number;
  data: ApiMatchGroup[];
}
enum TournamentFormat {
  GroupStage = "GROUP_STAGE",
  RoundRobin = "ROUND_ROBIN",
  SingleElimination = "SINGLE_ELIMINATION",
}


// Helper function to group matches by date
function groupMatchesByDate(matches: Match[]): Record<string, Match[]> {
  const grouped: Record<string, Match[]> = {};
  matches.forEach((match) => {
    const dateStr = match.date.toISOString().split("T")[0];
    if (!grouped[dateStr]) {
      grouped[dateStr] = [];
    }
    grouped[dateStr].push(match);
  });
  return grouped;
}

interface ResultProps {
  tournamentId: string | number
}

export default function Result({ tournamentId }: ResultProps) {
  // Remove format state, use tournament?.format instead
  const [groupMatches, setGroupMatches] = useState<Match[]>([])
  const [knockoutMatches, setKnockoutMatches] = useState<Match[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tournament, setTournament]= useState<Tournament | null>(null)
  
  const getResultForPDF = () => {
    // Group matches by date (YYYY-MM-DD)
    const grouped: Record<string, any[]> = {};
    matches.forEach((match) => {
      const dateStr = match.date.toISOString().split("T")[0];
      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push({
        startTime: match.startTime,
        endTime: match.endTime,
        teamOneName: match.team1.name,
        teamTwoName: match.team2.name,
        teamOneResult: match.score1?.toString() ?? "",
        teamTwoResult: match.score2?.toString() ?? "",
      });
    });
    // Convert to array of { date, matches }
    return Object.entries(grouped).map(([date, matches]) => ({ date, matches }));
  };
  // Load match data from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const tournament2= await getTournamentById(tournamentId)
        setTournament(tournament2.data)
        const response = await fetch(`http://localhost:6969/tournament/${tournamentId}/match/result`);
        const data: ApiMatchResponse = await response.json();
        console.log(data.data);
        // Map API data to Match[]
        const allMatches: Match[] = data.data.flatMap(group =>
          group.matches.map(match => ({
            id: match.id.toString(),
            date: new Date(group.date),
            startTime: match.startTime,
            endTime: match.endTime,
            team1: { id: match.teamOneId.toString(), name: match.teamOneName, leaderName: "", leaderEmail: "", phoneNumber: "", playerCount: 0 },
            team2: { id: match.teamTwoId.toString(), name: match.teamTwoName, leaderName: "", leaderEmail: "", phoneNumber: "", playerCount: 0 },
            venue: match.title || "",
            round: undefined,
            group: undefined,
            completed: match.teamOneResult !== null && match.teamTwoResult !== null,
            score1: match.teamOneResult ?? undefined,
            score2: match.teamTwoResult ?? undefined,
            events: [],
            lineups: undefined,
          }))
        );
        setGroupMatches(allMatches);
        setKnockoutMatches([]); // If you have knockout data, map and set here
      } catch (error) {
        console.error("Failed to load match data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const matches = tournament?.format?.toString() === TournamentFormat.SingleElimination ? knockoutMatches : groupMatches;

  const filteredMatches = matches.filter(
    (match) =>
      match.team1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.team2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (match.venue && match.venue.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (match.round && match.round.toLowerCase().includes(searchQuery.toLowerCase())), 
  )

  const groupedMatches = groupMatchesByDate(filteredMatches)

  const handleExportResults = () => {
    // In a real app, this would generate and download a PDF or Excel file
    alert("Export results functionality would be implemented here")
  }

  // Removed handleFormatChange. Format is now determined by tournament?.format.

  const handleScoreChange = (matchId: string, team: "team1" | "team2", score: number) => {
    if (tournament?.format?.toString() === TournamentFormat.SingleElimination) {
      setKnockoutMatches(
        knockoutMatches.map((match) => {
          if (match.id === matchId) {
            return {
              ...match,
              [team === "team1" ? "score1" : "score2"]: score,
            }
          }
          return match
        }),
      )
    } else {
      setGroupMatches(
        groupMatches.map((match) => {
          if (match.id === matchId) {
            return {
              ...match,
              [team === "team1" ? "score1" : "score2"]: score,
            }
          }
          return match
        }),
      )
    }
  }

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const handleViewMatchDetails = (match: Match) => {
    setSelectedMatch(match)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Guard: If tournament is not loaded, show nothing or a fallback
  if (!tournament) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ActionToolbar title="Results" totalItems={matches.length} onSearch={setSearchQuery}>
        <PDFDownloadLink
          style={{ color: 'blue', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
          document={
            <PDFResult
              result={getResultForPDF()}
              titleTournament={tournament?.title || ''}
              category={tournament?.category || ''}
              organizer={tournament?.organizer[0].fullName || ''}
            />
          }
          fileName={`${tournament?.title || 'tournament'}_Result.pdf`}
        >
          {({ loading }) => (
            <span className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors cursor-pointer">
              <FileDown className="h-5 w-5" />
              <span>{loading ? 'Generating PDF...' : 'Export Results'}</span>
            </span>
          )}
        </PDFDownloadLink>
      </ActionToolbar>

      {/* Match Details View */}
      {selectedMatch && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-neutral-800">Match Details</h2>
            <button onClick={() => setSelectedMatch(null)} className="btn btn-outline">
              Back to Results
            </button>
          </div>
          <MatchDetailTabs matchId={selectedMatch.id} />
        </div>
      )}

      {!selectedMatch && (tournament.format?.toString() === TournamentFormat.GroupStage || tournament.format?.toString() === TournamentFormat.RoundRobin) && (
        <div className="space-y-8">
          {Object.keys(groupedMatches)
            .sort()
            .map((dateStr) => (
              <div key={dateStr} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-primary-500 text-white px-6 py-3 flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">{formatDate(dateStr)}</h3>
                </div>

                <div className="divide-y divide-gray-200">
                  {groupedMatches[dateStr].map((match) => (
                    <div key={match.id} className="p-4 hover:bg-gray-50">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center space-x-2 text-gray-500 mb-2 md:mb-0">
                          <Clock className="h-4 w-4" />
                          <span>{match.startTime} - {match.endTime}</span>
                          {match.venue && (
                            <>
                              <span className="mx-2">•</span>
                              <MapPin className="h-4 w-4" />
                              <span>{match.venue}</span>
                            </>
                          )}
                          {match.round && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{match.round}</span>
                            </>
                          )}
                        </div>

                        {match.group && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            Group {match.group}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-center">
                        <div className="flex-1 text-right">
                          <span className="text-lg font-medium">{match.team1.name}</span>
                        </div>

                        <div className="mx-4 flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={match.score1 !== undefined ? match.score1 : ""}
                            onChange={(e) => handleScoreChange(match.id, "team1", Number.parseInt(e.target.value) || 0)}
                            className="w-12 h-10 text-center border border-gray-300 rounded-md"
                            disabled={match.completed}
                          />
                          <span className="text-xl font-bold text-gray-500">-</span>
                          <input
                            type="number"
                            min="0"
                            value={match.score2 !== undefined ? match.score2 : ""}
                            onChange={(e) => handleScoreChange(match.id, "team2", Number.parseInt(e.target.value) || 0)}
                            className="w-12 h-10 text-center border border-gray-300 rounded-md"
                            disabled={match.completed}
                          />
                        </div>

                        <div className="flex-1 flex items-center">
                          <span className="text-lg font-medium">{match.team2.name}</span>
                          {match.completed && (
                            <button
                              onClick={() => handleViewMatchDetails(match)}
                              className="ml-4 btn btn-sm btn-outline flex items-center space-x-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Details</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {!selectedMatch && tournament.format?.toString() === TournamentFormat.SingleElimination && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Tournament Bracket</h3>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Tournament bracket visualization */}
              <div className="flex justify-between">
                {/* Quarter-finals */}
                <div className="flex flex-col space-y-16">
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Quarter-finals</span>
                  </div>

                  {knockoutMatches
                    .filter((m) => m.round === "Quarter-final")
                    .map((match) => (
                      <div key={match.id} className="w-64 border border-gray-200 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-2">
                          {match.date.toLocaleDateString()} • {match.startTime} - {match.endTime}
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{match.team1.name}</span>
                          <span className="font-bold">{match.score1}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-medium">{match.team2.name}</span>
                          <span className="font-bold">{match.score2}</span>
                        </div>

                        <div className="mt-2 text-right">
                          <button
                            onClick={() => handleViewMatchDetails(match)}
                            className="text-primary-600 hover:text-primary-800 text-sm flex items-center justify-end space-x-1 ml-auto"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Details</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Semi-finals */}
                <div className="flex flex-col space-y-32 mt-24">
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Semi-finals</span>
                  </div>

                  {knockoutMatches
                    .filter((m) => m.round === "Semi-final")
                    .map((match) => (
                      <div key={match.id} className="w-64 border border-gray-200 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-2">
                          {match.date.toLocaleDateString()} • {match.startTime} - {match.endTime}
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{match.team1.name}</span>
                          <span className="font-bold">{match.score1}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-medium">{match.team2.name}</span>
                          <span className="font-bold">{match.score2}</span>
                        </div>

                        <div className="mt-2 text-right">
                          <button
                            onClick={() => handleViewMatchDetails(match)}
                            className="text-primary-600 hover:text-primary-800 text-sm flex items-center justify-end space-x-1 ml-auto"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Details</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Final */}
                <div className="flex flex-col mt-56">
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Final</span>
                  </div>

                  {knockoutMatches
                    .filter((m) => m.round === "Final")
                    .map((match) => (
                      <div key={match.id} className="w-64 border border-gray-200 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-2">
                          {match.date.toLocaleDateString()} • {match.startTime} - {match.endTime}
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{match.team1.name}</span>
                          <input
                            type="number"
                            min="0"
                            value={match.score1 !== undefined ? match.score1 : ""}
                            onChange={(e) => handleScoreChange(match.id, "team1", Number.parseInt(e.target.value) || 0)}
                            className="w-12 h-8 text-center border border-gray-300 rounded-md"
                            disabled={match.completed}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-medium">{match.team2.name}</span>
                          <input
                            type="number"
                            min="0"
                            value={match.score2 !== undefined ? match.score2 : ""}
                            onChange={(e) => handleScoreChange(match.id, "team2", Number.parseInt(e.target.value) || 0)}
                            className="w-12 h-8 text-center border border-gray-300 rounded-md"
                            disabled={match.completed}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Winner display (would show once final is completed) */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-primary-50 border border-primary-200 rounded-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <Trophy className="h-10 w-10 text-yellow-500" />
              </div>
              <h4 className="text-lg font-medium text-gray-700 mb-1">Tournament Winner</h4>
              <p className="text-gray-500">Complete the final match to determine the winner</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
