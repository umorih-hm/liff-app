import liff from '@line/liff';

export default defineNuxtPlugin(nuxtApp => {
  liff.init({
    liffId: '1657806163-nNy5bqDE'
  },
  () => {
    if (!liff.isLoggedIn()) {
      // 未ログイン
      // liff.login();
    } else {
      // ログイン済み
    }
  })

})