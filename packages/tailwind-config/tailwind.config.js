const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: ({ colors }) => ({
      inherit: colors.inherit,
      current: colors.current,
      transparent: colors.transparent,
      primary: {
        DEFAULT: '#32C768',
        hover: '#31b762',
        bg: '#E8FEE7',
      },
      blue: {
        100: '#E9F4FF',
        200: '#A5DCFF',
        400: '#79B9FF',
        500: '#208AFF',
        600: '#1D77DB',
        hover: '#2085f5',
      },
      green: {
        100: '#E8FEE7',
        200: '#AEF9B3',
        500: '#32C768',
        hover: '#31b762',
      },
      red: {
        500: '#E23731',
      },
      yellow: {
        400: '#FBBF24',
        500: '#F59E0B',
      },
      white: {
        DEFAULT: '#FFFFFF',
        hover: '#f4f4f5',
      },
      blueGray: {
        700: '#3E4664',
      },
      slate: {
        50: '#F3F6F9',
        100: '#F1F3F4',
        200: '#D3D5DA',
        300: '#B0B9C1',
        400: '#8B98A7',
        500: '#8F9EB0',
        600: '#667281',
        800: '#232737',
        900: '#171B2C',
      },
      gray: {
        50: '#F7F7F7',
        100: '#F2F2F2',
        200: '#E2E2E2',
        300: '#D9D9D9',
        400: '#CCCCCC',
        700: '#777777',
        800: '#333333',
        900: '#222222',
      },
    }),
    fontWeight: {
      regular: '400',
      medium: '500',
      bold: '700',
    },
    extend: {
      fontSize: {
        'body-13R': ['13px', { lineHeight: '100%', fontWeight: '400' }],
        'body-14R': ['14px', { lineHeight: '100%', fontWeight: '400' }],
        'body-16R': ['16px', { lineHeight: '100%', fontWeight: '400' }],
        'body-18R': ['18px', { lineHeight: '100%', fontWeight: '400' }],
        'caption-12R': ['12px', { lineHeight: '100%', fontWeight: '400' }],
        'header-20M': ['20px', { lineHeight: '100%', fontWeight: '500' }],
        'header-24M': ['24px', { lineHeight: '100%', fontWeight: '500' }],
        'body-13M': ['13px', { lineHeight: '100%', fontWeight: '500' }],
        'body-14M': ['14px', { lineHeight: '100%', fontWeight: '500' }],
        'body-16M': ['16px', { lineHeight: '100%', fontWeight: '500' }],
        'body-18M': ['18px', { lineHeight: '100%', fontWeight: '500' }],
        'caption-12M': ['12px', { lineHeight: '100%', fontWeight: '500' }],
        'header-20B': ['20px', { lineHeight: '100%', fontWeight: '700' }],
        'header-24B': ['24px', { lineHeight: '100%', fontWeight: '700' }],
        'body-13B': ['13px', { lineHeight: '100%', fontWeight: '700' }],
        'body-14B': ['14px', { lineHeight: '100%', fontWeight: '700' }],
        'body-16B': ['16px', { lineHeight: '100%', fontWeight: '700' }],
        'body-18B': ['18px', { lineHeight: '100%', fontWeight: '700' }],
        'caption-12B': ['12px', { lineHeight: '100%', fontWeight: '700' }],
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('not-first', '&:not(:first-child)');
      addVariant('not-last', '&:not(:last-child)');
    }),
  ],
};
