"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Calendar, Users, Trophy, Edit, Trash, Eye } from "lucide-react"
import Link from "next/link"
import PageHeader from "../../components/ui-elements/PageHeader"
import LoadingSpinner from "../../components/ui-elements/LoadingSpinner"
import api from '../../apis/api'
import { getLocalStorage } from '../../utils/localStorage'

// Define tournament type
interface Tournament {
  id: string
  title: string
  category: string
  startDate: Date
  endDate: Date
  status: "READY" | "IN_PROGRESS" | "FINISHED" | "DISCARDED"
  teamsCount: number
  matchesCount: number
  progress: number
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
const statusOptions = [
  { value: "all", label: "All" },
  { value: "READY", label: "Ready" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "FINISHED", label: "Finished" },
  { value: "DISCARDED", label: "Discarded" },
];

function getStatusColor(status: Tournament['status'], isActive: boolean = false) {
  // Màu sắc cho filter (isActive) hoặc badge (mặc định)
  switch (status) {
    case 'READY':
      return isActive ? 'bg-primary-100 text-primary-700 border border-primary-200' : 'bg-primary-100 text-primary-800';
    case 'IN_PROGRESS':
      return isActive ? 'bg-success-100 text-success-700 border border-success-200' : 'bg-success-100 text-success-800';
    case 'FINISHED':
      return isActive ? 'bg-neutral-100 text-neutral-700 border border-neutral-200' : 'bg-neutral-100 text-neutral-800';
    case 'DISCARDED':
      return isActive ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-red-100 text-red-800';
    default:
      return isActive ? 'bg-primary-100 text-primary-700 border border-primary-200' : 'bg-neutral-200 text-neutral-700';
  }
}

function getStatusLabel(status: Tournament['status']) {
  switch (status) {
    case 'READY': return 'Ready';
    case 'IN_PROGRESS': return 'In Progress';
    case 'FINISHED': return 'Finished';
    case 'DISCARDED': return 'Discarded';
    default: return status;
  }
}


  useEffect(() => {
    const fetchTournaments = async () => {
      setIsLoading(true);
      try {
        const token = getLocalStorage('token');
        const res = await api.get('/tournament?page=1', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Map API data to Tournament[]
        const apiData = res.data.data as any[];
        const mapped: Tournament[] = apiData.map((item) => {
  // Dùng status gốc từ API
  const status: Tournament['status'] = item.status;
  // Dates
  let startDate = undefined, endDate = undefined;
  if (Array.isArray(item.eventDates) && item.eventDates.length > 0) {
    const dates = item.eventDates.map((d: any) => new Date(d.date));
    startDate = new Date(Math.min(...dates.map((d: any) => d.getTime())));
    endDate = new Date(Math.max(...dates.map((d: any) => d.getTime())));
  } else {
    startDate = endDate = new Date(item.createdAt);
  }
  return {
    id: item.id.toString(),
    title: item.title,
    category: item.category?.categoryName || '',
    startDate,
    endDate,
    status,
    teamsCount: item.teamsCount || 0,
    matchesCount: item.matchesCount || 0,
    progress: 0, // You may calculate progress if API provides
  };
});
        setTournaments(mapped);
        setFilteredTournaments(mapped);
      } catch (error) {
        setTournaments([]);
        setFilteredTournaments([]);
        console.error('Failed to load tournaments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  // Filter tournaments based on search and filters
  useEffect(() => {
    let results = tournaments

    // Filter by status
    if (statusFilter !== "all") {
      results = results.filter((tournament) => tournament.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (tournament) =>
          tournament.title.toLowerCase().includes(query) || tournament.category.toLowerCase().includes(query),
      )
    }

    setFilteredTournaments(results)
  }, [tournaments, searchQuery, statusFilter])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
  }

  const handleDeleteTournament = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this tournament?")) {
      try {
        // Simulate API call
        //await simulateFetch(null, 1000)
        setTournaments(tournaments.filter((tournament) => tournament.id !== id))
      } catch (error) {
        console.error("Failed to delete tournament:", error)
      }
    }
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Tournament Management" description="Create and manage your tournaments">
        <Link href="/tournaments/create" className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create New Tournament</span>
        </Link>
      </PageHeader>

      {/* Search and filter bar */}
      <div className="bg-white rounded-xl shadow-card border border-neutral-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-neutral-400" />
            </div>
            <input
              type="search"
              className="input pl-10 w-full focus:border-primary-300 focus:ring-primary-300"
              placeholder="Search tournaments..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
  {statusOptions.map(option => (
    <button
      key={option.value}
      onClick={() => handleStatusFilter(option.value)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        statusFilter === option.value && option.value !== 'all'
          ? getStatusColor(option.value as Tournament['status'], true)
          : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
      }`}
    >
      {option.label}
    </button>
  ))}
</div>
        </div>
      </div>

      {/* Tournament list */}
      {filteredTournaments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-card border border-neutral-200 p-8 text-center">
          <Trophy className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">No tournaments found</h3>
          <p className="text-neutral-600 mb-6">No tournaments match your search criteria.</p>
          <Link href="/tournaments/create" className="btn btn-primary inline-flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create New Tournament</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredTournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-white rounded-xl shadow-card border border-neutral-200 p-6 transition-all duration-200 hover:shadow-card-hover"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-bold text-neutral-800 mr-3">{tournament.title}</h3>
                    <span
  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tournament.status)}`}
>
  {getStatusLabel(tournament.status)}
</span>
                  </div>
                  <p className="text-neutral-600 mb-4">{tournament.category}</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                    <div className="flex items-center text-neutral-600">
                      <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                      <span>
                        {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <Users className="h-4 w-4 mr-2 text-secondary-500" />
                      <span>{tournament.teamsCount} teams</span>
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <Trophy className="h-4 w-4 mr-2 text-accent-500" />
                      <span>{tournament.matchesCount} matches</span>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${tournament.progress}%` }}></div>
                  </div>
                  <div className="text-xs text-neutral-500">{tournament.progress}% complete</div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/tournaments/${tournament.id}`}
                    className="btn btn-primary flex items-center justify-center space-x-2"
                  >
                    <Eye className="h-5 w-5" />
                    <span>View Details</span>
                  </Link>
                  <div className="flex gap-2">
                    <Link
                      href={`/tournaments/${tournament.id}/edit`}
                      className="btn btn-outline flex items-center justify-center"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteTournament(tournament.id)}
                      className="btn btn-outline text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center justify-center"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
