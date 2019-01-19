<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="mb-3 text-right">
          <span @click="refreshPosts">
            <router-link :to="{ name: 'allposts' }" class="btn btn-secondary">
              <span class="mr-1"><font-awesome-icon icon="angle-left" /></span>
              Back to all posts</router-link>
          </span>
        </div>
        <form @submit.prevent="updatePost">
          <div class="row">
            <div class="col-md-8">
              <div class="form-group">
                <label for="title" class="text-muted">Title of the post</label>
                <input type="text" class="form-control" id="title" placeholder="Enter title here"
                      v-model="post.title">
              </div>

              <div class="form-group">
                <label for="description" class="text-muted">Description</label>
                <textarea class="form-control" id="description" cols="30" rows="20" v-model="post.description" placeholder="Write description here..."></textarea>
              </div>
            </div>
            <div class="col-md-4">
              <div class="image_field ml-auto mr-auto mb-3">
                <img v-if="post.pic_url && !uploadedImageUrl" :src="baseUrl + post.pic_url" alt="" />
                <img v-if="uploadedImageUrl" :src="uploadedImageUrl" />
                <input type="file" id="upload_ppic" @change="onFileChange" accept="image/*" v-show="false"/>
                <label for="upload_ppic" class="btn btn-primary upload_btn">
                  <font-awesome-icon :icon="['far', 'edit']" />
                </label>
              </div>
              <p class="text-center text-muted">Image ratio should be width = 3 x height</p>

              <div class="text-center">
                <button type="submit" class="btn btn-success">Update Post</button>
              </div>
            </div>
          </div>
          <div class="pre_loader" v-if="loading">
            <img :src="baseUrl + loaderUrl" alt="">
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import {addActivity} from '../../user/addActivity';
export default {
  data() {
    return {
      pageTitle: "Update Post Info",
      loading: false,
      uploadedImageUrl: null,
      post: {
        feature_image: '',
        title: '',
        pic_url: '',
        description: '',
      },
      userActivity: {
        'user_id': '',
        'user_name': '',
        'desc': ''
      }
    }
  },
  mounted() {
    this.$store.dispatch('pageHeading', this.pageTitle);

    axios.get('/api/post/' + this.$route.params.id + '/view')
    .then(response => {
      this.post = response.data.post
    })
    .catch(err => {
        console.log(err)
      }
    )
  },
  methods: {
    updatePost() {
      this.loading = true;
      let data = new FormData();

      data.append('feature_image', this.post.feature_image);
      data.append('user_id', this.currentUser.id);
      data.append('user_name', this.currentUser.name);
      data.append('title', this.post.title);
      data.append('description', this.post.description);

      axios.post('/api/post/' + this.$route.params.id + '/edit', data)
      .then(response => {
        this.post = response.data.updatedPost
        this.loading = false;

        let desc = "# Updated post info \r\n";
        desc += "* Affected post - \r\n &nbsp; &nbsp; &nbsp;> " + this.post.title;
        addActivity(this, desc);
      })
      .catch(err => {
          console.log(err)
        }
      )
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      this.post.feature_image = files[0];
      this.uploadedImageUrl = URL.createObjectURL(this.post.feature_image);
    },
    refreshPosts() {
      this.$store.dispatch('adminM/loading');
      this.$store.dispatch('adminM/allPosts');
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters['adminM/getCurrentUser'];
    }
  }
}
</script>
<style scoped>
  .image_field {
    width: 100%;
    min-height: 110px;
    overflow: hidden;
    background: #ddd;
    position: relative;
  }
  .image_field .upload_btn {
    position: absolute;
    right: 20px;
    bottom: 10px;
  }
</style>
