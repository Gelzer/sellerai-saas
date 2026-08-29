import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { aiHubMixServerPlugin } from './server/aihubmix-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), aiHubMixServerPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
