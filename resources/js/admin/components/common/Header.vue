<template>
  <header class="admin_header pt-3 pb-2">
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h5 class="mb-0 text-center text-capitalize">
            <span class="mr-1" style="color: #0EC34E;opacity: 0.6;"><font-awesome-icon icon="square" /></span>
            {{pageHeading}}
          </h5>
        </div>
        <div class="col-md-6 text-right">
          <div class="dropdown user_dropdown dropleft">
            <a href="#" role="button" class="user_avatar" id="userMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <img v-if="hasProfilePic" :src="baseUrl + profilrPic" alt="">
              <span v-if="!hasProfilePic">{{profilrPic}}</span>
              </a>
              <div class="dropdown-menu" aria-labelledby="userMenu">
                <router-link :to="{name: 'viewuser', params: {id: currentUser.id}}" 
                             class="dropdown-item">Profile</router-link>
                <a class="dropdown-item" href="#" @click.prevent="logOut">Log out</a>
              </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
export default {
  data() {
    return {
      hasProfilePic: false,
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('adminM/logOut', this.$router);
    }
  },
  computed: {
    pageHeading() {
      return this.$store.getters.getPageHeading;
    },
    currentUser() {
      return this.$store.getters['adminM/getCurrentUser'];
    },
    profilrPic() {
      let firstLetter = this.currentUser.name.substr(0, 1).toUpperCase();
      if(this.currentUser.profile_picture != null) {
        let ppic_url = this.currentUser.profile_picture;
        this.hasProfilePic = true;
        return ppic_url;
      }else if(this.$store.getters['adminM/getProfilePicture'] != '' &&
                this.$store.getters['adminM/getProfilePicture'] != null) {
        let ppic_url = this.$store.getters['adminM/getProfilePicture'];
        this.hasProfilePic = true;
        return ppic_url;
      }
      return firstLetter;
    }
  }
}
</script>

<style>
.admin_header {
  border-bottom: 2px solid #0ec34e;
  position: fixed;
  width: 100%;
  z-index: 99;
  background: #f1f8ff;
}
.admin_header .user_avatar {
  position: absolute;
  right: 15px;
  top: 0;
  margin-top: -5px;
  border: 2px solid #0ec34e;
  border-radius: 50%;
  z-index: 99999;
  width: 45px;
  height: 45px;
  background: #0ec34e;
  color: #fff;
  text-align: center;
  font-size: 26px;
  font-weight: 600;
  text-shadow: -1px 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
}
.admin_header .user_avatar:hover {
  text-decoration: none;
}
.admin_header .user_avatar img {
  width: 45px;
  height: 45px;
}
.user_dropdown .dropdown-menu {
  z-index: 9;
  top: 30px!important;
  left: 26px!important;
  background: #f2f4f5;
  border: 0 none;
  border-right: 3px solid #0ec34e;
  box-shadow: -5px 8px 10px rgba(150,150,150,0.1);
}
.user_dropdown .dropdown-menu a:hover,
.user_dropdown .dropdown-menu a:hover {
  background: none;
  color: #0ec34e;
}
</style>

