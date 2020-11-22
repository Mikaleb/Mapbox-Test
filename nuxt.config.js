import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - sharebike',
    title: 'sharebike',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/vue-mapbox@latest/dist/vue-mapbox.css' },
      { rel: 'stylesheet', href: 'https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css' },
    ],

  },

  generate: {
    interval: 2000,
  },


  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/composition-api',
    '@nuxtjs/style-resources',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios'
  ],

  styleResources: {
    stylus: ['~@zoov/design-system/src/styles/components.styl'],
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        light: {
          primary: colors.purple,
          secondary: colors.grey.darken1,
          accent: colors.shades.black,
          error: colors.red.accent3,
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: ['@zoov/design-system'],
    extend(config) {
      config.module.rules.find(rule => rule.test.test('.svg')).test = /\.(png|jpe?g|gif|webp)$/i;
      config.module.rules = config.module.rules.concat([
        {
          test: /\.svg$/,
          use: ['svg-inline-loader'],
        },
      ]);
    },
  },
}
