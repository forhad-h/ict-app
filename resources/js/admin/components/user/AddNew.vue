<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3"></div>
      <div class="col-md-6">
        <div class="mb-3 text-right">
            <router-link :to="{ name: 'allusers' }" class="btn btn-secondary">
              <span class="mr-1"><font-awesome-icon icon="angle-left" /></span>
              Back to all users</router-link>
        </div>
        <form @submit.prevent="addUser">
          <div class="form-group">
            <label for="name" class="text-muted">Name <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="name" placeholder="Enter name"
                   v-model.trim="$v.user.name.$model">
            <div class="err-msg text-danger mt-1" v-if="$v.user.name.$dirty && !$v.user.name.required">Name is required</div>
          </div>

          <div class="form-group">
            <label for="email" class="text-muted">Email address <span class="text-danger">*</span></label>
            <input type="email" class="form-control" id="email" placeholder="Enter email address"
                   v-model.trim.lazy="$v.user.email.$model"
                   autocomplete="username email">
            <div class="err-msg text-danger mt-1" v-if="$v.user.email.$dirty && !$v.user.email.required">Email is required</div>
            <div class="err-msg text-danger mt-1" v-if="!$v.user.email.email && user.email != ''">Please Enter a valid email address</div>
            <div class="err-msg text-danger mt-1" v-if="$v.user.email.$dirty && !$v.user.email.unique">'{{user.email}}' already exists, please try another.</div>
          </div>

          <div class="form-group">
            <label for="password" class="text-muted">Password <span class="text-danger">*</span></label>
            <input type="password" class="form-control" id="password" placeholder="Password"
                   v-model.lazy="$v.user.password.$model" autocomplete="new-password">
            <div class="err-msg text-danger mt-1" v-if="$v.user.password.$dirty && !$v.user.password.required">Password is required</div>
            <div class="err-msg text-danger mt-1" v-if="!$v.user.password.minLength">Password must be minimum 6 digit.</div>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="text-muted">Confirm Password <span class="text-danger">*</span></label>
            <input type="password" class="form-control" id="confirmPassword" placeholder="Confirm Password"
                   v-model.lazy="$v.user.confirmPassword.$model"
                   autocomplete="new-password">
            <div class="err-msg text-danger mt-1" v-if="$v.user.confirmPassword.$dirty && !$v.user.confirmPassword.required">Confirm Password is required</div>
            <div class="err-msg text-danger mt-1" v-if="$v.user.confirmPassword.$error">Password doesn't match.</div>
          </div>

          <div class="form-group" v-if="superadmin">
            <label for="role" class="text-muted">Role</label>
            <select class="form-control" id="role" v-model="user.role">
              <option value="">Select Role</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="author">Author</option>
              <option value="observer">Observer</option>
            </select>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-success" :disabled="$v.$invalid">Add New User</button>
          </div>
          <div class="pre_loader" v-if="isLoading">
            <img :src="baseUrl + loaderUrl" alt="">
          </div>
        </form>
      </div>
      <div class="col-md-3"></div>
    </div>
  </div>
</template>
<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';
import {addActivity} from '../../user/addActivity';
export default {
  data() {
    return {
      pageTitle: "Update Profile Info.",
      loading: false,
      uploadedImageUrl: null,
      user: {
        id: '',
        profile_picture: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
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
  },
  methods: {
    addUser() {
      this.$store.dispatch('adminM/loading');
      axios.post(this.$store.getters['adminM/getAddUserApiPath'], this.$data.user)
      .then(response => {
        this.$store.dispatch('adminM/allUsers');

        let desc = "# Added new user - \r\n &nbsp; &nbsp; &nbsp;> " + response.data.user.name + " (" + response.data.user.email + ")";
        addActivity(this, desc);

        this.$router.push('/admin/users/all');
      })
      .catch(err => {
        console.log(err)
      })
    }
  },
  validations: {
    user: {
      name: {
        required
      },
      email: {
        required,
        email,
        unique: value => {
          if(value === '') return false;
          return axios.get('/api/check-email/' + value)
          .then(res => {
            if(res.data.hasEmail) {
              return false;
            }else {
              return true;
            }
          })
          .catch(err => {
            console.log(err);
          })
        }
      },
      password: {
        required,
        minLength: minLength(6)
      },
      confirmPassword: {
        required,
        sameAs: sameAs('password')
      }
    }
  }
}
</script>

