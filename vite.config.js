import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: true,
    cors: true,
    proxy: {
      // Configure proxy if needed to forward WebSocket requests
      '/ws': {
        target: 'ws://localhost:5173',
        ws: true,
      },
    },
  },
  // other Vite configurations...
});
