<template>
  <div class="container">
    <div class="row">
      <div class="col-md-1"></div>
      <div class="col-md-10">
        <form @submit.prevent="updateUser">
          <div class="row">

            <div class="col-md-6">
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

              </div>

              <div class="col-md-6">
                <div class="image_field ml-auto mr-auto mb-3">
                  <img v-if="user.profile_picture && !uploadedImageUrl" :src="baseUrl + user.profile_picture" alt="" />
                  <img v-if="uploadedImageUrl" :src="uploadedImageUrl" />
                  <input type="file" id="upload_ppic" @change="onFileChange" accept="image/*" v-show="false"/>
                  <label for="upload_ppic" class="btn btn-primary upload_btn">
                    <font-awesome-icon :icon="['far', 'edit']" />
                  </label>
                </div>
                <p class="text-center text-muted">Please upload square image for better preview.</p>
                <div class="text-center">
                  <button type="submit" class="btn btn-success" :disabled="$v.$invalid">Update Profile</button>
                </div>
              </div>
            </div>


          <div class="pre_loader" v-if="loading">
            <img :src="baseUrl + loaderUrl" alt="">
          </div>
        </form>
      </div>
      <div class="col-md-1"></div>
    </div>
    <div>
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
    axios.get('/api/user/' + this.$route.params.id + '/view')
    .then(response => {
      let passField = {
        password: this.user.password,
        confirmPassword: this.user.confirmPassword
      }
      this.user = Object.assign({}, response.data.user, passField);
      this.$store.commit('adminM/setProfilePicture', this.user.profile_picture);
    })
    .catch(err => {
        console.log(err)
      }
    )
  },
  methods: {
    updateUser() {
      this.loading = true;
      let data = new FormData();
      
      data.append('profile_picture', this.user.profile_picture);
      data.append('id', this.currentUser.id);
      data.append('name', this.user.name);
      data.append('email', this.user.email);
      data.append('password', this.user.password);
      data.append('confirmPassword', this.user.confirmPassword);
      data.append('role', this.user.role);
      
      axios.post('/api/user/profile', data)
      .then(response => {
        let passField = {
          password: '',
          confirmPassword: ''
        }
        this.user = Object.assign({}, response.data.updatedProfile, passField);
        this.$store.commit('adminM/setProfilePicture', this.user.profile_picture);
        this.loading = false;

        if(response.data.updatePassword) {
          addActivity(this, "Changed password and/or Updated profile info")
          .then(response => {
            this.$store.dispatch('adminM/logOut', this.$router);
          })
          .catch(err => {
            console.log(err);
          });
        }else {
          addActivity(this, "Updated profile info");
        }

      })
      .catch(err => {
          console.log(err)
        }
      )
      
    },
    refreshUsers() {
      this.$store.dispatch('adminM/loading');
      this.$store.dispatch('adminM/allUsers');
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      this.user.profile_picture = files[0];
      this.uploadedImageUrl = URL.createObjectURL(this.user.profile_picture);
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters['adminM/getCurrentUser'];
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
    if(res.data.hasEmail && this.user.email != this.currentUser.email) {
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
<style scoped>
  .image_field {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
    background: #ddd;
    position: relative;
  }
  .image_field .upload_btn {
    position: absolute;
    left: 80px;
    top: 150px;
  }
</style>

