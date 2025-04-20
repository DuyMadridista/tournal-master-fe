"use client"

import TournamentDetails from "../../pages/TournamentDetails"
import PageHeader from "../../components/ui-elements/PageHeader"
import { Save, Download } from "lucide-react"

export default function DetailsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Tournament Details" description="Configure your tournament settings, format, and organizers">
        <button className="btn btn-outline flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Export</span>
        </button>
        <button className="btn btn-primary flex items-center space-x-2">
          <Save className="h-5 w-5" />
          <span>Save Changes</span>
        </button>
      </PageHeader>

      <TournamentDetails />
    </div>
  )
}
