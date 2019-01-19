/* jshint esversion:6 */
import {getCurrentUser} from '../auth/auth';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

const user = getCurrentUser();
export default {
  namespaced: true,
  state: {
    loginApiPath: '/api/auth/login',
    allUserApiPath: '/api/users/all',
    addUserApiPath: '/api/user/new',
    allWetlandApiPath: '/api/wetlands/all',
    addWetlandApiPath: '/api/wetland/new',
    allPostApiPath: '/api/posts/all',
    addPostApiPath: '/api/post/new',
    currentUser: user,
    profilePicture: '',
    loading: false,
    loggedIn: !!user,
    failed: false,
    allUsers: [],
    allWetlands: [],
    allPosts: [],
    failedConnection: false,
    
  },
  getters,
  mutations,
  actions,
}
