/* jshint esversion:6 */
import adminStore from '../admin/store/store';
import guestStore from '../guest/store/store';

export default {
  namespaced: true,
  state: {
    baseUrl: window.location.origin,
    isAdmin: false,
    pageHeading: 'Page title',
  },
  getters: {
    getBaseUrl(state) {
      return state.baseUrl;
    },
    getAdminStatus(state) {
      return state.isAdmin;
    },
    getPageHeading(state) {
      return state.pageHeading;
    },
  },
  mutations: {
    setAdmin(state, isAdmin) {
      if(isAdmin == true) {
        state.isAdmin = true;
      }else {
        state.isAdmin = false;
      }
    },
    setPageHeading(state, payload) {
      state.pageHeading = payload;
    },
  },
  actions: {
    callAdmin ({commit}, isAdmin) {
      commit('setAdmin', isAdmin)
    },
    pageHeading({commit}, payload) {
      commit('setPageHeading', payload);
    },
  },
  modules: {
    guestM: guestStore,
    adminM: adminStore,
  },
}