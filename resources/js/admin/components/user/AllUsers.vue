<template>
  <div class="container">
    <div class="row">
      <div class="col-md-1"></div>
      <div class="col-md-10">
        <template v-if="noData">
            <div class="alert alert-warning emptyMsg text-center">
              <h5 class="mb-0">User Not Found</h5>
            </div>
        </template>
        <template v-if="failedConnection">
            <div class="alert alert-danger emptyMsg text-center">
              Database connection error. Please 
              <a href="#" @click.prevent="logOut" class="btn btn-secondary btn-sm">Log In</a>
            </div>
        </template>

        <div class="row">
          <div class="col-md-10">
            <div class="filterOptions form-inline mb-3">
              <div class="col-12 pl-0 mb-3">
                <h4 class="d-inline mr-4">Filter Options</h4>
                <label for="showPerPage" class="text-muted mr-2 d-inline-block">Show per page</label>
                <select class="form-control" id="showPerPage" v-model="showPerPage">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="80">80</option>
                  <option value="100">100</option>
                  <option value="150">150</option>
                  <option value="200">200</option>
                </select>
              </div>

              <div class="form-group mr-3">
                <input type="text" class="form-control" id="filterName" placeholder="Filter by Name"
                      v-model="filterName">
              </div>

              <div class="form-group mr-3">
                <input type="text" class="form-control" id="filterEmail" placeholder="Filter by Email"
                      v-model="filterEmail">
              </div>

              <div class="form-group mr-3">
                <select class="form-control" id="filterRole" v-model="filterRole">
                  <option value="">Filter by Role</option>
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="author">Author</option>
                  <option value="observer">Observer</option>
                </select>
              </div>

              <div class="form-group mr-3"><label class="text-muted">Showing {{filteredUsers.length}} of {{this.totalFilteredItems}}</label></div>

            </div>
          </div>
          <div class="col-md-2">
            <div class="mb-3 text-right" v-if="superadmin || roleAdmin">
                <router-link :to="{ name: 'adduser' }" class="btn btn-secondary">Add User
                  <span class="ml-1"><font-awesome-icon icon="angle-right" /></span></router-link>
            </div>
          </div>
        </div>

        <table class="table table-striped">
          <thead>
            <tr class="bg-dark text-white">
              <td><strong>#</strong></td>
              <td><strong>Name</strong></td>
              <td><strong>Email</strong></td>
              <td><strong>Role</strong></td>
              <td class="text-center"><strong>Actions</strong></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user) in filteredUsers" :key="user.id" 
                :class="{'bg-secondary': user.id == currentUser.id,
                         'text-white': user.id == currentUser.id}">
              <td>{{ user.serialNo }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td class="text-capitalize">{{ user.role }}</td>
              <td class="text-center" width="130px">
                <router-link :to="{name: 'viewuser', params: {id: user.id}}" 
                             class="btn btn-primary btn-sm"
                            ><font-awesome-icon :icon="['fas', 'eye']" /></router-link>

                <router-link 
                          v-if="user.id != currentUser.id && 
                                (superadmin || roleAdmin) &&
                                user.role != 'superadmin'"
                          :to="{name: 'edituser', params: {id: user.id}}"
                          class="btn btn-warning btn-sm">
                  <font-awesome-icon :icon="['far', 'edit']" />
                </router-link>

                <router-link v-if="user.id == currentUser.id" 
                             :to="{name: 'editprofile', params: {id: currentUser.id}}"
                             class="btn btn-warning btn-sm">
                    <font-awesome-icon :icon="['far', 'edit']" />
                </router-link>

                <a href="#" v-if="user.id != currentUser.id && superadmin" class="btn btn-danger btn-sm" @click.prevent="deleteUser(user)"><font-awesome-icon icon="trash" /></a>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pre_loader" v-if="isLoading">
          <img :src="baseUrl + loaderUrl" alt="">
        </div>

        <nav aria-label="Page navigation" v-if="!isLoading && !noData">
          <input type="hidden" v-model="itemsStartFrom">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{disabled: currentPageNumber == 1}">
              <a class="page-link" href="#" aria-label="Previous"
                 @click.prevent="triggerPagination(currentPageNumber - 1)"
                 :aria-disabled="currentPageNumber == 1 ? 'true' : 'false'">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>

            <li class="page-item" v-for="(pageNum) in totalPage" :key="pageNum" ref="pagination"
               :class="{'active': pageNum == currentPageNumber}">
              <a class="page-link" href="#" @click.prevent="triggerPagination(pageNum)">{{pageNum}}</a>
            </li>

            <li class="page-item" :class="{disabled: currentPageNumber == totalPage}">
              <a class="page-link" href="#" aria-label="Next" 
                 @click.prevent="triggerPagination(currentPageNumber + 1)"
                 :aria-disabled="currentPageNumber == totalPage ? 'true' : 'false'">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
        
      </div>
      <div class="col-md-1"></div>
    </div>
  </div><!--  container -->
</template>
<script>
import {addActivity} from '../../user/addActivity';
export default {
  data() {
    return {
      pageTitle: "All Users",
      filterName: '',
      filterEmail: '',
      filterRole: '',
      itemsStartFrom: 0,
      showPerPage: 10,
      totalFilteredItems: 0,
      currentPageNumber: 1,
      userActivity: {
        'user_id': '',
        'user_name': '',
        'desc': ''
      }
    }
  },
  mounted() {
    this.$store.dispatch('pageHeading', this.pageTitle);
    if(!this.allUsers.length) {
      this.$store.dispatch('adminM/loading');
      this.$store.dispatch('adminM/allUsers');
    }
  },
  computed: {
    allUsers() {
      return this.$store.getters['adminM/getAllUsers']
    },
    failedConnection() {
      return this.$store.getters['adminM/getfailedConnection'];
    },
    noData() {
      if(!this.filteredUsers.length &&
         !this.isLoading &&
         !this.failedConnection) {
        return true;
      }
      return;
    },
    currentUser() {
      return this.$store.getters['adminM/getCurrentUser'];
    },
    filteredUsers() {
      let filteredUsers = this.allUsers.filter((eachUser) => {

        eachUser.name = eachUser.name != null ? eachUser.name : '';
        eachUser.email = eachUser.email != null ? eachUser.email : '';
        eachUser.role = eachUser.role != null ? eachUser.role : '';

        let matchUserName = eachUser.name.toLowerCase().match(
                              this.filterName.toLowerCase());
        let matchUserEmail = eachUser.email.toLowerCase().match(
                              this.filterEmail.toLowerCase());
        let matchUserRole = eachUser.role.toLowerCase().match(this.filterRole.toLowerCase());

        if(!!matchUserName && !!matchUserEmail && !!matchUserRole) {
          if(matchUserRole.index == 0) {
            return eachUser;
          }
        }
      })
      this.totalFilteredItems = filteredUsers.length;
      return filteredUsers.slice(this.itemsStartFrom, Number(this.itemsStartFrom) + Number(this.showPerPage));
    },
    totalPage() {
      return Math.ceil(this.totalFilteredItems/this.showPerPage);
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('adminM/logOut', this.$router);
    },
    deleteUser(user) {
      let confirmation = confirm("Are you sure to delete -> " + user.name);
      if(confirmation && this.superadmin) {
        this.$store.dispatch('adminM/loading');
        axios.get('/api/user/' + user.id + '/delete')
        .then(response => {
          this.$store.dispatch('adminM/allUsers');

          let desc = "# Deleted 1 user";
          addActivity(this, desc);
        })
        .catch(err => {
            console.log(err)
          }
        )
      }
      return;
    },
    triggerPagination(pageNum) {
      for(let i = 0; i < this.$refs.pagination.length; i++) {
        let eachElm = this.$refs.pagination[i];
        eachElm.className = eachElm.className.replace(' active', '');
      }
      let currentItem = this.$refs.pagination[pageNum - 1];
      if(currentItem) {
        currentItem.className += ' active';
      }
      this.currentPageNumber = pageNum;
      this.itemsStartFrom = ((pageNum * this.showPerPage) - this.showPerPage);
    }
  },
  watch: {
    filterRole() {
      triggerWatch(this)
    },
    filterName() {
      triggerWatch(this)
    },
    filterEmail() {
      triggerWatch(this)
    },
    showPerPage(value) {
      triggerWatch(this)
    }
  }
}
function triggerWatch(vm) {
    vm.itemsStartFrom = 0;
    vm.currentPageNumber = 1;
    vm.triggerPagination(vm.currentPageNumber);
}
</script>
<style scoped>
.emptyMsg,
.pre_loader {
  top: 150px;
  position: absolute;
  width: calc(100% - 30px);
  left: 15px;
}
</style>
