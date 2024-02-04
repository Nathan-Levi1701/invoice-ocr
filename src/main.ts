import { ViteSSG } from 'vite-ssg'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'

const routes = setupLayouts(generatedRoutes)

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    linkActiveClass: 'router-link-active',
    linkExactActiveClass: 'router-link-exact-active',
    scrollBehavior() {
      return { top: 0 }
    },
  },
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.glob<any>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))
  },
)
