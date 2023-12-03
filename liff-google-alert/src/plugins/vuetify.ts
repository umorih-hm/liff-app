import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin((nuxtApp) => {
  // const config = useRuntimeConfig().public as any;
  const vuetify = createVuetify({
    ssr: true,
    components: {
      ...components,
    },
    icons: {
      iconfont: 'mdi', // default - only for display purposes
    },
    directives,
    display: {
      thresholds: {
        sm: 604,
      },
    },
  });

  // Vue.js で Vuetify を使用する
  nuxtApp.vueApp.use(vuetify);
});
