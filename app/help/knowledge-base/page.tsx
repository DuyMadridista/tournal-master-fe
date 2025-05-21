"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  ChevronRight,
  BookOpen,
  Trophy,
  Users,
  Calendar,
  BarChart2,
  Settings,
  ArrowLeft,
  FileText,
  Clock,
  Eye,
} from "lucide-react"

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Topics", icon: FileText },
    { id: "getting-started", name: "Getting Started", icon: BookOpen },
    { id: "tournaments", name: "Tournament Management", icon: Trophy },
    { id: "teams", name: "Team Registration", icon: Users },
    { id: "scheduling", name: "Scheduling", icon: Calendar },
    { id: "results", name: "Results & Statistics", icon: BarChart2 },
    { id: "account", name: "Account & Billing", icon: Settings },
  ]

  const articles = [
    {
      id: "getting-started-guide",
      title: "Getting Started with Tourna Master",
      description: "Learn the basics of setting up and managing tournaments with our platform.",
      category: "getting-started",
      readTime: "5 min read",
      views: 12543,
      date: "Updated 2 weeks ago",
    },
    {
      id: "create-tournament",
      title: "How to Create Your First Tournament",
      description: "A step-by-step guide to creating and configuring a new tournament.",
      category: "tournaments",
      readTime: "8 min read",
      views: 9876,
      date: "Updated 1 month ago",
    },
    {
      id: "team-registration",
      title: "Setting Up Team Registration",
      description: "Learn how to configure registration forms and manage team sign-ups.",
      category: "teams",
      readTime: "6 min read",
      views: 7654,
      date: "Updated 3 weeks ago",
    },
    {
      id: "schedule-optimization",
      title: "Optimizing Tournament Schedules",
      description: "Advanced techniques for creating efficient and conflict-free schedules.",
      category: "scheduling",
      readTime: "10 min read",
      views: 6543,
      date: "Updated 1 week ago",
    },
    {
      id: "results-management",
      title: "Managing Results and Standings",
      description: "How to record match results and generate accurate standings.",
      category: "results",
      readTime: "7 min read",
      views: 5432,
      date: "Updated 2 months ago",
    },
    {
      id: "billing-plans",
      title: "Understanding Billing and Subscription Plans",
      description: "A guide to our pricing plans, billing cycles, and payment options.",
      category: "account",
      readTime: "4 min read",
      views: 4321,
      date: "Updated 1 month ago",
    },
    {
      id: "advanced-brackets",
      title: "Advanced Bracket Configuration",
      description: "Learn how to set up complex tournament brackets and formats.",
      category: "tournaments",
      readTime: "12 min read",
      views: 3456,
      date: "Updated 3 weeks ago",
    },
    {
      id: "team-management",
      title: "Managing Teams and Players",
      description: "How to organize teams, add players, and manage rosters.",
      category: "teams",
      readTime: "9 min read",
      views: 2345,
      date: "Updated 2 weeks ago",
    },
  ]

  const filteredArticles =
    activeCategory === "all" ? articles : articles.filter((article) => article.category === activeCategory)

  const searchResults = searchQuery
    ? articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : filteredArticles

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link
                href="/help"
                className="inline-flex items-center text-primary-100 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span>Back to Help Center</span>
              </Link>
            </div>
            <h1 className="text-3xl font-bold mb-4">Knowledge Base</h1>
            <p className="text-primary-100 mb-6">
              Browse our comprehensive collection of guides, tutorials, and documentation
            </p>
            <div className="relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-primary-500 text-neutral-800 placeholder-neutral-400"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden sticky top-24">
              <div className="p-4 border-b border-neutral-200">
                <h2 className="font-semibold text-neutral-800">Categories</h2>
              </div>
              <nav className="p-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-md text-left transition-colors ${
                        activeCategory === category.id
                          ? "bg-primary-50 text-primary-700 font-medium"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{category.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Articles list */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-neutral-800">
                  {searchQuery
                    ? "Search Results"
                    : activeCategory === "all"
                      ? "All Articles"
                      : `${categories.find((c) => c.id === activeCategory)?.name} Articles`}
                </h2>
                <span className="text-sm text-neutral-500">{searchResults.length} articles</span>
              </div>

              {searchResults.length > 0 ? (
                <div className="divide-y divide-neutral-200">
                  {searchResults.map((article) => (
                    <Link
                      key={article.id}
                      href={`/help/articles/${article.id}`}
                      className="block p-6 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-neutral-800 hover:text-primary-600 transition-colors mb-2">
                            {article.title}
                          </h3>
                          <p className="text-neutral-600 mb-3">{article.description}</p>
                          <div className="flex items-center text-sm text-neutral-500 space-x-4">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {article.readTime}
                            </span>
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {article.views.toLocaleString()} views
                            </span>
                            <span>{article.date}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <ChevronRight className="h-5 w-5 text-neutral-400" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center p-4 bg-neutral-100 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-neutral-500" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-2">No articles found</h3>
                  <p className="text-neutral-600 mb-6">
                    {searchQuery
                      ? `We couldn't find any articles matching "${searchQuery}"`
                      : "There are no articles in this category yet"}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-neutral-500">© 2025 Tourna Master. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-neutral-500 hover:text-primary-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-neutral-500 hover:text-primary-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/help" className="text-neutral-500 hover:text-primary-600 transition-colors">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
