'use client'

import { motion } from 'framer-motion'
import { 
  Smartphone, 
  Calendar, 
  FileText, 
  Shield, 
  DollarSign, 
  Star,
  Download,
  CheckCircle,
  ArrowRight,
  Zap,
  Award,
  Users,
  MapPin,
  MessageCircle
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function WorkersPage() {
  const features = [
    {
      icon: FileText,
      title: "AI Resume Builder",
      description: "Our AI writes professional resumes from your skills and experience - no writing needed!",
      highlight: "Professional results"
    },
    {
      icon: Calendar,
      title: "Smart Availability",
      description: "Set your schedule once and get matched with jobs that fit your availability perfectly.",
      highlight: "Work when you want"
    },
    {
      icon: MapPin,
      title: "Location-Based Jobs",
      description: "Find work near you with GPS matching and travel time calculations built-in.",
      highlight: "Work close to home"
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Track your safety record, upload certifications, and maintain your professional credentials.",
      highlight: "Stay certified"
    },
    {
      icon: DollarSign,
      title: "Fair Pay Guarantee",
      description: "Transparent pricing, secure payments, and industry-standard rates for all jobs.",
      highlight: "Get paid fairly"
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description: "Chat directly with employers, ask questions, and build professional relationships.",
      highlight: "Stay connected"
    }
  ]

  const appScreens = [
    {
      title: "Quick Registration",
      description: "Sign up in minutes with photo verification",
      features: ["Photo upload", "Skills selection", "Certification upload"]
    },
    {
      title: "Job Matching",
      description: "Swipe through jobs matched to your skills",
      features: ["Smart matching", "Distance filter", "Pay transparency"]
    },
    {
      title: "Profile & Resume",
      description: "AI-generated professional profiles",
      features: ["Auto resume", "Skill showcase", "Safety record"]
    }
  ]

  const workerTypes = [
    {
      icon: "🏗️",
      title: "Riggers",
      description: "Structural rigging, crane operations, heavy lifting",
      average: "$45-65/hr"
    },
    {
      icon: "🔗",
      title: "Doggers",
      description: "Load securing, crane communication, safety coordination", 
      average: "$40-55/hr"
    },
    {
      icon: "🏗️",
      title: "Crane Operators",
      description: "Mobile crane, tower crane, overhead crane operations",
      average: "$55-80/hr"
    },
    {
      icon: "🦺",
      title: "Safety Officers",
      description: "Site safety, incident management, compliance monitoring",
      average: "$50-70/hr"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-rigger-light via-white to-blue-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rigger-blue/10 to-rigger-orange/10 rounded-full text-sm font-medium text-rigger-blue border border-rigger-blue/20"
              >
                📱 RiggerHub Mobile App
              </motion.div>

              <h1 className="text-5xl sm:text-6xl font-display font-bold leading-tight text-rigger-gray">
                Find Work
                <span className="gradient-text"> That Fits</span>
              </h1>

              <p className="text-xl text-rigger-gray/80 leading-relaxed">
                The smart way to find construction work. Get matched with jobs that fit your skills, schedule, and location. AI builds your resume, we handle the rest.
              </p>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  className="group px-8 py-4 bg-black text-white text-lg font-semibold rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                    📱
                  </div>
                  <div className="text-left">
                    <div className="text-xs opacity-80">Download on the</div>
                    <div className="text-lg font-bold">App Store</div>
                  </div>
                </motion.button>
                
                <motion.button
                  className="group px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-semibold rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                    🤖
                  </div>
                  <div className="text-left">
                    <div className="text-xs opacity-80">Get it on</div>
                    <div className="text-lg font-bold">Google Play</div>
                  </div>
                </motion.button>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-rigger-blue">50k+</div>
                  <div className="text-sm text-rigger-gray/70">Active Workers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rigger-blue">$55/hr</div>
                  <div className="text-sm text-rigger-gray/70">Average Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rigger-blue">4.9★</div>
                  <div className="text-sm text-rigger-gray/70">App Rating</div>
                </div>
              </div>
            </motion.div>

            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative flex justify-center"
            >
              <div className="relative">
                <div className="w-80 h-[600px] bg-black rounded-[3rem] p-4 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="h-12 bg-rigger-blue flex items-center justify-between px-6 text-white text-sm">
                      <span>9:41</span>
                      <span>RiggerHub</span>
                      <span>100%</span>
                    </div>
                    
                    {/* App Content */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gradient-to-r from-rigger-blue to-rigger-orange rounded-full flex items-center justify-center text-white text-2xl">
                          👷
                        </div>
                        <div>
                          <div className="font-semibold">Welcome back, John!</div>
                          <div className="text-sm text-gray-500">3 new job matches</div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">High-Rise Project</span>
                          <span className="text-green-600 font-bold">$65/hr</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          Perth CBD • Senior Rigger • 3 months
                        </div>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-rigger-blue text-white py-2 rounded-lg text-sm font-medium">
                            Apply Now
                          </button>
                          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                            Save
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {[1,2].map((i) => (
                          <div key={i} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-sm">Bridge Construction</span>
                              <span className="text-rigger-blue font-semibold text-sm">$58/hr</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Fremantle • Dogger • 6 weeks
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -left-4 bg-white rounded-full p-3 shadow-lg"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -right-4 bg-white rounded-lg p-2 shadow-lg"
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <span className="text-sm font-semibold text-rigger-blue">💰 $2,400</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Worker Types */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-rigger-gray mb-6">
              Built for Every
              <span className="gradient-text"> Construction Professional</span>
            </h2>
            <p className="text-xl text-rigger-gray/70 max-w-3xl mx-auto">
              Whether you're a rigger, dogger, crane operator, or safety officer, RiggerHub connects you with the right opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workerTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center"
              >
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className="text-xl font-semibold text-rigger-gray mb-3">
                  {type.title}
                </h3>
                <p className="text-rigger-gray/70 text-sm mb-4 leading-relaxed">
                  {type.description}
                </p>
                <div className="inline-block bg-gradient-to-r from-rigger-blue to-rigger-orange text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {type.average}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-rigger-light to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-rigger-gray mb-6">
              Smart Features That
              <span className="gradient-text"> Work For You</span>
            </h2>
            <p className="text-xl text-rigger-gray/70 max-w-3xl mx-auto">
              From AI resume building to smart job matching, every feature is designed to help you find better work faster.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-gradient-to-r from-rigger-blue to-rigger-orange rounded-xl">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {feature.highlight}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-rigger-gray mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-rigger-gray/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Screens */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-rigger-gray mb-6">
              Simple. Smart. 
              <span className="gradient-text">Powerful.</span>
            </h2>
            <p className="text-xl text-rigger-gray/70 max-w-3xl mx-auto">
              Three screens, endless opportunities. The RiggerHub app is designed for busy construction professionals who need results fast.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {appScreens.map((screen, index) => (
              <motion.div
                key={screen.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className="w-48 h-80 bg-gradient-to-br from-rigger-blue/20 to-rigger-orange/20 rounded-3xl mx-auto flex items-center justify-center relative overflow-hidden">
                    <div className="text-6xl">{index === 0 ? '📝' : index === 1 ? '🎯' : '👤'}</div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-3xl"></div>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-rigger-gray mb-4">
                  {screen.title}
                </h3>
                
                <p className="text-rigger-gray/70 mb-6">
                  {screen.description}
                </p>
                
                <div className="space-y-2">
                  {screen.features.map((feature, i) => (
                    <div key={i} className="flex items-center justify-center space-x-2 text-sm text-rigger-gray/80">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-rigger-blue to-rigger-orange">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-display font-bold mb-6">
              Your Next Job is Waiting
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join 50,000+ construction professionals who found better work through RiggerHub. Download the app and start earning more today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <motion.button
                className="px-10 py-5 bg-black text-white font-bold text-lg rounded-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="h-6 w-6" />
                <span>Download for iOS</span>
              </motion.button>
              <motion.button
                className="px-10 py-5 bg-green-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="h-6 w-6" />
                <span>Download for Android</span>
              </motion.button>
            </div>

            <div className="text-sm opacity-80">
              Free to download • No subscription fees • Earn more immediately
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}