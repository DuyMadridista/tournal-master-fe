"use client"

import { useState, useEffect } from "react"
import type { Team } from "../types/tournament"
import ActionToolbar from "../components/ui-elements/ActionToolbar"
import { Plus, FileUp, Grid, Pencil, Trash, Users, Mail, Phone, UserCircle } from "lucide-react"
import { useDataFetching } from "../context/DataFetchingContext"
import SkeletonLoader from "../components/ui-elements/SkeletonLoader"
import PlayerManagementModal from "../components/player-management/PlayerManagementModal"

// Sample data for demonstration
const sampleTeams: Team[] = [
  {
    id: "team-1",
    name: "FC Barcelona",
    tier: "A",
    group: "A",
    leaderName: "Carlos Rodriguez",
    leaderEmail: "carlos@example.com",
    phoneNumber: "+1234567890",
    playerCount: 18,
  },
  {
    id: "team-2",
    name: "Real Madrid",
    tier: "A",
    group: "B",
    leaderName: "Miguel Fernandez",
    leaderEmail: "miguel@example.com",
    phoneNumber: "+0987654321",
    playerCount: 20,
  },
  {
    id: "team-3",
    name: "Manchester United",
    tier: "A",
    group: "C",
    leaderName: "James Wilson",
    leaderEmail: "james@example.com",
    phoneNumber: "+1122334455",
    playerCount: 22,
  },
  {
    id: "team-4",
    name: "Bayern Munich",
    tier: "A",
    group: "D",
    leaderName: "Hans Mueller",
    leaderEmail: "hans@example.com",
    phoneNumber: "+6677889900",
    playerCount: 19,
  },
]

interface ParticipantsProps {
  tournamentId?: string
}

export default function Participants({ tournamentId }: ParticipantsProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTeam, setNewTeam] = useState<Partial<Team>>({
    name: "",
    tier: "A",
    leaderName: "",
    leaderEmail: "",
    phoneNumber: "",
    playerCount: 0,
  })
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const { simulateFetch, isLoading } = useDataFetching()

  // Simulate initial data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call with a longer delay for initial load
        const data = await simulateFetch(sampleTeams, 2000)
        setTeams(data)
      } catch (error) {
        console.error("Failed to load teams:", error)
      } finally {
        setIsInitialLoading(false)
      }
    }

    loadData()
  }, [simulateFetch])

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.leaderEmail.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddTeam = async () => {
    if (!newTeam.name || !newTeam.leaderName || !newTeam.leaderEmail) return

    const team: Team = {
      id: `team-${Date.now()}`,
      name: newTeam.name,
      tier: newTeam.tier || "A",
      group: "",
      leaderName: newTeam.leaderName,
      leaderEmail: newTeam.leaderEmail,
      phoneNumber: newTeam.phoneNumber || "",
      playerCount: newTeam.playerCount || 0,
    }

    try {
      // Simulate API call to add a team
      await simulateFetch(team, 1500)
      setTeams([...teams, team])
      setNewTeam({
        name: "",
        tier: "A",
        leaderName: "",
        leaderEmail: "",
        phoneNumber: "",
        playerCount: 0,
      })
      setShowAddForm(false)
    } catch (error) {
      console.error("Failed to add team:", error)
    }
  }

  const handleImportTeams = async () => {
    try {
      // Simulate API call to import teams
      const newTeams = await simulateFetch(
        [
          {
            id: "team-import-1",
            name: "Chelsea",
            tier: "A",
            group: "B",
            leaderName: "Frank Lampard",
            leaderEmail: "frank@example.com",
            phoneNumber: "+4455667788",
            playerCount: 21,
          },
          {
            id: "team-import-2",
            name: "Arsenal",
            tier: "A",
            group: "C",
            leaderName: "Mikel Arteta",
            leaderEmail: "mikel@example.com",
            phoneNumber: "+9988776655",
            playerCount: 20,
          },
        ],
        2000,
      )
      setTeams([...teams, ...newTeams])
    } catch (error) {
      console.error("Failed to import teams:", error)
    }
  }

  const handleGenerateGroups = async () => {
    try {
      // Simulate API call to generate groups
      const updatedTeams = await simulateFetch(
        teams.map((team, index) => ({
          ...team,
          group: String.fromCharCode(65 + (index % 4)), // Assign A, B, C, D groups
        })),
        2500,
      )
      setTeams(updatedTeams)
    } catch (error) {
      console.error("Failed to generate groups:", error)
    }
  }

  const handleEditTeam = (teamId: string) => {
    // In a real app, this would open a modal or form with the team details
    alert(`Edit team with ID: ${teamId}`)
  }

  const handleDeleteTeam = async (teamId: string) => {
    // In a real app, this would show a confirmation dialog
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        // Simulate API call to delete a team
        await simulateFetch(null, 1000)
        setTeams(teams.filter((team) => team.id !== teamId))
      } catch (error) {
        console.error("Failed to delete team:", error)
      }
    }
  }

  const handleManagePlayers = (teamId: string) => {
    setSelectedTeamId(teamId)
  }

  if (isInitialLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 bg-white rounded-xl p-5 shadow-md border border-neutral-200 animate-pulse">
          <div className="h-8 w-48 bg-neutral-200 rounded mb-4"></div>
          <div className="flex justify-between">
            <div className="h-10 w-64 bg-neutral-200 rounded"></div>
            <div className="flex space-x-2">
              <div className="h-10 w-24 bg-neutral-200 rounded"></div>
              <div className="h-10 w-32 bg-neutral-200 rounded"></div>
              <div className="h-10 w-36 bg-neutral-200 rounded"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <div className="h-6 w-full bg-neutral-200 rounded"></div>
          </div>
          <SkeletonLoader variant="table-row" count={5} className="mx-4 my-4" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ActionToolbar
        title="Tournament Participants"
        totalItems={teams.length}
        onSearch={setSearchQuery}
        showFilter={true}
      >
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-md btn-primary flex items-center space-x-2"
          disabled={isLoading}
        >
          <Plus className="h-5 w-5" />
          <span>Add New</span>
        </button>

        <button
          onClick={handleImportTeams}
          className="btn btn-md btn-secondary flex items-center space-x-2"
          disabled={isLoading}
        >
          <FileUp className="h-5 w-5" />
          <span>Import Teams</span>
        </button>

        <button
          onClick={handleGenerateGroups}
          className="btn btn-md bg-purple-600 text-white hover:bg-purple-700 flex items-center space-x-2"
          disabled={isLoading}
        >
          <Grid className="h-5 w-5" />
          <span>Generate Groups</span>
        </button>
      </ActionToolbar>

      {showAddForm && (
        <div className="mb-6 p-6 bg-white rounded-xl border border-primary-200 shadow-md animate-in">
          <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
            <UserCircle className="h-6 w-6 mr-2 text-primary-500" />
            Add New Team
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Team Name</label>
              <input
                type="text"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                className="input"
                placeholder="FC Barcelona"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Tier</label>
              <select
                value={newTeam.tier}
                onChange={(e) => setNewTeam({ ...newTeam, tier: e.target.value })}
                className="input"
              >
                <option value="A">Tier A</option>
                <option value="B">Tier B</option>
                <option value="C">Tier C</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Leader Name</label>
              <input
                type="text"
                value={newTeam.leaderName}
                onChange={(e) => setNewTeam({ ...newTeam, leaderName: e.target.value })}
                className="input"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Leader Email</label>
              <input
                type="email"
                value={newTeam.leaderEmail}
                onChange={(e) => setNewTeam({ ...newTeam, leaderEmail: e.target.value })}
                className="input"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={newTeam.phoneNumber}
                onChange={(e) => setNewTeam({ ...newTeam, phoneNumber: e.target.value })}
                className="input"
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Number of Players</label>
              <input
                type="number"
                value={newTeam.playerCount || ""}
                onChange={(e) => setNewTeam({ ...newTeam, playerCount: Number(e.target.value) })}
                className="input"
                placeholder="18"
                min="0"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button onClick={() => setShowAddForm(false)} className="btn btn-md btn-outline" disabled={isLoading}>
              Cancel
            </button>
            <button onClick={handleAddTeam} className="btn btn-md btn-primary" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Team"}
            </button>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-head">No.</th>
              <th className="table-head">Team Name</th>
              <th className="table-head">Tier</th>
              <th className="table-head">Group</th>
              <th className="table-head">Leader Name</th>
              <th className="table-head">Leader Email</th>
              <th className="table-head">Phone Number</th>
              <th className="table-head">Players</th>
              <th className="table-head">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredTeams.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={9} className="table-cell text-center py-8 text-neutral-500">
                  No teams found. Add a team to get started.
                </td>
              </tr>
            ) : (
              filteredTeams.map((team, index) => (
                <tr
                  key={team.id}
                  className="table-row transition-opacity duration-300"
                  style={{ opacity: isLoading ? 0.6 : 1 }}
                >
                  <td className="table-cell text-neutral-500">{index + 1}</td>
                  <td className="table-cell font-medium text-primary-600 hover:text-primary-800 hover:underline cursor-pointer">
                    {team.name}
                  </td>
                  <td className="table-cell text-neutral-500">{team.tier}</td>
                  <td className="table-cell">
                    {team.group && <span className="badge badge-primary">Group {team.group}</span>}
                  </td>
                  <td className="table-cell text-neutral-700">{team.leaderName}</td>
                  <td className="table-cell text-neutral-500 flex items-center">
                    <Mail className="h-4 w-4 mr-1 text-primary-500" />
                    {team.leaderEmail}
                  </td>
                  <td className="table-cell text-neutral-500 flex items-center">
                    <Phone className="h-4 w-4 mr-1 text-primary-500" />
                    {team.phoneNumber}
                  </td>
                  <td className="table-cell">
                    <button
                      onClick={() => handleManagePlayers(team.id)}
                      className="flex items-center text-primary-600 hover:text-primary-800 hover:underline"
                    >
                      <Users className="h-4 w-4 mr-1 text-primary-500" />
                      <span className="text-neutral-700">{team.playerCount}</span>
                    </button>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTeam(team.id)}
                        className="p-1 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-full transition-colors"
                        disabled={isLoading}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                        disabled={isLoading}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Player Management Modal */}
      {selectedTeamId && <PlayerManagementModal teamId={selectedTeamId} onClose={() => setSelectedTeamId(null)} />}
    </div>
  )
}
