"use client"

import { useState } from "react"
import type { Organizer } from "../../types/tournament"
import { Pencil, Plus, Trash, Users, Mail, UserPlus } from "lucide-react"
import InfoCard from "../ui-elements/InfoCard"

interface OrganizersListProps {
  organizers: Organizer[]
  onOrganizersChange?: (organizers: Organizer[]) => void
}

export default function OrganizersList({ organizers, onOrganizersChange }: OrganizersListProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newOrganizer, setNewOrganizer] = useState<Partial<Organizer>>({
    fullName: "",
    email: "",
    role: "Member",
  })

  const handleAddOrganizer = () => {
    if (!newOrganizer.fullName || !newOrganizer.email) return

    const organizer: Organizer = {
      id: `org-${Date.now()}`,
      fullName: newOrganizer.fullName,
      email: newOrganizer.email,
      role: newOrganizer.role || "Member",
    }

    if (onOrganizersChange) {
      onOrganizersChange([...organizers, organizer])
    }

    setNewOrganizer({
      fullName: "",
      email: "",
      role: "Member",
    })
    setShowAddForm(false)
  }

  const handleRemoveOrganizer = (id: string) => {
    if (onOrganizersChange) {
      onOrganizersChange(organizers.filter((org) => org.id !== id))
    }
  }

  return (
    <InfoCard>
      <div className="flex items-center mb-6 -mx-5 -mt-5 px-5 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
              <input
                type="text"
                value={newOrganizer.fullName}
                onChange={(e) => setNewOrganizer({ ...newOrganizer, fullName: e.target.value })}
                className="input"
                placeholder="John Doe"
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
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button onClick={() => setShowAddForm(false)} className="btn btn-sm btn-outline">
              Cancel
            </button>
            <button onClick={handleAddOrganizer} className="btn btn-sm btn-primary">
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
