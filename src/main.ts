import { Api } from './helpers/Api'
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

const api = new Api(
  'http://localhost:4000',
  'rest',
  'gql'
)

Vue.use(VueApollo)

Vue.prototype.$api = api

new Vue({
  router,
  store,
  apolloProvider: api.GraphqlClient,
  render: (h) => h(App)
}).$mount('#app')
