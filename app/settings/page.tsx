"use client"

import { useState } from "react"
import { Save, User, Lock, Bell, Globe, Shield, HelpCircle } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "language", label: "Language", icon: Globe },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "help", label: "Help", icon: HelpCircle },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Settings</h1>
        <p className="text-neutral-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-4 border-b border-neutral-200">
              <h2 className="font-semibold text-neutral-800">Settings</h2>
            </div>
            <nav className="p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-md text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl font-bold text-neutral-800 mb-6">Profile Settings</h2>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="h-12 w-12 text-primary-600" />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-1 rounded-full border-2 border-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-neutral-800">Profile Picture</h3>
                      <p className="text-neutral-500 text-sm mb-3">
                        Upload a new profile picture or avatar for your account
                      </p>
                      <div className="flex space-x-3">
                        <button className="btn btn-sm btn-primary">Upload New</button>
                        <button className="btn btn-sm btn-outline">Remove</button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
                        <input type="text" className="input" defaultValue="John" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
                        <input type="text" className="input" defaultValue="Smith" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                        <input type="email" className="input" defaultValue="john.smith@example.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
                        <input type="tel" className="input" defaultValue="+1 (555) 123-4567" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Bio</label>
                        <textarea
                          className="input min-h-[100px]"
                          defaultValue="Tournament organizer with 5+ years of experience managing football competitions."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-6 flex justify-end">
                    <button className="btn btn-primary flex items-center space-x-2">
                      <Save className="h-5 w-5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h2 className="text-xl font-bold text-neutral-800 mb-6">Security Settings</h2>
                <p className="text-neutral-600 mb-6">Manage your password and account security settings</p>
                {/* Security settings content would go here */}
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h2 className="text-xl font-bold text-neutral-800 mb-6">Notification Settings</h2>
                <p className="text-neutral-600 mb-6">Manage how and when you receive notifications</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-neutral-800">Email Notifications</h3>
                      <p className="text-sm text-neutral-500">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-neutral-800">Match Reminders</h3>
                      <p className="text-sm text-neutral-500">Receive reminders before scheduled matches</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-neutral-800">Result Updates</h3>
                      <p className="text-sm text-neutral-500">Receive updates when match results are posted</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "language" && (
              <div>
                <h2 className="text-xl font-bold text-neutral-800 mb-6">Language Settings</h2>
                <p className="text-neutral-600 mb-6">Choose your preferred language for the application</p>
                <div className="max-w-md">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Language</label>
                  <select className="input">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="vi">Tiếng Việt</option>
                  </select>

                  <div className="mt-6">
                    <button className="btn btn-primary flex items-center space-x-2">
                      <Save className="h-5 w-5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div>
                <h2 className="text-xl font-bold text-neutral-800 mb-6">Privacy Settings</h2>
                <p className="text-neutral-600 mb-6">Manage your privacy preferences</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-neutral-800">Profile Visibility</h3>
                      <p className="text-sm text-neutral-500">Make your profile visible to other users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "help" && (
              <div>
                <h2 className="text-xl font-bold text-neutral-800 mb-6">Help & Support</h2>
                <p className="text-neutral-600 mb-6">Get help with using Tourna Master</p>
                <div className="space-y-4">
                  <div className="p-4 border border-neutral-200 rounded-lg">
                    <h3 className="font-medium text-neutral-800 mb-2">Documentation</h3>
                    <p className="text-sm text-neutral-500 mb-3">
                      Browse our comprehensive documentation to learn how to use all features of Tourna Master.
                    </p>
                    <button className="btn btn-sm btn-outline">View Documentation</button>
                  </div>

                  <div className="p-4 border border-neutral-200 rounded-lg">
                    <h3 className="font-medium text-neutral-800 mb-2">Contact Support</h3>
                    <p className="text-sm text-neutral-500 mb-3">Need help? Contact our support team for assistance.</p>
                    <button className="btn btn-sm btn-outline">Contact Support</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
