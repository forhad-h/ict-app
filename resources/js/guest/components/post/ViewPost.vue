<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-2"></div>
      <div class="col-md-8">
        <div class="mb-3 text-right">
            <router-link :to="{ name: 'blog' }" class="btn btn-outline-secondary">
              <span class="mr-1"><font-awesome-icon icon="angle-left" /></span>
              Back to Blog</router-link>
        </div>

        <div class="card">
          <div class="card-body">
            <h2 style="color: #555" class="mb-3 text-capitalize">{{post.title}}</h2>
            <div class="post_pic text-center">
                <img :src="baseUrl + post.pic_url" alt="">
            </div>
            <h6 class="card-subtitle mb-2 mt-3 text-muted">by {{post.user_name}} | {{stringDate(post.created_at)}}</h6>
            <div class="post_desc">
              <p>{{post.description}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-2"></div>
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
      post: {},
      loading: false,
    }
  },
  mounted() {
    this.loading = true;
      axios.get('/api/guest/post/' + this.$route.params.id + '/view')
      .then(response => {
        this.post = response.data.post
        this.loading = false;
      })
      .catch(err => {
          console.log(err)
          this.loading = false;
        }
      )
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
  }
}
</script>
<style>
.post_pic img {
  max-width: 100%;
  width: 100%;
}
.post_desc p::first-letter {
  font-size: 2rem;
  text-transform: uppercase;
  color: #06556F;
}

</style>

