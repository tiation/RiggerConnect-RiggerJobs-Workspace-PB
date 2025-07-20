'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Mike Thompson",
      role: "Construction Manager",
      company: "BuildCorp Industries",
      image: "👷‍♂️",
      rating: 5,
      testimonial: "Rigger Connect transformed our hiring process. We went from weeks to hours finding qualified riggers. Our project efficiency increased by 35% in just three months.",
      stats: "35% efficiency increase"
    },
    {
      name: "Sarah Martinez",
      role: "Safety Director",
      company: "SkyHigh Construction",
      image: "👩‍🔧",
      rating: 5,
      testimonial: "The safety management features are incredible. We've seen a 90% reduction in incidents since implementing Rigger Connect. Our insurance premiums have never been lower.",
      stats: "90% fewer incidents"
    },
    {
      name: "David Chen",
      role: "Project Director",
      company: "Apex Builders",
      image: "👨‍💼",
      rating: 5,
      testimonial: "The ROI was immediate. We saved over $100K in the first year just from reduced recruitment costs and improved project timelines. Best investment we've made.",
      stats: "$100K+ saved annually"
    },
    {
      name: "Lisa Rodriguez",
      role: "Operations Manager",
      company: "Premier Construction",
      image: "👩‍💼",
      rating: 5,
      testimonial: "Customer support is outstanding. The platform is intuitive, and the matching algorithm is spot-on. Our team adoption was seamless.",
      stats: "100% team adoption"
    },
    {
      name: "James Wilson",
      role: "Senior Rigger",
      company: "Independent Contractor",
      image: "👨‍🏭",
      rating: 5,
      testimonial: "As a rigger, this platform changed my career. I get matched with projects that fit my skills perfectly, and the pay is consistently excellent.",
      stats: "40% income increase"
    },
    {
      name: "Amanda Foster",
      role: "Crane Operator",
      company: "Heavy Lift Specialists",
      image: "👩‍🚀",
      rating: 5,
      testimonial: "I love how the platform tracks my certifications and reminds me of renewals. The safety protocols give me confidence on every job site.",
      stats: "Zero safety incidents"
    }
  ]

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-rigger-light to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-rigger-gray mb-6">
            What Our Clients
            <span className="gradient-text"> Say</span>
          </h2>
          <p className="text-xl text-rigger-gray/70 max-w-3xl mx-auto">
            Don't just take our word for it. Hear from construction professionals who have transformed their operations with Rigger Connect.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6">
                  <Quote className="h-6 w-6 text-rigger-blue/20" />
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial */}
                <blockquote className="text-rigger-gray/80 mb-6 leading-relaxed">
                  "{testimonial.testimonial}"
                </blockquote>

                {/* Stats Badge */}
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-rigger-blue to-rigger-orange text-white text-xs font-semibold rounded-full mb-6">
                  {testimonial.stats}
                </div>

                {/* Author */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-rigger-blue to-rigger-orange rounded-full flex items-center justify-center text-white text-xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-semibold text-rigger-gray">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-rigger-gray/70">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-rigger-blue font-medium">
                      {testimonial.company}
                    </p>
                  </div>
                </div>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-rigger-blue/5 to-rigger-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-rigger-blue mb-2">4.9/5</div>
                <div className="text-sm text-rigger-gray/70">Average Rating</div>
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-rigger-blue mb-2">10,000+</div>
                <div className="text-sm text-rigger-gray/70">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-rigger-blue mb-2">95%</div>
                <div className="text-sm text-rigger-gray/70">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-rigger-blue mb-2">24/7</div>
                <div className="text-sm text-rigger-gray/70">Support Available</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-display font-bold text-rigger-gray mb-4">
            Ready to Join Our Success Stories?
          </h3>
          <p className="text-lg text-rigger-gray/70 mb-8 max-w-2xl mx-auto">
            Start your free trial today and discover why thousands of construction professionals trust Rigger Connect.
          </p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-rigger-blue to-rigger-orange text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px -10px rgba(30, 64, 175, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Success Story
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}