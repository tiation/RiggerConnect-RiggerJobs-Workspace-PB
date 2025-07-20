'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Shield, Award } from 'lucide-react'

export default function Stats() {
  const stats = [
    {
      icon: Users,
      number: "50,000+",
      label: "Skilled Workers",
      description: "Connected across North America",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      number: "500+",
      label: "Projects Completed",
      description: "Successfully delivered on time",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      number: "99.9%",
      label: "Safety Rating",
      description: "Industry-leading safety record",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Award,
      number: "95%",
      label: "Client Satisfaction",
      description: "Exceeding expectations consistently",
      color: "from-purple-500 to-pink-500"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-rigger-gray mb-6">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-rigger-gray/70 max-w-3xl mx-auto">
            Join thousands of construction professionals who trust Rigger Connect to power their workforce management needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="relative group"
            >
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                {/* Background gradient */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`} />
                
                {/* Icon */}
                <motion.div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-6`}
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </motion.div>

                {/* Number */}
                <motion.div
                  className="text-4xl font-display font-bold text-rigger-gray mb-2"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  viewport={{ once: true }}
                >
                  {stat.number}
                </motion.div>

                {/* Label */}
                <h3 className="text-xl font-semibold text-rigger-gray mb-2">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-rigger-gray/70 text-sm">
                  {stat.description}
                </p>

                {/* Hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-rigger-gray/70 mb-6">
            Ready to join the fastest-growing construction workforce platform?
          </p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-rigger-blue to-rigger-orange text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px -10px rgba(30, 64, 175, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}