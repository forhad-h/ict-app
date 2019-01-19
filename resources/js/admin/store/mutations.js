/* jshint esversion: 6 */
export default {
  setLoading(state) {
    state.loading = true;
  },
  setProfilePicture(state, payload) {
    state.profilePicture = payload;
  },
  setSuccessData(state, payload) {
    state.loading = false;
    state.loggedIn = true;
    state.failed = false;
    let tokenInfo = {
      token: payload.response.access_token,
      expires: payload.response.expires_in
    }
    state.currentUser = Object.assign({}, payload.response.user, tokenInfo);
    localStorage.setItem('user', JSON.stringify(state.currentUser));
    payload.router.push('/admin');
  },
  setLoginFailed(state) {
    state.loading = false;
    state.loggedIn = false;
    state.failed = true;
  },
  setLogOut(state, router) {
    state.loggedIn = false;
    state.currentUser = null;
    localStorage.removeItem('user');
    router.push('/login');
  },
  setAllUsers(state, payload) {
    state.failedConnection = false;
    state.allUsers = payload;
    state.loading = false;
    for(let i = 0; i < state.allUsers.length; i++) {
      state.allUsers[i].serialNo = i + 1;
    }
  },
  setAllWetlands(state, payload) {
    state.failedConnection = false;
    state.allWetlands = payload;
    state.loading = false;
    for(let i = 0; i < state.allWetlands.length; i++) {
      state.allWetlands[i].serialNo = i + 1;
    }
  },
  setAllPosts(state, payload) {
    state.failedConnection = false;
    state.allPosts = payload;
    state.loading = false;
    for(let i = 0; i < state.allPosts.length; i++) {
      state.allPosts[i].serialNo = i + 1;
    }
  },
  setFailedConnection(state) {
    state.loading = false;
    state.failedConnection = true;
  },
}