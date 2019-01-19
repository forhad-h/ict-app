<template>
    <div>
      <admin-nav v-if="isAuthAdmin"/>
      <component :is="header"></component>

      <main :id="wrapperId">
        <router-view :key="$route.fullPath"></router-view>
      </main>

      <component :is="footer"></component>
    </div>
</template>

<script>
import adminNav from '../admin/components/common/AdminNav.vue';
import adminFooter from '../admin/components/common/Footer.vue';
import adminHeader from '../admin/components/common/Header.vue';
import guestHeader from '../guest/components/common/Header.vue';
import guestFooter from '../guest/components/common/Footer.vue';

export default {
  data() {
    return {
      footer: '',
      header: '',
      admin: false
    }
  },
  components: {
    'admin-footer': adminFooter,
    'admin-header': adminHeader,
    'guest-header': guestHeader,
    'guest-footer': guestFooter,
    'admin-nav': adminNav,
  },
  computed: {
    baseUrl() {
      return this.$store.getters.getBaseUrl;
    },
    isAuthAdmin() {
      let adminStatus = this.$store.getters.getAdminStatus;
      let authStatus = this.$store.getters['adminM/getLoggedIn'];
      if(adminStatus && authStatus) {
        this.header = 'admin-header';
        this.footer = 'admin-footer';
        this.admin = true;
      }else {
        this.header = 'guest-header';
        this.footer = 'guest-footer';
        this.admin = false;
      }
      return this.admin;
    },
    wrapperId() {
      if(this.isAuthAdmin) {
        return 'admin_main'
      }else if(!this.isAuthAdmin) {
        return 'guest_main'
      }
    }
  },
}
</script>
<style>
#guest_main, #admin_main {
  padding-top: 60px;
  padding-bottom: 60px;
  min-height: calc(100vh - 60px);
}
#admin_main {
  padding-top: 90px;
}
</style>
