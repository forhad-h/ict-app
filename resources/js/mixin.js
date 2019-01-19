/* jshint esversion: 6 */
export const mixin = {
  data() {
    return {
      loaderUrl: '/img/loader.gif',
    }
  },
  computed: {
    baseUrl() {
      return this.$store.getters.getBaseUrl;
    },
    isLoading() {
      return this.$store.getters['adminM/getLoading'];
    },
    isGuestLoading() {
      return this.$store.getters['guestM/getLoading'];
    },
    currentUser() {
      return this.$store.getters['adminM/getCurrentUser'];
    },
    superadmin() {
      if(this.currentUser.role == 'superadmin') return true;
      return false;
    },
    roleAdmin() {
      if(this.currentUser.role == 'admin') return true;
      return false;
    },
    author() {
      if(this.currentUser.role == 'author') return true;
      return false;
    },
    observer() {
      if(this.currentUser.role == 'observer') return true;
      return false;
    }
  }
}