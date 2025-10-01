import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // We need to specify our entry points
        // The default is index.html but we are building a chrome extension
        // so we don't need it.
        // popup: 'src/popup.html', // if you had a popup
        background: 'src/background.js',
        content: 'src/content.jsx',
      },
      output: {
        // Configure the output file names
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      }
    }
  }
})