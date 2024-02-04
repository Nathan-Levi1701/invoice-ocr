/* eslint-disable quote-props */
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import type { IconOptions, ThemeDefinition } from 'vuetify'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import type { VuetifyModule } from '~/types'

export const install: VuetifyModule = ({ app, isClient }) => {
  if (isClient) {
    const theme: ThemeDefinition = {
      dark: false,
      colors: {
        primary: '#ba2743',
        secondary: '#8a9bb5',
        'accent': '#5d74b7',
        

        background: '#F6F6F6',
        surface: '#FFFFFF',

        error: '#B00020',
        success: '#52b256',
        warning: '#FB8C00',
      },
    }

    const icons: IconOptions = { defaultSet: 'mdi', aliases, sets: { mdi } }

    const vuetify = createVuetify({
      components,
      directives,
      icons,
      theme: {
        defaultTheme: 'theme', themes: { theme },
      },
    })

    app.use(vuetify)
  }
}
