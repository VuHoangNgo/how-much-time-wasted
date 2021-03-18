import Vue from 'vue'
import AppOriginal from './AppOriginal.vue'

Vue.config.productionTip = false

new Vue({
  el: "#app",
  render: h => h(AppOriginal),
}).$mount('#app');
