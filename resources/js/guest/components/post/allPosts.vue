<template>
  <div class="container mt-5">
    <div class="row align-items-center">
      <template v-if="noData">
          <div class="col alert alert-warning emptyMsg text-center">
            No Posts Found
          </div>
      </template>

      <div class="col-12">
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

      <template v-for="post in filteredPosts">
      <div class="col-md-4 mb-4" :key="post.id">
        <div class="card">
          <div class="featre_image">
              <img :src="baseUrl + post.pic_url" alt="" class="card-img-top">
          </div>
          <div class="card-body">
            <h3 class="card-title">{{post.title}}</h3>
            <h6 class="card-subtitle mb-2 mt-3 text-muted">by <span class="text-capitalize">{{post.user_name}}</span> | {{stringDate(post.created_at)}}</h6>
            <p class="card-text">{{post.description.substr(0, 150)}}...</p>
              <router-link :to="{name: 'viewpost', params: {id: post.id}}" class="btn btn-primary">Read More</router-link>
          </div>
        </div>
      </div>
      </template>

      <div class="pre_loader" v-if="isGuestLoading">
        <img :src="baseUrl + loaderUrl" alt="">
      </div>

      <nav class="col-12" aria-label="Page navigation" v-if="!isGuestLoading && !noData">
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
      <div class="pre_loader" v-if="loading">
        <img :src="baseUrl + loaderUrl" alt="">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      filterUserName: '',
      filterTitle: '',
      filterDesc: '',
      itemsStartFrom: 0,
      showPerPage: 10,
      totalFilteredItems: 0,
      currentPageNumber: 1,
    }
  },
  mounted() {
    this.$store.dispatch('pageHeading', this.pageTitle);
    if(!this.allPosts.length) {
      this.$store.dispatch('guestM/loading');
      this.$store.dispatch('guestM/allPosts');
    }
  },
  computed: {
    allPosts() {
      return this.$store.getters['guestM/getAllPosts']
    },
    noData() {
      if(!this.allPosts.length &&
         !this.isGuestLoading &&
         !this.failedConnection) {
        return true;
      }
      return;
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
    loading() {
      return this.$store.getters['guestM/getLoading'];
    }
  },
  methods: {
    stringDate(postDate) {
      let date = new Date(postDate);
      let day = date.getDate();
      let month = date.toLocaleString('en-us', { month: 'long' });
      let year = date.getFullYear();
      let hours = date.getHours();
      let miniutes = date.getMinutes();
      let format12 = hours > 12 ? "pm" : "am"
      let stringDate = day + " " + month + " " + year;
      return stringDate;
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

