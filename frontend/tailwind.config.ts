import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#0F172A',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A',
          border: 'rgba(4, 106, 90, 0.12)',
        },
        emerald: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#10B981',
          600: '#059669',
          700: '#046A5A', // Brand Emerald Primary
          800: '#035346',
          900: '#023F36', // Brand Deep Emerald
          950: '#012923',
        },
        ivory: '#FAF8F2',
        cream: '#F5F1E8',
        rose: {
          50: '#FFF5F7',
          100: '#FFE6EC',
          200: '#FFCCD7',
          300: '#FFA3B5',
          400: '#F86B8A',
          500: '#E83D65',
          600: '#D21E4B',
          700: '#B01239',
          800: '#921232',
          900: '#7B132E',
          950: '#460515',
        },
        gold: {
          50: '#FDFBF7',
          100: '#FBF4E6',
          200: '#F6E4BF',
          300: '#EED092',
          400: '#E3B95B',
          500: '#C9A227', // Brand Luxury Gold
          600: '#A9781D',
          700: '#845717',
          800: '#6E4517',
          900: '#5C3916',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        cormorant: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        heading: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        poppins: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'emerald-sm': '0 4px 15px -2px rgba(16, 185, 129, 0.12)',
        'emerald-md': '0 8px 25px -4px rgba(16, 185, 129, 0.18)',
        'emerald-lg': '0 12px 35px -5px rgba(16, 185, 129, 0.24)',
        'rose-sm': '0 4px 15px -2px rgba(232, 61, 101, 0.08)',
        'rose-md': '0 8px 25px -4px rgba(232, 61, 101, 0.14)',
        'rose-lg': '0 12px 35px -5px rgba(232, 61, 101, 0.20)',
      },
    },
  },
  plugins: [],
};

export default config;
