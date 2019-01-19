/* jshint esversion: 6 */
export default  {
  getLoginApiPath(state) {
    return state.loginApiPath;
  },
  getAllUserApiPath(state) {
    return state.allUserApiPath;
  },
  getAddUserApiPath(state) {
    return state.addUserApiPath;
  },
  getAllWetlandApiPath(state) {
    return state.allWetlandApiPath;
  },
  getAddWetlandApiPath(state) {
    return state.addWetlandApiPath;
  },
  getAllPostApiPath(state) {
    return state.allPostApiPath;
  },
  getAddPostApiPath(state) {
    return state.addPostApiPath;
  },
  getCurrentUser(state) {
    return state.currentUser;
  },
  getProfilePicture(state) {
    return state.profilePicture;
  },
  getLoading(state) {
    return state.loading;
  },
  getLoggedIn(state) {
    return state.loggedIn;
  },
  getFailed(state) {
    return state.failed;
  },
  getAllUsers(state) {
    return state.allUsers;
  },
  getAllWetlands(state) {
    return state.allWetlands;
  },
  getAllPosts(state) {
    return state.allPosts;
  },
  getFailedConnection(state) {
    return state.failedConnection;
  },
}