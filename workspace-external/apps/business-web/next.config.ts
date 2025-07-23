import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable webpack optimizations
  webpack: (config, { isServer }) => {
    // Enable module concatenation
    config.optimization.concatenateModules = true;

    // Optimize chunks
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 70000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    };

    return config;
  },
  // Configure CDN URL for static assets
  assetPrefix: process.env.NEXT_PUBLIC_CDN_URL,
  
  // Enable static asset optimization
  images: {
    domains: [
      'cdn.riggerhireapp.com',
      'assets.riggerhireapp.com'
    ],
    minimumCacheTTL: 3600,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Additional optimizations
  optimizeFonts: true,
  compress: true,
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@mui/icons-material', '@mui/material'],
    turbo: {
      loaders: {
        '.svg': ['@svgr/webpack'],
      },
    },
  },
  
  // Cache control headers
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
