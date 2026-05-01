import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@reown/appkit', '@reown/appkit-adapter-wagmi', 'wagmi', 'viem']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
})
