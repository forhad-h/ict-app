<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 pl-5 pr-5">
        <div class="mb-3 text-right">
            <router-link :to="{ name: 'allposts' }" class="btn btn-secondary">
              <span class="mr-1"><font-awesome-icon icon="angle-left" /></span>
              Back to all posts</router-link>
        </div>
        <form @submit.prevent="addPost">
          <div class="row">
            <div class="col-md-8">
              <div class="form-group">
                <input type="hidden" class="form-control" id="user_id" v-model="user_id">
              </div>
              <div class="form-group">
                <input type="hidden" class="form-control" id="user_name" v-model="user_name">
              </div>

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
                <img v-if="post.pic_url" :src="baseUrl + post.pic_url" alt="" />
                <img v-if="uploadedImageUrl" :src="uploadedImageUrl" />
                <input type="file" id="upload_ppic" @change="onFileChange" accept="image/*" v-show="false"/>
                <label for="upload_ppic" class="btn btn-primary upload_btn">
                  <font-awesome-icon :icon="['far', 'edit']" />
                </label>
              </div>
              <p class="text-center text-muted">Image ratio should be width = 3 x height</p>

              <div class="text-center">
                <button type="submit" class="btn btn-success">Add New Post</button>
              </div>
            </div>
          </div>

          <div class="pre_loader" v-if="isLoading">
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
      pageTitle: "Add new post",
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
  methods: {
    addPost() {
      this.$store.dispatch('adminM/loading');
      let data = new FormData();

      data.append('feature_image', this.post.feature_image);
      data.append('user_id', this.currentUser.id);
      data.append('user_name', this.currentUser.name);
      data.append('title', this.post.title);
      data.append('description', this.post.description);

      axios.post(this.$store.getters['adminM/getAddPostApiPath'], data)
      .then(response => {
        this.$store.dispatch('adminM/allPosts');

        let desc = "# Added new post - \r\n &nbsp; &nbsp; &nbsp;> " + response.data.post.title;
        addActivity(this, desc);
        
        this.$router.push('/admin/posts/all');
      })
      .catch(err => {
        console.log(err)
      })
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      this.post.feature_image = files[0];
      this.uploadedImageUrl = URL.createObjectURL(this.post.feature_image);
    }
  },
  computed: {
    user_id() {
      return this.currentUser.id
    },
    user_name() {
      return this.currentUser.name
    },
    currentUser() {
      return this.$store.getters['adminM/getCurrentUser'];
    }
  },
  mounted() {
    this.$store.dispatch('pageHeading', this.pageTitle);
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
