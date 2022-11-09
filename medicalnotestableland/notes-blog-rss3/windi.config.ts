import { defineConfig } from 'vite-plugin-windicss'
import typography from 'windicss/plugin/typography'

export default defineConfig({
  darkMode: 'class',
  plugins: [
    typography(),
  ],
  attributify: true,
  theme: {
    extend: {
      colors: {},
      fontFamily: {
        cg: ['Cormorant Garamond', 'serif'],
        ebg: ['EB Garamond', 'serif'],
        lato: ['Lato', 'sans-serif'],
      },
    },
  },
})
