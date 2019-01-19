<template>
  <div class="container pt-5 mt-3">
    <div class="row pt-5 mt-5">
      <div class="col-md-4"></div>
      <div class="col-md-4">
        <div class="alert alert-danger errMsg" v-if="isLoginFailed">
          <span>User credential doesn't match</span>
        </div>
        <form @submit.prevent="authenticate()">
          <div class="form-group">
            <label for="email" class="text-muted">Email address</label>
            <input type="email" class="form-control" id="email" placeholder="Enter email address"
                   v-model="user.email">
          </div>
          <div class="form-group">
            <label for="password" class="text-muted">Password</label>
            <input type="password" class="form-control" id="password" placeholder="Password"
                   v-model="user.password">
          </div>


          <!-- <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1">
            <label class="form-check-label" for="exampleCheck1">Check me out</label>
          </div> -->
          <div class="text-center">
            <button type="submit" class="btn btn-success bg-gradient-success btn-block">Log In</button>
          </div>
          <div v-if="isLoading" class="pre_loader">
            <img :src="baseUrl + loaderUrl" alt="">
          </div>
        </form>
      </div>
      <div class="col-md-4"></div>
    </div>
  </div>
</template>
<script>
import {login} from '../../auth/auth';

export default {
  data() {
    return {
      user: {
        email: '',
        password: ''
      }
    }
  },
  computed: {
    isLoginFailed() {
        return this.$store.getters['adminM/getFailed'];
    }
  },
  methods: {
    authenticate() {
      this.$store.dispatch('adminM/loading');

      let loginApiPath = this.$store.getters['adminM/getLoginApiPath'];

      login(loginApiPath, this.$data.user)
        .then(response => {
          this.$store.dispatch('adminM/loginSuccess', {response: response, router: this.$router});
        })
        .catch(err => {
          this.user.email = '';
          this.user.password = '';
          this.$store.dispatch('adminM/loginFailed');
        })

    }
  }
}
</script>
<style scoped>
  .errMsg {
    position: absolute;
    top: -60px;
    left: 15px;
    width: calc(100% - 30px);
  }
</style>
