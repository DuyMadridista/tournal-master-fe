"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Calendar,
  CheckCircle,
  Trophy,
  Users,
  BarChart3,
  Clock,
  AlertTriangle,
  ChevronRight,
  Zap,
  Sparkles,
  Shield,
  LineChart,
} from "lucide-react"

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("create")

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Navigation */}
      <header className="border-b border-indigo-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-2 rounded-lg">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">Tourna Master</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-neutral-700 hover:text-indigo-600 font-medium transition-colors duration-200">
              Features
            </a>
            <a href="#benefits" className="text-neutral-700 hover:text-indigo-600 font-medium transition-colors duration-200">
              Benefits
            </a>
            <a href="#testimonials" className="text-neutral-700 hover:text-indigo-600 font-medium transition-colors duration-200">
              Testimonials
            </a>
          </nav>
          <div className="flex items-center space-x-5">
            <Link href="/login" className="hidden md:block bg-gradient-to-r from-blue-500 to-indigo-300 text-white rounded-full px-6 py-2.5 font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:scale-105 duration-200 text-neutral-700 hover:text-indigo-600 font-medium transition-colors duration-200">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-full px-6 py-2.5 font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:scale-105 duration-200"
            >
              Start For Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/3 -right-24 w-80 h-80 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 left-1/3 w-72 h-72 bg-indigo-300 rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 text-indigo-800 font-medium text-sm"
              >
                ✨ The ultimate tournament management platform
              </motion.div>
              
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">Smart</span> and <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">Efficient</span>{" "}
                Tournament Management
              </motion.h1>
              <motion.p
                className="text-xl text-neutral-700 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Optimize schedules, detect conflicts, and receive automated improvement suggestions with our
                comprehensive tournament management platform.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-full px-8 py-3.5 text-lg font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:scale-105 duration-200 flex items-center justify-center"
                >
                  <span>Get Started</span>
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Link>
                <a
                  href="#demo"
                  className="rounded-full px-8 py-3.5 text-lg font-medium border-2 border-indigo-200 text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center justify-center"
                >
                  <span>View Demo</span>
                </a>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                className="relative rounded-2xl shadow-xl overflow-hidden border-8 border-white bg-white"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-30"></div>
                <div className="relative rounded-xl overflow-hidden">
                  <Image
                    src="https://d3b9lqvq58doft.cloudfront.net/uploads/image+(3).png?height=600&width=800"
                    alt="Tourna Master Dashboard"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <p className="text-lg font-semibold">Smart and Efficient Tournament Management</p>
                      <p className="text-sm opacity-90">Manage every aspect of the tournament from one place</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-600 text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white rounded-full opacity-10"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center transform transition-transform hover:scale-105 duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <p className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">500+</p>
              <p className="text-sm text-blue-100 font-medium">Tournaments Organized</p>
            </div>
            <div className="text-center transform transition-transform hover:scale-105 duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <p className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">10,000+</p>
              <p className="text-sm text-blue-100 font-medium">Matches Scheduled</p>
            </div>
            <div className="text-center transform transition-transform hover:scale-105 duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <p className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">98%</p>
              <p className="text-sm text-blue-100 font-medium">Customer Satisfaction</p>
            </div>
            <div className="text-center transform transition-transform hover:scale-105 duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <p className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">40%</p>
              <p className="text-sm text-blue-100 font-medium">Time Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-20 right-0 w-72 h-72 bg-indigo-100 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute bottom-20 left-0 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 text-indigo-800 font-medium text-sm">
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">Key Features</h2>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
              Tourna Master provides all the tools you need to create and manage tournament schedules efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={<Calendar className="h-8 w-8 text-indigo-600" />}
                title="Automated Scheduling"
                description="Create optimized tournament schedules with just a few clicks, saving hours of manual planning."
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={<AlertTriangle className="h-8 w-8 text-blue-600" />}
                title="Conflict Detection"
                description="Automatically detect and alert about schedule conflicts, teams playing too many matches, or insufficient rest time."
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={<Sparkles className="h-8 w-8 text-indigo-600" />}
                title="Smart Suggestions"
                description="Receive improvement suggestions for your schedule based on data analysis and optimization rules."
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={<Users className="h-8 w-8 text-blue-600" />}
                title="Team Management"
                description="Track all participating teams and players, including contact information and match history."
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={<BarChart3 className="h-8 w-8 text-indigo-600" />}
                title="Efficiency Analysis"
                description="Evaluate your schedule on a 100-point scale and receive specific suggestions for improvement."
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-blue-600" />}
                title="Automatic Optimization"
                description="Apply optimization suggestions with one click to instantly improve your tournament schedule."
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Schedule Optimization Showcase */}
      <section id="demo" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 text-indigo-800 font-medium text-sm">
              Smart Analysis
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">Schedule Optimization</h2>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
              See how Tourna Master analyzes and improves your tournament schedule
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
            <div className="border-b border-neutral-200">
              <div className="flex">
                <button
                  className={`px-6 py-4 font-medium text-sm ${
                    activeTab === "create" ? "text-primary-600 border-b-2 border-primary-600" : "text-neutral-600"
                  }`}
                  onClick={() => setActiveTab("create")}
                >
                  Create Schedule
                </button>
                <button
                  className={`px-6 py-4 font-medium text-sm ${
                    activeTab === "analyze" ? "text-primary-600 border-b-2 border-primary-600" : "text-neutral-600"
                  }`}
                  onClick={() => setActiveTab("analyze")}
                >
                  Analyze
                </button>
                <button
                  className={`px-6 py-4 font-medium text-sm ${
                    activeTab === "optimize" ? "text-primary-600 border-b-2 border-primary-600" : "text-neutral-600"
                  }`}
                  onClick={() => setActiveTab("optimize")}
                >
                  Optimize
                </button>
              </div>
            </div>
            <div className="p-6">
              {activeTab === "create" && (
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/2">
                    <h3 className="text-xl font-bold text-neutral-900 mb-4">Create Schedules Easily</h3>
                    <p className="text-neutral-700 mb-6">
                      Simply enter basic information about your tournament, participating teams, and timeframe, and
                      Tourna Master will automatically create an optimized schedule for you.
                    </p>
                    <ul className="space-y-3">
                      <FeatureListItem text="Support for various tournament formats" />
                      <FeatureListItem text="Customize match times and venues" />
                      <FeatureListItem text="Automatically balance matches between teams" />
                      <FeatureListItem text="Export schedules in multiple formats" />
                    </ul>
                  </div>
                  <div className="md:w-1/2">
                    <div className="rounded-lg border border-neutral-200 overflow-hidden">
                      <Image
                        src="https://d3b9lqvq58doft.cloudfront.net/uploads/image+(6).png?height=400&width=600"
                        alt="Create Tournament Schedule"
                        width={600}
                        height={400}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "analyze" && (
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/2">
                    <h3 className="text-xl font-bold text-neutral-900 mb-4">Analyze Schedule Efficiency</h3>
                    <p className="text-neutral-700 mb-6">
                      Tourna Master evaluates your schedule based on multiple criteria and provides an overall score
                      along with improvement suggestions.
                    </p>
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Schedule Efficiency Score</span>
                        <span className="text-sm font-bold text-amber-600">68/100</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2.5">
                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "68%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <AnalysisIssue
                        severity="high"
                        issue="Team A plays 3 matches in one day"
                        impact="Affects player performance and health"
                      />
                      <AnalysisIssue
                        severity="medium"
                        issue="Team B has insufficient rest time between matches"
                        impact="May cause fatigue and increase injury risk"
                      />
                      <AnalysisIssue
                        severity="low"
                        issue="Uneven distribution of matches across days"
                        impact="Some days are overloaded, others have few matches"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <div className="rounded-lg border border-neutral-200 overflow-hidden">
                      <Image
                        src="https://d3b9lqvq58doft.cloudfront.net/uploads/image+(5).png?height=400&width=600"
                        alt="Schedule Analysis"
                        width={600}
                        height={400}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "optimize" && (
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/2">
                    <h3 className="text-xl font-bold text-neutral-900 mb-4">Smart Schedule Optimization</h3>
                    <p className="text-neutral-700 mb-6">
                      Receive and apply specific optimization suggestions to improve your tournament schedule instantly.
                    </p>
                    <div className="space-y-4">
                      <OptimizationSuggestion
                        suggestion="Move Team A vs Team C match from 9:00 to 14:00"
                        benefit="Reduces Team A's matches in one day from 3 to 2"
                      />
                      <OptimizationSuggestion
                        suggestion="Swap Team B vs Team D match with Team E vs Team F match"
                        benefit="Increases Team B's rest time between matches from 1 hour to 3 hours"
                      />
                      <OptimizationSuggestion
                        suggestion="Move 2 matches from Saturday to Sunday"
                        benefit="Balances the number of matches across weekdays"
                      />
                    </div>
                    <div className="mt-6">
                      <button className="btn btn-primary rounded-lg px-6 py-2.5 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all">
                        Apply All Suggestions
                      </button>
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <div className="rounded-lg border border-neutral-200 overflow-hidden">
                      <Image
                        src="https://d3b9lqvq58doft.cloudfront.net/uploads/image+(7).png?height=400&width=600"
                        alt="Schedule Optimization"
                        width={600}
                        height={400}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Benefits of Using Tourna Master</h2>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
              Why leading tournament organizers choose Tourna Master
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex">
              <div className="mr-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Save Time</h3>
                <p className="text-neutral-700">
                  Reduce schedule planning time from days to minutes with intelligent automation tools.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Minimize Risk</h3>
                <p className="text-neutral-700">
                  Detect and resolve schedule conflicts before they become major issues.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <LineChart className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Increase Performance</h3>
                <p className="text-neutral-700">
                  Optimize schedules to ensure teams have adequate rest time, leading to better performance.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Better Experience</h3>
                <p className="text-neutral-700">
                  Create a better experience for players, coaches, and spectators with sensible and easy-to-follow
                  schedules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-indigo-200/30 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 text-indigo-800 font-medium text-sm">
              Success Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">What Our Customers Say</h2>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
              Hundreds of tournament organizers trust Tourna Master
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Tourna Master helped us save over 20 hours of scheduling for our 32-team tournament. The analysis tools and optimization suggestions were incredibly useful."
              author="John Smith"
              role="Director, Youth Soccer Championship"
            />
            <TestimonialCard
              quote="The conflict detection feature helped us avoid many headaches. Now we can be confident that our schedule is fair and efficient."
              author="Sarah Johnson"
              role="Head of School Sports Tournament"
            />
            <TestimonialCard
              quote="The user-friendly interface and smart suggestions helped me, someone with little experience, create a professional schedule for our tournament."
              author="Michael Brown"
              role="Community Soccer Club Owner"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full opacity-5"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-white rounded-full opacity-5"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-6 inline-block px-6 py-2 rounded-full bg-white/10 text-white font-medium text-sm"
          >
            Get Started Today
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Ready to optimize your <span className="text-blue-200">tournament schedule</span>?
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-10 max-w-3xl mx-auto text-blue-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Start today and experience the difference with Tourna Master
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link
              href="/signup"
              className="bg-white text-indigo-700 hover:bg-blue-50 rounded-full px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
            >
              <span>Start For Free</span>
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
            <Link
              href="/demo"
              className="bg-transparent border-2 border-white/70 text-white hover:bg-white/10 rounded-full px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center"
            >
              <span>View Demo</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 text-white mb-4">
                <Trophy className="h-6 w-6 text-primary-500" />
                <span className="text-xl font-bold">Tourna Master</span>
              </div>
              <p className="mb-4">
                Tourna Master is a smart tournament management platform that helps optimize schedules and enhance the experience for participants.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    User Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Updates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Partners
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 mt-8 text-sm">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p>&copy; 2023 Tourna Master. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Component for feature cards
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white rounded-xl border border-indigo-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-indigo-200 group relative overflow-hidden">
      {/* Subtle gradient background that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content positioned above the background */}
      <div className="relative z-10">
        <div className="mb-5 p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg inline-block group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="text-xl font-bold text-neutral-900 mb-3">{title}</h3>
        <p className="text-neutral-600">{description}</p>
      </div>
    </div>
  )
}

// Component for feature list items
function FeatureListItem({ text }: { text: string }) {
  return (
    <li className="flex items-start">
      <CheckCircle className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
      <span className="text-neutral-700">{text}</span>
    </li>
  )
}

// Component for analysis issues
function AnalysisIssue({ severity, issue, impact }: { severity: string, issue: string, impact: string }) {
  const severityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    low: "bg-blue-100 text-blue-800 border-blue-200",
  }

  const severityIcons = {
    high: <AlertTriangle className="h-5 w-5 text-red-600" />,
    medium: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    low: <AlertTriangle className="h-5 w-5 text-blue-600" />,
  }

  return (
    <div className={`rounded-lg border p-3 ${severityColors[severity as keyof typeof severityColors]}`}>
      <div className="flex items-start">
        <div className="mr-2 mt-0.5">{severityIcons[severity as keyof typeof severityIcons]}</div>
        <div>
          <h4 className="font-medium">{issue}</h4>
          <p className="text-sm mt-1 opacity-80">{impact}</p>
        </div>
      </div>
    </div>
  )
}

// Component for optimization suggestions
function OptimizationSuggestion({ suggestion, benefit }: { suggestion: string, benefit: string }) {
  return (
    <div className="rounded-lg border border-primary-200 bg-primary-50 p-3">
      <div className="flex items-start">
        <div className="mr-2 mt-0.5">
          <Sparkles className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h4 className="font-medium">{suggestion}</h4>
          <p className="text-sm mt-1 text-neutral-700">{benefit}</p>
          <button className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
            Apply Suggestion
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Component for testimonial cards
function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="mb-4 text-primary-600">
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-neutral-700 mb-6">{quote}</p>
      <div>
        <p className="font-bold text-neutral-900">{author}</p>
        <p className="text-sm text-neutral-500">{role}</p>
      </div>
    </div>
  )
}
