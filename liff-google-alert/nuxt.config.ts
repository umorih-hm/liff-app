// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src',
  devtools: { enabled: true },
  app: {
    head: {
      title: process.env.APP_NAME,
    },
    modules: ['@nuxtjs/i18n'],
    i18n: {
      defaultLocale: 'ja',
      locales: [
        { code: 'ja', iso: 'ja-JP', file: 'ja.json' },
      ],
      langDir: 'assets/lang',
    },
    imports: {
      autoImport: true,
    },
    css: [
      '@/assets/styles/main.sass',
    ],
    nitro: {
      prerender: {
        ignore: [
          '/200',
          '/404',
        ],
      },
    },
    vite: {
      ssr: {
        noExternal: [
          'vuetify',
        ],
      },
    },
  },
})