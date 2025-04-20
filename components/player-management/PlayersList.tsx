"use client"

import { useState, useEffect } from "react"
import { User, Edit, Trash, Plus, Search, Filter, ChevronDown, ArrowUpDown, Check, X, Save } from "lucide-react"
import { useDataFetching } from "../../context/DataFetchingContext"
import LoadingSpinner from "../ui-elements/LoadingSpinner"

interface Player {
  id: string
  name: string
  number: number
  position: string
  age: number
  nationality: string
  status: "active" | "injured" | "suspended"
}

interface Team {
  id: string
  name: string
}

interface PlayersListProps {
  teamId: string
  onClose?: () => void
}

export default function PlayersList({ teamId, onClose }: PlayersListProps) {
  const [players, setPlayers] = useState<Player[]>([])
  const [team, setTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [positionFilter, setPositionFilter] = useState<string>("all")
  const [isAddingPlayer, setIsAddingPlayer] = useState(false)
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null)
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: "",
    number: 0,
    position: "Forward",
    age: 20,
    nationality: "",
    status: "active",
  })
  const { simulateFetch } = useDataFetching()

  // Load team and players data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Sample team data
        const sampleTeam: Team = {
          id: teamId,
          name: "FC Barcelona",
        }

        // Sample players data
        const samplePlayers: Player[] = [
          {
            id: "player-1",
            name: "Lionel Messi",
            number: 10,
            position: "Forward",
            age: 34,
            nationality: "Argentina",
            status: "active",
          },
          {
            id: "player-2",
            name: "Gerard Piqué",
            number: 3,
            position: "Defender",
            age: 35,
            nationality: "Spain",
            status: "active",
          },
          {
            id: "player-3",
            name: "Sergio Busquets",
            number: 5,
            position: "Midfielder",
            age: 33,
            nationality: "Spain",
            status: "active",
          },
          {
            id: "player-4",
            name: "Marc-André ter Stegen",
            number: 1,
            position: "Goalkeeper",
            age: 30,
            nationality: "Germany",
            status: "active",
          },
          {
            id: "player-5",
            name: "Ansu Fati",
            number: 22,
            position: "Forward",
            age: 19,
            nationality: "Spain",
            status: "injured",
          },
          {
            id: "player-6",
            name: "Frenkie de Jong",
            number: 21,
            position: "Midfielder",
            age: 25,
            nationality: "Netherlands",
            status: "active",
          },
          {
            id: "player-7",
            name: "Jordi Alba",
            number: 18,
            position: "Defender",
            age: 33,
            nationality: "Spain",
            status: "suspended",
          },
        ]

        // Simulate API calls
        const teamData = await simulateFetch(sampleTeam, 500)
        const playersData = await simulateFetch(samplePlayers, 1000)

        setTeam(teamData)
        setPlayers(playersData)
      } catch (error) {
        console.error("Failed to load players data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [teamId, simulateFetch])

  // Filter players based on search and filters
  const filteredPlayers = players.filter((player) => {
    // Apply search filter
    const matchesSearch =
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.position.toLowerCase().includes(searchQuery.toLowerCase())

    // Apply status filter
    const matchesStatus = statusFilter === "all" || player.status === statusFilter

    // Apply position filter
    const matchesPosition = positionFilter === "all" || player.position === positionFilter

    return matchesSearch && matchesStatus && matchesPosition
  })

  const handleAddPlayer = async () => {
    if (!newPlayer.name || !newPlayer.nationality) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const player: Player = {
        id: `player-${Date.now()}`,
        name: newPlayer.name || "",
        number: newPlayer.number || 0,
        position: newPlayer.position || "Forward",
        age: newPlayer.age || 20,
        nationality: newPlayer.nationality || "",
        status: (newPlayer.status as "active" | "injured" | "suspended") || "active",
      }

      // Simulate API call
      await simulateFetch(player, 1000)

      setPlayers([...players, player])
      setIsAddingPlayer(false)
      setNewPlayer({
        name: "",
        number: 0,
        position: "Forward",
        age: 20,
        nationality: "",
        status: "active",
      })
    } catch (error) {
      console.error("Failed to add player:", error)
    }
  }

  const handleUpdatePlayer = async (playerId: string) => {
    try {
      const updatedPlayers = players.map((player) => (player.id === playerId ? { ...player, ...newPlayer } : player))

      // Simulate API call
      await simulateFetch(null, 1000)

      setPlayers(updatedPlayers)
      setEditingPlayerId(null)
    } catch (error) {
      console.error("Failed to update player:", error)
    }
  }

  const handleDeletePlayer = async (playerId: string) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      try {
        // Simulate API call
        await simulateFetch(null, 1000)

        setPlayers(players.filter((player) => player.id !== playerId))
      } catch (error) {
        console.error("Failed to delete player:", error)
      }
    }
  }

  const startEditingPlayer = (player: Player) => {
    setEditingPlayerId(player.id)
    setNewPlayer({
      name: player.name,
      number: player.number,
      position: player.position,
      age: player.age,
      nationality: player.nationality,
      status: player.status,
    })
  }

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
            <div className="relative">
              <button className="btn btn-outline flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Status</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-dropdown border border-neutral-200 p-2 z-10">
                <div className="space-y-1">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                      statusFilter === "all" ? "bg-primary-50 text-primary-700" : "hover:bg-neutral-50"
                    }`}
                  >
                    <span className="flex-1 text-left">All</span>
                    {statusFilter === "all" && <Check className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setStatusFilter("active")}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                      statusFilter === "active" ? "bg-primary-50 text-primary-700" : "hover:bg-neutral-50"
                    }`}
                  >
                    <span className="flex-1 text-left">Active</span>
                    {statusFilter === "active" && <Check className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setStatusFilter("injured")}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                      statusFilter === "injured" ? "bg-primary-50 text-primary-700" : "hover:bg-neutral-50"
                    }`}
                  >
                    <span className="flex-1 text-left">Injured</span>
                    {statusFilter === "injured" && <Check className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setStatusFilter("suspended")}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                      statusFilter === "suspended" ? "bg-primary-50 text-primary-700" : "hover:bg-neutral-50"
                    }`}
                  >
                    <span className="flex-1 text-left">Suspended</span>
                    {statusFilter === "suspended" && <Check className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="relative">
              <button className="btn btn-outline flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Position</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-dropdown border border-neutral-200 p-2 z-10">
                <div className="space-y-1">
                  <button
                    onClick={() => setPositionFilter("all")}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                      positionFilter === "all" ? "bg-primary-50 text-primary-700" : "hover:bg-neutral-50"
                    }`}
                  >
                    <span className="flex-1 text-left">All</span>
                    {positionFilter === "all" && <Check className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setPositionFilter("Goalkeeper")}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                      positionFilter === "Goalkeeper" ? "bg-primary-50 text-primary-700" : "hover:bg-neutral-50"
                    }`}
                  >
                    <span className="flex-1 text-left">Goalkeeper</span>
                    {positionFilter === "Goalkeeper" && <Check className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setPositionFilter("Defender")}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                      positionFilter === "Defender" ? "bg-primary-50 text-primary-700" : "hover:bg-neutral-50"
                    }`}
                  >
                    <span className="flex-1 text-left">Defender</span>
                    {positionFilter === "Defender" && <Check className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setPositionFilter("Midfielder")}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                      positionFilter === "Midfielder" ? "bg-primary-50 text-primary-700" : "hover:bg-neutral-50"
                    }`}
                  >
                    <span className="flex-1 text-left">Midfielder</span>
                    {positionFilter === "Midfielder" && <Check className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setPositionFilter("Forward")}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                      positionFilter === "Forward" ? "bg-primary-50 text-primary-700" : "hover:bg-neutral-50"
                    }`}
                  >
                    <span className="flex-1 text-left">Forward</span>
                    {positionFilter === "Forward" && <Check className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <button onClick={() => setIsAddingPlayer(true)} className="btn btn-primary flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Player</span>
            </button>
          </div>
        </div>

        {isAddingPlayer && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4 animate-in">
            <h3 className="text-lg font-semibold text-primary-800 mb-3">Add New Player</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={newPlayer.name || ""}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  className="input"
                  placeholder="Player name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Number</label>
                <input
                  type="number"
                  value={newPlayer.number || ""}
                  onChange={(e) => setNewPlayer({ ...newPlayer, number: Number.parseInt(e.target.value) })}
                  className="input"
                  placeholder="Jersey number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Position</label>
                <select
                  value={newPlayer.position}
                  onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                  className="input"
                >
                  <option value="Goalkeeper">Goalkeeper</option>
                  <option value="Defender">Defender</option>
                  <option value="Midfielder">Midfielder</option>
                  <option value="Forward">Forward</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Age</label>
                <input
                  type="number"
                  value={newPlayer.age || ""}
                  onChange={(e) => setNewPlayer({ ...newPlayer, age: Number.parseInt(e.target.value) })}
                  className="input"
                  placeholder="Player age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Nationality *</label>
                <input
                  type="text"
                  value={newPlayer.nationality || ""}
                  onChange={(e) => setNewPlayer({ ...newPlayer, nationality: e.target.value })}
                  className="input"
                  placeholder="Player nationality"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
                <select
                  value={newPlayer.status}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, status: e.target.value as "active" | "injured" | "suspended" })
                  }
                  className="input"
                >
                  <option value="active">Active</option>
                  <option value="injured">Injured</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsAddingPlayer(false)} className="btn btn-outline">
                Cancel
              </button>
              <button onClick={handleAddPlayer} className="btn btn-primary flex items-center space-x-2">
                <Save className="h-5 w-5" />
                <span>Save Player</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                <div className="flex items-center space-x-1">
                  <span>Player</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                <div className="flex items-center space-x-1">
                  <span>Number</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                <div className="flex items-center space-x-1">
                  <span>Position</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                <div className="flex items-center space-x-1">
                  <span>Age</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                <div className="flex items-center space-x-1">
                  <span>Nationality</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-neutral-500">
                  No players found matching your criteria
                </td>
              </tr>
            ) : (
              filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-neutral-50">
                  {editingPlayerId === player.id ? (
                    // Editing mode
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={newPlayer.name || ""}
                          onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
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
                        <select
                          value={newPlayer.position}
                          onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                          className="input"
                        >
                          <option value="Goalkeeper">Goalkeeper</option>
                          <option value="Defender">Defender</option>
                          <option value="Midfielder">Midfielder</option>
                          <option value="Forward">Forward</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={newPlayer.age || ""}
                          onChange={(e) => setNewPlayer({ ...newPlayer, age: Number.parseInt(e.target.value) })}
                          className="input w-20"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={newPlayer.nationality || ""}
                          onChange={(e) => setNewPlayer({ ...newPlayer, nationality: e.target.value })}
                          className="input"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={newPlayer.status}
                          onChange={(e) =>
                            setNewPlayer({ ...newPlayer, status: e.target.value as "active" | "injured" | "suspended" })
                          }
                          className="input"
                        >
                          <option value="active">Active</option>
                          <option value="injured">Injured</option>
                          <option value="suspended">Suspended</option>
                        </select>
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
                    // View mode
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900">{player.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{player.number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{player.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{player.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{player.nationality}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(player.status)}`}
                        >
                          {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
                        </span>
                      </td>
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
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-neutral-200 flex justify-between items-center">
        <div className="text-sm text-neutral-500">
          Showing {filteredPlayers.length} of {players.length} players
        </div>
        <div className="flex space-x-2">
          <button className="btn btn-outline">Previous</button>
          <button className="btn btn-outline">Next</button>
        </div>
      </div>
    </div>
  )
}
