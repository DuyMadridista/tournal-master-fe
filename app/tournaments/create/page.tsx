"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import api from "../../../apis/api"
import { getLocalStorage } from "../../../utils/localStorage"
import PageHeader from "../../../components/ui-elements/PageHeader"
import DatePicker from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"

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

export default function CreateTournamentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<{ id: number; categoryName: string }[]>([])
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
    if (["numberOfPlayers", "numberOfGroups", "teamsPerGroup", "advancePerGroup", "categoryId"].includes(name)) {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
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
    
    setIsLoading(true)
    
    try {
      const token = getLocalStorage("token")
      
      // Prepare data for API
      const apiData = {
        ...formData,
        selectCategory: categories.find(c => c.id === formData.categoryId)?.categoryName || ""
      }
      
      await api.post("/tournament", apiData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      // Redirect to tournaments page on success
      router.push("/tournaments")
    } catch (error) {
      console.error("Failed to create tournament:", error)
      setErrors({
        ...errors,
        submit: "Failed to create tournament. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get today's date for min date in date picker
  const today = new Date()

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Create Tournament" 
        description="Set up a new tournament with your preferred settings"
      >
        <Link href="/tournaments" className="btn btn-outline flex items-center space-x-2">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Tournaments</span>
        </Link>
      </PageHeader>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card border border-neutral-200 p-6">
        {/* General Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-primary-600 mb-6">General Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <option value={0}>Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
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
                className="input w-full h-32"
              />
            </div>
          </div>
        </div>
        
        {/* Tournament Details Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-primary-600 mb-6">Tournament Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <option value="LEAGUE">League</option>
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
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
              {errors.eventDates && <p className="text-red-500 text-sm mt-1">{errors.eventDates}</p>}
            </div>
          </div>
        </div>
        
        {/* Group Stage Settings (conditional) */}
        {formData.format === "GROUP_STAGE" && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary-600 mb-6">Group Stage Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {errors.submit}
          </div>
        )}
        
        {/* Form actions */}
        <div className="flex justify-end space-x-4">
          <Link href="/tournaments" className="btn btn-outline">
            Cancel
          </Link>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Tournament"}
          </button>
        </div>
      </form>
    </div>
  )
}
