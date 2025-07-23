'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  FileText,
  Clock,
  Target,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Wand2,
  Edit3
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PostJobPage() {
  const [useAI, setUseAI] = useState(true)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [generatedJob, setGeneratedJob] = useState('')

  const [jobData, setJobData] = useState({
    title: '',
    workType: '',
    location: {
      address: '',
      city: '',
      state: 'WA'
    },
    duration: {
      startDate: '',
      endDate: '',
      type: 'temporary'
    },
    requirements: {
      experience: '',
      certifications: [],
      skills: []
    },
    compensation: {
      hourlyRate: '',
      overtimeRate: '',
      paymentTerms: 'weekly'
    },
    description: '',
    urgency: 'medium',
    basicRequirements: ''
  })

  const workTypes = [
    { value: 'rigger', label: 'Rigger', icon: '🏗️' },
    { value: 'dogger', label: 'Dogger', icon: '🔗' },
    { value: 'crane_operator', label: 'Crane Operator', icon: '🏗️' },
    { value: 'safety_officer', label: 'Safety Officer', icon: '🦺' }
  ]

  const certificationOptions = [
    'Rigging License',
    'Dogger License', 
    'Crane Operator License',
    'White Card',
    'Working at Heights',
    'First Aid Certificate',
    'Safety Officer Certification'
  ]

  const skillOptions = [
    'Heavy Lifting',
    'Crane Operation',
    'Safety Management',
    'Team Leadership',
    'Equipment Maintenance',
    'Load Calculations',
    'Site Coordination'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setJobData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as object,
          [child]: value
        }
      }))
    } else {
      setJobData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const generateJobWithAI = async () => {
    setLoading(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedJob(`
**Senior Rigger - High Rise Construction Project**

We are seeking an experienced and safety-focused Senior Rigger to join our dynamic construction team for an exciting high-rise development project in Perth CBD. This is an excellent opportunity for a skilled professional to work on a landmark building that will define the city's skyline.

**Key Responsibilities:**
• Plan and execute complex rigging operations for high-rise construction
• Ensure all lifting operations comply with WorkSafe WA regulations
• Coordinate with crane operators and site supervisors
• Conduct pre-lift inspections and risk assessments
• Mentor junior team members and maintain safety standards

**Essential Requirements:**
• Current Rigging License (High Risk Work License)
• Minimum 5 years of rigging experience in high-rise construction
• White Card and Working at Heights certification
• Strong understanding of load calculations and lifting procedures
• Excellent communication and leadership skills

**What We Offer:**
• Competitive hourly rate of $65 per hour
• Overtime rates at 1.5x standard rate
• Weekly pay cycle
• Career development opportunities
• Comprehensive safety training and equipment provided

**Project Details:**
• Duration: 6-month contract with potential for extension
• Location: Perth CBD with easy access to public transport
• Start Date: Immediate
• Full-time position, Monday to Friday with occasional Saturday work

Join our award-winning team and contribute to Perth's most exciting construction project. We prioritize safety, professionalism, and career growth for all team members.
      `)
      setLoading(false)
      setStep(2)
    }, 3000)
  }

  const steps = [
    { number: 1, title: 'Job Details', icon: FileText },
    { number: 2, title: 'Review & Edit', icon: Edit3 },
    { number: 3, title: 'Publish', icon: Target }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-20 pb-16 bg-gradient-to-br from-rigger-light via-white to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-display font-bold text-rigger-gray mb-4">
                Post a New Job
                <span className="gradient-text"> Opening</span>
              </h1>
              <p className="text-xl text-rigger-gray/70">
                Find qualified riggers, doggers, and crane operators with AI-powered job posting
              </p>
            </div>

            {/* AI Toggle */}
            <div className="bg-gradient-to-r from-rigger-blue/10 to-rigger-orange/10 rounded-2xl p-6 mb-8 border border-rigger-blue/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-rigger-blue to-rigger-orange rounded-xl">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-rigger-gray">
                      AI-Powered Job Posting
                    </h3>
                    <p className="text-rigger-gray/70">
                      Let AI create compelling job descriptions from your basic requirements
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setUseAI(!useAI)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    useAI ? 'bg-rigger-blue' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      useAI ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center items-center mb-12">
              {steps.map((stepItem, index) => (
                <div key={stepItem.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    step >= stepItem.number 
                      ? 'bg-rigger-blue border-rigger-blue text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {step > stepItem.number ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <stepItem.icon className="h-6 w-6" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-20 h-0.5 mx-4 ${
                      step > stepItem.number ? 'bg-rigger-blue' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Step 1: Job Details */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {useAI ? (
                    /* AI Mode */
                    <div className="space-y-6">
                      <div className="text-center">
                        <Wand2 className="h-16 w-16 text-rigger-blue mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-rigger-gray mb-4">
                          AI Job Generator
                        </h2>
                        <p className="text-rigger-gray/70 mb-8">
                          Describe your job requirements in simple terms, and our AI will create a professional job posting for you.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-rigger-gray mb-2">
                          Describe the job you need to post *
                        </label>
                        <textarea
                          name="basicRequirements"
                          value={jobData.basicRequirements}
                          onChange={handleInputChange}
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                          placeholder="Example: Need a senior rigger for a 6-month high-rise construction project in Perth CBD. Must have rigging license and 5+ years experience. Paying $65/hour with overtime available. Starting immediately."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-rigger-gray mb-2">
                            Job Type *
                          </label>
                          <select
                            name="workType"
                            value={jobData.workType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                            required
                          >
                            <option value="">Select job type</option>
                            {workTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.icon} {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-rigger-gray mb-2">
                            Urgency Level
                          </label>
                          <select
                            name="urgency"
                            value={jobData.urgency}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                          >
                            <option value="low">🟢 Low - Standard hiring timeline</option>
                            <option value="medium">🟡 Medium - Need to fill soon</option>
                            <option value="high">🔴 High - Urgent hire needed</option>
                          </select>
                        </div>
                      </div>

                      {loading ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rigger-blue mx-auto mb-4"></div>
                          <h3 className="text-xl font-semibold text-rigger-gray mb-2">
                            AI is creating your job post...
                          </h3>
                          <p className="text-rigger-gray/70">
                            Analyzing requirements and generating professional content
                          </p>
                        </div>
                      ) : (
                        <motion.button
                          onClick={generateJobWithAI}
                          className="w-full px-8 py-4 bg-gradient-to-r from-rigger-blue to-rigger-orange text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-3"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={!jobData.basicRequirements || !jobData.workType}
                        >
                          <Sparkles className="h-6 w-6" />
                          <span>Generate Job Post with AI</span>
                          <ArrowRight className="h-5 w-5" />
                        </motion.button>
                      )}
                    </div>
                  ) : (
                    /* Manual Mode */
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold text-rigger-gray mb-6">
                        Manual Job Posting
                      </h2>

                      <div>
                        <label className="block text-sm font-medium text-rigger-gray mb-2">
                          Job Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={jobData.title}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                          placeholder="Senior Rigger - High Rise Construction"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-rigger-gray mb-2">
                            Job Type *
                          </label>
                          <select
                            name="workType"
                            value={jobData.workType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                            required
                          >
                            <option value="">Select job type</option>
                            {workTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.icon} {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-rigger-gray mb-2">
                            Hourly Rate *
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                              type="number"
                              name="compensation.hourlyRate"
                              value={jobData.compensation.hourlyRate}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                              placeholder="65"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-rigger-gray mb-2">
                          Job Description *
                        </label>
                        <textarea
                          name="description"
                          value={jobData.description}
                          onChange={handleInputChange}
                          rows={8}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                          placeholder="Describe the role, responsibilities, requirements, and what you're offering..."
                          required
                        />
                      </div>

                      <motion.button
                        onClick={() => setStep(2)}
                        className="w-full px-8 py-4 bg-gradient-to-r from-rigger-blue to-rigger-orange text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!jobData.title || !jobData.workType || !jobData.description}
                      >
                        <span>Continue to Review</span>
                        <ArrowRight className="h-5 w-5" />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Review & Edit */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-rigger-gray mb-6">
                    Review Your Job Post
                  </h2>

                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="prose prose-lg max-w-none">
                      <div className="whitespace-pre-line text-rigger-gray">
                        {useAI ? generatedJob : jobData.description}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-green-800 mb-2">
                          AI Optimization Complete
                        </h3>
                        <div className="text-sm text-green-700 space-y-1">
                          <div>✓ WorkSafe WA compliance keywords included</div>
                          <div>✓ Industry-standard compensation mentioned</div>
                          <div>✓ Professional tone and structure applied</div>
                          <div>✓ SEO optimized for better visibility</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 px-6 py-3 text-rigger-blue border border-rigger-blue rounded-lg hover:bg-rigger-blue hover:text-white transition-all"
                    >
                      Edit Job Details
                    </button>
                    <motion.button
                      onClick={() => setStep(3)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-rigger-blue to-rigger-orange text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Publish Job Post
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Publish */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center space-y-8"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-rigger-blue to-rigger-orange rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-semibold text-rigger-gray mb-4">
                      Job Posted Successfully! 🎉
                    </h2>
                    <p className="text-xl text-rigger-gray/70 mb-8">
                      Your job posting is now live and visible to over 50,000 qualified workers
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-rigger-blue/10 to-rigger-orange/10 rounded-xl p-6">
                    <h3 className="font-semibold text-rigger-gray mb-4">What happens next?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-rigger-blue rounded-full flex items-center justify-center text-white font-semibold mx-auto mb-2">1</div>
                        <div className="font-medium">Instant Visibility</div>
                        <div className="text-gray-600">Your job appears in worker feeds immediately</div>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-rigger-blue rounded-full flex items-center justify-center text-white font-semibold mx-auto mb-2">2</div>
                        <div className="font-medium">AI Matching</div>
                        <div className="text-gray-600">We notify qualified workers about your opportunity</div>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-rigger-blue rounded-full flex items-center justify-center text-white font-semibold mx-auto mb-2">3</div>
                        <div className="font-medium">Applications</div>
                        <div className="text-gray-600">Receive applications from interested workers</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                      className="px-8 py-3 bg-gradient-to-r from-rigger-blue to-rigger-orange text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Dashboard
                    </motion.button>
                    <motion.button
                      className="px-8 py-3 bg-white text-rigger-blue border border-rigger-blue rounded-lg hover:bg-rigger-blue hover:text-white transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Post Another Job
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}