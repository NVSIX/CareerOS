export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Remapped V1 names (existing className usage restyles automatically)
        base: "#faf9f4",          // page background (was near-black)
        surface: "#efece3",       // cards / containers (parchment)
        elevated: "#e9e8e3",      // hover / active container
        pressed: "#e5e2d8",       // pressed state fill
        separator: "#ddd8cc",     // hairlines where a visible rule is still needed
        accent: "#1F7A5C",        // verified / positive / growth (deep teal-green)
        "accent-dim": "#DDEBE4",  // accent badge fill on cream
        warning: "#B07818",       // gaps, moderate risk, coaching flags
        danger: "#d8113a",        // high risk (same hue as primary)
        txt: "#1b1c19",           // primary text (near-black on cream)
        "txt-dim": "#6B6557",     // secondary text, warm grey

        // New tokens
        primary: "#d8113a",            // CTAs, active states, brand moments
        "on-primary": "#ffffff",
        "primary-container": "#ffeceb",
        "on-primary-container": "#40000a",
        secondary: "#112250",          // deep navy — headers, nav, data ink
        "secondary-container": "#E7EAF3",
      },
      fontFamily: {
        display: ['"Hanken Grotesk"', "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
}
