"use client"

import { useState, useEffect } from "react"
import { User, Edit, Trash, Plus, Search, X, Save } from "lucide-react"
import { useDataFetching } from "../../context/DataFetchingContext"
import LoadingSpinner from "../ui-elements/LoadingSpinner"
import api from "@/apis/api"
import { getLocalStorage } from "@/utils/localStorage"
import { canEdit } from "@/utils/roleUtils"
import { toast } from "react-toastify"

interface Player {
  id: string
  playerName: string
  number: number
  phone: string
  dateOfBirth: string
}

interface Team {
  id: string
  name: string
}

interface PlayersListProps {
  tournamentId?: string;
  team: Team;
  onClose?: () => void;
}

function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

interface PlayerFormErrors {
  playerName?: string;
  number?: string;
  phone?: string;
  dateOfBirth?: string;
}

export default function PlayersList({ tournamentId, team, onClose }: PlayersListProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const token = getLocalStorage('token')
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = (typeof window !== 'undefined') ? (window as any).React?.useRef<HTMLInputElement | null>(null) || require('react').useRef<HTMLInputElement | null>(null) : { current: null };
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    playerName: "",
    number: 0,
    phone: "",
    dateOfBirth: "",
  });
  const [formErrors, setFormErrors] = useState<PlayerFormErrors>({});
  const { simulateFetch } = useDataFetching();
  const handleImportPlayers = () => {
    fileInputRef.current?.click();
  }

  // Handle file selection and import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tournamentId) return;
    setImportLoading(true);
    setImportError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(`/tournament/${tournamentId}/team/${team.id}/player/import`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'multipart/form-data',
        },
      });
      // Update the players list after import
      const importedPlayers = res.data?.data;
      if (Array.isArray(importedPlayers)) {
        setPlayers(importedPlayers);
      }
      // Optionally show a toast here for success
    } catch (error: any) {
      setImportError((error && (error?.response?.data?.message || error.toString())) || "Failed to import players.");
      // Optionally show a toast here for error
    } finally {
      setImportLoading(false);
      // Reset file input so user can re-upload the same file if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }
  // Fetch player data from API
  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      try {
        const res= await api.get(`/tournament/${tournamentId}/team/${team.id}/player`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data.data;
        setPlayers(Array.isArray(data) ? data : []);
      } catch (error) {
        setPlayers([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (tournamentId && team.id) fetchPlayers();
  }, [tournamentId, team.id]);

  // Optionally keep team mock for display


  const validatePlayerForm = (player: Partial<Player>): PlayerFormErrors => {
    const errors: PlayerFormErrors = {};
    if (!player.playerName || player.playerName.trim() === "") {
      errors.playerName = "Full Name is required.";
    }
    if (!player.phone || player.phone.trim() === "") {
      errors.phone = "Phone Number is required.";
    } else if (!/^[0-9\-+() ]{8,20}$/.test(player.phone)) {
      errors.phone = "Phone Number is invalid.";
    }
    if (!player.dateOfBirth || player.dateOfBirth.trim() === "") {
      errors.dateOfBirth = "Date of Birth is required.";
    }
    if (!player.number || player.number === null) {
      errors.number = "Number is required.";
    }
    return errors;
  };

  const handleAddPlayer = async () => {
    const errors = validatePlayerForm(newPlayer);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      const payload = {
        playerName: newPlayer.playerName,
        number: newPlayer.number,
        phone: newPlayer.phone,
        dateOfBirth: newPlayer.dateOfBirth,
      };
      const res = await api.post(
        `/tournament/${tournamentId}/team/${team.id}/player`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const createdPlayer = res.data?.data;
      if (createdPlayer) {
        setPlayers([...players, createdPlayer]);
        setIsAddingPlayer(false);
        setNewPlayer({
          playerName: "",
          number: 0,
          phone: "",
          dateOfBirth: "",
        });
        setFormErrors({});
      } else {
        toast.error("Failed to add player: No player data returned from API.");
      }
    } catch (error: any) {
      console.error("Failed to add player:", error.response.data.message);
     toast.error("Failed to add player. Please try again.");
    }
  };

  const handleUpdatePlayer = async (playerId: string) => {
    try {
      const updatedPlayers = players.map((player) =>
        player.id === playerId ? { ...player, ...newPlayer } : player
      );
      // Simulate API call
      await simulateFetch(null, 1000);
      setPlayers(updatedPlayers);
      setEditingPlayerId(null);
    } catch (error) {
      console.error("Failed to update player:", error);
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    // if (window.confirm("Are you sure you want to delete this player?")) {
      try {
        // Simulate API call
        await simulateFetch(null, 1000)

        setPlayers(players.filter((player) => player.id !== playerId))
      } catch (error) {
        console.error("Failed to delete player:", error)
      }
    // }
  }

  const startEditingPlayer = (player: Player) => {
    setEditingPlayerId(player.id);
    setNewPlayer({
      playerName: player.playerName,
      number: player.number,
      phone: player.phone,
      dateOfBirth: player.dateOfBirth,
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "injured":
        return "bg-red-100 text-red-800"
      case "suspended":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-neutral-100 text-neutral-800"
    }
  }

  // Filter players based on search query (playerName or phone)
  const filteredPlayers = (Array.isArray(players) ? players : []).filter((player) => {
    const search = searchQuery.toLowerCase();
    return (
      player.playerName.toLowerCase().includes(search) ||
      player.phone.toLowerCase().includes(search)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPlayers.length / pageSize) || 1;
  const paginatedPlayers = filteredPlayers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset to first page if filter/search changes and currentPage is out of bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredPlayers.length, totalPages]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-neutral-200 max-w-4xl mx-auto">
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-full">
            <User className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-800">{team?.name} - Players</h2>
            <p className="text-sm text-neutral-500">{players.length} players registered</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100" aria-label="Close">
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        )}
      </div>

      <div className="p-4 border-b border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-neutral-400" />
            </div>
            <input
              type="search"
              className="input pl-10 w-full focus:border-primary-300 focus:ring-primary-300"
              placeholder="Search players..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {canEdit() && (
              <button onClick={() => setIsAddingPlayer(true)} className="btn btn-primary p-2 flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add Player</span>
              </button>
            )}
            {canEdit() && (
              <button onClick={handleImportPlayers} className="btn btn-secondary px-2 py-3 flex items-center space-x-2" disabled={importLoading}>
                <Plus className="h-5 w-5" />
                <span>{importLoading ? "Importing..." : "Import Player"}</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {importError && <div className="text-red-500 text-xs mt-2">{importError}</div>}
          </div>
        </div>

        {isAddingPlayer && (
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-lg p-0 mb-6 animate-in">
  <div className="bg-green-600 rounded-t-2xl px-6 py-4 flex items-center">
    <h3 className="text-lg font-bold text-white tracking-wide">Add New Player</h3>
  </div>
  <form className="px-6 py-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block text-base font-medium text-neutral-800 mb-2">Full Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={newPlayer.playerName || ""}
          onChange={(e) => setNewPlayer({ ...newPlayer, playerName: e.target.value })}
          className={`input text-base py-2 px-3 border rounded-lg focus:ring-2 w-full ${formErrors.playerName ? 'border-red-500 focus:ring-red-300' : 'border-neutral-300 focus:ring-primary-300'}`}
          placeholder="Full name"
        />
        {formErrors.playerName && (
          <div className="text-red-500 text-xs mt-1">{formErrors.playerName}</div>
        )}
      </div>
      <div>
        <label className="block text-base font-medium text-neutral-800 mb-2">Number <span className="text-red-500">*</span></label>
        <input
          type="number"
          value={newPlayer.number || ""}
          onChange={(e) => setNewPlayer({ ...newPlayer, number: Number.parseInt(e.target.value) })}
          className={`input text-base py-2 px-3 border rounded-lg focus:ring-2 w-full ${formErrors.number ? 'border-red-500 focus:ring-red-300' : 'border-neutral-300 focus:ring-primary-300'}`}
          placeholder="Jersey number"
        />
        {formErrors.number && (
          <div className="text-red-500 text-xs mt-1">{formErrors.number}</div>
        )}
      </div>
      <div>
        <label className="block text-base font-medium text-neutral-800 mb-2">Phone Number <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={newPlayer.phone || ""}
          onChange={(e) => setNewPlayer({ ...newPlayer, phone: e.target.value })}
          className={`input text-base py-2 px-3 border rounded-lg focus:ring-2 w-full ${formErrors.phone ? 'border-red-500 focus:ring-red-300' : 'border-neutral-300 focus:ring-primary-300'}`}
          placeholder="Phone number"
        />
        {formErrors.phone && (
          <div className="text-red-500 text-xs mt-1">{formErrors.phone}</div>
        )}
      </div>
      <div>
        <label className="block text-base font-medium text-neutral-800 mb-2">Date of Birth <span className="text-red-500">*</span></label>
        <input
          type="date"
          value={newPlayer.dateOfBirth || ""}
          onChange={(e) => setNewPlayer({ ...newPlayer, dateOfBirth: e.target.value })}
          className={`input text-base py-2 px-3 border rounded-lg focus:ring-2 w-full ${formErrors.dateOfBirth ? 'border-red-500 focus:ring-red-300' : 'border-neutral-300 focus:ring-primary-300'}`}
          placeholder="YYYY-MM-DD"
        />
        {formErrors.dateOfBirth && (
          <div className="text-red-500 text-xs mt-1">{formErrors.dateOfBirth}</div>
        )}
      </div>
    </div>
    <div className="flex justify-end gap-3 mt-2">
      <button type="button" onClick={() => setIsAddingPlayer(false)} className="btn btn-outline px-6 py-2 rounded-lg text-base">
        Cancel
      </button>
      <button type="button" onClick={handleAddPlayer} className="btn btn-primary flex items-center space-x-2 px-6 py-2 rounded-lg text-base">
        <Save className="h-5 w-5" />
        <span>Save Player</span>
      </button>
    </div>
  </form>
</div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Full Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date of Birth</th>
              {canEdit() && (
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-neutral-500">
                  No players found matching your criteria
                </td>
              </tr>
            ) : (
              paginatedPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-neutral-50">
                  {editingPlayerId === player.id ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={newPlayer.playerName || ""}
                          onChange={(e) => setNewPlayer({ ...newPlayer, playerName: e.target.value })}
                          className="input"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={newPlayer.number || ""}
                          onChange={(e) => setNewPlayer({ ...newPlayer, number: Number.parseInt(e.target.value) })}
                          className="input w-20"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={newPlayer.phone || ""}
                          onChange={(e) => setNewPlayer({ ...newPlayer, phone: e.target.value })}
                          className="input"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="date"
                          value={newPlayer.dateOfBirth || ""}
                          onChange={(e) => setNewPlayer({ ...newPlayer, dateOfBirth: e.target.value })}
                          className="input"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleUpdatePlayer(player.id)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Save className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setEditingPlayerId(null)}
                            className="text-neutral-600 hover:text-neutral-900"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">{player.playerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{player.number}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{player.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(player.dateOfBirth)}</td>
                      {canEdit() && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => startEditingPlayer(player)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeletePlayer(player.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="text-sm text-neutral-500 mb-2 md:mb-0">
          Showing {paginatedPlayers.length} of {filteredPlayers.length} filtered players (Total: {players.length})
        </div>
        {/* Pagination Controls */}
        <div className="flex space-x-2">
          <button
            className="btn btn-outline rounded-lg p-2"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={`btn btn-outline rounded-lg p-2 ${currentPage === idx + 1 ? 'bg-primary-600 text-white ' : ''}`}
              onClick={() => setCurrentPage(idx + 1)}
              disabled={currentPage === idx + 1}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="btn btn-outline rounded-lg p-2"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
