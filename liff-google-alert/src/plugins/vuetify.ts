import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';

export default defineNuxtPlugin((nuxtApp) => {
  // const config = useRuntimeConfig().public as any;
  const vuetify = createVuetify({
    ssr: true,
    components: {
      ...components,
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
