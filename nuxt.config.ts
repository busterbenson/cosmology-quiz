// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: true
  },
  app: {
    head: {
      title: 'Cosmology Quiz - Discover Your Philosophical Worldview',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Discover your philosophical worldview through intelligent questioning about reality, consciousness, and existence.' }
      ],
    }
  },
  nitro: {
    experimental: {
      wasm: true
    }
  }
})