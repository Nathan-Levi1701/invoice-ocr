import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import generateSitemap from 'vite-ssg-sitemap'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import { VitePWA } from 'vite-plugin-pwa'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 500,
  },
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    Icons({ autoInstall: true }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue', 'md'],
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: 'src/components.d.ts',
      resolvers: [
        IconsResolver({
          prefix: 'icon',
          enabledCollections: ['mdi'],
        }),
      ],
    }),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'EPI-USE Invoice OCR Tool',
        short_name: 'EPI-USE Invoice OCR Tool',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],

  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    formatting: 'minify',
    format: 'esm',
    onFinished() {
      generateSitemap(
        {
          robots: [{ userAgent: '*', allow: '/' }],
        })
    },
  },

  ssr: {
    noExternal: ['vuetify', 'v-calendar', 'vue-recaptcha', 'vue3-signature'],
  },

  optimizeDeps: {
    exclude: [
      '@vuetify/loader-shared/runtime',
      'vuetify',
    ],
  },
})
