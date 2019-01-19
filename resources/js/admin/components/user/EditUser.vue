<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3"></div>
      <div class="col-md-6">
        <div class="mb-3 text-right">
          <span @click="refreshUsers">
            <router-link :to="{ name: 'allusers' }" class="btn btn-secondary">
              <span class="mr-1"><font-awesome-icon icon="angle-left" /></span>
              Back to all users</router-link>
          </span>
        </div>
        <form @submit.prevent="updateUser">
          <div class="form-group">
            <label for="name" class="text-muted">Name</label>
            <input type="text" class="form-control" id="name" placeholder="Enter name"
                  v-model.trim="$v.user.name.$model">
            <div class="err-msg text-danger mt-1" v-if="$v.user.name.$dirty && !$v.user.name.required">Name is required</div>
          </div>

          <div class="form-group">
            <label for="email" class="text-muted">Email address</label>
            <input type="email" class="form-control" id="email" placeholder="Enter email address"
                  v-model.trim.lazy="$v.user.email.$model"
                  autocomplete="username email">
            <div class="err-msg text-danger mt-1" v-if="$v.user.email.$dirty && !$v.user.email.required">Email is required</div>
            <div class="err-msg text-danger mt-1" v-if="!$v.user.email.email && user.email != ''">Please Enter a valid email address</div>
            <div class="err-msg text-danger mt-1" v-if="$v.user.email.$dirty && !$v.user.email.unique">'{{user.email}}' already exists, please try another.</div>
          </div>

          <div class="form-group">
            <label for="password" class="text-muted">Password</label>
            <input type="password" class="form-control" id="password" placeholder="Password"
                  v-model.lazy="$v.user.password.$model" autocomplete="new-password">
            <div class="err-msg text-danger mt-1" v-if="!$v.user.password.minLength">Password must be minimum 6 digit.</div>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="text-muted">Confirm Password</label>
            <input type="password" class="form-control" id="confirmPassword" placeholder="Confirm Password"
                  v-model="$v.user.confirmPassword.$model"
                  autocomplete="new-password">
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
            <button type="submit" class="btn btn-success" :disabled="$v.$invalid">Update User</button>
          </div>
          <div class="pre_loader" v-if="loading">
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
      pageTitle: "Update User Info",
      loading: false,
      user: {
        id: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
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

    axios.get('/api/user/' + this.$route.params.id + '/view')
    .then(response => {
      let passField = {
        password: this.user.password,
        confirmPassword: this.user.confirmPassword
      }
      this.user = Object.assign({}, response.data.user, passField);
    })
    .catch(err => {
        console.log(err)
      }
    )
  },
  methods: {
    updateUser() {
      this.loading = true;
      axios.post('/api/user/' + this.$route.params.id + '/edit', this.user)
      .then(response => {
        this.user = response.data.updatedUser
        this.loading = false;

        if(response.data.updatePassword) {
          let desc = "# Changed password and/or Updated user info \r\n";
          desc += "* Affected user - \r\n &nbsp; &nbsp; &nbsp;> " + this.user.name + " (" + this.user.email + ")\r\n";
          addActivity(this, desc);
        }else {
          let desc = "# Updated user info \r\n";
          desc += "* Affected user - \r\n &nbsp; &nbsp; &nbsp;> " + this.user.name + " (" + this.user.email + ")\r\n";
          addActivity(this, desc);
        }

      })
      .catch(err => {
          console.log(err)
          this.loading = false;
        }
      )
    },
    refreshUsers() {
      this.$store.dispatch('adminM/loading');
      this.$store.dispatch('adminM/allUsers');
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
        unique
      },
      password: {
        minLength: minLength(6)
      },
      confirmPassword: {
        sameAs: sameAs('password')
      }
    }
  },
}
function unique() {
  if(this.user.email === '') return true;
  return axios.get('/api/check-email/' + this.user.email)
  .then(res => {
    if(res.data.hasEmail && 
       (this.$route.params.id != res.data.user.id)) {
      return false;
    }else {
      return true;
    }
  })
  .catch(err => {
    console.log(err);
  })
}
</script>
