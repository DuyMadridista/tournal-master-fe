"use client"

import React, { useState, useEffect } from "react"
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
import { Upload } from "@mui/icons-material"
import { getLocalStorage } from "@/utils/localStorage"
import { toast } from "react-toastify"
const token = getLocalStorage('token');

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
  // --- Update Result File Upload Logic ---
  const fileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>({});

  const handleUpdateResult = async (matchId: string) => {
    const fileInput = fileInputRefs.current[matchId];
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert('Please select a file to upload.');
      return;
    }
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`http://localhost:6969/tournament/${tournamentId}/match/updateResult/${matchId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update result');
      }
      toast.success('Result updated successfully!');
      loadData();
    } catch (err: any) {
      toast.error('Error updating result: ' + err.message);
    }
  };

  const triggerFileInput = (matchId: string) => {
    const input = fileInputRefs.current[matchId];
    if (input) input.click();
  };
  // --- End Update Result File Upload Logic ---
  // Remove format state, use tournament?.format instead
  const [groupMatches, setGroupMatches] = useState<Match[]>([])
  const [knockoutMatches, setKnockoutMatches] = useState<Match[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tournament, setTournament]= useState<Tournament | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "bracket">("list")
  
  // Organize knockout matches by rounds
  const organizedKnockoutMatches = React.useMemo(() => {
    if (!knockoutMatches.length) return { final: [], semiFinals: [], quarterFinals: [], earlier: [] };
    
    // Sort matches by date (assuming newer matches are later stages)
    const sortedMatches = [...knockoutMatches].sort((a, b) => b.date.getTime() - a.date.getTime());
    
    // Take first match as final, next two as semifinals, next four as quarterfinals
    const final = sortedMatches.slice(0, 1);
    const semiFinals = sortedMatches.slice(1, 3);
    const quarterFinals = sortedMatches.slice(3, 7);
    const earlier = sortedMatches.slice(7);
    
    return { final, semiFinals, quarterFinals, earlier };
  }, [knockoutMatches]);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      const tournament= await getTournamentById(tournamentId)
      setTournament(tournament.data)
      
      const response = await fetch(`http://localhost:6969/tournament/${tournamentId}/match/result`);
      const data: ApiMatchResponse = await response.json();
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
          type: match.type,
        }))
      );
      setGroupMatches(allMatches);
      setKnockoutMatches(allMatches.filter(match => match.type === "KNOCKOUT")); 
    } catch (error) {
      console.error("Failed to load match data:", error);
    } finally {
      setIsLoading(false);
    }
  };
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

    loadData();
  }, [tournamentId]);

  const matches = tournament?.format?.toString() === TournamentFormat.SingleElimination ? knockoutMatches : groupMatches;
  
  const filteredMatches = matches.filter(
    (match) =>
      match.team1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.team2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (match.venue && match.venue.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (match.round && match.round.toLowerCase().includes(searchQuery.toLowerCase())), 
  )

  
  const groupedMatches = groupMatchesByDate(filteredMatches)

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
      <ActionToolbar title="Results" totalItems={matches.length } onSearch={setSearchQuery}>
        <PDFDownloadLink
          style={{ color: 'green', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
          document={
            <PDFResult
              result={getResultForPDF()}
              titleTournament={tournament?.title || ''}
              category={tournament?.category?.categoryName || ''}
              organizer={tournament?.organizers?.[0].fullName || ''}
            />
          }
          fileName={`${tournament?.title || 'tournament'}_Result.pdf`}
        >
          {({ loading }) => (
            <span className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer">
              <FileDown className="h-5 w-5" />
              <span>{loading ? 'Generating PDF...' : 'Export Results'}</span>
            </span>
          )}
        </PDFDownloadLink>

          {tournament.format?.toString() === TournamentFormat.GroupStage && (
            <div className="flex justify-end">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${viewMode === "list" 
                    ? "bg-primary-500 text-white" 
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"}`}
                >
                  Group Stage
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("bracket")}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${viewMode === "bracket" 
                    ? "bg-primary-500 text-white" 
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"}`}
                >
                  Knockout
                </button>
              </div>
            </div>
          )}
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

      {!selectedMatch && ((tournament.format?.toString() === TournamentFormat.GroupStage && viewMode === "list") || tournament.format?.toString() === TournamentFormat.RoundRobin) && (
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
                        <div className="flex-1 flex items-center justify-end">
                          <input
                            type="file"
                            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            style={{ display: 'none' }}
                            ref={el => (fileInputRefs.current[match.id] = el)}
                            onChange={() => handleUpdateResult(match.id)}
                          />
                          <button
                            className="ml-4 btn btn-sm btn-outline flex items-center space-x-1"
                            onClick={() => triggerFileInput(match.id)}
                            type="button"
                          >
                            <Upload className="h-4 w-4" />
                            <span>Update result</span>
                          </button>
                          <span className="text-lg font-medium ml-2">{match.team1?.name}</span>
                        </div>

                        <div className="mx-4 flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={match.score1 !== undefined ? match.score1 : ""}
                            onChange={(e) => handleScoreChange(match.id, "team1", Number.parseInt(e.target.value) || 0)}
                            className="w-12 h-10 text-center border border-gray-300 rounded-md"
                            disabled={true}
                          />
                          <span className="text-xl font-bold text-gray-500">-</span>
                          <input
                            type="number"
                            min="0"
                            value={match.score2 !== undefined ? match.score2 : ""}
                            onChange={(e) => handleScoreChange(match.id, "team2", Number.parseInt(e.target.value) || 0)}
                            className="w-12 h-10 text-center border border-gray-300 rounded-md"
                            disabled={true}
                          />
                        </div>

                        <div className="flex-1 flex items-center">
                          <span className="text-lg font-medium">{match.team2?.name}</span>
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

      {!selectedMatch && tournament.format?.toString() === TournamentFormat.GroupStage && viewMode === "bracket" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Tournament Bracket</h3>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Tournament bracket visualization */}
              <div className="flex justify-around">
                {/* Quarter-finals */}
                {organizedKnockoutMatches.quarterFinals.length > 0 && (
                <div className="flex flex-col space-y-16">
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Quarter-finals</span>
                  </div>

                  {organizedKnockoutMatches.quarterFinals.map((match) => (
                      <div key={match.id} className="w-64 border border-gray-200 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-2">
                          {match.date.toLocaleDateString()} • {match.startTime} - {match.endTime}
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{match.team1?.name}</span>
                          <span className="font-bold">{match.score1}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-medium">{match.team2?.name}</span>
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
                )}
                {/* Semi-finals */}
                {organizedKnockoutMatches.semiFinals.length > 0 && (
                <div className="flex flex-col space-y-32 mt-24">
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Semi-finals</span>
                  </div>

                  {organizedKnockoutMatches.semiFinals.map((match) => (
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
                        
                        <div className="mt-2 flex items-center justify-between">
                          <input
                            type="file"
                            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            style={{ display: 'none' }}
                            ref={el => (fileInputRefs.current[match.id] = el)}
                            onChange={() => handleUpdateResult(match.id)}
                          />
                        <button
                            onClick={() => triggerFileInput(match.id)}
                            className="text-primary-600 hover:text-primary-800 text-sm flex items-center justify-start space-x-1"
                          >
                            <Upload className="h-4 w-4" />
                            <span>Update</span>
                          </button>
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
                )}
                {/* Final */}
                <div className="flex flex-col mt-56">
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Final</span>
                  </div>

                  {organizedKnockoutMatches.final.map((match) => (
                      <div key={match.id} className="w-64 border border-gray-200 rounded-lg p-3 mt-28">
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
                      
                      <div className="mt-2 flex items-center justify-between">
                        <input
                          type="file"
                          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          style={{ display: 'none' }}
                          ref={el => (fileInputRefs.current[match.id] = el)}
                          onChange={() => handleUpdateResult(match.id)}
                        />
                      <button
                          onClick={() => triggerFileInput(match.id)}
                          className="text-primary-600 hover:text-primary-800 text-sm flex items-center justify-start space-x-1"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Update</span>
                        </button>
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
