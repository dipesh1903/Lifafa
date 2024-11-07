/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        "light": {
              "primary": "#8F4C38",
              "surfaceTint": "#8F4C38",
              "onPrimary": "#FFFFFF",
              "primaryContainer": "#FFDBD1",
              "onPrimaryContainer": "#3A0B01",
              "secondary": "#77574E",
              "onSecondary": "#FFFFFF",
              "secondaryContainer": "#FFDBD1",
              "onSecondaryContainer": "#2C150F",
              "tertiary": "#6C5D2F",
              "onTertiary": "#FFFFFF",
              "tertiaryContainer": "#F5E1A7",
              "onTertiaryContainer": "#231B00",
              "error": "#BA1A1A",
              "onError": "#FFFFFF",
              "errorContainer": "#FFDAD6",
              "onErrorContainer": "#410002",
              "background": "#FFF8F6",
              "onBackground": "#231917",
              "surface": "#FFF8F6",
              "onSurface": "#231917",
              "surfaceVariant": "#F5DED8",
              "onSurfaceVariant": "#53433F",
              "outline": "#85736E",
              "outlineVariant": "#D8C2BC",
              "shadow": "#000000",
              "scrim": "#000000",
              "inverseSurface": "#392E2B",
              "inverseOnSurface": "#FFEDE8",
              "inversePrimary": "#FFB5A0",
              "primaryFixed": "#FFDBD1",
              "onPrimaryFixed": "#3A0B01",
              "primaryFixedDim": "#FFB5A0",
              "onPrimaryFixedVariant": "#723523",
              "secondaryFixed": "#FFDBD1",
              "onSecondaryFixed": "#2C150F",
              "secondaryFixedDim": "#E7BDB2",
              "onSecondaryFixedVariant": "#5D4037",
              "tertiaryFixed": "#F5E1A7",
              "onTertiaryFixed": "#231B00",
              "tertiaryFixedDim": "#D8C58D",
              "onTertiaryFixedVariant": "#534619",
              "surfaceDim": "#E8D6D2",
              "surfaceBright": "#FFF8F6",
              "surfaceContainerLowest": "#FFFFFF",
              "surfaceContainerLow": "#FFF1ED",
              "surfaceContainer": "#FCEAE5",
              "surfaceContainerHigh": "#F7E4E0",
              "surfaceContainerHighest": "#F1DFDA"
          },
      }
    },
  },
  plugins: [],
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "html": "HTML"
  },
  "editor.quickSuggestions": {
    "strings": true
  }
}

