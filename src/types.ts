import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export type FirebaseModule = (ctx: ViteSSGContext) => void

export type VuetifyModule = (ctx: ViteSSGContext) => void