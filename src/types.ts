import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export type FirebaseModule = (ctx: ViteSSGContext) => void

export type VuetifyModule = (ctx: ViteSSGContext) => void

export type VCalendarModule = (ctx: ViteSSGContext) => void

export type VVueRecaptcha = (ctx: ViteSSGContext) => void

export type VueSignature = (ctx: ViteSSGContext) => void

export type ImageCropper = (ctx: ViteSSGContext) => void
