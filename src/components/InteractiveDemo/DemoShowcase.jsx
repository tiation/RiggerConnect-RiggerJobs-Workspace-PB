import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

const DemoShowcase = () => {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  const demos = [
    {
      id: 'job-matching',
      title: 'AI-Powered Job Matching',
      description: 'Experience our intelligent job matching algorithm that connects riggers with perfect opportunities in Western Australia\'s mining industry.',
      features: ['Smart Skills Matching', 'Location-Based Search', 'Salary Optimization', 'Real-time Updates'],
      component: 'JobMatchingDemo',
      duration: 8000,
    },
    {
      id: 'document-management',
      title: 'Document Management System',
      description: 'Streamlined document upload, verification, and compliance tracking for all your certifications and qualifications.',
      features: ['Drag & Drop Upload', 'Auto Verification', 'Compliance Tracking', 'Expiry Alerts'],
      component: 'DocumentDemo',
      duration: 6000,
    },
    {
      id: 'analytics-dashboard',
      title: 'Advanced Analytics Dashboard',
      description: 'Comprehensive insights into your job search performance, market trends, and career progression opportunities.',
      features: ['Performance Metrics', 'Market Analysis', 'Trend Predictions', 'Custom Reports'],
      component: 'AnalyticsDemo',
      duration: 7000,
    },
    {
      id: 'mobile-experience',
      title: 'Mobile-First Experience',
      description: 'Fully responsive design optimized for mobile devices with native app-like performance and offline capabilities.',
      features: ['Offline Mode', 'Push Notifications', 'Touch Optimized', 'Dark Theme'],
      component: 'MobileDemo',
      duration: 5000,
    }
  ];

  const JobMatchingDemo = ({ isActive, step }) => (
    <div className="relative h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Search Interface */}
      <div className={`absolute top-4 left-4 right-4 transition-all duration-1000 ${isActive ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'}`}>
        <div className="bg-gray-700/80 backdrop-blur-xl rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="text-sm text-gray-300">Searching for: "Senior Rigger - Mining"</div>
              <div className="text-xs text-cyan-400">Location: Perth, WA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Cards */}
      <div className="absolute top-20 left-4 right-4 space-y-3">
        {[
          { company: 'BHP Billiton', role: 'Senior Rigger', match: '98%', salary: '$85,000' },
          { company: 'Rio Tinto', role: 'Lead Rigger', match: '94%', salary: '$92,000' },
          { company: 'Fortescue Metals', role: 'Rigging Supervisor', match: '91%', salary: '$78,000' }
        ].map((job, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r from-cyan-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl p-4 border border-gray-600/50 transition-all duration-1000 delay-${index * 200} ${
              isActive && step >= index + 1 ? 'opacity-100 transform-none' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">{job.role}</h3>
                <p className="text-gray-300 text-sm">{job.company}</p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${job.match === '98%' ? 'text-green-400' : 'text-cyan-400'}`}>
                  {job.match}
                </div>
                <div className="text-gray-400 text-sm">{job.salary}</div>
              </div>
            </div>
            {job.match === '98%' && (
              <div className="mt-2 text-xs text-green-400 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Perfect Match!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const DocumentDemo = ({ isActive, step }) => (
    <div className="relative h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden">
      <div className="grid grid-cols-2 h-full">
        {/* Upload Area */}
        <div className="p-6 border-r border-gray-600/50">
          <div className={`h-full border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center transition-all duration-1000 ${
            isActive && step >= 1 ? 'border-cyan-400 bg-cyan-400/10' : ''
          }`}>
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400 flex items-center justify-center transition-all duration-500 ${
                isActive && step >= 1 ? 'animate-bounce' : ''
              }`}>
                📄
              </div>
              <p className="text-gray-300 text-sm">
                {isActive && step >= 1 ? 'Uploading Certificate...' : 'Drop files here'}
              </p>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="p-6">
          <h3 className="text-white font-semibold mb-4">Document Status</h3>
          <div className="space-y-3">
            {[
              { name: 'Mining Certificate', status: 'verified', color: 'green' },
              { name: 'Safety Training', status: 'processing', color: 'yellow' },
              { name: 'Medical Clearance', status: 'pending', color: 'gray' }
            ].map((doc, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 transition-all duration-500 delay-${index * 300} ${
                  isActive && step >= index + 2 ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  doc.status === 'verified' ? 'bg-green-400' : 
                  doc.status === 'processing' ? 'bg-yellow-400 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <span className="text-gray-300 text-sm flex-1">{doc.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  doc.status === 'verified' ? 'bg-green-400/20 text-green-400' :
                  doc.status === 'processing' ? 'bg-yellow-400/20 text-yellow-400' :
                  'bg-gray-400/20 text-gray-400'
                }`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const AnalyticsDemo = ({ isActive, step }) => (
    <div className="relative h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden p-6">
      <div className="grid grid-cols-3 gap-4 h-full">
        {/* Metrics Cards */}
        <div className="space-y-4">
          {[
            { label: 'Applications Sent', value: '24', change: '+12%' },
            { label: 'Profile Views', value: '156', change: '+8%' },
            { label: 'Interview Invites', value: '7', change: '+40%' }
          ].map((metric, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r from-cyan-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl p-4 transition-all duration-500 delay-${index * 200} ${
                isActive && step >= index + 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              <div className="text-sm text-gray-300">{metric.label}</div>
              <div className="text-xs text-green-400">{metric.change}</div>
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="col-span-2">
          <div className={`bg-gray-700/50 rounded-xl p-4 h-full transition-all duration-1000 ${
            isActive && step >= 4 ? 'opacity-100' : 'opacity-0'
          }`}>
            <h3 className="text-white font-semibold mb-4">Application Success Rate</h3>
            <div className="relative h-32">
              {/* Mock Chart Bars */}
              <div className="flex items-end justify-between h-full">
                {[65, 78, 82, 75, 88, 92, 86].map((height, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-t from-cyan-400 to-pink-400 rounded-t transition-all duration-500 delay-${index * 100}`}
                    style={{
                      width: '12%',
                      height: isActive && step >= 4 ? `${height}%` : '0%'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MobileDemo = ({ isActive, step }) => (
    <div className="relative h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
      <div className="relative">
        {/* Phone Frame */}
        <div className="w-48 h-80 bg-gray-900 rounded-3xl p-2 shadow-2xl">
          <div className="w-full h-full bg-gray-800 rounded-2xl overflow-hidden relative">
            {/* Screen Content */}
            <div className={`absolute inset-0 transition-all duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-400 to-pink-400 h-16 flex items-center justify-between px-4">
                <div className="text-black font-semibold">RiggerConnect</div>
                <div className="w-8 h-8 bg-black/20 rounded-full"></div>
              </div>
              
              {/* Content */}
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4].map((item, index) => (
                  <div
                    key={item}
                    className={`bg-gray-700 rounded-xl p-3 transition-all duration-500 delay-${index * 200} ${
                      isActive && step >= index + 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-600 rounded mb-1"></div>
                        <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        {isActive && (
          <>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-cyan-400 rounded-full animate-pulse"></div>
          </>
        )}
      </div>
    </div>
  );

  const renderDemoComponent = (componentName, isActive, step) => {
    switch (componentName) {
      case 'JobMatchingDemo':
        return <JobMatchingDemo isActive={isActive} step={step} />;
      case 'DocumentDemo':
        return <DocumentDemo isActive={isActive} step={step} />;
      case 'AnalyticsDemo':
        return <AnalyticsDemo isActive={isActive} step={step} />;
      case 'MobileDemo':
        return <MobileDemo isActive={isActive} step={step} />;
      default:
        return <div>Demo not found</div>;
    }
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % 6);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    let timeout;
    if (isPlaying) {
      timeout = setTimeout(() => {
        setCurrentDemo((prev) => (prev + 1) % demos.length);
        setAnimationStep(0);
      }, demos[currentDemo].duration);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, currentDemo, demos]);

  return (
    <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/5 via-transparent to-pink-500/5"></div>
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
            Interactive Experience
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the powerful features of our rigger workspace platform through these interactive demonstrations
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Demo Navigation */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-2">
              {demos.map((demo, index) => (
                <button
                  key={demo.id}
                  onClick={() => {
                    setCurrentDemo(index);
                    setAnimationStep(0);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    currentDemo === index
                      ? 'bg-gradient-to-r from-cyan-400 to-pink-400 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {demo.title}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentDemo((prev) => (prev - 1 + demos.length) % demos.length)}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-pink-400 text-black rounded-xl font-semibold hover:from-cyan-300 hover:to-pink-300 transition-all duration-300"
              >
                {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                <span>{isPlaying ? 'Pause' : 'Play'} Demo</span>
              </button>
              
              <button
                onClick={() => setCurrentDemo((prev) => (prev + 1) % demos.length)}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Demo Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Demo Display */}
            <div className="lg:col-span-2">
              {renderDemoComponent(demos[currentDemo].component, isPlaying, animationStep)}
            </div>

            {/* Demo Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {demos[currentDemo].title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {demos[currentDemo].description}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {demos[currentDemo].features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Demo Progress</span>
                  <span>{Math.round((animationStep / 5) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-pink-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(animationStep / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoShowcase;
