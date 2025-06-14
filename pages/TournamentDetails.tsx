"use client"

import { useState } from "react"
import type { Tournament, TournamentFormat, GroupStageSettings, Organizer } from "../types/tournament"
import InfoCard from "../components/ui-elements/InfoCard"
import EditableField from "../components/ui-elements/EditableField"
import FormatSelector from "../components/tournament-details/FormatSelector"
import GroupStageSettingsComponent from "../components/tournament-details/GroupStageSettings"
import OrganizersList from "../components/tournament-details/OrganizersList"
import EventDatesDisplay from "../components/tournament-details/EventDatesDisplay"
import MatchDaysManager from "../components/tournament-details/MatchDaysManager"
import { AlertTriangle, Info, Calendar, MapPin, Users, FileText } from "lucide-react"

import { useEffect } from "react"
import axios from "axios"
// ...keep other imports


interface MatchDay {
  id: string
  date: Date
  name: string
  isActive: boolean
  notes?: string
}

export default function TournamentDetails({ tournamentId }: { tournamentId: string }) {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [organizers, setOrganizers] = useState<Organizer[]>([])
  const [matchDays, setMatchDays] = useState<MatchDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // For demo, use hardcoded id = 31. Replace with router param as needed.
  useEffect(() => {
    const fetchTournament = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:6969/api/tournament/${tournamentId}`);
        const data = res.data.data;
        const progress = res.data.additionalData?.progress;
        // Map category (may be object)
        const category = typeof data.category === "object" ? data.category.categoryName : data.category;
        // Map organizers
        const mappedOrganizers: Organizer[] = (data.organizers || []).map((o: any) => ({
          id: String(o.id),
          fullName: o.fullName,
          email: o.email,
          // role: not available in API, fallback to "Member"
          role: o.role || "Member"
        }));
        setOrganizers(mappedOrganizers);
        // Map match days from eventDates
        const mappedMatchDays: MatchDay[] = (data.eventDates || []).map((ed: any) => ({
          id: String(ed.id),
          date: new Date(ed.date),
          name: `Match Day ${ed.id}`,
          isActive: true // No isActive in API, default to true
        }));
        setMatchDays(mappedMatchDays);
        // Map tournament
        setTournament({
          id: String(data.id || ""),
          title: data.title || "",
          category: category || "",
          status: data.status || "",
          organizers: data.organizers || [],
          place: data.place || "",
          format: data.format === "ROUND_ROBIN" ? "Round Robin" : (data.format || ""),
          location: data.place || "",
          description: data.description || "",
          startDate: (() => {
            if (data.eventDates && data.eventDates.length > 0) {
              const sorted = [...data.eventDates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
              return new Date(sorted[0].date);
            }
            return new Date();
          })(),
          endDate: (() => {
            if (data.eventDates && data.eventDates.length > 0) {
              const sorted = [...data.eventDates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
              return new Date(sorted[sorted.length - 1].date);
            }
            return new Date();
          })(),
          numberOfPlayers: data.numberOfPlayers || 0,
          groupStageSettings: data.numberOfGroups && data.teamsPerGroup && data.advancePerGroup ? {
            numberOfGroups: data.numberOfGroups,
            teamsPerGroup: data.teamsPerGroup,
            advancePerGroup: data.advancePerGroup,
          } : undefined,
          progress: progress?.progress,
          totalMatch: progress?.totalMatch,
          totalTeam: progress?.totalTeam,
          totalPlayer: progress?.totalPlayer,
        });
      } catch (err: any) {
        setError("Failed to fetch tournament data");
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, []);

  // Only update if tournament is not null and always provide all required fields
  const handleTournamentChange = (field: keyof Tournament, value: any) => {
    setTournament(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value ?? "",
        id: prev.id ?? "",
        title: field === "title" ? value ?? "" : prev.title ?? "",
        category: field === "category" ? value ?? "" : prev.category ?? "",
        format: field === "format" ? value ?? "" : prev.format ?? "",
        location: field === "location" ? value ?? "" : prev.location ?? "",
        description: field === "description" ? value ?? "" : prev.description ?? "",
        startDate: prev.startDate ?? new Date(),
        endDate: prev.endDate ?? new Date(),
        numberOfPlayers: prev.numberOfPlayers ?? 0,
        groupStageSettings: prev.groupStageSettings,
      }
    });
  }

  const handleFormatChange = (format: TournamentFormat) => {
    setTournament(prev => {
      if (!prev) return prev;
      if (format !== "GROUP_STAGE") {
        return {
          ...prev,
          format,
          groupStageSettings: undefined,
        };
      } else {
        return {
          ...prev,
          format,
          groupStageSettings: {
            numberOfGroups: 4,
            teamsPerGroup: 4,
            advancePerGroup: 2,
          },
        };
      }
    });
  }

  const handleGroupStageSettingsChange = (settings: GroupStageSettings) => {
    setTournament(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        groupStageSettings: settings,
      };
    });
  }

  const handleDatesChange = (startDate: Date, endDate: Date) => {
    setTournament(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        startDate,
        endDate,
      };
    });
  }

  const handleMatchDaysChange = (updatedMatchDays: MatchDay[]) => {
    setMatchDays(updatedMatchDays)
  }

  const handleDiscardTournament = () => {
    // In a real app, this would show a confirmation dialog and then delete the tournament
    alert("Tournament would be discarded after confirmation")
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-[300px]">Loading tournament details...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center min-h-[300px] text-red-600">{error}</div>;
  }
  if (!tournament) {
    return <div className="flex justify-center items-center min-h-[300px] text-neutral-500">No tournament data found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <InfoCard className="overflow-hidden">
            <div className="flex items-center mb-6 -mx-5 -mt-5 px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white">
              <Info className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Tournament Information</h3>
            </div>

            <EditableField
              label="Tournament Title"
              value={tournament.title}
              onSave={(value) => handleTournamentChange("title", value)}
              className="mb-6"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="mt-1 text-primary-500">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-500 mb-1">Category</div>
                  <div className="text-base font-medium">{tournament.category}</div>
                </div>
              </div>

              <FormatSelector selectedFormat={tournament.format} onFormatChange={handleFormatChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="mt-1 text-primary-500">
                  <Users className="h-5 w-5" />
                </div>
                <EditableField
                  label="Number of Players"
                  value={tournament.numberOfPlayers || 0}
                  type="number"
                  onSave={(value) => handleTournamentChange("numberOfPlayers", Number(value))}
                />
              </div>

              <div className="flex items-start space-x-3">
                <div className="mt-1 text-primary-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <EditableField
                  label="Location"
                  value={tournament.location}
                  onSave={(value) => handleTournamentChange("location", value)}
                />
              </div>
            </div>

            {tournament.format === "GROUP_STAGE" && tournament.groupStageSettings && (
              <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
                <h4 className="text-lg font-medium text-primary-700 mb-3">Group Stage Settings</h4>
                <GroupStageSettingsComponent
                  settings={tournament.groupStageSettings}
                  onSettingsChange={handleGroupStageSettingsChange}
                />
              </div>
            )}

            <div className="flex items-start space-x-3 mt-6">
              <div className="mt-1 text-primary-500">
                <FileText className="h-5 w-5" />
              </div>
              <EditableField
                label="Description"
                value={tournament.description}
                type="textarea"
                onSave={(value) => handleTournamentChange("description", value)}
                className="flex-1"
              />
            </div>
          </InfoCard>



          <OrganizersList organizers={organizers} onOrganizersChange={setOrganizers} tournamentId={tournament.id} />
          <InfoCard isDanger title="Danger Zone">
            <p className="text-red-600 mb-4">
              This action cannot be undone. This will permanently delete the tournament and all associated data.
            </p>
            <button
              onClick={handleDiscardTournament}
              className="btn btn-md w-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center space-x-2"
            >
              <AlertTriangle className="h-5 w-5" />
              <span>Discard Tournament</span>
            </button>
          </InfoCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <InfoCard>
            <div className="flex items-center mb-6 -mx-5 -mt-5 px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl">
              <Calendar className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Tournament Overview</h3>
            </div>

            {/* Tournament progress indicator */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-neutral-500 mb-2">Tournament Progress</h4>
              <div className="w-full bg-neutral-200 rounded-full h-2.5">
                <div className={`bg-primary-500 h-2.5 rounded-full w-[${tournament?.progress}%]`} />
              </div>
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>Registration</span>
                <span>Group Stage</span>
                <span>Finals</span>
              </div>
            </div>

            {/* Tournament stats */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-primary-50 rounded-lg p-3 border border-primary-100">
                <div className="text-xs font-medium text-neutral-500 mb-1">Teams</div>
                <div className="text-2xl font-bold text-primary-700">{tournament?.totalTeam}</div>
              </div>
              <div className="bg-secondary-50 rounded-lg p-3 border border-secondary-100">
                <div className="text-xs font-medium text-neutral-500 mb-1">Matches</div>
                <div className="text-2xl font-bold text-secondary-700">{tournament?.totalMatch}</div>
              </div>
              <div className="bg-accent-50 rounded-lg p-3 border border-accent-100">
                <div className="text-xs font-medium text-neutral-500 mb-1">Total Players</div>
                <div className="text-2xl font-bold text-accent-700">{tournament?.totalPlayer}</div>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                <div className="text-xs font-medium text-neutral-500 mb-1">Match Days</div>
                <div className="text-2xl font-bold text-neutral-700">{matchDays.length}</div>
              </div>
            </div>

            {/* Match days summary */}
            <div className="mt-8">
              <h4 className="text-sm font-medium text-neutral-500 mb-3">Upcoming Match Days</h4>
              {matchDays.length > 0 ? (
                <div className="space-y-2">
                  {matchDays
                    .filter((day) => day.isActive && day.date >= new Date())
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .slice(0, 3)
                    .map((day) => (
                      <div
                        key={day.id}
                        className="flex items-center p-2 bg-neutral-50 rounded-md border border-neutral-200"
                      >
                        <div className="bg-primary-100 text-primary-700 p-2 rounded-md mr-3">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{day.name}</div>
                          <div className="text-xs text-neutral-500">
                            {new Intl.DateTimeFormat("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            }).format(day.date)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center p-4 bg-neutral-50 rounded-md border border-neutral-200">
                  <p className="text-neutral-500 text-sm">No match days scheduled yet</p>
                </div>
              )}
            </div>
          </InfoCard>
          <InfoCard>
            <div className="flex items-center mb-6 -mx-5 -mt-5 px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl">
              <Calendar className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Tournament Schedule</h3>
            </div>

            <EventDatesDisplay
              startDate={tournament.startDate}
              endDate={tournament.endDate}
              onDatesChange={handleDatesChange}
            />

            <div className="mt-6 border-t border-neutral-200 pt-6">
              <MatchDaysManager
                startDate={tournament.startDate}
                endDate={tournament.endDate}
                onMatchDaysChange={handleMatchDaysChange}
                initialMatchDays={matchDays}
                tournamentId={tournament.id}
              />
            </div>
          </InfoCard>
          
        </div>
      </div>
    </div>
  )
}

function Trophy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
