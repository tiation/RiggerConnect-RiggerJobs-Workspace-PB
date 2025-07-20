'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  CheckCircle,
  ArrowRight,
  User,
  CreditCard
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CompanyRegistration() {
  const [formData, setFormData] = useState({
    companyName: '',
    abn: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: 'WA',
      postcode: ''
    },
    contactPerson: {
      firstName: '',
      lastName: '',
      position: ''
    },
    companySize: '',
    industry: 'construction',
    password: '',
    confirmPassword: ''
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [abnVerified, setAbnVerified] = useState(false)

  const steps = [
    { number: 1, title: 'Company Details', icon: Building2 },
    { number: 2, title: 'Contact Information', icon: User },
    { number: 3, title: 'Account Setup', icon: CreditCard }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as object,
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const verifyABN = async () => {
    // Simulate ABN verification
    setTimeout(() => {
      setAbnVerified(true)
    }, 1500)
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Company registration:', formData)
    // Handle registration logic here
  }

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
                Join RiggerHub as a
                <span className="gradient-text"> Construction Company</span>
              </h1>
              <p className="text-xl text-rigger-gray/70">
                Start hiring qualified riggers, doggers, and crane operators in minutes
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center items-center mb-12">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    currentStep >= step.number 
                      ? 'bg-rigger-blue border-rigger-blue text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-20 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-rigger-blue' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Registration Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Company Details */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-semibold text-rigger-gray mb-6">
                      Company Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-rigger-gray mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                          placeholder="ABC Construction Pty Ltd"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-rigger-gray mb-2">
                          Australian Business Number (ABN) *
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            name="abn"
                            value={formData.abn}
                            onChange={handleInputChange}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                            placeholder="12 345 678 901"
                            required
                          />
                          <button
                            type="button"
                            onClick={verifyABN}
                            className={`px-4 py-3 rounded-lg font-medium transition-all ${
                              abnVerified 
                                ? 'bg-green-100 text-green-700 border border-green-300' 
                                : 'bg-rigger-blue text-white hover:bg-rigger-blue/90'
                            }`}
                            disabled={abnVerified}
                          >
                            {abnVerified ? '✓ Verified' : 'Verify'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-rigger-gray mb-2">
                          Company Size
                        </label>
                        <select
                          name="companySize"
                          value={formData.companySize}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                        >
                          <option value="">Select company size</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="200+">200+ employees</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-rigger-gray mb-2">
                          Industry
                        </label>
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                        >
                          <option value="construction">Construction</option>
                          <option value="mining">Mining</option>
                          <option value="manufacturing">Manufacturing</option>
                          <option value="infrastructure">Infrastructure</option>
                        </select>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-rigger-gray mb-2">
                        Business Address *
                      </label>
                      <div className="space-y-4">
                        <input
                          type="text"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                          placeholder="Street Address"
                          required
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleInputChange}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                            placeholder="City"
                            required
                          />
                          <select
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleInputChange}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                          >
                            <option value="WA">WA</option>
                            <option value="NSW">NSW</option>
                            <option value="VIC">VIC</option>
                            <option value="QLD">QLD</option>
                            <option value="SA">SA</option>
                            <option value="TAS">TAS</option>
                            <option value="NT">NT</option>
                            <option value="ACT">ACT</option>
                          </select>
                          <input
                            type="text"
                            name="address.postcode"
                            value={formData.address.postcode}
                            onChange={handleInputChange}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                            placeholder="Postcode"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Contact Information */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-semibold text-rigger-gray mb-6">
                      Contact Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-rigger-gray mb-2">
                          Contact Person First Name *
                        </label>
                        <input
                          type="text"
                          name="contactPerson.firstName"
                          value={formData.contactPerson.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                          placeholder="John"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-rigger-gray mb-2">
                          Contact Person Last Name *
                        </label>
                        <input
                          type="text"
                          name="contactPerson.lastName"
                          value={formData.contactPerson.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                          placeholder="Smith"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-rigger-gray mb-2">
                        Position/Title *
                      </label>
                      <input
                        type="text"
                        name="contactPerson.position"
                        value={formData.contactPerson.position}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                        placeholder="HR Manager / Site Manager / Director"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-rigger-gray mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                          placeholder="hiring@company.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-rigger-gray mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                          placeholder="+61 8 1234 5678"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Account Setup */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-semibold text-rigger-gray mb-6">
                      Account Setup
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-rigger-gray mb-2">
                          Password *
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                          placeholder="Create a secure password"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-rigger-gray mb-2">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rigger-blue focus:border-transparent"
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-rigger-blue/10 to-rigger-orange/10 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-rigger-gray mb-4">
                        🎉 Ready to Start Hiring!
                      </h3>
                      <div className="space-y-2 text-sm text-rigger-gray/80">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Access to 50,000+ verified workers</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>AI-powered job posting and matching</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Automated WorkSafe WA compliance</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>14-day free trial - no credit card required</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-rigger-gray/70">
                      By registering, you agree to our Terms of Service and Privacy Policy.
                      Your information is protected and never shared with third parties.
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-8">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 text-rigger-blue border border-rigger-blue rounded-lg hover:bg-rigger-blue hover:text-white transition-all"
                    >
                      Previous
                    </button>
                  ) : <div></div>}

                  {currentStep < 3 ? (
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      className="px-8 py-3 bg-gradient-to-r from-rigger-blue to-rigger-orange text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Next Step</span>
                      <ArrowRight className="h-5 w-5" />
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-rigger-blue to-rigger-orange text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Create Account</span>
                      <CheckCircle className="h-5 w-5" />
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}