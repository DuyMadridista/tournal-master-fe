"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Clock,
  Calendar,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Printer,
  Share2,
  BookOpen,
  ChevronRight,
} from "lucide-react"

export default function ArticlePage() {
  const params = useParams()
  const slug = params?.slug as string
  const [article, setArticle] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  useEffect(() => {
    // Simulate fetching article data
    const fetchArticle = async () => {
      setIsLoading(true)
      // In a real app, you would fetch the article data from an API
      // For this example, we'll use a mock article
      setTimeout(() => {
        setArticle({
          id: slug,
          title: "Getting Started with Tourna Master",
          description: "Learn the basics of setting up and managing tournaments with our platform.",
          content: `
            <h2>Introduction to Tourna Master</h2>
            <p>Welcome to Tourna Master, the all-in-one tournament management platform designed to simplify the process of organizing and running sports tournaments. This guide will walk you through the basic steps to get started with our platform.</p>
            
            <h2>Creating Your Account</h2>
            <p>Before you can create and manage tournaments, you'll need to set up your account:</p>
            <ol>
              <li>Visit the Tourna Master homepage and click on "Sign Up"</li>
              <li>Enter your email address and create a password</li>
              <li>Verify your email address by clicking the link sent to your inbox</li>
              <li>Complete your profile by adding your name and organization details</li>
            </ol>
            
            <h2>Creating Your First Tournament</h2>
            <p>Once your account is set up, you can create your first tournament:</p>
            <ol>
              <li>From your dashboard, click on "Create Tournament"</li>
              <li>Enter the tournament name, sport, and date range</li>
              <li>Select the tournament format (knockout, round-robin, groups + knockout, etc.)</li>
              <li>Configure additional settings like team size, scoring system, and venue details</li>
              <li>Click "Create" to finalize your tournament</li>
            </ol>
            
            <h2>Managing Team Registration</h2>
            <p>After creating your tournament, you'll need to set up team registration:</p>
            <ol>
              <li>Go to the "Teams" section of your tournament</li>
              <li>Click on "Registration Settings" to configure your registration form</li>
              <li>Choose between open registration or invitation-only</li>
              <li>Set registration deadlines and any registration fees</li>
              <li>Customize the information you want to collect from teams</li>
            </ol>
            
            <h2>Creating a Schedule</h2>
            <p>Once teams are registered, you can create your tournament schedule:</p>
            <ol>
              <li>Navigate to the "Schedule" section</li>
              <li>Click on "Generate Schedule" to automatically create a balanced schedule</li>
              <li>Alternatively, manually create matches by clicking "Add Match"</li>
              <li>Assign venues, dates, and times to each match</li>
              <li>Use the Schedule Analyzer to identify and resolve any conflicts</li>
            </ol>
            
            <h2>Managing Results</h2>
            <p>During the tournament, you'll need to record match results:</p>
            <ol>
              <li>Go to the "Results" section</li>
              <li>Find the match you want to update and click "Enter Result"</li>
              <li>Enter the scores and any additional statistics</li>
              <li>Click "Save" to update the standings automatically</li>
            </ol>
            
            <h2>Next Steps</h2>
            <p>Now that you understand the basics, explore these advanced features:</p>
            <ul>
              <li>Custom branding to add your logo and colors</li>
              <li>Communication tools to send updates to teams</li>
              <li>Advanced statistics tracking</li>
              <li>Mobile app for on-the-go management</li>
            </ul>
            
            <p>For more detailed information on any of these topics, check out our specific guides in the Knowledge Base.</p>
          `,
          category: "getting-started",
          readTime: "5 min read",
          views: 12543,
          date: "Updated 2 weeks ago",
          author: {
            name: "Sarah Johnson",
            role: "Product Specialist",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          relatedArticles: [
            {
              id: "create-tournament",
              title: "How to Create Your First Tournament",
              category: "tournaments",
            },
            {
              id: "team-registration",
              title: "Setting Up Team Registration",
              category: "teams",
            },
            {
              id: "schedule-optimization",
              title: "Optimizing Tournament Schedules",
              category: "scheduling",
            },
          ],
        })
        setIsLoading(false)
      }, 1000)
    }

    fetchArticle()
  }, [slug])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Link copied to clipboard!")
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.description,
        url: window.location.href,
      })
    } else {
      handleCopyLink()
    }
  }

  const submitFeedback = (helpful: boolean) => {
    setFeedbackSubmitted(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-neutral-200 rounded mb-4"></div>
          <div className="h-4 w-96 bg-neutral-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-neutral-100 rounded-full mb-4">
            <FileText className="h-8 w-8 text-neutral-500" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">Article Not Found</h1>
          <p className="text-neutral-600 mb-6">The article you're looking for doesn't exist or has been moved.</p>
        </div>
        <Link
          href="/help/knowledge-base"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Browse Knowledge Base
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link
              href="/help/knowledge-base"
              className="inline-flex items-center text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Back to Knowledge Base</span>
            </Link>
            <div className="flex space-x-2">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                title="Copy link"
              >
                <Copy className="h-5 w-5" />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                title="Print article"
              >
                <Printer className="h-5 w-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                title="Share article"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Article content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center space-x-2 text-sm text-neutral-500 mb-4">
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                      {article.category}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {article.readTime}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {article.date}
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold text-neutral-800 mb-4">{article.title}</h1>
                  <p className="text-lg text-neutral-600 mb-6">{article.description}</p>

                  <div className="flex items-center space-x-3 mb-8 pb-8 border-b border-neutral-200">
                    <img
                      src={article.author.avatar || "/placeholder.svg?height=40&width=40"}
                      alt={article.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-neutral-800">{article.author.name}</p>
                      <p className="text-sm text-neutral-500">{article.author.role}</p>
                    </div>
                  </div>

                  <div
                    className="prose prose-neutral max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  ></div>

                  <div className="mt-12 pt-6 border-t border-neutral-200">
                    <h3 className="font-bold text-neutral-800 mb-4">Was this article helpful?</h3>
                    {feedbackSubmitted ? (
                      <p className="text-neutral-600">Thank you for your feedback!</p>
                    ) : (
                      <div className="flex space-x-4">
                        <button
                          onClick={() => submitFeedback(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                        >
                          <ThumbsUp className="h-5 w-5 text-primary-600" />
                          <span>Yes, it helped</span>
                        </button>
                        <button
                          onClick={() => submitFeedback(false)}
                          className="flex items-center space-x-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                        >
                          <ThumbsDown className="h-5 w-5 text-neutral-600" />
                          <span>No, I need more help</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                  <div className="p-4 border-b border-neutral-200">
                    <h2 className="font-semibold text-neutral-800">Related Articles</h2>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      {article.relatedArticles.map((related: any) => (
                        <Link
                          key={related.id}
                          href={`/help/articles  => (
                        <Link
                          key={related.id}
                          href={\`/help/articles/${related.id}`}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 transition-colors"
                        >
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 text-neutral-500 mr-2" />
                            <span className="text-sm text-neutral-700 hover:text-primary-600 transition-colors">
                              {related.title}
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-neutral-400" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-primary-50 rounded-xl shadow-sm border border-primary-200 p-4">
                  <h3 className="font-medium text-primary-800 mb-2">Need more help?</h3>
                  <p className="text-sm text-primary-700 mb-3">
                    If you couldn't find what you're looking for, our support team is here to help.
                  </p>
                  <Link
                    href="/help#contact-section"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                  >
                    <span>Contact support</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-8 mt-12">
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
