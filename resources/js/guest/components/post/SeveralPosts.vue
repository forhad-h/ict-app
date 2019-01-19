<template>
  <div class="container">
    <div class="row align-items-center">
      <template v-if="noData">
          <div class="col alert alert-warning emptyMsg text-center">
            No Posts Found
          </div>
      </template>
      <template v-for="post in allPosts.slice(0, 3)">
        <div class="col-md-4" :key="post.id">
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
      <div class="pre_loader" v-if="loading">
        <img :src="baseUrl + loaderUrl" alt="">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    allPosts() {
      return this.$store.getters['guestM/getAllPosts']
    },
    noData() {
      if(!this.allPosts.length &&
         !this.isLoading &&
         !this.failedConnection) {
        return true;
      }
      return;
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
    }
  },
  mounted() {
    this.$store.dispatch('pageHeading', this.pageTitle);
    if(!this.allPosts.length) {
      this.$store.dispatch('guestM/loading');
      this.$store.dispatch('guestM/allPosts');
    }
  }
}
</script>
<style scoped>
 .row {
   position: relative;
 }
</style>

