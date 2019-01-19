<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-5">
        <div class="mb-3 text-right">
            <router-link :to="{ name: 'allusers' }" class="btn btn-secondary">
              <span class="mr-1"><font-awesome-icon icon="angle-left" /></span>
              Back to all users</router-link>
        </div>

        <div class="card" style="padding-top: 30px;">
          <div class="header_info text-center">
            <div class="profile_pic">
                <img v-if="user.profile_picture" :src="baseUrl + user.profile_picture" alt="" />
            </div>
          </div>
          <div class="card-body">
            <h5 style="color: #888" class="text-center mb-3">{{user.id != currentUser.id ? 'User' : ''}} Details</h5>
            <span style="position: absolute;top:15px;right: 0;">
              <router-link v-if="user.id == currentUser.id" 
                            :to="{name: 'editprofile', params: {id: currentUser.id}}"
                            class="btn btn-warning btn-sm">
                  Edit Profile <font-awesome-icon :icon="['far', 'edit']" />
              </router-link>
            </span>
            <table class="table">
              <tbody>
                <tr>
                  <td class="bg-light"><strong>ID No.</strong></td>
                  <td>{{ user.id }}</td>
                </tr>
                <tr>
                  <td class="bg-light"><strong>Name</strong></td>
                  <td>{{ user.name }}</td>
                </tr>
                <tr>
                  <td class="bg-light"><strong>Email</strong></td>
                  <td>{{ user.email }}</td>
                </tr>
                <tr>
                  <td class="bg-light"><strong>Role</strong></td>
                  <td class="text-capitalize">{{ user.role }}</td>
                </tr>
                <tr>
                  <td class="bg-light"><strong>User from</strong></td>
                  <td>{{ stringDate(user.created_at) }}</td>
                </tr>
                <tr>
                  <td class="bg-light"><strong>Last updated info. at</strong></td>
                  <td>{{ stringDate(user.updated_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-md-1"></div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-light text-center">
            <h5 class="mb-0" style="color: #888">{{user.id != currentUser.id ? 'User' : ''}} Activities</h5>
          </div>
          <div class="card-body">
            <table class="table table-bordered">
              <tbody>
                <tr>
                  <td width="150" style="border-color: #ccc;"><strong>Date &amp; time</strong></td>
                  <td style="border-color: #ccc;"><strong>Description</strong></td>
                </tr>
                <template v-if="userActivities != null &&
                                userActivities != '' &&
                                userActivities.length">
                  <tr v-for="userActivity in filteredActivities" :key="userActivity.id">
                    <td style="border-color: #ccc;">{{stringDate(userActivity.created_at)}}</td>
                    <td style="border-color: #ccc;" v-html="userActivity.desc"></td>
                  </tr>
                </template>
              </tbody>
            </table>

            <nav aria-label="Page navigation" v-if="!loading">
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
              <a href="#" @click.prevent="clearActivities"
                          v-if="superadmin"
                          class="btn btn-danger" 
                          :class="{disabled: !userActivities.length}"
                          role="button"
                          :aria-disabled="!userActivities.length"
                          style="position: absolute;bottom: 0;right: 0;">Clear all</a>
            </nav>
          </div>
        </div>
      </div>
      <div class="pre_loader" v-if="loading">
        <img :src="baseUrl + loaderUrl" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import {addActivity} from '../../user/addActivity';
export default {
  data() {
    return {
      pageTitle: 'User details and activities',
      loading: false,
      user: {},
      userActivities: [],
      itemsStartFrom: 0,
      showPerPage: 5,
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
    this.fetchUserData()
  },
  methods: {
    stringDate(postDate) {
      let date = new Date(postDate);
      let day = date.getDate();
      let month = date.toLocaleString('en-us', { month: 'long' });
      let year = date.getFullYear();
      let hours = date.getHours();
      let miniutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      let format12 = hours >= 12 ? "pm" : "am"
      hours = hours % 12;
      hours = hours ? hours : 12;
      let stringDate = day + " " + month + " " + year + " " + hours + ":" + miniutes + format12;

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
    clearActivities() {
      let confirmation = confirm("Are you sure to clear all activities of " + this.user.name);
      if(confirmation && this.superadmin) {
        this.$store.dispatch('adminM/loading');
        axios.get("/api/user/activities/" + this.user.id + "/delete")
        .then(response => {
          let desc = "# Clear activities of " + this.user.name;
          addActivity(this, desc);
          this.fetchUserData()
        })
        .catch(err => {
            console.log(err)
          }
        )
      }
      return;
    },
    fetchUserData() {
      this.loading = true;
      axios.get('/api/user/' + this.$route.params.id + '/view')
      .then(response => {
        this.user = response.data.user;
        this.userActivities = response.data.userActivities;
        this.loading = false;
      })
      .catch(err => {
          console.log(err)
          this.loading = false;
        }
      )
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.userActivities.length/this.showPerPage);
    },
    filteredActivities() {
      let filteredActivities = [...this.userActivities].reverse();
      filteredActivities = filteredActivities.slice(this.itemsStartFrom, Number(this.itemsStartFrom) + Number(this.showPerPage));
      return filteredActivities;
    }
  }
}
</script>
<style scoped>
.header_info {
  position: absolute;
  left: 0;
  top: -75px;
}
.header_info .profile_pic {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  background: #ddd;
}
.header_info .profile_pic img {
  max-width: 100%;
}

</style>

