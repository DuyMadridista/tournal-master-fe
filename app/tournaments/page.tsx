"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Calendar, Users, Trophy, Edit, Trash, Eye, ArrowLeft, X } from "lucide-react"
import Link from "next/link"
import PageHeader from "../../components/ui-elements/PageHeader"
import LoadingSpinner from "../../components/ui-elements/LoadingSpinner"
import api from '../../apis/api'
import { getLocalStorage } from '../../utils/localStorage'
import DatePicker from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import "react-multi-date-picker/styles/layouts/mobile.css"
import "../../styles/datepicker-custom.css"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { toast } from "react-toastify"

// Define tournament format types
type TournamentFormat = "KNOCKOUT" | "GROUP_STAGE" | "LEAGUE"

// Define tournament creation form data
interface TournamentFormData {
  title: string
  description: string
  place: string
  categoryId: number
  numberOfPlayers: number
  format: TournamentFormat
  numberOfGroups?: number
  teamsPerGroup?: number
  advancePerGroup?: number
  eventDates: string[]
}

// Define tournament type
interface Tournament {
  id: string
  title: string
  category: string
  startDate: Date
  endDate: Date
  status: "READY" | "IN_PROGRESS" | "FINISHED" | "DISCARDED" | "NEED_INFORMATION"
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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<{ categoryId: number; categoryName: string }[]>([])
  const [formData, setFormData] = useState<TournamentFormData>({
    title: "",
    description: "",
    place: "",
    categoryId: 0,
    numberOfPlayers: 0,
    format: "KNOCKOUT",
    eventDates: []
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [dates, setDates] = useState<any[]>([])
const statusOptions = [
  { value: "all", label: "All" },
  { value: "READY", label: "Ready" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "FINISHED", label: "Finished" },
  { value: "DISCARDED", label: "Discarded" },
  { value: "NEED_INFORMATION", label: "Need Information" },
];

function getStatusColor(status: Tournament['status'], isActive: boolean = false) {
  // Màu sắc cho filter (isActive) hoặc badge (mặc định)
  switch (status) {
    case 'NEED_INFORMATION':
      return isActive ? 'bg-primary-100 text-primary-700 border border-primary-200' : 'bg-primary-100 text-primary-800';
    case 'IN_PROGRESS':
      return isActive ? 'bg-success-100 text-success-700 border border-success-200' : 'bg-success-100 text-success-800';
    case 'FINISHED':
      return isActive ? 'bg-neutral-100 text-purple-700 border bg-purple-100 border-purple-200' : 'bg-neutral-100 text-neutral-800';
    case 'DISCARDED':
      return isActive ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-red-100 text-red-800';
    case 'READY':
      return isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-green-100 text-green-800';
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
    case 'NEED_INFORMATION': return 'Need Information';
    default: return status;
  }
}


  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getLocalStorage("token")
        const res = await api.get("/category", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setCategories(res.data.data || [])
      } catch (error) {
        console.error("Failed to load categories:", error)
      }
    }
    fetchCategories()
  }, [])
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Convert numeric values
    if (["numberOfPlayers", "numberOfGroups", "teamsPerGroup", "advancePerGroup"].includes(name)) {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      })
    } else if (name === "categoryId") {
      // Special handling for categoryId to ensure it's properly converted to number
      const numValue = parseInt(value);
      setFormData({
        ...formData,
        [name]: numValue
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      })
    }
  }

  // Handle date changes
  const handleDateChange = (selectedDates: any) => {
    setDates(selectedDates)
    
    // Convert dates to string format for API
    const formattedDates = selectedDates.map((date: any) => {
      const dateObj = new Date(date)
      return dateObj.toISOString().split('T')[0]
    })
    
    setFormData({
      ...formData,
      eventDates: formattedDates
    })
    
    // Clear error for dates if it exists
    if (errors.eventDates) {
      setErrors({
        ...errors,
        eventDates: ""
      })
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    
    if (!formData.place.trim()) {
      newErrors.place = "Place is required"
    }
    
    if (formData.categoryId === 0) {
      newErrors.categoryId = "Category is required"
    }
    
    if (formData.numberOfPlayers <= 0) {
      newErrors.numberOfPlayers = "Number of players is required"
    }
    
    if (formData.format === "GROUP_STAGE") {
      if (!formData.numberOfGroups || formData.numberOfGroups <= 0) {
        newErrors.numberOfGroups = "Number of groups is required"
      }
      
      if (!formData.teamsPerGroup || formData.teamsPerGroup <= 0) {
        newErrors.teamsPerGroup = "Teams per group is required"
      }
      
      if (!formData.advancePerGroup || formData.advancePerGroup <= 0) {
        newErrors.advancePerGroup = "Advance per group is required"
      }
      
      if (formData.advancePerGroup && formData.teamsPerGroup && 
          formData.advancePerGroup > formData.teamsPerGroup) {
        newErrors.advancePerGroup = "Cannot be greater than teams per group"
      }
    }
    
    if (formData.eventDates.length === 0) {
      newErrors.eventDates = "Event dates are required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const token = getLocalStorage("token")
      
      // Prepare data for API
      const apiData = {
        ...formData,
        selectCategory: categories.find(c => c.categoryId === formData.categoryId)?.categoryName || ""
      }
      
      await api.post("/tournament", apiData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      // Close dialog and refresh tournaments
      setIsDialogOpen(false)
      // Refresh the tournaments list
      setIsLoading(true)
      try {
        const token = getLocalStorage('token')
        const res = await api.get('/tournament?page=1', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        // Map API data to Tournament[]
        const apiData = res.data.data as any[]

        const mapped: Tournament[] = apiData.map((item) => {
          // Dùng status gốc từ API
          const status: Tournament['status'] = item.status
          // Dates
          let startDate = undefined, endDate = undefined
          if (Array.isArray(item.eventDates) && item.eventDates.length > 0) {
            const dates = item.eventDates.map((d: any) => new Date(d.date))
            startDate = new Date(Math.min(...dates.map((d: any) => d.getTime())))
            endDate = new Date(Math.max(...dates.map((d: any) => d.getTime())))
          } else {
            startDate = endDate = new Date(item.createdAt)
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
          }
        })
        setTournaments(mapped)
        setFilteredTournaments(mapped)
      } catch (error) {
        console.error('Failed to refresh tournaments:', error)
      } finally {
        setIsLoading(false)
      }
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        place: "",
        categoryId: 0,
        numberOfPlayers: 0,
        format: "KNOCKOUT",
        eventDates: []
      })
      setDates([])
      setErrors({})
    } catch (error) {
      console.error("Failed to create tournament:", error)
      setErrors({
        ...errors,
        submit: "Failed to create tournament. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get today's date for min date in date picker
  const today = new Date()

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
        const apiData = res.data.data as any[];
        const mapped: Tournament[] = apiData.map((item) => {
  const status: Tournament['status'] = item.status;
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
    teamsCount: item.numberOfTeams || 0,
    matchesCount: item.numberOfMatches || 0,
    progress: item.progress || 0,
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

  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [tournamentToDelete, setTournamentToDelete] = useState<string | null>(null)

  const openDeleteDialog = (id: string) => {
    setTournamentToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteTournament = async () => {
    if (!tournamentToDelete) return
    
    try {
      setTournaments(tournaments.filter((tournament) => tournament.id !== tournamentToDelete))
      await api.delete(`/tournament/${tournamentToDelete}`)
      toast.success("Tournament deleted successfully")
      setIsDeleteDialogOpen(false)
      setTournamentToDelete(null)
    } catch (error) {
      console.error("Failed to delete tournament:", error)
      toast.error("Failed to delete tournament")
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="btn btn-primary flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create New Tournament</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg border border-neutral-200">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary-600">Create Tournament</DialogTitle>
              <DialogDescription className="text-neutral-600">
                Set up a new tournament with your preferred settings
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* General Information Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-primary-600 pb-2 border-b border-neutral-200">General Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-neutral-800 font-medium mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter tournament title"
                      className={`input w-full ${errors.title ? 'border-red-500' : ''}`}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-neutral-800 font-medium mb-2">
                      Place <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="place"
                      value={formData.place}
                      onChange={handleInputChange}
                      placeholder="Enter tournament location"
                      className={`input w-full ${errors.place ? 'border-red-500' : ''}`}
                    />
                    {errors.place && <p className="text-red-500 text-sm mt-1">{errors.place}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-neutral-800 font-medium mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className={`input w-full ${errors.categoryId ? 'border-red-500' : ''}`}
                    >
                      <option key="default" value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId?.toString()}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-neutral-800 font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter tournament description"
                      className="input w-full h-24"
                    />
                  </div>
                </div>
              </div>
              
              {/* Tournament Details Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-primary-600 pb-2 border-b border-neutral-200">Tournament Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-neutral-800 font-medium mb-2">
                      Number of Players <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="numberOfPlayers"
                      value={formData.numberOfPlayers || ''}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="Enter number of players"
                      className={`input w-full ${errors.numberOfPlayers ? 'border-red-500' : ''}`}
                    />
                    {errors.numberOfPlayers && <p className="text-red-500 text-sm mt-1">{errors.numberOfPlayers}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-neutral-800 font-medium mb-2">
                      Format <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="format"
                      value={formData.format}
                      onChange={handleInputChange}
                      className="input w-full"
                    >
                      <option value="KNOCKOUT">Knockout</option>
                      <option value="GROUP_STAGE">Group Stage</option>
                      <option value="ROUND_ROBIN">Round Robin</option>
                      <option value="SINGLE_ELIMINATION">Single Elimination</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-neutral-800 font-medium mb-2">
                      Event Dates <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DatePicker
                        value={dates}
                        onChange={handleDateChange}
                        multiple
                        sort
                        format="DD/MM/YYYY"
                        calendarPosition="bottom"
                        plugins={[<DatePanel key="date-panel" />]}
                        minDate={new Date(today.getTime() + 24 * 60 * 60 * 1000)}
                        placeholder="Select event dates"
                        className={`input w-full ${errors.eventDates ? 'border-red-500' : ''}`}
                        style={{
                          width: '100%',
                          height: '40px',
                          boxSizing: 'border-box'
                        }}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    </div>
                    {errors.eventDates && <p className="text-red-500 text-sm mt-1">{errors.eventDates}</p>}
                  </div>
                </div>
              </div>
              
              {/* Group Stage Settings (conditional) */}
              {formData.format === "GROUP_STAGE" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-primary-600 pb-2 border-b border-neutral-200">Group Stage Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-neutral-800 font-medium mb-2">
                        Number of Groups <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="numberOfGroups"
                        value={formData.numberOfGroups || ''}
                        onChange={handleInputChange}
                        min="1"
                        placeholder="Enter number of groups"
                        className={`input w-full ${errors.numberOfGroups ? 'border-red-500' : ''}`}
                      />
                      {errors.numberOfGroups && <p className="text-red-500 text-sm mt-1">{errors.numberOfGroups}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-neutral-800 font-medium mb-2">
                        Teams Per Group <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="teamsPerGroup"
                        value={formData.teamsPerGroup || ''}
                        onChange={handleInputChange}
                        min="1"
                        placeholder="Enter teams per group"
                        className={`input w-full ${errors.teamsPerGroup ? 'border-red-500' : ''}`}
                      />
                      {errors.teamsPerGroup && <p className="text-red-500 text-sm mt-1">{errors.teamsPerGroup}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-neutral-800 font-medium mb-2">
                        Advance Per Group <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="advancePerGroup"
                        value={formData.advancePerGroup || ''}
                        onChange={handleInputChange}
                        min="1"
                        placeholder="Enter advance per group"
                        className={`input w-full ${errors.advancePerGroup ? 'border-red-500' : ''}`}
                      />
                      {errors.advancePerGroup && <p className="text-red-500 text-sm mt-1">{errors.advancePerGroup}</p>}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Error message */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {errors.submit}
                </div>
              )}
              
              {/* Form actions */}
              <DialogFooter className="mt-8 pt-4 border-t border-neutral-200">
                <div className="flex gap-3 w-full sm:w-auto justify-end">
                  <button 
                    type="button" 
                    className="btn btn-outline px-5 py-2.5 text-sm font-medium"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary px-5 py-2.5 text-sm font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Tournament"}
                  </button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="btn btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Tournament</span>
          </button>
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
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tournament.status, true)}`}
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
                    <button
                      onClick={() => openDeleteDialog(tournament.id)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-lg border border-neutral-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-neutral-600">
              Are you sure you want to delete this tournament? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-3 justify-end">
            <button 
              className="btn btn-outline px-5 py-2.5 text-sm font-medium"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </button>
            <button 
              className="btn bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 text-sm font-medium"
              onClick={handleDeleteTournament}
            >
              Delete Tournament
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
