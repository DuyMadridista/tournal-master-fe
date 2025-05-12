"use client"

import { useState, useEffect } from "react"
import type { Team } from "../types/tournament"
import ActionToolbar from "../components/ui-elements/ActionToolbar"
import { Plus, FileUp, Grid, Pencil, Trash, Users, Mail, Phone, UserCircle } from "lucide-react"
import SkeletonLoader from "../components/ui-elements/SkeletonLoader"
import PlayerManagementModal from "../components/player-management/PlayerManagementModal"
import axios from "axios"
import api, { getTournamentById } from '../apis/api'
import { getLocalStorage } from "@/utils/localStorage"
import React from "react"
import { toast } from "react-toastify";


interface ParticipantsProps {
  tournamentId?: string
}

interface ApiTeam {
  teamId: number
  teamName: string
  tier: number | string
  group: string
  leaderName: string
  leaderEmail: string
  leaderPhoneNumber: string
  playerCount: number
}

interface ApiResponse {
  success: boolean
  total: number
  statusCode: number
  message: string
  data: ApiTeam[]
  additionalData: {
    totalTeamOfTournament: number
  }
}

  

interface ParticipantsProps {
  tournamentId?: string
}

export default function Participants({ tournamentId }: ParticipantsProps) {

  const [teams, setTeams] = useState<Team[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTeam, setNewTeam] = useState<Partial<Team>>({
    name: "",
    tier: 1,
    leaderName: "",
    leaderEmail: "",
    phoneNumber: "",
    playerCount: 0,
  })
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortValue, setSortValue] = useState<string>("teamName")
  const [sortType, setSortType] = useState<"ASC"|"DESC">("ASC")
  const token = getLocalStorage('token')
  const [format, setFormat] = useState<string>("GROUP_STAGE")

  // Fetch teams from API
  const fetchTeams = React.useCallback(async () => {
    if (!tournamentId) return;
    const tournament = await getTournamentById(Number(tournamentId))
    setFormat(tournament.data.format)
    setIsInitialLoading(true)
    setError(null)
    try {
      const res = await api.get<ApiResponse>(
        `/tournament/${tournamentId}/team`,
        {
          params: {
            page: currentPage,
            keyword: searchQuery,
            sortValue: sortValue,
            sortType: sortType,
            format: format,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      // Map API data to Team[]
      const apiData = res.data.data as ApiTeam[]
      console.log(res.data.additionalData)
      const mapped: Team[] = apiData.map((item) => ({
        id: String(item.teamId),
        name: item.teamName,
        tier: Number(item.tier),
        group: item.group,
        leaderName: item.leaderName,
        leaderEmail: item.leaderEmail,
        phoneNumber: item.leaderPhoneNumber,
        playerCount: item.playerCount,
      }))
      setTeams(mapped)
      setTotalPages(Math.ceil(res.data.additionalData.totalTeamOfTournament / 10) || 1)
    } catch (err: any) {
      setError("Failed to load teams")
      toast.error("Failed to load teams");
    } finally {
      setIsInitialLoading(false)
    }
  }, [tournamentId, currentPage, searchQuery, sortValue, sortType, token]);

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTeams]);

  const handleSort = (field: string) => {
    if (sortValue === field) {
      setSortType(prev => prev === "ASC" ? "DESC" : "ASC")
    } else {
      setSortValue(field)
      setSortType("ASC")
    }
    setCurrentPage(1)
  }

  // No need to filter locally, server handles filter
  const filteredTeams = teams

  const handleAddTeam = async () => {
    if (!newTeam.name || !newTeam.leaderName || !newTeam.leaderEmail) return;
    if (!tournamentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        teamName: newTeam.name,
        tier: newTeam.tier || 1,
        group: newTeam.group || "",
        leaderName: newTeam.leaderName,
        leaderEmail: newTeam.leaderEmail,
        leaderPhoneNumber: newTeam.phoneNumber || "",
        playerCount: newTeam.playerCount || 0,
      };
      await api.post(`/tournament/${tournamentId}/team`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowAddForm(false);
      setNewTeam({
        name: "",
        tier: 1,
        leaderName: "",
        leaderEmail: "",
        phoneNumber: "",
        playerCount: 0,
      });
      setCurrentPage(1);
      // Immediately refresh list after add
      fetchTeams();
      toast.success("The team was added successfully.");
    } catch (error: any) {
      setError("Failed to add team");
      toast.error((error && (error.message || error.toString())) || "Failed to add team.");
      console.error("Failed to add team:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // File input ref for import
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [importLoading, setImportLoading] = useState(false);

  // Trigger file input when Import Teams button is clicked
  const handleImportTeams = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection and import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tournamentId) return;
    setImportLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post(`/tournament/${tournamentId}/team/import`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'multipart/form-data'
        },
      });
      // Refresh the list after import
      fetchTeams();
      toast.success("Teams were imported successfully.");
    } catch (error) {
      setError("Failed to import teams");
      toast.error((error && (error.message || error.toString())) || "Failed to import teams.");
      console.error("Failed to import teams:", error);
    } finally {
      setImportLoading(false);
      // Reset file input so user can re-upload the same file if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleGenerateGroups = async () => {
    if (!tournamentId) return;
    setIsLoading(true);
    setError(null);
    try {
      await api.post(`/tournament/${tournamentId}/generate-groups`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh the list after generating groups
      fetchTeams();
      toast.success("Groups were generated successfully.");
    } catch (error) {
      setError("Failed to generate groups");
      toast.error((error && (error.message || error.toString())) || "Failed to generate groups.");
      console.error("Failed to generate groups:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditTeam = (teamId: string) => {
    // In a real app, this would open a modal or form with the team details
    alert(`Edit team with ID: ${teamId}`)
  }

  // State for delete confirmation popup
  const [teamIdToDelete, setTeamIdToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Show the confirmation dialog instead of window.confirm
  const handleDeleteTeam = (teamId: string) => {
    setTeamIdToDelete(teamId);
  };

  // Confirm deletion and call API
  const confirmDeleteTeam = async () => {
    if (!tournamentId || !teamIdToDelete) return;
    setDeleteLoading(true);
    setError(null);
    try {
      await api.delete(`/tournament/${tournamentId}/team/${teamIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTeamIdToDelete(null);
      fetchTeams();
      toast.success("The team was deleted successfully.");
    } catch (error) {
      setError("Failed to delete team");
      toast.error((error && (error.message || error.toString())) || "Failed to delete team.");
      console.error("Failed to delete team:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Cancel deletion
  const cancelDeleteTeam = () => {
    setTeamIdToDelete(null);
  };

  const handleManagePlayers = (team: Team) => {
    setSelectedTeam(team)
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
          disabled={isLoading || importLoading}
        >
          <FileUp className="h-5 w-5" />
          <span>{importLoading ? "Importing..." : "Import Teams"}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {format === "GROUP_STAGE" && (
        <button
          onClick={handleGenerateGroups}
          className="btn btn-md bg-purple-600 text-white hover:bg-purple-700 flex items-center space-x-2"
          disabled={isLoading}
        >
          <Grid className="h-5 w-5" />
          <span>Generate Groups</span>
        </button>
              )}
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
                placeholder="Real Madrid CF"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Tier</label>
              <select
                value={newTeam.tier}
                onChange={(e) => setNewTeam({ ...newTeam, tier: Number(e.target.value) })}
                className="input"
              >
                <option value="1">Tier 1</option>
                <option value="2">Tier 2</option>
                <option value="3">Tier 3</option>
                <option value="4">Tier 4</option>
                <option value="5">Tier 5</option>
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
              <th className="table-head cursor-pointer" onClick={() => handleSort("teamName")}>Team Name {sortValue === "teamName" && (sortType === "ASC" ? "▲" : "▼")}</th>
              <th className="table-head cursor-pointer" onClick={() => handleSort("tier")}>Tier {sortValue === "tier" && (sortType === "ASC" ? "▲" : "▼")}</th>
              {format === "GROUP_STAGE" && <th className="table-head cursor-pointer" onClick={() => handleSort("group")}>Group {sortValue === "group" && (sortType === "ASC" ? "▲" : "▼")}</th>}
              <th className="table-head cursor-pointer" onClick={() => handleSort("leaderName")}>Leader {sortValue === "leaderName" && (sortType === "ASC" ? "▲" : "▼")}</th>
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
                  {format === "GROUP_STAGE" && <td className="table-cell">
                    {team.group && <span className="badge badge-primary">Group {team.group}</span>}
                  </td>}
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
                      onClick={() => handleManagePlayers(team)}
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
      {selectedTeam && (
  <PlayerManagementModal
    tournamentId={tournamentId}
    team={selectedTeam}
    onClose={() => {
      setSelectedTeam(null);
      fetchTeams();
    }}
  />
)}

      {/* Delete Confirmation Modal */}
      {teamIdToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full animate-in border border-neutral-200">
            <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
              <Trash className="h-6 w-6 mr-2 text-red-500" />
              Confirm Deletion
            </h2>
            <p className="mb-6 text-neutral-700">Are you sure you want to <span className="font-bold text-red-600">delete</span> this team? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDeleteTeam}
                className="btn btn-md btn-outline"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTeam}
                className="btn btn-md btn-danger bg-red-600 text-white hover:bg-red-700"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls (bottom) */}
      <div className="flex justify-end items-center mt-4 space-x-2">
        <button
          className="btn btn-sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            className={`btn btn-sm ${currentPage === idx + 1 ? "btn-primary" : "btn-outline"}`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="btn btn-sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}
