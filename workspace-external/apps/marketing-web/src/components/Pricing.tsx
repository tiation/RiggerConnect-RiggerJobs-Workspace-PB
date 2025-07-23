'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Zap, Crown, Building, ArrowRight } from 'lucide-react'

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      icon: Zap,
      price: "$99",
      period: "/month",
      description: "Perfect for small construction teams getting started",
      features: [
        "Up to 25 workers",
        "Basic matching algorithm",
        "Standard safety reporting",
        "Email support",
        "Mobile app access",
        "Basic project management",
        "Certificate tracking",
        "Standard integrations"
      ],
      popular: false,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      name: "Professional",
      icon: Crown,
      price: "$199",
      period: "/month",
      description: "Most popular choice for growing construction companies",
      features: [
        "Up to 100 workers",
        "Advanced AI matching",
        "Real-time safety monitoring",
        "Priority phone support",
        "Advanced analytics",
        "Custom workflows",
        "API access",
        "Advanced integrations",
        "Training management",
        "Compliance automation",
        "24/7 emergency alerts",
        "Custom reporting"
      ],
      popular: true,
      gradient: "from-rigger-blue to-rigger-orange",
      bgGradient: "from-orange-50 to-blue-50"
    },
    {
      name: "Enterprise",
      icon: Building,
      price: "Custom",
      period: "pricing",
      description: "Tailored solution for large construction enterprises",
      features: [
        "Unlimited workers",
        "White-label solution",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced security features",
        "SLA guarantees",
        "On-premise deployment",
        "Custom training",
        "Multi-region support",
        "Advanced compliance",
        "Custom workflows",
        "Priority development"
      ],
      popular: false,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    }
  ]

  const faqs = [
    {
      question: "Is there a free trial?",
      answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required."
    },
    {
      question: "Can I change plans anytime?",
      answer: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle."
    },
    {
      question: "What's included in support?",
      answer: "All plans include comprehensive support. Professional and Enterprise plans include priority phone support and dedicated success managers."
    },
    {
      question: "Do you offer custom solutions?",
      answer: "Yes, our Enterprise plan can be fully customized to meet your specific business needs and integration requirements."
    }
  ]

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-rigger-gray mb-6">
            Choose Your
            <span className="gradient-text"> Perfect Plan</span>
          </h2>
          <p className="text-xl text-rigger-gray/70 max-w-3xl mx-auto mb-8">
            Start with a 14-day free trial. No credit card required. Scale as you grow with flexible pricing that works for teams of all sizes.
          </p>
          
          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center bg-rigger-light rounded-full p-1 mb-12"
          >
            <button className="px-6 py-2 bg-white text-rigger-blue font-medium rounded-full shadow-sm">
              Monthly
            </button>
            <button className="px-6 py-2 text-rigger-gray/70 font-medium rounded-full">
              Yearly (Save 20%)
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className={`relative group ${plan.popular ? 'lg:-mt-8' : ''}`}
            >
              <div className={`relative bg-gradient-to-br ${plan.bgGradient} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border ${plan.popular ? 'border-rigger-orange shadow-xl' : 'border-gray-100'} overflow-hidden h-full`}>
                {/* Popular Badge */}
                {plan.popular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  >
                    <div className={`bg-gradient-to-r ${plan.gradient} text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg`}>
                      Most Popular
                    </div>
                  </motion.div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8 pt-4">
                  <motion.div
                    className={`inline-flex p-4 rounded-full bg-gradient-to-r ${plan.gradient} mb-4`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <plan.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-display font-bold text-rigger-gray mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-rigger-gray">{plan.price}</span>
                    <span className="text-rigger-gray/70 ml-1">{plan.period}</span>
                  </div>
                  
                  <p className="text-rigger-gray/70 text-sm">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 + featureIndex * 0.05 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-rigger-gray">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  className={`w-full px-6 py-4 ${plan.popular 
                    ? `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-xl` 
                    : 'bg-white text-rigger-blue border border-rigger-blue hover:bg-rigger-blue hover:text-white'
                  } font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-3xl font-display font-bold text-rigger-gray mb-12 text-center">
            Frequently Asked Questions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-rigger-light rounded-xl p-6 hover:bg-white hover:shadow-md transition-all duration-300"
              >
                <h4 className="font-semibold text-rigger-gray mb-3">
                  {faq.question}
                </h4>
                <p className="text-rigger-gray/70 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-2xl font-display font-bold text-rigger-gray mb-4">
              30-Day Money-Back Guarantee
            </h3>
            <p className="text-rigger-gray/70 max-w-2xl mx-auto">
              Try Rigger Connect risk-free. If you're not completely satisfied within 30 days, we'll refund your money, no questions asked.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}