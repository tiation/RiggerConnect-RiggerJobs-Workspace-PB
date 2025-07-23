'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface DemoStep {
  title: string;
  description: string;
  imageUrl: string;
  gif?: string;
}

const demoSteps: DemoStep[] = [
  {
    title: 'Business Dashboard',
    description: 'Enterprise-grade dashboard for managing job postings, worker verification, and compliance tracking.',
    imageUrl: '/screenshots/responsive/business-dashboard-tablet.png',
    gif: '/demos/dashboard-interaction.gif'
  },
  {
    title: 'Job Listings',
    description: 'Streamlined job posting interface with integrated compliance checks and worker matching.',
    imageUrl: '/screenshots/responsive/job-listings-tablet.png',
    gif: '/demos/job-posting-flow.gif'
  },
  {
    title: 'Worker Profiles',
    description: 'Comprehensive worker profiles with certification tracking and safety compliance status.',
    imageUrl: '/screenshots/responsive/worker-profile-tablet.png',
    gif: '/demos/profile-verification.gif'
  }
];

export const PlatformOverview: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          Platform Overview
        </h1>

        <div className="relative bg-gray-800 rounded-lg p-6 shadow-xl">
          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {demoSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentStep === index
                    ? 'bg-gradient-to-r from-cyan-400 to-fuchsia-500'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Main Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-cyan-400">
              {demoSteps[currentStep].title}
            </h2>
            <p className="text-gray-300">{demoSteps[currentStep].description}</p>

            {/* Responsive Image/GIF Container */}
            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-700">
              <Image
                src={demoSteps[currentStep].imageUrl}
                alt={demoSteps[currentStep].title}
                fill
                className="object-cover"
              />
              {demoSteps[currentStep].gif && (
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <Image
                    src={demoSteps[currentStep].gif}
                    alt={`${demoSteps[currentStep].title} interaction`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              className="px-6 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-600 hover:to-fuchsia-600 text-white transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        {/* Interactive Tips */}
        <div className="mt-8 p-6 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">
            Interactive Tips
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Hover over images to see interactive demonstrations</li>
            <li>• Use navigation dots for quick section access</li>
            <li>• Mobile-friendly interface with touch support</li>
            <li>• Keyboard navigation supported (← →)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlatformOverview;
