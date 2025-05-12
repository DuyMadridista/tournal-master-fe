"use client"

import { useState, useEffect } from "react"
import type { Organizer } from "../../types/tournament"
import { Pencil, Plus, Trash, Users, Mail, UserPlus, AlertTriangle } from "lucide-react"
import InfoCard from "../ui-elements/InfoCard"
import axios from "axios"

interface OrganizersListProps {
  organizers: Organizer[]
  onOrganizersChange?: (organizers: Organizer[]) => void
  tournamentId?: string
}

interface SystemOrganizer {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
}

export default function OrganizersList({ organizers, onOrganizersChange, tournamentId }: OrganizersListProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newOrganizer, setNewOrganizer] = useState<Partial<Organizer>>({
    fullName: "",
    email: "",
    role: "Member",
  })
  const [systemOrganizers, setSystemOrganizers] = useState<SystemOrganizer[]>([])
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<string>("") 
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all organizers from the API when the component mounts or when showAddForm is true
  useEffect(() => {
    if (showAddForm) {
      fetchOrganizers()
    }
  }, [showAddForm])

  const fetchOrganizers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get('http://localhost:6969/organizer/getAllOrganizer', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.data.success) {
        setSystemOrganizers(response.data.data)
      } else {
        setError('Failed to fetch organizers')
      }
    } catch (err) {
      console.error('Error fetching organizers:', err)
      setError('Failed to fetch organizers from the server')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOrganizerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const organizerId = e.target.value
    setSelectedOrganizerId(organizerId)
    
    if (organizerId) {
      const selectedOrg = systemOrganizers.find(org => org.id.toString() === organizerId)
      if (selectedOrg) {
        setNewOrganizer({
          fullName: `${selectedOrg.firstName} ${selectedOrg.lastName}`,
          email: selectedOrg.email,
          role: selectedOrg.role || "Member"
        })
      }
    } else {
      // Reset form if "Select an organizer" is chosen
      setNewOrganizer({
        fullName: "",
        email: "",
        role: "Member"
      })
    }
  }

  const updateTournamentOrganizers = async (updatedOrganizers: Organizer[]) => {
    if (!tournamentId) {
      console.error("Tournament ID is not available")
      setError("Tournament ID is not available")
      return false
    }

    try {
      setIsLoading(true)
      // Extract organizer IDs (only use numeric IDs from the system)
      const organizerIds = updatedOrganizers
        .map(org => {
          // Only include numeric IDs (from system organizers)
          const id = parseInt(org.id)
          return isNaN(id) ? null : id
        })
        .filter(id => id !== null) as number[]

      // Make API call to update organizers
      await axios.put(
        `http://localhost:6969/tournament/${tournamentId}/detail`,
        { organizers: organizerIds },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      return true
    } catch (error) {
      console.error("Failed to update tournament organizers:", error)
      setError("Failed to update organizers on the server")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddOrganizer = async () => {
    if (!newOrganizer.fullName || !newOrganizer.email) return

    const organizer: Organizer = {
      id: selectedOrganizerId || `org-${Date.now()}`,
      fullName: newOrganizer.fullName,
      email: newOrganizer.email,
      role: newOrganizer.role || "Member",
    }

    // Check if this organizer is already in the list
    const isDuplicate = organizers.some(org => org.email === organizer.email)
    if (isDuplicate) {
      setError('This organizer is already in the list')
      return
    }

    const updatedOrganizers = [...organizers, organizer]
    
    // Update organizers on the server
    const success = await updateTournamentOrganizers(updatedOrganizers)
    
    if (success) {
      if (onOrganizersChange) {
        onOrganizersChange(updatedOrganizers)
      }

      setNewOrganizer({
        fullName: "",
        email: "",
        role: "Member",
      })
      setSelectedOrganizerId("")
      setShowAddForm(false)
      setError(null)
    }
  }

  const handleRemoveOrganizer = async (id: string) => {
    const updatedOrganizers = organizers.filter((org) => org.id !== id)
    
    // Update organizers on the server
    const success = await updateTournamentOrganizers(updatedOrganizers)
    
    if (success && onOrganizersChange) {
      onOrganizersChange(updatedOrganizers)
    }
  }

  return (
    <InfoCard>
      <div className="flex items-center mb-6 -mx-5 -mt-5 px-5 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl">
        <Users className="h-5 w-5 mr-2" />
        <h3 className="font-semibold">Tournament Staff</h3>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-neutral-600">Manage the team responsible for running this tournament</p>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-sm btn-outline flex items-center space-x-1"
          >
            <Pencil className="h-4 w-4" />
            <span>{isEditing ? "Done" : "Edit"}</span>
          </button>
          <button onClick={() => setShowAddForm(true)} className="btn btn-sm btn-primary flex items-center space-x-1">
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border border-primary-200 rounded-lg bg-primary-50 animate-in">
          <h4 className="text-lg font-medium text-primary-700 mb-3 flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Add New Organizer
          </h4>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Select Organizer</label>
            <select 
              className="input w-full"
              value={selectedOrganizerId}
              onChange={handleOrganizerSelect}
              disabled={isLoading}
            >
              <option value="">Select an organizer</option>
              {systemOrganizers.map(org => (
                <option key={org.id} value={org.id.toString()}>
                  {org.firstName} {org.lastName} ({org.email})
                </option>
              ))}
            </select>
            {isLoading && <p className="mt-1 text-xs text-neutral-500">Loading organizers...</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
              <input
                type="text"
                value={newOrganizer.fullName}
                onChange={(e) => setNewOrganizer({ ...newOrganizer, fullName: e.target.value })}
                className="input"
                placeholder="John Doe"
                disabled={!!selectedOrganizerId}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <input
                type="email"
                value={newOrganizer.email}
                onChange={(e) => setNewOrganizer({ ...newOrganizer, email: e.target.value })}
                className="input"
                placeholder="john@example.com"
                disabled={!!selectedOrganizerId}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button onClick={() => {
              setShowAddForm(false)
              setError(null)
              setSelectedOrganizerId("")
              setNewOrganizer({
                fullName: "",
                email: "",
                role: "Member",
              })
            }} className="btn btn-sm btn-outline">
              Cancel
            </button>
            <button 
              onClick={handleAddOrganizer} 
              className="btn btn-sm btn-primary"
              disabled={!newOrganizer.fullName || !newOrganizer.email || isLoading}
            >
              Add Organizer
            </button>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead className="table-header bg-neutral-50">
            <tr>
              <th className="table-head">No.</th>
              <th className="table-head">Full Name</th>
              <th className="table-head">Email</th>
              {isEditing && <th className="table-head text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="table-body">
            {organizers.map((organizer, index) => (
              <tr key={organizer.id} className="table-row">
                <td className="table-cell text-neutral-500">{index + 1}</td>
                <td className="table-cell font-medium">{organizer.fullName}</td>
                <td className="table-cell text-neutral-500 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary-500" />
                  {organizer.email}
                </td>
                {isEditing && (
                  <td className="table-cell text-right">
                    <button
                      onClick={() => handleRemoveOrganizer(organizer.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </InfoCard>
  )
}
