import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import app from './app.vue'
import Chance from 'chance'

import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import zhTerm from './lang/ch'
import enTerm from './lang/en'

Vue.use(VueI18n);

const messages = {
  en: {
    ...enLocale,
    ...enTerm,
  },
  ch: {
    ...zhTerm,
    ...zhLocale,
  },
};

const i18n = new VueI18n({
  locale: localStorage.getItem('lang') || 'ch',
  messages,
});

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

window.data = {
  config: {
    networks: {
      kylin: {
        blockchain: 'eos',
        host: 'api-kylin.eoslaomao.com',
        port: 443,
        chainId: "5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191",
        protocol: "https",
        httpEndpoint: "https://api-kylin.eoslaomao.com:443",
      },
      mainnet: {
        blockchain: 'eos',
        host: 'api1.eosasia.one',
        port: 443,
        chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        protocol: "https",
        httpEndpoint: "https://api1.eosasia.one:443"
      },
    },
  },
};

if (!localStorage.getItem('network')) {
  localStorage.setItem('network', 'mainnet');
}

if (!localStorage.getItem('seed')) {
  localStorage.setItem('seed', new Chance().word({ length: 10}));
}

new Vue({
  el: '#app',
  i18n,
  data,
  render: h => h(app)
});
