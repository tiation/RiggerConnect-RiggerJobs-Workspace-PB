'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Shield, 
  Users, 
  Target,
  ArrowRight,
  CheckCircle 
} from 'lucide-react'

export default function Benefits() {
  const mainBenefits = [
    {
      icon: TrendingUp,
      title: "Increase Productivity by 40%",
      description: "Streamlined workflows and intelligent matching reduce downtime and maximize project efficiency.",
      stats: "40% faster project completion",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: DollarSign,
      title: "Reduce Costs by 30%",
      description: "Eliminate recruitment fees, reduce turnover costs, and optimize resource allocation for maximum ROI.",
      stats: "30% reduction in labor costs",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Improve Safety by 95%",
      description: "Comprehensive safety management and real-time monitoring dramatically reduce workplace incidents.",
      stats: "95% reduction in incidents",
      color: "from-orange-500 to-red-500"
    }
  ]

  const additionalBenefits = [
    {
      icon: Clock,
      title: "Faster Hiring",
      description: "Find and onboard qualified riggers in hours, not weeks."
    },
    {
      icon: Users,
      title: "Better Teams",
      description: "Build cohesive teams with compatible skills and experience."
    },
    {
      icon: Target,
      title: "Project Success",
      description: "Higher completion rates with skilled, verified professionals."
    }
  ]

  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-rigger-gray mb-6">
            Measurable Results for Your
            <span className="gradient-text"> Business</span>
          </h2>
          <p className="text-xl text-rigger-gray/70 max-w-3xl mx-auto">
            Don't just take our word for it. Our clients see real, measurable improvements in their operations from day one.
          </p>
        </motion.div>

        {/* Main Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {mainBenefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden text-center">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <motion.div
                  className={`inline-flex p-6 rounded-full bg-gradient-to-r ${benefit.color} mb-6 mx-auto`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <benefit.icon className="h-8 w-8 text-white" />
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-display font-bold text-rigger-gray mb-4">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-rigger-gray/70 mb-6 leading-relaxed">
                  {benefit.description}
                </p>

                {/* Stats */}
                <motion.div
                  className={`inline-block px-4 py-2 bg-gradient-to-r ${benefit.color} text-white rounded-full text-sm font-semibold`}
                  whileHover={{ scale: 1.05 }}
                >
                  {benefit.stats}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-rigger-light to-white rounded-3xl p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-display font-bold text-rigger-gray mb-4">
              Additional Benefits You'll Love
            </h3>
            <p className="text-lg text-rigger-gray/70 max-w-2xl mx-auto">
              Beyond the major improvements, you'll discover numerous ways Rigger Connect enhances your daily operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-rigger-blue to-rigger-orange p-2 rounded-lg flex-shrink-0">
                  <benefit.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-rigger-gray mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-rigger-gray/70 text-sm">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ROI Calculator Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-rigger-blue to-rigger-orange rounded-2xl p-12 text-white text-center"
        >
          <h3 className="text-3xl font-display font-bold mb-4">
            Calculate Your Potential Savings
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            See how much time and money you could save with Rigger Connect. Most clients see ROI within the first month.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-2xl font-bold mb-2">$50K+</div>
              <div className="text-sm opacity-80">Average Annual Savings</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-2xl font-bold mb-2">200hrs</div>
              <div className="text-sm opacity-80">Time Saved Per Month</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-2xl font-bold mb-2">30 Days</div>
              <div className="text-sm opacity-80">Average ROI Timeline</div>
            </div>
          </div>

          <motion.button
            className="px-8 py-4 bg-white text-rigger-blue font-semibold rounded-xl hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Calculate Your ROI</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}