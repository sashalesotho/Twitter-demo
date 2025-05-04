import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './public',
    emptyOutDir: false,
  },
  plugins: [react()],
  server: {
    proxy: {
      '/posts': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
      },
      '/createUser': 'http://localhost:3000',
      '/login': 'http://localhost:3000',
      '/protected-route': 'http://localhost:3000',
      // '/feed': 'http://localhost:3000',
    },
  },
});
