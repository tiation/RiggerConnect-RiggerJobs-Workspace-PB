#!/usr/bin/env node

/**
 * Generate placeholder assets for the RiggerConnect-RiggerJobs-Workspace
 * This script creates placeholder images and diagrams for the README
 */

const fs = require('fs');
const path = require('path');

// SVG templates for different asset types
const svgTemplates = {
  logo: (width = 200, height = 100) => `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#2563eb" rx="10"/>
      <text x="${width/2}" y="${height/2 - 10}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">RiggerConnect</text>
      <text x="${width/2}" y="${height/2 + 10}" text-anchor="middle" fill="#93c5fd" font-family="Arial, sans-serif" font-size="10">Job Matching Platform</text>
    </svg>
  `,
  
  screenshot: (width = 250, height = 400, title = "Screenshot") => `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" rx="20"/>
      <rect x="10" y="10" width="${width-20}" height="60" fill="#2563eb" rx="5"/>
      <text x="${width/2}" y="45" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${title}</text>
      <rect x="20" y="90" width="${width-40}" height="20" fill="#e2e8f0" rx="3"/>
      <rect x="20" y="120" width="${width-40}" height="20" fill="#e2e8f0" rx="3"/>
      <rect x="20" y="150" width="${width-60}" height="20" fill="#e2e8f0" rx="3"/>
      <rect x="20" y="200" width="${width-40}" height="100" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1" rx="5"/>
      <text x="${width/2}" y="255" text-anchor="middle" fill="#64748b" font-family="Arial, sans-serif" font-size="10">Content Area</text>
    </svg>
  `,
  
  architecture: (width = 800, height = 600) => `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f8fafc"/>
      
      <!-- Mobile Apps -->
      <rect x="50" y="50" width="120" height="80" fill="#3b82f6" rx="10"/>
      <text x="110" y="80" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10" font-weight="bold">RiggerConnect</text>
      <text x="110" y="95" text-anchor="middle" fill="#93c5fd" font-family="Arial, sans-serif" font-size="8">Business App</text>
      
      <rect x="50" y="150" width="120" height="80" fill="#10b981" rx="10"/>
      <text x="110" y="180" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10" font-weight="bold">RiggerJobs</text>
      <text x="110" y="195" text-anchor="middle" fill="#6ee7b7" font-family="Arial, sans-serif" font-size="8">Worker App</text>
      
      <!-- API Gateway -->
      <rect x="300" y="100" width="120" height="80" fill="#f59e0b" rx="10"/>
      <text x="360" y="130" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10" font-weight="bold">API Gateway</text>
      <text x="360" y="145" text-anchor="middle" fill="#fbbf24" font-family="Arial, sans-serif" font-size="8">AutomationServer</text>
      
      <!-- Database -->
      <rect x="550" y="50" width="120" height="80" fill="#8b5cf6" rx="10"/>
      <text x="610" y="80" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10" font-weight="bold">MongoDB</text>
      <text x="610" y="95" text-anchor="middle" fill="#c4b5fd" font-family="Arial, sans-serif" font-size="8">Database</text>
      
      <!-- Redis -->
      <rect x="550" y="150" width="120" height="80" fill="#ef4444" rx="10"/>
      <text x="610" y="180" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10" font-weight="bold">Redis</text>
      <text x="610" y="195" text-anchor="middle" fill="#fca5a5" font-family="Arial, sans-serif" font-size="8">Cache</text>
      
      <!-- AWS Services -->
      <rect x="300" y="250" width="120" height="80" fill="#ff6b35" rx="10"/>
      <text x="360" y="280" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10" font-weight="bold">AWS Services</text>
      <text x="360" y="295" text-anchor="middle" fill="#ff9473" font-family="Arial, sans-serif" font-size="8">S3, Lambda, SES</text>
      
      <!-- Arrows -->
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#64748b"/>
        </marker>
      </defs>
      
      <line x1="170" y1="90" x2="290" y2="130" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
      <line x1="170" y1="190" x2="290" y2="150" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
      <line x1="420" y1="120" x2="540" y2="90" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
      <line x1="420" y1="160" x2="540" y2="180" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
      <line x1="360" y1="180" x2="360" y2="240" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
      
      <!-- Title -->
      <text x="400" y="30" text-anchor="middle" fill="#1f2937" font-family="Arial, sans-serif" font-size="16" font-weight="bold">RiggerConnect System Architecture</text>
    </svg>
  `,
  
  dashboard: (width = 600, height = 400) => `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" rx="10"/>
      
      <!-- Header -->
      <rect x="0" y="0" width="${width}" height="60" fill="#1f2937" rx="10"/>
      <text x="30" y="35" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Admin Dashboard</text>
      
      <!-- Stats Cards -->
      <rect x="20" y="80" width="160" height="80" fill="#3b82f6" rx="8"/>
      <text x="100" y="105" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Active Jobs</text>
      <text x="100" y="125" text-anchor="middle" fill="#93c5fd" font-family="Arial, sans-serif" font-size="20" font-weight="bold">1,247</text>
      
      <rect x="200" y="80" width="160" height="80" fill="#10b981" rx="8"/>
      <text x="280" y="105" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Workers</text>
      <text x="280" y="125" text-anchor="middle" fill="#6ee7b7" font-family="Arial, sans-serif" font-size="20" font-weight="bold">8,934</text>
      
      <rect x="380" y="80" width="160" height="80" fill="#f59e0b" rx="8"/>
      <text x="460" y="105" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Revenue</text>
      <text x="460" y="125" text-anchor="middle" fill="#fbbf24" font-family="Arial, sans-serif" font-size="20" font-weight="bold">$2.3M</text>
      
      <!-- Chart Area -->
      <rect x="20" y="180" width="560" height="180" fill="white" stroke="#e2e8f0" stroke-width="1" rx="8"/>
      <text x="300" y="200" text-anchor="middle" fill="#64748b" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Analytics Chart</text>
      
      <!-- Mock chart lines -->
      <polyline points="40,320 100,280 160,290 220,250 280,240 340,220 400,210 460,200 520,190 560,180" 
                stroke="#3b82f6" stroke-width="3" fill="none"/>
      <polyline points="40,340 100,320 160,310 220,290 280,280 340,260 400,250 460,240 520,230 560,220" 
                stroke="#10b981" stroke-width="3" fill="none"/>
    </svg>
  `
};

// Asset configuration
const assets = [
  // Logo
  { path: 'assets/logos/riggerconnect-logo.png', type: 'logo', width: 200, height: 100 },
  
  // Screenshots - RiggerConnect App
  { path: 'assets/screenshots/riggerconnect-dashboard.png', type: 'screenshot', width: 250, height: 400, title: 'Dashboard' },
  { path: 'assets/screenshots/riggerconnect-job-posting.png', type: 'screenshot', width: 250, height: 400, title: 'Job Posting' },
  { path: 'assets/screenshots/riggerconnect-worker-selection.png', type: 'screenshot', width: 250, height: 400, title: 'Worker Selection' },
  
  // Screenshots - RiggerJobs App
  { path: 'assets/screenshots/riggerjobs-job-feed.png', type: 'screenshot', width: 250, height: 400, title: 'Job Feed' },
  { path: 'assets/screenshots/riggerjobs-profile.png', type: 'screenshot', width: 250, height: 400, title: 'Profile' },
  { path: 'assets/screenshots/riggerjobs-earnings.png', type: 'screenshot', width: 250, height: 400, title: 'Earnings' },
  
  // Architecture
  { path: 'assets/architecture/system-architecture.png', type: 'architecture', width: 800, height: 600 },
  
  // Dashboard
  { path: 'assets/screenshots/admin-analytics.png', type: 'dashboard', width: 600, height: 400 }
];

// Generate assets
console.log('🎨 Generating assets for RiggerConnect-RiggerJobs-Workspace...');

assets.forEach(asset => {
  const fullPath = path.join(__dirname, '..', asset.path);
  const dir = path.dirname(fullPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Generate SVG content
  const svgContent = svgTemplates[asset.type](asset.width, asset.height, asset.title);
  
  // Write SVG file (using .svg extension for now)
  const svgPath = fullPath.replace('.png', '.svg');
  fs.writeFileSync(svgPath, svgContent);
  
  console.log(`✅ Created ${svgPath}`);
});

console.log('\n🎉 All assets generated successfully!');
console.log('\n💡 Note: These are placeholder SVG files. For production, replace with actual screenshots and professional designs.');
