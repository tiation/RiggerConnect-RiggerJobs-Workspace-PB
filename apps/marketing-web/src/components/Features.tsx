'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  Shield, 
  Target, 
  Clock, 
  MapPin, 
  Award,
  Zap,
  CheckCircle,
  TrendingUp,
  Phone
} from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Users,
      title: "Smart Workforce Matching",
      description: "AI-powered matching system connects the right skilled riggers with your specific project needs, ensuring perfect fit every time.",
      benefits: ["Skill verification", "Experience matching", "Availability sync", "Performance history"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Comprehensive Safety Management",
      description: "Industry-leading safety protocols with real-time monitoring, incident tracking, and compliance management built-in.",
      benefits: ["Safety certifications", "Incident reporting", "Compliance tracking", "Risk assessment"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Target,
      title: "Project Management Integration",
      description: "Seamlessly integrate with your existing project management tools and workflows for maximum efficiency.",
      benefits: ["Timeline sync", "Resource planning", "Budget tracking", "Progress reporting"],
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Clock,
      title: "Real-Time Communication",
      description: "Instant messaging, video calls, and status updates keep everyone connected and informed throughout the project.",
      benefits: ["Instant messaging", "Video conferencing", "Status updates", "Emergency alerts"],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: MapPin,
      title: "Location-Based Services",
      description: "GPS tracking, geofenced check-ins, and location-based worker matching for optimal resource allocation.",
      benefits: ["GPS tracking", "Geofenced areas", "Travel optimization", "Local talent pool"],
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Award,
      title: "Certification Management",
      description: "Automated tracking of certifications, licenses, and training requirements with renewal reminders and compliance alerts.",
      benefits: ["Auto renewals", "Compliance alerts", "Training tracking", "Skill validation"],
      color: "from-teal-500 to-cyan-500"
    }
  ]

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-rigger-light to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rigger-blue/10 to-rigger-orange/10 rounded-full text-sm font-medium text-rigger-blue border border-rigger-blue/20 mb-6"
          >
            <Zap className="h-4 w-4 mr-2" />
            Powerful Features
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-rigger-gray mb-6">
            Everything You Need to
            <span className="gradient-text"> Succeed</span>
          </h2>
          <p className="text-xl text-rigger-gray/70 max-w-3xl mx-auto">
            From intelligent matching to comprehensive safety management, Rigger Connect provides all the tools you need to build efficient, safe, and successful construction teams.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden h-full">
                {/* Background gradient */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color}`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-display font-bold text-rigger-gray mb-4">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-rigger-gray/70 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <motion.div
                        key={benefit}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + benefitIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-rigger-gray/80">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-rigger-blue to-rigger-orange rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-display font-bold mb-4">
              Ready to Transform Your Workforce Management?
            </h3>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Join thousands of construction professionals who have streamlined their operations with Rigger Connect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-3 bg-white text-rigger-blue font-semibold rounded-xl hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
              </motion.button>
              <motion.button
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-rigger-blue transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}