'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Users, 
  PlusCircle, 
  Search, 
  BarChart3,
  Calendar,
  FileText,
  Star,
  Clock,
  DollarSign,
  MapPin,
  Filter,
  MoreHorizontal,
  Eye,
  MessageCircle,
  CheckCircle,
  XCircle,
  Sparkles,
  TrendingUp,
  UserCheck
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    {
      title: 'Active Job Postings',
      value: '12',
      change: '+3 this week',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Applications',
      value: '89',
      change: '+24 this week',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Successful Hires',
      value: '7',
      change: '+2 this month',
      icon: UserCheck,
      color: 'bg-purple-500'
    },
    {
      title: 'Average Time to Hire',
      value: '2.3 days',
      change: '-0.5 days',
      icon: Clock,
      color: 'bg-orange-500'
    }
  ]

  const recentJobs = [
    {
      id: 1,
      title: 'Senior Rigger - High Rise Construction',
      location: 'Perth CBD',
      postedDate: '2 days ago',
      applications: 15,
      status: 'Active',
      urgency: 'High',
      salary: '$65/hr'
    },
    {
      id: 2,
      title: 'Dogger - Bridge Project',
      location: 'Fremantle',
      postedDate: '5 days ago',
      applications: 8,
      status: 'Active',
      urgency: 'Medium',
      salary: '$55/hr'
    },
    {
      id: 3,
      title: 'Crane Operator - Mining Site',
      location: 'Kalgoorlie',
      postedDate: '1 week ago',
      applications: 23,
      status: 'Interviewing',
      urgency: 'High',
      salary: '$75/hr'
    }
  ]

  const recentApplications = [
    {
      id: 1,
      workerName: 'John Smith',
      position: 'Senior Rigger - High Rise Construction',
      experience: '8 years',
      rating: 4.9,
      appliedDate: '1 hour ago',
      status: 'New',
      hourlyRate: '$62/hr'
    },
    {
      id: 2,
      workerName: 'Mike Johnson',
      position: 'Dogger - Bridge Project',
      experience: '5 years',
      rating: 4.7,
      appliedDate: '3 hours ago',
      status: 'Reviewed',
      hourlyRate: '$53/hr'
    },
    {
      id: 3,
      workerName: 'Sarah Wilson',
      position: 'Crane Operator - Mining Site',
      experience: '12 years',
      rating: 5.0,
      appliedDate: '1 day ago',
      status: 'Interview',
      hourlyRate: '$73/hr'
    }
  ]

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'jobs', name: 'Job Postings', icon: FileText },
    { id: 'applications', name: 'Applications', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20">
        {/* Dashboard Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-3xl font-display font-bold text-rigger-gray">
                  Welcome back, ABC Construction
                </h1>
                <p className="text-rigger-gray/70">
                  Manage your workforce, track applications, and grow your team
                </p>
              </div>
              
              <div className="flex space-x-3">
                <motion.button
                  className="px-6 py-3 bg-white text-rigger-blue border border-rigger-blue rounded-lg hover:bg-rigger-blue hover:text-white transition-all flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="h-5 w-5" />
                  <span>Browse Workers</span>
                </motion.button>
                
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-rigger-blue to-rigger-orange text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Post New Job</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                    activeTab === tab.id
                      ? 'border-rigger-blue text-rigger-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                        <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-rigger-blue to-rigger-orange rounded-xl p-6 text-white">
                <h2 className="text-xl font-semibold mb-4">🚀 Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left hover:bg-white/30 transition-all">
                    <Sparkles className="h-6 w-6 mb-2" />
                    <div className="font-semibold">AI Job Generator</div>
                    <div className="text-sm opacity-90">Create job posts in seconds</div>
                  </button>
                  <button className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left hover:bg-white/30 transition-all">
                    <Search className="h-6 w-6 mb-2" />
                    <div className="font-semibold">Find Workers</div>
                    <div className="text-sm opacity-90">Browse available talent</div>
                  </button>
                  <button className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left hover:bg-white/30 transition-all">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    <div className="font-semibold">View Reports</div>
                    <div className="text-sm opacity-90">Track hiring performance</div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Jobs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Job Postings</h2>
                    <button className="text-rigger-blue hover:text-rigger-blue/80">View All</button>
                  </div>
                  
                  <div className="space-y-4">
                    {recentJobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{job.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            job.urgency === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {job.urgency}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{job.postedDate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{job.salary}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {job.applications} applications
                          </span>
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            job.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
                    <button className="text-rigger-blue hover:text-rigger-blue/80">View All</button>
                  </div>
                  
                  <div className="space-y-4">
                    {recentApplications.map((app) => (
                      <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{app.workerName}</h3>
                            <p className="text-sm text-gray-600">{app.position}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            app.status === 'New' ? 'bg-blue-100 text-blue-700' : 
                            app.status === 'Reviewed' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-green-100 text-green-700'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span>{app.experience} experience</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{app.rating}</span>
                          </div>
                          <span>{app.hourlyRate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Applied {app.appliedDate}</span>
                          <div className="flex space-x-2">
                            <button className="p-1 text-rigger-blue hover:bg-rigger-blue/10 rounded">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other tabs content would go here */}
          {activeTab !== 'overview' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FileText className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {tabs.find(tab => tab.id === activeTab)?.name} Section
              </h3>
              <p className="text-gray-600">
                This section is under development. Full functionality coming soon!
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}