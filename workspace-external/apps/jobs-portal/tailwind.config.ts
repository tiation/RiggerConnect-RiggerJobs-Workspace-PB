import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          neon: '#00ffff',
          hover: '#33ffff',
        },
        secondary: {
          neon: '#ff00ff',
          hover: '#ff33ff',
        },
        background: {
          dark: '#0a0a0a',
          card: '#1a1a1a',
          hover: '#2a2a2a',
        },
      },
      boxShadow: {
        neon: '0 0 10px #00ffff, 0 0 20px #00ffff33',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
}
export default config
