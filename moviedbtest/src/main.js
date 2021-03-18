import Vue from 'vue'
import AppOriginal from './AppOriginal.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

new Vue({
  el: "#app",
  vuetify,
  render: h => h(AppOriginal)
}).$mount('#app');
