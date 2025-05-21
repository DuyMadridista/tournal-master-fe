"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  FileText,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Video,
  Users,
  Calendar,
  Trophy,
  BarChart2,
  Settings,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeChatTab, setActiveChatTab] = useState("chat")

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const toggleFaq = (index: number) => {
    if (expandedFaqs.includes(index)) {
      setExpandedFaqs(expandedFaqs.filter((i) => i !== index))
    } else {
      setExpandedFaqs([...expandedFaqs, index])
    }
  }

  const categories = [
    { id: "all", name: "All Topics", icon: FileText },
    { id: "getting-started", name: "Getting Started", icon: BookOpen },
    { id: "tournaments", name: "Tournament Management", icon: Trophy },
    { id: "teams", name: "Team Registration", icon: Users },
    { id: "scheduling", name: "Scheduling", icon: Calendar },
    { id: "results", name: "Results & Statistics", icon: BarChart2 },
    { id: "account", name: "Account & Billing", icon: Settings },
  ]

  const faqs = [
    {
      question: "How do I create a new tournament?",
      answer:
        "To create a new tournament, log in to your account and click on the 'Create Tournament' button on your dashboard. Follow the step-by-step wizard to set up your tournament details, format, and settings.",
      category: "tournaments",
    },
    {
      question: "Can I import teams from a spreadsheet?",
      answer:
        "Yes, you can import teams from Excel or CSV files. Go to the Teams section of your tournament, click on 'Import Teams', and follow the instructions to upload your file and map the columns.",
      category: "teams",
    },
    {
      question: "How do I resolve scheduling conflicts?",
      answer:
        "The Schedule Analyzer tool automatically detects conflicts. Go to your tournament schedule, click on 'Analyze Schedule', and the system will highlight conflicts and suggest solutions that you can apply with one click.",
      category: "scheduling",
    },
    {
      question: "How can I change my subscription plan?",
      answer:
        "To change your subscription plan, go to Account Settings > Billing > Subscription. You'll see options to upgrade, downgrade, or cancel your current plan. Changes take effect at the end of your current billing cycle.",
      category: "account",
    },
    {
      question: "How do I add custom fields to team registration?",
      answer:
        "Go to Tournament Settings > Registration > Custom Fields. Click 'Add Field' and specify the field type (text, number, dropdown, etc.), label, and whether it's required. These fields will appear on your registration form.",
      category: "teams",
    },
    {
      question: "Can I generate a printable tournament bracket?",
      answer:
        "Yes, go to your tournament's Brackets page and click on the 'Print' or 'Export PDF' button in the top right corner. You can customize the layout and information displayed before printing.",
      category: "tournaments",
    },
  ]

  const popularArticles = [
    {
      title: "Getting Started with Tourna Master",
      description: "A complete guide to setting up your first tournament",
      category: "getting-started",
      icon: BookOpen,
      views: 4582,
    },
    {
      title: "Advanced Scheduling Techniques",
      description: "Learn how to create optimal schedules for complex tournaments",
      category: "scheduling",
      icon: Calendar,
      views: 3241,
    },
    {
      title: "Managing Team Registrations",
      description: "How to handle team sign-ups, payments, and roster management",
      category: "teams",
      icon: Users,
      views: 2876,
    },
    {
      title: "Troubleshooting Common Issues",
      description: "Solutions to the most frequently reported problems",
      category: "all",
      icon: AlertCircle,
      views: 5123,
    },
  ]

  const recentArticles = [
    {
      title: "Using the New Schedule Analyzer",
      date: "Updated 2 days ago",
      category: "scheduling",
    },
    {
      title: "Setting Up Multi-Stage Tournaments",
      date: "Updated 1 week ago",
      category: "tournaments",
    },
    {
      title: "Customizing Registration Forms",
      date: "Updated 2 weeks ago",
      category: "teams",
    },
  ]

  const filteredFaqs = activeCategory === "all" ? faqs : faqs.filter((faq) => faq.category === activeCategory)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      {/* <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">How can we help you?</h1>
            <p className="text-primary-100 mb-8 text-lg">
              Find answers to your questions and learn how to get the most out of Tourna Master
            </p>
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-primary-500 text-neutral-800 placeholder-neutral-400"
                placeholder="Search for help articles, tutorials, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute inset-y-0 right-0 px-4 py-2 mr-1 my-1 bg-primary-700 hover:bg-primary-800 text-white rounded-lg transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </header> */}

      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        {/* Quick links */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickLinkCard
              title="Knowledge Base"
              description="Browse our comprehensive guides and tutorials"
              icon={BookOpen}
              link="/help/knowledge-base"
              color="bg-primary-600"
            />
            <QuickLinkCard
              title="Video Tutorials"
              description="Watch step-by-step video guides for common tasks"
              icon={Video}
              link="/help/videos"
              color="bg-secondary-600"
            />
            <QuickLinkCard
              title="Contact Support"
              description="Get in touch with our customer support team"
              icon={MessageCircle}
              link="#contact-section"
              color="bg-accent-600"
            />
          </div>
        </section>

        {/* Categories and content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden sticky top-24">
              <div className="p-4 border-b border-neutral-200">
                <h2 className="font-semibold text-neutral-800">Help Topics</h2>
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
              <div className="p-4 bg-neutral-50 border-t border-neutral-200">
                <h3 className="font-medium text-neutral-800 mb-3">Need more help?</h3>
                <Link
                  href="#contact-section"
                  className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  <span>Contact our support team</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Popular articles */}
            <section className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-800">Popular Help Articles</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {popularArticles.map((article, index) => {
                    const Icon = article.icon
                    return (
                      <Link
                        key={index}
                        href={`/help/articles/${article.title.toLowerCase().replace(/\s+/g, "-")}`}
                        className="flex flex-col h-full p-5 rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start mb-3">
                          <div className="p-2 rounded-lg bg-primary-100 text-primary-700 mr-4">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-neutral-800 group-hover:text-primary-600 transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-sm text-neutral-500">{article.description}</p>
                          </div>
                        </div>
                        <div className="mt-auto pt-3 flex items-center justify-between text-xs text-neutral-400">
                          <span className="bg-neutral-100 px-2 py-1 rounded-full">{article.category}</span>
                          <span className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {article.views.toLocaleString()} views
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
              <div className="p-4 bg-neutral-50 border-t border-neutral-200 text-center">
                <Link
                  href="/help/knowledge-base"
                  className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                >
                  <span>Browse all articles</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </section>

            {/* FAQs */}
            <section className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-800">Frequently Asked Questions</h2>
              </div>
              <div className="divide-y divide-neutral-200">
                {isLoading ? (
                  // Loading skeleton
                  Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="p-6 animate-pulse">
                        <div className="flex items-center justify-between">
                          <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
                          <div className="h-5 w-5 bg-neutral-200 rounded-full"></div>
                        </div>
                        <div className="h-16 bg-neutral-100 rounded mt-4 w-full"></div>
                      </div>
                    ))
                ) : filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, index) => (
                    <div key={index} className="p-6">
                      <button
                        className="flex items-center justify-between w-full text-left"
                        onClick={() => toggleFaq(index)}
                      >
                        <h3 className="font-medium text-neutral-800 text-lg">{faq.question}</h3>
                        {expandedFaqs.includes(index) ? (
                          <ChevronDown className="h-5 w-5 text-neutral-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-neutral-400" />
                        )}
                      </button>
                      {expandedFaqs.includes(index) && (
                        <div className="mt-4 text-neutral-600 bg-neutral-50 p-4 rounded-lg">{faq.answer}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-neutral-500">No FAQs found for this category.</p>
                  </div>
                )}
              </div>
              <div className="p-4 bg-neutral-50 border-t border-neutral-200 text-center">
                <Link
                  href="/help/faqs"
                  className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                >
                  <span>View all FAQs</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </section>

            {/* Recent updates */}
            <section className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-800">Recently Updated</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentArticles.map((article, index) => (
                    <Link
                      key={index}
                      href={`/help/articles/${article.title.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-neutral-800 hover:text-primary-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-sm text-neutral-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {article.date}
                        </p>
                      </div>
                      <span className="bg-neutral-100 px-2 py-1 rounded-full text-xs text-neutral-600">
                        {article.category}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* Troubleshooting guides */}
            <section className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-800">Troubleshooting Guides</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TroubleshootingCard
                    title="Schedule Conflicts"
                    description="Resolve overlapping matches and team conflicts"
                    link="/help/troubleshooting/schedule-conflicts"
                  />
                  <TroubleshootingCard
                    title="Registration Issues"
                    description="Fix problems with team and player registration"
                    link="/help/troubleshooting/registration-issues"
                  />
                  <TroubleshootingCard
                    title="Bracket Generation"
                    description="Troubleshoot issues with tournament brackets"
                    link="/help/troubleshooting/bracket-generation"
                  />
                  <TroubleshootingCard
                    title="Results & Standings"
                    description="Fix problems with match results and standings"
                    link="/help/troubleshooting/results-standings"
                  />
                </div>
              </div>
            </section>

            {/* Contact support section */}
            <section
              id="contact-section"
              className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden"
            >
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-800">Contact Support</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <div className="bg-neutral-50 rounded-xl p-6 mb-6">
                      <div className="flex items-start mb-4">
                        <div className="p-2 rounded-lg bg-primary-100 text-primary-700 mr-4">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-neutral-800">Support Hours</h3>
                          <p className="text-neutral-600">
                            Our team is available Monday through Friday, 9:00 AM to 6:00 PM Eastern Time.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="p-2 rounded-lg bg-primary-100 text-primary-700 mr-4">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-neutral-800">Response Time</h3>
                          <p className="text-neutral-600">
                            We typically respond to all inquiries within 24 hours during business days.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                      <div className="flex border-b border-neutral-200">
                        <button
                          className={`flex-1 py-3 px-4 text-center font-medium ${
                            activeChatTab === "chat"
                              ? "text-primary-600 border-b-2 border-primary-600"
                              : "text-neutral-500 hover:text-neutral-700"
                          }`}
                          onClick={() => setActiveChatTab("chat")}
                        >
                          Live Chat
                        </button>
                        <button
                          className={`flex-1 py-3 px-4 text-center font-medium ${
                            activeChatTab === "email"
                              ? "text-primary-600 border-b-2 border-primary-600"
                              : "text-neutral-500 hover:text-neutral-700"
                          }`}
                          onClick={() => setActiveChatTab("email")}
                        >
                          Email Support
                        </button>
                      </div>

                      <div className="p-6">
                        {activeChatTab === "chat" ? (
                          <div>
                            <p className="text-neutral-600 mb-4">
                              Start a live chat with our support team for immediate assistance with your questions.
                            </p>
                            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                              <MessageCircle className="h-5 w-5 mr-2" />
                              Start Live Chat
                            </button>
                          </div>
                        ) : (
                          <div>
                            <p className="text-neutral-600 mb-4">
                              Send us an email and we'll get back to you as soon as possible.
                            </p>
                            <form className="space-y-4">
                              <div>
                                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                                  Your Name
                                </label>
                                <input
                                  type="text"
                                  id="name"
                                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  placeholder="Enter your name"
                                />
                              </div>
                              <div>
                                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                                  Email Address
                                </label>
                                <input
                                  type="email"
                                  id="email"
                                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  placeholder="Enter your email"
                                />
                              </div>
                              <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                                  Subject
                                </label>
                                <input
                                  type="text"
                                  id="subject"
                                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  placeholder="What is your question about?"
                                />
                              </div>
                              <div>
                                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                                  Message
                                </label>
                                <textarea
                                  id="message"
                                  rows={4}
                                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  placeholder="Please describe your issue in detail"
                                ></textarea>
                              </div>
                              <button
                                type="submit"
                                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                              >
                                Send Message
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden h-full">
                      <div className="p-6 border-b border-neutral-200">
                        <h3 className="font-bold text-neutral-800">Other Ways to Reach Us</h3>
                      </div>
                      <div className="p-6 space-y-6">
                        <div className="flex items-start">
                          <div className="p-2 rounded-lg bg-primary-100 text-primary-700 mr-4">
                            <Phone className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-800">Phone Support</h4>
                            <p className="text-neutral-600 mb-2">Available for Premium and Enterprise plans</p>
                            <a href="tel:+18005551234" className="text-primary-600 hover:text-primary-700 font-medium">
                              +1 (800) 555-1234
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="p-2 rounded-lg bg-primary-100 text-primary-700 mr-4">
                            <Mail className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-800">Email</h4>
                            <p className="text-neutral-600 mb-2">For general inquiries</p>
                            <a
                              href="mailto:support@tournamaster.com"
                              className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                              support@tournamaster.com
                            </a>
                          </div>
                        </div>

                        <div className="border-t border-neutral-200 pt-6">
                          <h4 className="font-medium text-neutral-800 mb-4">Connect With Us</h4>
                          <div className="flex space-x-4">
                            <a
                              href="#"
                              className="p-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                              >
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                              </svg>
                            </a>
                            <a
                              href="#"
                              className="p-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                              >
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                              </svg>
                            </a>
                            <a
                              href="#"
                              className="p-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                              >
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                              </svg>
                            </a>
                            <a
                              href="#"
                              className="p-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                              >
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Article feedback */}
            <section className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
              <h3 className="font-bold text-neutral-800 mb-4">Was this help section useful?</h3>
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
                  <ThumbsUp className="h-5 w-5 text-primary-600" />
                  <span>Yes, it helped</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
                  <ThumbsDown className="h-5 w-5 text-neutral-600" />
                  <span>No, I need more help</span>
                </button>
              </div>
            </section>
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

function QuickLinkCard({
  title,
  description,
  icon: Icon,
  link,
  color,
}: {
  title: string
  description: string
  icon: any
  link: string
  color: string
}) {
  return (
    <Link
      href={link}
      className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md hover:border-primary-300 transition-all group"
    >
      <div className="flex items-start">
        <div className={`p-3 rounded-lg ${color} text-white mr-4`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold text-neutral-800 group-hover:text-primary-600 transition-colors">{title}</h3>
          <p className="text-neutral-600">{description}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center text-primary-600 font-medium">
        <span>Learn more</span>
        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  )
}

function TroubleshootingCard({
  title,
  description,
  link,
}: {
  title: string
  description: string
  link: string
}) {
  return (
    <Link
      href={link}
      className="flex items-start p-4 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/30 transition-all group"
    >
      <div className="p-2 rounded-lg bg-red-100 text-red-700 mr-3">
        <AlertCircle className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-medium text-neutral-800 group-hover:text-primary-600 transition-colors">{title}</h3>
        <p className="text-sm text-neutral-600">{description}</p>
        <div className="mt-2 flex items-center text-primary-600 text-sm font-medium">
          <span>View guide</span>
          <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}
