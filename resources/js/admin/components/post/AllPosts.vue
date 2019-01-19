<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">

        <template v-if="noData">
            <div class="alert alert-warning emptyMsg text-center">
              <h5 class="mb-0">Post Not Found</h5>
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
                <input type="text" class="form-control" id="filterUserName" placeholder="Filter by User Name"
                      v-model="filterUserName">
              </div>

              <div class="form-group mr-3">
                <input type="text" class="form-control" id="filterTitle" placeholder="Filter by Title"
                      v-model="filterTitle">
              </div>

              <div class="form-group mr-3">
                <input type="text" class="form-control" id="filterDesc" placeholder="Filter by Desc"
                      v-model="filterDesc">
              </div>

              <div class="form-group mr-3"><label class="text-muted">Showing {{filteredPosts.length}} of {{this.totalFilteredItems}}</label></div>

            </div>
          </div>
          <div class="col-md-2">
            <div class="mb-3 text-right">
                <router-link v-if="!observer" :to="{ name: 'addpost' }" class="btn btn-secondary">Add Post
                  <span class="ml-1"><font-awesome-icon icon="angle-right" /></span></router-link>
            </div>
          </div>
        </div>


        <table class="table table-striped">
          <thead>
            <tr class="bg-dark text-white">
              <td><strong>#</strong></td>
              <td><strong>Feature Image</strong></td>
              <td><strong>User Name</strong></td>
              <td><strong>Title</strong></td>
              <td><strong>Description</strong></td>
              <td class="text-center"><strong>Actions</strong></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(post) in filteredPosts" :key="post.id">
              <td>{{ post.serialNo }}</td>
              <td style="max-width: 100px"><img v-if="post.pic_url" :src="baseUrl + post.pic_url" alt="" /></td>
              <td class="text-capitalize">{{ post.user_name }}</td>
              <td>{{ post.title }}</td>
              <td style="width: 35%;">{{ post.description.substr(0, 150) }}...</td>
              <td class="text-center" width="130px">
                <a class="btn btn-primary btn-sm" target="_new" href="#" @click.prevent="viewPost(post.id)"><font-awesome-icon :icon="['fas', 'eye']" /></a>

                <router-link 
                         v-if="superadmin || currentUser.id == post.user_id"
                         :to="{name: 'editpost', params: {id: post.id}}"
                         class="btn btn-warning btn-sm">
                  <font-awesome-icon :icon="['far', 'edit']" />
                </router-link>

                <a href="#" v-if="superadmin || currentUser.id == post.user_id" class="btn btn-danger btn-sm" @click.prevent="deletePost(post)"><font-awesome-icon icon="trash" /></a>
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
    </div>
  </div>
</template>
<script>
import {addActivity} from '../../user/addActivity';
export default {
  data() {
    return {
      pageTitle: "List of All Posts",
      filterUserName: '',
      filterTitle: '',
      filterDesc: '',
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
    if(!this.allPosts.length) {
      this.$store.dispatch('adminM/loading');
      this.$store.dispatch('adminM/allPosts');
    }
  },
  computed: {
    allPosts() {
      return this.$store.getters['adminM/getAllPosts']
    },
    failedConnection() {
      return this.$store.getters['adminM/getFailedConnection'];
    },
    noData() {
      if(!this.filteredPosts.length &&
         !this.isLoading &&
         !this.failedConnection) {
        return true;
      }
      return;
    },
    currentUser() {
      return this.$store.getters['adminM/getCurrentUser'];
    },
    filteredPosts() {
      let filteredPosts = this.allPosts.filter((eachPost) => {

        eachPost.user_name = eachPost.user_name != null ? eachPost.user_name : '';
        eachPost.title = eachPost.title != null ? eachPost.title : '';
        eachPost.description = eachPost.description != null ? eachPost.description : '';

        let matchPostUserName = eachPost.user_name.toLowerCase().match(
                              this.filterUserName.toLowerCase());
        let matchPostTitle = eachPost.title.toLowerCase().match(
                              this.filterTitle.toLowerCase());
        let matchPostDesc = eachPost.description.toLowerCase().match(this.filterDesc.toLowerCase());

        if(!!matchPostUserName && !!matchPostTitle && !!matchPostDesc) {
          return eachPost;
        }
      })
      this.totalFilteredItems = filteredPosts.length;
      return filteredPosts.slice(this.itemsStartFrom, Number(this.itemsStartFrom) + Number(this.showPerPage));
    },
    totalPage() {
      return Math.ceil(this.totalFilteredItems/this.showPerPage);
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('adminM/logOut', this.$router);
    },
    deletePost(post) {
      let confirmation = confirm("Are you sure to delete -> " + post.title);
      if(confirmation && 
         (this.superadmin || this.currentUser.id == post.user_id)) {
        this.$store.dispatch('adminM/loading');
        axios.get('/api/post/' + post.id + '/delete')
        .then(response => {
          this.$store.dispatch('adminM/allPosts');

          let desc = "# Deleted 1 post";
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
    },
    viewPost(id) {
      let routeData = this.$router.resolve({name: 'viewpost', params: {id: id}});
      window.open(routeData.href, '_blank');
    }
  },
  watch: {
    filterUserName() {
      triggerWatch(this)
    },
    filterTitle() {
      triggerWatch(this)
    },
    filterDesc() {
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