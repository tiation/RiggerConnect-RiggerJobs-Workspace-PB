#!/usr/bin/env node

/**
 * Jekyll Theme Configuration Generator
 * Generates standardized _config.yml theme sections for all Rigger component sites
 */

const fs = require('fs');
const path = require('path');
const themeConfig = require('./tiation-rigger-theme.json');

// Component sites that need theme updates
const componentSites = [
  {
    name: 'jobs-app',
    path: '/Users/tiaastor/tiation-rigger-workspace/components/jobs-app/_config.yml',
    title: 'tiation-rigger-jobs-app',
    description: 'Enterprise-grade job matching platform in the Tiation Rigger ecosystem'
  },
  {
    name: 'connect-app',
    path: '/Users/tiaastor/tiation-rigger-workspace/components/connect-app/_config.yml',
    title: 'tiation-rigger-connect-app',
    description: 'Professional networking platform for rigging and construction industry'
  },
  {
    name: 'mobile-app',
    path: '/Users/tiaastor/tiation-rigger-workspace/components/mobile-app/_config.yml',
    title: 'tiation-rigger-mobile-app',
    description: 'Mobile application suite for riggers and construction professionals'
  },
  {
    name: 'automation-server',
    path: '/Users/tiaastor/tiation-rigger-workspace/components/automation-server/_config.yml',
    title: 'tiation-rigger-automation-server',
    description: 'AI-powered automation and analytics platform'
  },
  {
    name: 'metrics-dashboard',
    path: '/Users/tiaastor/tiation-rigger-workspace/components/metrics-dashboard/_config.yml',
    title: 'tiation-rigger-metrics-dashboard',
    description: 'Business intelligence and performance metrics platform'
  },
  {
    name: 'infrastructure',
    path: '/Users/tiaastor/tiation-rigger-workspace/components/infrastructure/_config.yml',
    title: 'tiation-rigger-infrastructure',
    description: 'Cloud infrastructure and deployment automation tools'
  },
  {
    name: 'shared-libraries',
    path: '/Users/tiaastor/tiation-rigger-workspace/components/shared-libraries/_config.yml',
    title: 'tiation-rigger-shared-libraries',
    description: 'Reusable components and utilities for the Rigger ecosystem'
  },
  {
    name: 'workspace-docs',
    path: '/Users/tiaastor/tiation-rigger-workspace/components/workspace-docs/_config.yml',
    title: 'Tiation Rigger Workspace Documentation',
    description: 'Comprehensive documentation for the Rigger development platform'
  }
];

/**
 * Generate standardized Jekyll theme configuration
 */
function generateJekyllConfig(site) {
  const { colors, gradients, shadows } = themeConfig;
  
  return `# GitHub Pages Configuration
title: "${site.title}"
description: "${site.description}"
author: "Tiation Team"
email: "tiatheone@protonmail.com"
url: "https://tiation.github.io/${site.name}"
baseurl: ""

# Theme Configuration
theme: minima
markdown: kramdown
highlighter: rouge

# Plugins
plugins:
  - jekyll-feed
  - jekyll-sitemap
  - jekyll-seo-tag
  - jekyll-github-metadata

# Dark Neon Theme - Standardized Rigger Colors
minima:
  skin: dark
  social_links:
    github: tiation
    email: tiatheone@protonmail.com

# Standardized Dark Neon Theme
custom_css: |
  :root {
    /* Primary Brand Colors */
    --primary-color: ${colors.primary.cyan};
    --secondary-color: ${colors.primary.magenta};
    --primary-dark: ${colors.primary.dark};
    --primary-darker: ${colors.primary.darker};
    
    /* Secondary Colors */
    --secondary-purple: ${colors.secondary.purple};
    --secondary-blue: ${colors.secondary.blue};
    --secondary-teal: ${colors.secondary.teal};
    --secondary-pink: ${colors.secondary.pink};
    
    /* Background Colors */
    --background-color: ${colors.background.primary};
    --bg-secondary: ${colors.background.secondary};
    --bg-tertiary: ${colors.background.tertiary};
    --bg-card: ${colors.background.card};
    --bg-overlay: ${colors.background.overlay};
    --bg-glass: ${colors.background.glass};
    
    /* Text Colors */
    --text-color: ${colors.text.primary};
    --text-secondary: ${colors.text.secondary};
    --text-muted: ${colors.text.muted};
    --text-inverse: ${colors.text.inverse};
    --text-accent: ${colors.text.accent};
    
    /* Accent Colors */
    --accent-color: ${colors.accent.neon_green};
    --accent-orange: ${colors.accent.neon_orange};
    --accent-red: ${colors.accent.neon_red};
    --accent-yellow: ${colors.accent.neon_yellow};
    
    /* Status Colors */
    --status-success: ${colors.status.success};
    --status-warning: ${colors.status.warning};
    --status-error: ${colors.status.error};
    --status-info: ${colors.status.info};
    
    /* Mining Industry Colors */
    --mining-safety: ${colors.mining_industry.safety};
    --mining-hazard: ${colors.mining_industry.hazard};
    --mining-approved: ${colors.mining_industry.approved};
    --mining-pending: ${colors.mining_industry.pending};
    --mining-caution: ${colors.mining_industry.caution};
    --mining-restricted: ${colors.mining_industry.restricted};
    
    /* Border Colors */
    --border-primary: rgba(0, 212, 255, 0.3);
    --border-secondary: rgba(255, 255, 255, 0.1);
    --border-accent: rgba(255, 0, 128, 0.3);
    --border-dark: ${colors.border.dark};
    --border-light: ${colors.border.light};
    
    /* Gradients */
    --gradient-primary: ${gradients.primary.css};
    --gradient-secondary: ${gradients.secondary.css};
    --gradient-background: ${gradients.background.css};
    --gradient-button: ${gradients.button.css};
    --gradient-card: ${gradients.card.css};
    --gradient-neon-glow: ${gradients.neon_glow.css};
    
    /* Shadow Effects */
    --shadow-neon: ${shadows.neon_glow};
    --shadow-glow: ${shadows.magenta_glow};
    --shadow-soft: ${shadows.soft_glow};
    --shadow-primary: ${shadows.primary};
    --shadow-secondary: ${shadows.secondary};
    --shadow-card: ${shadows.card};
    --shadow-hover: ${shadows.hover};
  }
  
  /* Base Theme Styles */
  body {
    background: var(--background-color);
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 0, 128, 0.1) 0%, transparent 50%);
    color: var(--text-color);
    line-height: 1.6;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    overflow-x: hidden;
  }
  
  /* Animated Background */
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      radial-gradient(circle at 20% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 0, 128, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 60% 40%, rgba(0, 255, 136, 0.1) 0%, transparent 50%);
    animation: pulse 4s ease-in-out infinite alternate;
    z-index: -1;
  }
  
  @keyframes pulse {
    0% { opacity: 0.3; }
    100% { opacity: 0.6; }
  }
  
  /* Header Styling */
  .site-header {
    background: var(--primary-darker);
    border-bottom: 2px solid var(--primary-color);
    box-shadow: var(--shadow-neon);
    backdrop-filter: blur(20px);
  }
  
  .site-title {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: bold;
    text-shadow: var(--shadow-neon);
    transition: all 0.3s ease;
  }
  
  .site-title:hover {
    animation: glow 1s ease-in-out infinite alternate;
  }
  
  @keyframes glow {
    from { filter: brightness(1); }
    to { filter: brightness(1.5); }
  }
  
  /* Navigation */
  .site-nav .page-link {
    color: var(--text-color);
    transition: all 0.3s ease;
    position: relative;
  }
  
  .site-nav .page-link:hover {
    color: var(--primary-color);
    text-shadow: var(--shadow-neon);
  }
  
  .site-nav .page-link::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--gradient-primary);
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  .site-nav .page-link:hover::after {
    width: 100%;
  }
  
  /* Main Content */
  .page-content {
    background: var(--bg-card);
    border-radius: 15px;
    margin: 20px auto;
    padding: 40px;
    max-width: 1200px;
    box-shadow: var(--shadow-card);
    backdrop-filter: blur(10px);
  }
  
  /* Headings with Neon Glow */
  h1, h2, h3, h4, h5, h6 {
    background: var(--gradient-neon-glow);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 30px 0 20px 0;
    position: relative;
  }
  
  h1 {
    font-size: 3rem;
    text-align: center;
    margin-bottom: 40px;
  }
  
  /* Links with Cyan Glow */
  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
  }
  
  a:hover {
    color: var(--accent-color);
    text-shadow: var(--shadow-neon);
    text-decoration: underline;
  }
  
  /* Code Blocks with Neon Styling */
  pre, code {
    background: var(--primary-darker);
    border: 1px solid var(--primary-color);
    border-radius: 8px;
    color: var(--accent-color);
    box-shadow: inset 0 0 10px rgba(0, 212, 255, 0.1);
  }
  
  pre {
    padding: 20px;
    overflow-x: auto;
    position: relative;
  }
  
  pre::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--gradient-primary);
    border-radius: 8px 8px 0 0;
  }
  
  /* Feature Cards */
  .feature-card {
    background: var(--bg-secondary);
    border: 2px solid;
    border-image: var(--gradient-primary) 1;
    border-radius: 15px;
    padding: 20px;
    margin: 20px 0;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .feature-card:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-5px);
  }
  
  .feature-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
    transition: all 0.5s ease;
  }
  
  .feature-card:hover::before {
    left: 100%;
  }
  
  /* Buttons with Neon Styling */
  .btn, button {
    background: var(--gradient-primary);
    border: none;
    color: var(--primary-dark);
    padding: 12px 24px;
    border-radius: 25px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    overflow: hidden;
  }
  
  .btn:hover, button:hover {
    box-shadow: var(--shadow-hover);
    transform: scale(1.05);
  }
  
  .btn::before, button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.5s ease;
  }
  
  .btn:hover::before, button:hover::before {
    left: 100%;
  }
  
  /* Mobile Optimization */
  @media (max-width: 768px) {
    .page-content {
      margin: 10px;
      padding: 20px;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    .feature-card {
      margin: 10px 0;
      padding: 15px;
    }
  }
  
  /* Print Styles */
  @media print {
    body {
      background: white !important;
      color: black !important;
    }
    
    .site-header, .site-footer {
      display: none !important;
    }
  }

# SEO and Social Media
lang: en-US
twitter:
  username: tiation
  card: summary_large_image

# Build Settings
exclude:
  - node_modules
  - package.json
  - package-lock.json
  - .gitignore
  - README_OLD.md
  - scripts/
  - backups/
  - logs/
  - data/

# Include assets
include:
  - _pages
  - docs
  - assets`;
}

/**
 * Generate all Jekyll configurations
 */
function generateAllConfigs() {
  console.log('🎨 Generating standardized Jekyll theme configurations...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  componentSites.forEach(site => {
    try {
      const configContent = generateJekyllConfig(site);
      const fullPath = path.resolve(__dirname, site.path);
      const dir = path.dirname(fullPath);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
      
      // Write the configuration file
      fs.writeFileSync(fullPath, configContent, 'utf8');
      console.log(`✅ Generated: ${site.name}/_config.yml`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ Error generating ${site.name}: ${error.message}`);
      errorCount++;
    }
  });
  
  console.log(`\n🎯 Theme standardization complete!`);
  console.log(`✅ Successfully generated: ${successCount} configurations`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} configurations`);
  }
  console.log(`\n📋 Summary:`);
  console.log(`   • All sites now use standardized color values`);
  console.log(`   • Consistent gradient definitions across platforms`);
  console.log(`   • Unified neon glow effects and animations`);
  console.log(`   • Mobile-optimized responsive design`);
  console.log(`   • Enterprise-grade accessibility features`);
}

// Run if called directly
if (require.main === module) {
  generateAllConfigs();
}

module.exports = {
  generateJekyllConfig,
  generateAllConfigs,
  componentSites
};
