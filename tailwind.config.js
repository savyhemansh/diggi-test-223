/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./*.html", "./js/*.js"],
  theme: {
    extend: {
      colors: {
        // Core brand palette
        "primary": "#705b3c",
        "on-primary": "#ffffff",
        "primary-container": "#a68e6b",
        "on-primary-container": "#38280d",
        "primary-fixed": "#fbdeb7",
        "primary-fixed-dim": "#dec39c",
        "on-primary-fixed": "#271902",
        "on-primary-fixed-variant": "#564426",
        "inverse-primary": "#dec39c",
        "secondary": "#615e56",
        "on-secondary": "#ffffff",
        "secondary-container": "#e4dfd4",
        "on-secondary-container": "#65625a",
        "secondary-fixed": "#e7e2d7",
        "secondary-fixed-dim": "#cbc6bb",
        "on-secondary-fixed": "#1d1c15",
        "on-secondary-fixed-variant": "#49473f",
        "tertiary": "#5f5f58",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#94928a",
        "on-tertiary-container": "#2b2b25",
        "tertiary-fixed": "#e5e2d9",
        "tertiary-fixed-dim": "#c9c6be",
        "on-tertiary-fixed": "#1c1c16",
        "on-tertiary-fixed-variant": "#484741",
        // Surfaces
        "surface": "#faf9f6",
        "surface-dim": "#dbdad7",
        "surface-bright": "#faf9f6",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f4f3f0",
        "surface-container": "#efeeeb",
        "surface-container-high": "#e9e8e5",
        "surface-container-highest": "#e3e2e0",
        "surface-variant": "#e3e2e0",
        "surface-tint": "#705b3c",
        "background": "#faf9f6",
        "on-background": "#1a1c1a",
        "on-surface": "#1a1c1a",
        "on-surface-variant": "#38352f",
        "inverse-surface": "#2f312f",
        "inverse-on-surface": "#f2f1ee",
        // Error
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        // Outline
        "outline": "#7f766b",
        "outline-variant": "#d0c5b8",
        // Custom brand tokens
        "aged-parchment": "#F9F8F5",
        "gold-shimmer": "#D4AF37",
        "midnight-navy": "#1a1c1a"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      spacing: {
        "max-width": "1280px",
        "margin-desktop": "64px",
        gutter: "24px",
        unit: "8px",
        "margin-mobile": "20px"
      },
      fontFamily: {
        "display-lg": ["Didot", "Georgia", "serif"],
        "headline-lg": ["Didot", "Georgia", "serif"],
        "headline-md": ["Didot", "Georgia", "serif"],
        "headline-lg-mobile": ["Didot", "Georgia", "serif"],
        "body-lg": ["Fraunces", "Georgia", "serif"],
        "body-md": ["Fraunces", "Georgia", "serif"],
        "label-caps": ["Inter", "sans-serif"]
      },
      fontSize: {
        "display-lg": ["28px", { lineHeight: "1.2", letterSpacing: "0.005em", fontWeight: "400" }],
        "headline-lg": ["22px", { lineHeight: "1.25", fontWeight: "400" }],
        "headline-md": ["17px", { lineHeight: "1.4", fontWeight: "400" }],
        "headline-lg-mobile": ["22px", { lineHeight: "1.25", fontWeight: "400" }],
        "body-lg": ["15px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "1.55", fontWeight: "400" }],
        "label-caps": ["9px", { lineHeight: "1.4", letterSpacing: "0.18em", fontWeight: "400" }]
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries")
  ]
};
