import Vue from 'vue'
import VueI18n from 'vue-I18n'

Vue.use(VueI18n)

const locale = navigator.language.trim().substring(0, 2)
const messages = {}
const i18n = new VueI18n({
  locale,
  fallbackLocale: 'en',
  messages
})

export default i18n
