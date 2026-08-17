import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        menu: resolve(__dirname, 'menu.html'),
        contact: resolve(__dirname, 'contact.html'),
        reservations: resolve(__dirname, 'reservations.html'),
        kitchen: resolve(__dirname, 'kitchen.html'),
        owner: resolve(__dirname, 'owner.html'),
        qrcodes: resolve(__dirname, 'qrcodes.html'),
      },
    },
  },
});
