<template>
  <div class="adminNavbar">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark pl-0 pr-0">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="text-center w-100">
        <a class="navbar-brand mr-0" :href="baseUrl + '/admin'">
          <img :src="baseUrl + logoSrc" alt="">
        </a>
        <a :href="baseUrl + '/'" class="btn btn-secondary btn-sm mt-2" target="_blank">Visit Site</a>
      </div>
      <hr/>
      <div class="collapse navbar-collapse w-100" id="navbarTogglerDemo01">
        <ul class="navbar-nav mt-2 mt-lg-0 w-100">
          
          <span @click.prevent="showSubMenu({})" class="d-block">
            <router-link tag="li" to="/admin" class="nav-item" active-class="active" exact>
              <a class="nav-link">
                  <span class="mr-1"><font-awesome-icon icon="igloo" /></span>
                  Dashboard 
                  <span class="sr-only">(current)</span>
              </a>
            </router-link>
          </span>

          <li class="nav-item dropdown_menu" :class="{active: matchPath == 'user'}">
            <a class="nav-link" href="#" role="button"
               @click.prevent="showSubMenu(dropdownElms.first)"
               :class="{clicked: dropdownElms.first.status}">
              <span class="mr-1"><font-awesome-icon icon="users-cog" /></span>
              Users
              <span class="ml-3 collapseIcon"
                    v-show="!dropdownElms.first.status"><font-awesome-icon icon="plus" /></span>
              <span class="ml-3 collapseIcon"
                    v-show="dropdownElms.first.status"><font-awesome-icon icon="minus" /></span>
            </a>

            <div class="admin_submenu" v-show="dropdownElms.first.status">
              <router-link to="/admin/users/all" class="nav-link">All Users</router-link>
              <router-link v-if="superadmin || roleAdmin"
                       to="/admin/user/add"
                       class="nav-link">Add New</router-link>
            </div>
          </li>

          <li class="nav-item dropdown_menu" :class="{active: matchPath == 'wetland'}">
            <a class="nav-link" href="#" role="button"
               @click.prevent="showSubMenu(dropdownElms.second)"
               :class="{clicked: dropdownElms.second.status}">
              <span class="mr-1"><font-awesome-icon icon="water" /></span>
              Wetlands
              <span class="ml-3 collapseIcon"
                    v-show="!dropdownElms.second.status"><font-awesome-icon icon="plus" /></span>
              <span class="ml-3 collapseIcon"
                    v-show="dropdownElms.second.status"><font-awesome-icon icon="minus" /></span>
            </a>

            <div class="admin_submenu" v-show="dropdownElms.second.status">
              <router-link to="/admin/wetlands/all" class="nav-link">All Wetlands</router-link>
              <router-link v-if="superadmin || author || roleAdmin"
                           to="/admin/wetland/add" class="nav-link">Add New</router-link>
            </div>
          </li>

          <li class="nav-item dropdown_menu" :class="{active: matchPath == 'post'}">
            <a class="nav-link" href="#" role="button"
               @click.prevent="showSubMenu(dropdownElms.third)"
               :class="{clicked: dropdownElms.third.status}">
              <span class="mr-1"><font-awesome-icon icon="blog" /></span>
              Blog Posts
              <span class="ml-3 collapseIcon"
                    v-show="!dropdownElms.third.status"><font-awesome-icon icon="plus" /></span>
              <span class="ml-3 collapseIcon"
                    v-show="dropdownElms.third.status"><font-awesome-icon icon="minus" /></span>
            </a>

            <div class="admin_submenu" v-show="dropdownElms.third.status">
              <router-link to="/admin/posts/all" class="nav-link">All Posts</router-link>
              <router-link v-if="!observer" 
                          to="/admin/post/add" class="nav-link">Add New</router-link>
            </div>
          </li>

        </ul>
      </div>
    </nav>
  </div>
</template>
<script>
export default {
  data() {
    return {
      logoSrc: '/img/logo.png',
      dropdownElms: {
        first: {name: 'user', status: false, objName: 'first'},
        second: {name: 'wetland', status: false, objName: 'second'},
        third: {name: 'post', status: false, objName: 'third'},
      },
    }
  },
  computed: {
    matchPath() {
      let path = this.$route.path.split('/');
      let first = this.dropdownElms.first;
      let second = this.dropdownElms.second;
      let third = this.dropdownElms.third;
      if(path[2] != null) {
        if(path[2].match(first.name)) {
          first.status = true;
          return first.name;
        }else if(path[2].match(second.name)) {
          second.status = true;
          return second.name;
        }else if(path[2].match(third.name)) {
          third.status = true;
          return third.name;
        }
      }
      return;
    },
  },
  methods: {
    showSubMenu(currentElm) {
      _.forEach(this.dropdownElms, function(value, key) {
          if(currentElm.objName != key) {
              value.status = false;
          }
      });
      currentElm.status = !currentElm.status;
    },
  }
}
</script>

<style>
.dropdown_menu {
  position: relative;
}
.dropdown_menu .collapseIcon {
  position: absolute;
  right: 15px;
  top: 10px;
}
.dropdown_menu .admin_submenu {
  padding-left: 20px;
}
</style>
