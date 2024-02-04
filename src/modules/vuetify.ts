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
        background: '#F6F6F6',
        surface: '#FFFFFF',
        primary: '#000000',
        'primary-darken-1': '#2c85d1',
        secondary: '#e91e63',
        'secondary-darken-1': '#018786',
        error: '#B00020',
        info: '#2196F3',
        success: '#4CAF50',
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
