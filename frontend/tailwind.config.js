/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface": "#f8f9ff",
        "surface-dim": "#cbdbf5",
        "surface-bright": "#f8f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#444653",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        "outline": "#757684",
        "outline-variant": "#c4c5d5",
        "primary": "#00288e",
        "on-primary": "#ffffff",
        "primary-container": "#1e40af",
        "on-primary-container": "#a8b8ff",
        "secondary": "#006398",
        "on-secondary": "#ffffff",
        "secondary-container": "#5bb8fe",
        "on-secondary-container": "#00476e",
        "tertiary": "#2d3449",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#434b60",
        "on-tertiary-container": "#b4bbd5",
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "background": "#f8f9ff",
        "on-background": "#0b1c30",
        "surface-variant": "#d3e4fe",
        // Semantic risk palette
        "risk-high": "#DC2626",
        "risk-high-bg": "#FEE2E2",
        "risk-high-text": "#991B1B",
        "risk-medium": "#D97706",
        "risk-medium-bg": "#FEF3C7",
        "risk-medium-text": "#92400E",
        "risk-low": "#16A34A",
        "risk-low-bg": "#DCFCE7",
        "risk-low-text": "#166534"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "gutter": "1rem",
        "gutter-dense": "0.5rem",
        "margin": "1.5rem",
        "margin-mobile": "1rem",
        "space-2xs": "0.125rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "0.75rem",
        "space-lg": "1rem",
        "space-xl": "1.5rem",
        "space-2xl": "2rem"
      },
      fontFamily: {
        "body": ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        "label-code": ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "monospace"]
      },
      fontSize: {
        "display-lg": ["32px", { lineHeight: "40px", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-sm": ["18px", { lineHeight: "26px", fontWeight: "600" }],
        "body-lg": ["15px", { lineHeight: "24px", fontWeight: "400" }],
        "body-md": ["13px", { lineHeight: "20px", fontWeight: "400" }],
        "body-sm": ["12px", { lineHeight: "18px", fontWeight: "400" }],
        "label-code-lg": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "label-code-md": ["12px", { lineHeight: "16px", fontWeight: "500" }],
        "label-code-sm": ["10px", { lineHeight: "14px", fontWeight: "500" }]
      },
      boxShadow: {
        "sm": "0 1px 8px rgba(0,0,0,0.04)",
        "md": "0 4px 16px rgba(0,0,0,0.06)",
        "lg": "0 8px 24px -4px rgba(15,23,42,0.12)"
      }
    }
  },
  plugins: [],
}
