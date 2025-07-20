'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Wrench } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'For Workers', href: '/workers' },
    { name: 'For Business', href: '/business' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="bg-gradient-to-r from-rigger-blue to-rigger-orange p-2 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold gradient-text">
              Rigger Connect
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-rigger-gray hover:text-rigger-blue transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              className="px-4 py-2 text-rigger-blue border border-rigger-blue rounded-lg hover:bg-rigger-blue hover:text-white transition-all font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-rigger-blue to-rigger-orange text-white rounded-lg hover:shadow-lg transition-all font-medium"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -10px rgba(30, 64, 175, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-rigger-gray" />
            ) : (
              <Menu className="h-6 w-6 text-rigger-gray" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden bg-white rounded-lg shadow-lg mt-2"
        >
          <div className="py-4 space-y-4">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="block px-4 py-2 text-rigger-gray hover:text-rigger-blue transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
                whileHover={{ x: 10 }}
              >
                {item.name}
              </motion.a>
            ))}
            <div className="px-4 pt-4 border-t space-y-2">
              <button className="w-full px-4 py-2 text-rigger-blue border border-rigger-blue rounded-lg hover:bg-rigger-blue hover:text-white transition-all font-medium">
                Sign In
              </button>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-rigger-blue to-rigger-orange text-white rounded-lg hover:shadow-lg transition-all font-medium">
                Get Started
              </button>
            </div>
          </div>
        </motion.div>
      </nav>
    </motion.header>
  )
}