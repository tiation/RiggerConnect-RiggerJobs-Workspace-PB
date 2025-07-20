'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, CheckCircle, Users, Shield, Zap } from 'lucide-react'

export default function CTA() {
  const quickStats = [
    { icon: Users, text: "50,000+ Workers" },
    { icon: Shield, text: "99.9% Safety Rating" },
    { icon: Zap, text: "40% Faster Hiring" }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-rigger-blue to-rigger-orange overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-white rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/30"
            >
              🚀 Join the Construction Revolution
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              Ready to Transform
              <br />
              <span className="text-yellow-300">Your Workforce?</span>
            </h2>
            
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Join thousands of construction professionals who have revolutionized their operations with Rigger Connect. Start your free trial today and see results in 24 hours.
            </p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-8 mb-12"
            >
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
                >
                  <stat.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{stat.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            <motion.button
              className="group px-10 py-5 bg-white text-rigger-blue text-lg font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-3 min-w-[250px] justify-center"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px -10px rgba(0, 0, 0, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              className="group px-10 py-5 bg-transparent border-2 border-white text-white text-lg font-bold rounded-2xl hover:bg-white hover:text-rigger-blue transition-all duration-300 flex items-center space-x-3 min-w-[250px] justify-center backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="h-5 w-5" />
              <span>Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
            
            <p className="text-sm opacity-60">
              Trusted by 10,000+ construction professionals worldwide
            </p>
          </motion.div>

          {/* Urgency Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto"
          >
            <div className="text-2xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3">
              Limited Time: Get 2 Months Free
            </h3>
            <p className="text-sm opacity-90 mb-4">
              Sign up before the end of the month and get your first two months absolutely free. Plus, lock in today's pricing for life.
            </p>
            <div className="text-xs opacity-70">
              Offer expires in: 
              <span className="font-mono bg-white/20 px-2 py-1 rounded ml-2">
                15 days 12:34:56
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 text-6xl opacity-10"
        animate={{ 
          y: [-10, 10, -10],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        🏗️
      </motion.div>
      
      <motion.div
        className="absolute bottom-20 right-10 text-4xl opacity-10"
        animate={{ 
          y: [10, -10, 10],
          rotate: [0, -5, 5, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
      >
        ⚙️
      </motion.div>
    </section>
  )
}