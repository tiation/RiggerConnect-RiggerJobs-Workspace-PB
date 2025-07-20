'use client'

import { motion } from 'framer-motion'
import { 
  Building2, 
  Users, 
  Search, 
  FileText, 
  CreditCard, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Target
} from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function BusinessPortal() {
  const features = [
    {
      icon: Sparkles,
      title: "AI Job Posting",
      description: "Transform basic requirements into compelling job advertisements that attract top talent.",
      benefit: "3x more applications"
    },
    {
      icon: Search,
      title: "Smart Worker Matching",
      description: "Advanced filtering and AI-powered matching connects you with qualified riggers instantly.",
      benefit: "75% faster hiring"
    },
    {
      icon: FileText,
      title: "Automated Compliance",
      description: "WorkSafe WA reporting, tax obligations, and documentation handled automatically.",
      benefit: "Zero compliance issues"
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Built-in escrow and payment processing for recruitment fees and contractor payments.",
      benefit: "100% payment security"
    },
    {
      icon: BarChart3,
      title: "Hiring Analytics",
      description: "Track your hiring performance, worker quality, and project outcomes with detailed insights.",
      benefit: "Data-driven decisions"
    },
    {
      icon: Shield,
      title: "Safety Management",
      description: "Monitor worker safety records, incident reports, and maintain compliance automatically.",
      benefit: "99.9% safety rating"
    }
  ]

  const steps = [
    {
      number: "01",
      title: "Quick Registration",
      description: "Register your company with ABN verification in under 2 minutes",
      icon: Building2
    },
    {
      number: "02", 
      title: "Post Jobs with AI",
      description: "Our AI writes compelling job ads from your basic requirements",
      icon: Sparkles
    },
    {
      number: "03",
      title: "Review Applications",
      description: "Get matched with pre-verified, qualified workers automatically",
      icon: Users
    },
    {
      number: "04",
      title: "Hire & Pay Securely",
      description: "Complete the hire with built-in payments and compliance handling",
      icon: CreditCard
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
                🏢 For Construction Companies
              </motion.div>

              <h1 className="text-5xl sm:text-6xl font-display font-bold leading-tight text-rigger-gray">
                Hire Top Riggers
                <span className="gradient-text"> Instantly</span>
              </h1>

              <p className="text-xl text-rigger-gray/80 leading-relaxed">
                Post jobs, find qualified workers, and manage your entire construction workforce from one powerful platform. AI-powered job posting and automatic compliance included.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register/company">
                  <motion.button
                    className="group px-8 py-4 bg-gradient-to-r from-rigger-blue to-rigger-orange text-white text-lg font-semibold rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Start Hiring Today</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                
                <motion.button
                  className="px-8 py-4 bg-white text-rigger-blue border-2 border-rigger-blue text-lg font-semibold rounded-xl hover:bg-rigger-blue hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Watch Demo
                </motion.button>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-rigger-blue">2 min</div>
                  <div className="text-sm text-rigger-gray/70">Setup Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rigger-blue">50k+</div>
                  <div className="text-sm text-rigger-gray/70">Available Workers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rigger-blue">24hrs</div>
                  <div className="text-sm text-rigger-gray/70">Average Hire Time</div>
                </div>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-500 ml-4">RiggerHub Business Portal</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-rigger-blue/10 to-rigger-orange/10 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Sparkles className="h-5 w-5 text-rigger-blue" />
                        <span className="font-semibold">AI Writing Job Post...</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        "Seeking experienced rigger for high-rise construction project..."
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {[1,2,3].map((i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-gradient-to-r from-rigger-blue to-rigger-orange rounded-full flex items-center justify-center text-white font-semibold">
                            {i}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">John Smith - Senior Rigger</div>
                            <div className="text-xs text-gray-500">98% Match • Available Now</div>
                          </div>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
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
              Hire Workers in
              <span className="gradient-text"> 4 Simple Steps</span>
            </h2>
            <p className="text-xl text-rigger-gray/70 max-w-3xl mx-auto">
              Our streamlined process gets you from job posting to hire in under 24 hours, with AI assistance every step of the way.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-rigger-blue to-rigger-orange rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                    {step.number}
                  </div>
                  
                  <div className="absolute -top-2 -right-2">
                    <step.icon className="h-8 w-8 text-rigger-blue" />
                  </div>

                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-rigger-blue to-rigger-orange opacity-30"></div>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-rigger-gray mb-3">
                  {step.title}
                </h3>
                <p className="text-rigger-gray/70">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
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
              Everything You Need to
              <span className="gradient-text"> Scale Your Team</span>
            </h2>
            <p className="text-xl text-rigger-gray/70 max-w-3xl mx-auto">
              From AI-powered job posting to automated compliance, we handle the complexity so you can focus on building.
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
                    <div className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      {feature.benefit}
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
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join hundreds of construction companies who've streamlined their hiring with RiggerHub. Start your free trial today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register/company">
                <motion.button
                  className="px-10 py-5 bg-white text-rigger-blue font-bold text-lg rounded-xl hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Free Trial
                </motion.button>
              </Link>
              <motion.button
                className="px-10 py-5 border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white hover:text-rigger-blue transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule Demo
              </motion.button>
            </div>

            <div className="mt-8 text-sm opacity-80">
              No credit card required • 14-day free trial • Cancel anytime
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}