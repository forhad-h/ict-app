/*jshint esversion: 6 */
require('./bootstrap');
require('./helper/font-awesome');
window.Vue = require('vue');
import {mixin} from './mixin';
import Vuex from 'vuex';
import storeData from './store/store';
import VueRouter from 'vue-router';
import {adminRoutes} from './admin/routes/routes';
import {guestRoutes} from './guest/routes/routes';
import MainApp from './components/MainApp.vue';
import NotFound from './components/NotFound.vue';
import Vulidate from 'vuelidate';

Vue.config.productionTip = false;

Vue.mixin(mixin);

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Vulidate);

const store = new Vuex.Store(storeData);
const notFoundRoutes = [
  { 
    path: '*',
    component: NotFound
  }
]
const routes = [...adminRoutes, ...guestRoutes, ...notFoundRoutes];
const router = new VueRouter({
    routes,
    mode: 'history',
});
axios.interceptors.request.use(config => {
  let currentUser = store.getters['adminM/getCurrentUser'];
  if(!!currentUser){
      config.headers.common.Authorization = "Bearer " + currentUser.token;
  }
  return config;
});
router.beforeEach((to, from, next) => {

  let adminPath = to.fullPath.split('/');
  let loginPath = to.fullPath.split('/');
  let loggedIn = store.getters['adminM/getLoggedIn'];
  if( adminPath[1] == 'admin') {
    store.dispatch('callAdmin', true);
    if(!loggedIn) {
      next('/login');
    }else {
      next();
    }
  }else {
    store.dispatch('callAdmin', false);
    if(loginPath[1] == 'login') {
      if(loggedIn) {
        next('/admin');
      }
    }
    next();
  }
});


window.onstorage = (res) => {
  if(res.key == 'user') {
    if(res.oldValue != null) {
      if(res.oldValue !== res.newValue) {
          store.dispatch('adminM/logOut', router);
      }
    }
  }
};

Vue.component('main-app', MainApp)
const app = new Vue({
    el: '#app',
    router,
    store,
});
