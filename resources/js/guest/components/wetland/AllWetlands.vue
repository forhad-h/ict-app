<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">

        <template v-if="noData">
            <div class="alert alert-warning emptyMsg text-center">
              <h5 class="mb-0">Wetland Not Found</h5>
            </div>
        </template>
        <template v-if="failedConnection">
            <div class="alert alert-danger emptyMsg text-center">
              Database connection error. Please 
              <a href="#" @click.prevent="logOut" class="btn btn-secondary btn-sm">Log In</a>
            </div>
        </template>

        <div class="row">
          <div class="col-md-12">
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

              <div class="form-group mr-3 mb-3">
                <select class="form-control" id="filterNature" v-model="filterNature">
                  <option value="">Filter by Nature</option>
                  <option value="haor">Haor</option>
                  <option value="beel">Beel</option>
                </select>
              </div>

              <div class="form-group mr-3 mb-3">
                <input type="text" class="form-control" id="filterName" placeholder="Filter by Name"
                      v-model="filterName">
              </div>

              <div class="form-group mr-3 mb-3">
                <input type="text" class="form-control" id="filterLocation" placeholder="Filter by Location"
                      v-model="filterLocation">
              </div>

              <div class="form-group mr-3 mb-3">
                <input type="text" class="form-control" id="filterArea" placeholder="Filter by Area"
                      v-model="filterArea">
              </div>

              <div class="form-group mr-3 mb-3">
                <input type="text" class="form-control" id="filterFlora" placeholder="Filter by Flora"
                      v-model="filterFlora">
              </div>

              <div class="form-group mr-3 mb-3">
                <input type="text" class="form-control" id="filterFauna" placeholder="Filter by Fauna"
                      v-model="filterFauna">
              </div>


              <div class="form-group mr-3"><label class="text-muted">Showing {{filteredWetlands.length}} of {{this.totalFilteredItems}}</label></div>

            </div>
          </div>
        </div>


        <!-- <table class="table table-striped">
          <thead>
            <tr class="bg-dark text-white">
              <td><strong>#</strong></td>
              <td><strong>Nature</strong></td>
              <td><strong>Name</strong></td>
              <td><strong>Location</strong></td>
              <td><strong>Area</strong></td>
              <td><strong>Flora</strong></td>
              <td><strong>Fauna</strong></td>
              <td><strong>Remarks</strong></td>
              <td class="text-center"><strong>Actions</strong></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(wetland) in filteredWetlands" :key="wetland.id">
              <td>{{ wetland.serialNo }}</td>
              <td class="text-capitalize">{{ wetland.nature }}</td>
              <td>{{ wetland.name }}</td>
              <td>{{ wetland.location }}</td>
              <td>{{ wetland.area }}</td>
              <td>{{ wetland.flora }}</td>
              <td>{{ wetland.fauna }}</td>
              <td>{{ wetland.remarks }}</td>
              <td class="text-center" width="130px">
                <router-link :to="{name: 'viewwetland', params: {id: wetland.id}}" class="btn btn-primary btn-sm"><font-awesome-icon :icon="['fas', 'eye']" /></router-link>

                <router-link v-if="superadmin || roleAdmin"
                             :to="{name: 'editwetland', params: {id: wetland.id}}"
                             class="btn btn-warning btn-sm">
                  <font-awesome-icon :icon="['far', 'edit']" />
                </router-link>

                <a href="#"  v-if="superadmin" class="btn btn-danger btn-sm" @click.prevent="deleteWetland(wetland)"><font-awesome-icon icon="trash" /></a>
              </td>
            </tr>
          </tbody>
        </table> -->

        <div class="row">
          <template v-for="(wetland) in filteredWetlands">
            <div class="col-md-3 mb-4" :key="wetland.id">
              <div class="card">
                <div class="card-body">
                  <div class="body_info text-center" :style="{backgroundImage: 'url(' +wetland.pic_url +')'}">
                    <div class="body_overlay pl-2 pr-2">
                      <div class="label_info"><span class="d-inline-block pl-3 pr-3 pt-1 bg-success text-white text-uppercase">{{wetland.nature}}</span></div>
                      <h4 class="card-title text-capitalize">{{wetland.name}}, {{wetland.location}}</h4>
                      <router-link :to="{name: 'guestviewwetland', params: {id: wetland.id}}" class="btn btn-primary btn-sm">View</router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="pre_loader" v-if="isGuestLoading">
          <img :src="baseUrl + loaderUrl" alt="">
        </div>

        <nav aria-label="Page navigation" v-if="!isGuestLoading && !noData">
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

      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageTitle: "List of All Wetlands",
      filterNature: '',
      filterName: '',
      filterLocation: '',
      filterArea: '',
      filterFlora: '',
      filterFauna: '',
      itemsStartFrom: 0,
      showPerPage: 10,
      totalFilteredItems: 0,
      currentPageNumber: 1,
    }
  },
  mounted() {
    this.$store.dispatch('pageHeading', this.pageTitle);
    if(!this.allWetlands.length) {
      this.$store.dispatch('guestM/loading');
      this.$store.dispatch('guestM/allWetlands');
    }
  },
  computed: {
    allWetlands() {
      return this.$store.getters['guestM/getAllWetlands']
    },
    failedConnection() {
      return this.$store.getters['guestM/getFailedConnection'];
    },
    noData() {
      if(!this.filteredWetlands.length &&
         !this.isGuestLoading &&
         !this.failedConnection) {
        return true;
      }
      return;
    },
    currentUser() {
      return this.$store.getters['adminM/getCurrentUser'];
    },
    filteredWetlands() {
      let filteredWetlands = this.allWetlands.filter((eachWetland) => {
        
        eachWetland.nature = eachWetland.nature != null ? eachWetland.nature : '';
        eachWetland.name = eachWetland.name != null ? eachWetland.name : '';
        eachWetland.location = eachWetland.location != null ? eachWetland.location : '';
        eachWetland.area = eachWetland.area != null ? eachWetland.area : '';
        eachWetland.flora = eachWetland.flora != null ? eachWetland.flora : '';
        eachWetland.fauna = eachWetland.fauna != null ? eachWetland.fauna : '';

        let matchWetlandNature = eachWetland.nature.toLowerCase().match(
                              this.filterNature.toLowerCase());

        let matchWetlandName = eachWetland.name.toLowerCase().match(
                              this.filterName.toLowerCase());

        let matchWetlandLocation = eachWetland.location.toLowerCase().match(
                              this.filterLocation.toLowerCase());

        let matchWetlandArea = eachWetland.area.toLowerCase().match(
                              this.filterArea.toLowerCase());

        let matchWetlandFlora = eachWetland.flora.toLowerCase().match(
                              this.filterFlora.toLowerCase());

        let matchWetlandFauna = eachWetland.fauna.toLowerCase().match(
                              this.filterFauna.toLowerCase());

        if(!!matchWetlandNature &&
           !!matchWetlandName &&
           !!matchWetlandLocation &&
           !!matchWetlandFlora &&
           !!matchWetlandFauna &&
           !!matchWetlandArea) {
            return eachWetland;
        }
      })
      this.totalFilteredItems = filteredWetlands.length;
      return filteredWetlands.slice(this.itemsStartFrom, Number(this.itemsStartFrom) + Number(this.showPerPage));
    },
    totalPage() {
      return Math.ceil(this.totalFilteredItems/this.showPerPage);
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('adminM/logOut', this.$router);
    },
    deleteWetland(wetland) {
      let confirmation = confirm("Are you sure to delete -> " + wetland.name);
      if(confirmation && this.superadmin) {
        this.$store.dispatch('adminM/loading');
        axios.get('/api/wetland/' + wetland.id + '/delete')
        .then(response => {
          this.$store.dispatch('adminM/allWetlands');
        })
        .catch(err => {
            console.log(err)
          }
        )
      }
      return;
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
    }
  },
  watch: {
    filterNature() {
      triggerWatch(this)
    },
    filterName() {
      triggerWatch(this)
    },
    filterLocation() {
      triggerWatch(this)
    },
    filterArea() {
      triggerWatch(this)
    },
    filterFlora() {
      triggerWatch(this)
    },
    filterFauna() {
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
<style scoped>
.emptyMsg,
.pre_loader {
  top: 150px;
  position: absolute;
  width: calc(100% - 30px);
  left: 15px;
}
.card-body .body_info {
  background-color: #aaa;
  background-repeat: no-repeat;
  background-size: cover;
}
.card-body .body_overlay {
  padding-top: 2.5rem;
  padding-bottom: 1.5rem;
  width: 100%;
  height: 100%;
  position: relative;
  background: rgba(0,0,0,0.4);
}
.card-body .label_info {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
}
.card-body .body_info h4 {
  color: #fff;
  text-shadow: -1px 1px 3px rgba(0,0,0,0.5);
}
</style>