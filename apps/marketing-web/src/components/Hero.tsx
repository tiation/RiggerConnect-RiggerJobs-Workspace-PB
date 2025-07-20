'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, CheckCircle } from 'lucide-react'

export default function Hero() {
  const features = [
    "Connect with verified skilled riggers",
    "Real-time project matching",
    "Comprehensive safety tracking",
    "24/7 support and monitoring"
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-rigger-light via-white to-blue-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-rigger-blue to-rigger-orange rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-rigger-orange to-rigger-blue rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
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
              🚀 The Future of Construction Workforce Management
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight"
            >
              Connect. Build.{' '}
              <span className="gradient-text">Excel.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-rigger-gray leading-relaxed max-w-2xl"
            >
              Rigger Connect is the premier platform connecting skilled riggers, crane operators, and safety professionals with construction projects. Streamline your workforce management and build safer, more efficient teams.
            </motion.p>

            {/* Feature List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-rigger-gray">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.a
                href="https://tiation.net/business/"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-gradient-to-r from-rigger-blue to-rigger-orange text-white text-lg font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 40px -10px rgba(30, 64, 175, 0.4)" 
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.a
                href="https://tiation.net/workers/"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-white text-rigger-blue border-2 border-rigger-blue text-lg font-semibold rounded-xl hover:bg-rigger-blue hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="h-5 w-5" />
                <span>Find Workers</span>
              </motion.a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex items-center space-x-8 pt-8"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-rigger-blue">500+</div>
                <div className="text-sm text-rigger-gray">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-rigger-blue">50k+</div>
                <div className="text-sm text-rigger-gray">Workers Connected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-rigger-blue">99.9%</div>
                <div className="text-sm text-rigger-gray">Safety Rating</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image/Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <motion.div
              className="relative z-10"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Main illustration - Construction worker with crane background */}
              <div className="w-full h-96 bg-gradient-to-br from-rigger-blue/20 to-rigger-orange/20 rounded-3xl flex items-center justify-center relative overflow-hidden">
                <motion.div
                  className="text-8xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  🏗️
                </motion.div>
                
                {/* Floating elements */}
                <motion.div
                  className="absolute top-8 right-8 bg-white rounded-full p-3 shadow-lg"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </motion.div>
                
                <motion.div
                  className="absolute bottom-8 left-8 bg-white rounded-full p-3 shadow-lg"
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  ⚡
                </motion.div>

                <motion.div
                  className="absolute top-1/2 left-8 bg-white rounded-lg p-2 shadow-lg"
                  animate={{ x: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-sm font-semibold text-rigger-blue">
                    🎯 Perfect Match!
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-rigger-blue/5 to-rigger-orange/5 rounded-3xl transform rotate-6 scale-105"></div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  )
}