import Vue from 'vue';
import I18n from 'vue-i18n';

Vue.use(I18n);

// https://kazupon.github.io/vue-i18n/dynamic.html
export default new I18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: require('../../assets/locales/en'),
    sk: require('../../assets/locales/sk')
  }
});
