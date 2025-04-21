"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import PlayersList from "./PlayersList"
import { Team } from "@/types/tournament"

interface PlayerManagementModalProps {
  tournamentId?: string
  team: Team
  onClose: () => void
}

export default function PlayerManagementModal({ tournamentId, team, onClose }: PlayerManagementModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Prevent scrolling of the body when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [onClose])

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        ref={modalRef}
        className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-lg shadow-xl animate-fade-in"
      >
        <PlayersList tournamentId={tournamentId} team={team} onClose={onClose} />
      </div>
    </div>,
    document.body,
  )
}
