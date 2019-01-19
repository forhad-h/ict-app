/* jshint esversion: 6 */
export default {
  loading({commit}) {
    commit('setLoading');
  },
  loginSuccess({commit}, payload) {
    commit('setSuccessData', payload);
  },
  loginFailed({commit}) {
    commit('setLoginFailed')
  },
  logOut({commit}, router){
    commit('setLogOut', router);
  },
  allUsers({commit, state}){
    axios.get(state.allUserApiPath)
    .then(response => {
      if(Array.isArray(response.data.users)) {
        commit('setAllUsers', response.data.users);
      }else {
        commit('setAllUsers', []);
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
}