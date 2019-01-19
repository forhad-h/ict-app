/* jshint esversion:6 */
export default {
  namespaced: true,
  state: {
    allPostApiPath: '/api/guest/posts/all',
    allWetlandApiPath: '/api/guest/wetlands/all',
    loading: false,
    failedConnection: false,
    allPosts: [],
    allWetlands: [],
  },
  getters: {
    getFailedConnection(state) {
      return state.failedConnection;
    },
    getAllPosts(state) {
      return state.allPosts;
    },
    getAllWetlands(state) {
      return state.allWetlands;
    },
    getLoading(state) {
      return state.loading;
    }
  },
  mutations: {
    setLoading(state) {
      state.loading = true;
    },
    setAllPosts(state, payload) {
      state.failedConnection = false;
      state.allPosts = payload;
      state.loading = false;
    },
    setAllWetlands(state, payload) {
      state.failedConnection = false;
      state.allWetlands = payload;
      state.loading = false;
    }
  },
  actions: {
    loading({commit}) {
      commit('setLoading');
    },
    allPosts({commit, state}){
      axios.get(state.allPostApiPath)
      .then(response => {
        if(Array.isArray(response.data.posts)) {
          commit('setAllPosts', response.data.posts);
        }else {
          commit('setAllPosts', []);
        }
      }).catch(err => {
        commit('setFailedConnection');
      });
    },
    allWetlands({commit, state}){
      axios.get(state.allWetlandApiPath)
      .then(response => {
        if(Array.isArray(response.data.wetlands)) {
          commit('setAllWetlands', response.data.wetlands);
        }else {
          commit('setAllWetlands', []);
        }
      }).catch(err => {
        commit('setFailedConnection');
      });
    },
  },
}