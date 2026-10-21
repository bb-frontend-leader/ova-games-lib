import path from 'path';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';

import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap';
// import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    UnoCSS(),
    VitePluginSvgSpritemap('**/icons/*.svg', {
      prefix: 'icon-',
    }),
    // Descomente esta línea si necesita visualizar el OVA en su dispositivo móvil. 👇
    // basicSsl()
  ],
  base: './',
  build: {
    target: 'ES2022',
    outDir: 'dist/',
    assetsDir: './',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@react-pdf')) {
            return 'vendor-pdf';
          }
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/@tiptap') || id.includes('node_modules/prosemirror')) {
            return 'vendor-tiptap';
          }
          if (id.includes('node_modules/@react-aria') || id.includes('node_modules/@react-stately') || id.includes('node_modules/react-stately')) {
            return 'vendor-react-aria';
          }
          if (id.includes('node_modules/@atlaskit')) {
            return 'vendor-atlaskit';
          }
          if (id.includes('node_modules/react-popper') || id.includes('node_modules/react-draggable') || id.includes('node_modules/@popperjs')) {
            return 'vendor-popper';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap';
          }
          if (id.includes('node_modules/books-ui')) {
            return 'vendor-books-ui';
          }
          if (id.includes('node_modules/wouter')) {
            return 'vendor-router';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
      '@shared': `${path.resolve(__dirname, 'src/shared')}/`,
      '@activities': `${path.resolve(__dirname, 'src/shared/components/activities')}/`,
      '@features': `${path.resolve(__dirname, 'src/shared/components/features')}/`,
      '@games': `${path.resolve(__dirname, 'src/shared/components/games')}/`,
      '@layouts': `${path.resolve(__dirname, 'src/shared/components/layouts')}`,
      '@ui': `${path.resolve(__dirname, 'src/shared/components/ui')}`,
      '@pages': `${path.resolve(__dirname, 'src/pages')}/`,
      '@router': `${path.resolve(__dirname, 'src/routers')}/`,
      '@styles': `${path.resolve(__dirname, `src/styles`)}/`
    }
  },
  server: {
    host: true
  }
});
