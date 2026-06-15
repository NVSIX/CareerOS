/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      colors: {
        // Surface hierarchy
        'surface':                   '#f7f9fd',
        'surface-dim':               '#d8dade',
        'surface-bright':            '#f7f9fd',
        'surface-container-lowest':  '#ffffff',
        'surface-container-low':     '#f2f4f8',
        'surface-container':         '#eceef2',
        'surface-container-high':    '#e6e8ec',
        'surface-container-highest': '#e0e2e6',
        // Text
        'on-surface':         '#191c1f',
        'on-surface-variant': '#5c3f3f',
        // Primary (TalentBank red)
        'primary':            '#ad002a',
        'on-primary':         '#ffffff',
        'primary-container':  '#d8113a',
        'on-primary-container': '#ffeceb',
        'inverse-primary':    '#ffb3b3',
        'primary-fixed':      '#ffdad9',
        'primary-fixed-dim':  '#ffb3b3',
        'on-primary-fixed':   '#40000a',
        'on-primary-fixed-variant': '#920022',
        // Secondary (slate blue-grey)
        'secondary':          '#555f6f',
        'on-secondary':       '#ffffff',
        'secondary-container':'#d6e0f3',
        'on-secondary-container': '#596373',
        'secondary-fixed':    '#d9e3f6',
        'secondary-fixed-dim':'#bdc7d9',
        'on-secondary-fixed': '#121c2a',
        'on-secondary-fixed-variant': '#3d4756',
        // Tertiary
        'tertiary':           '#525556',
        'on-tertiary':        '#ffffff',
        'tertiary-container': '#6b6d6e',
        'on-tertiary-container': '#eff0f1',
        'tertiary-fixed':     '#e1e3e4',
        'tertiary-fixed-dim': '#c5c7c8',
        'on-tertiary-fixed':  '#191c1d',
        'on-tertiary-fixed-variant': '#454748',
        // Error
        'error':              '#ba1a1a',
        'on-error':           '#ffffff',
        'error-container':    '#ffdad6',
        'on-error-container': '#93000a',
        // Surface tint / outline
        'surface-tint':       '#bf0030',
        'outline':            '#916f6e',
        'outline-variant':    '#e6bdbc',
        // Inverse
        'inverse-surface':    '#2d3134',
        'inverse-on-surface': '#eff1f5',
        // Background
        'background':         '#f7f9fd',
        'on-background':      '#191c1f',
        'surface-variant':    '#e0e2e6',
      },
      fontFamily: {
        'display':  ['"Hanken Grotesk"', 'sans-serif'],
        'body':     ['Manrope', 'sans-serif'],
        'label':    ['Inter', 'sans-serif'],
        'mono':     ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'headline-lg':  ['40px', { lineHeight: '48px', fontWeight: '700', letterSpacing: '-0.02em' }],
        'headline-md':  ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'headline-sm':  ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg':      ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md':      ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm':      ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-lg':     ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'label-md':     ['12px', { lineHeight: '16px', fontWeight: '600' }],
        'label-sm':     ['11px', { lineHeight: '16px', fontWeight: '600' }],
      },
      borderRadius: {
        'sm':  '0.25rem',
        DEFAULT: '0.5rem',
        'md':  '0.75rem',
        'lg':  '1rem',
        'xl':  '1.5rem',
        'full':'9999px',
      },
      spacing: {
        'base': '8px', 'sm': '8px', 'md': '16px', 'lg': '32px',
        'xl': '48px', 'gutter': '24px',
        'margin-mobile': '16px', 'margin-desktop': '64px',
        'max-width': '1280px',
      },
      maxWidth: { 'content': '1280px' },
    },
  },
  plugins: [],
}
