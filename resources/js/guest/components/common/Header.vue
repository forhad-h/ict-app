<template>
  <header class="main_header">
      <nav class="navbar navbar-expand-lg fixed-top bg-white navbar-light">
        <div class="container">
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
            
            <router-link to="/" class="navbar-brand" active-class="active" exact>
              <img :src="baseUrl + logoSrc">
            </router-link>
              
            <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
              <router-link tag="li" to="/" class="nav-item" active-class="active" exact><a  class="nav-link">Home</a></router-link>
              <router-link tag="li" :to="{name: 'blog'}" class="nav-item" active-class="active" exact><a  class="nav-link">Blog</a></router-link>
              <router-link tag="li" :to="{name: 'wetlands'}" class="nav-item" active-class="active" exact><a  class="nav-link">WetLands</a></router-link>
              <li class="nav-item">
                <a href="#" @click.prevent="showSearchOptions"
                            class="nav-link btn btn-outline-secondary search_btn">
                <font-awesome-icon icon="search" />
              </a></li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="search_filter_options text-center" v-if="searchOptions">
        <a href="#" @click.prevent="hideSearchOptions" class="btn btn-danger btn-lg close_btn"><font-awesome-icon icon="times" /></a>
        <div class="row">
          <div class="col-md-4"></div>
          <div class="col-md-4">
            <div class="filterOptions mb-3 text-center">
              <div class="col-12 pl-0 mb-3">
                <h4 class="d-inline mr-4 text-white">Search Options</h4>
              </div>

              <div class="form-group mb-3">
                <select class="form-control" id="filterNature" v-model="filterNature">
                  <option value="">Filter by Nature</option>
                  <option value="haor">Haor</option>
                  <option value="beel">Beel</option>
                </select>
              </div>

              <div class="form-group mb-3" v-show="filterNature">
                <input type="text" class="form-control" id="filterName" placeholder="Filter by Name"
                      v-model="filterName">
              </div>
              <div class="form-group mb-3" v-show="filterName">
                <input type="text" class="form-control" id="filterLocation" placeholder="Filter by Location"
                      v-model="filterLocation">
              </div>

              <div class="form-group mb-3" v-show="filterLocation">
                <input type="text" class="form-control" id="filterArea" placeholder="Filter by Area"
                      v-model="filterArea">
              </div>

              <div class="form-group mb-3" v-show="filterArea">
                <input type="text" class="form-control" id="filterFlora" placeholder="Filter by Flora"
                      v-model="filterFlora">
              </div>

              <div class="form-group mb-3" v-show="filterFlora">
                <input type="text" class="form-control" id="filterFauna" placeholder="Filter by Fauna"
                      v-model="filterFauna">
              </div>
              
              <div class="form-group mb-3">
                <router-link :to="{
                                    name: 'searchedwetlands',
                                    query: {nature: filterNature,
                                            name: filterName,
                                            location: filterLocation,
                                            area: filterArea,
                                            flora: filterFlora,
                                            fauna: filterFauna
                                            },
                                  }" 
                             class="btn btn-primary btn-lg btn-block">Search</router-link>
              </div>

            </div>
          </div>
          <div class="col-md-4"></div>
        </div>
      </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      logoSrc: '/img/logo.png',
      headerBackSrc: '/img/header_back.png',
      filterNature: '',
      filterName: '',
      filterLocation: '',
      filterArea: '',
      filterFlora: '',
      filterFauna: '',
      searchOptions: false
    }
  },
  methods: {
    showSearchOptions() {
      this.clearSearchData();
      this.searchOptions = true;
    },
    hideSearchOptions() {
      this.clearSearchData();
      this.searchOptions = false;
    },
    clearSearchData() {
      this.filterNature = '';
      this.filterName = '';
      this.filterLocation = '';
      this.filterArea = '';
      this.filterFlora = '';
      this.filterFauna = '';
    }
  },
  watch: {
    '$route'() {
      this.searchOptions = false;
    }
  }
}
</script>

<style>
.main_header .navbar {
  background-size: cover;
  background-repeat: no-repeat;
  border-bottom: 3px solid #0ec34e;
}
.main_header .navbar ul li {
  margin-left: 25px;
}
.main_header .navbar ul li a {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 16px;
  padding: 8px 20px!important;
  border-radius: 10px;
}

.main_header .navbar ul li.active a {
  border: 2px solid #0ec34e;
  border-radius: 10px;
  color: #0ec34e!important;
}
.main_header .navbar ul li a.search_btn {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0!important;
  line-height: 2.5;
}
.search_filter_options {
  position: fixed;
  top: 78px;
  left: 0;
  z-index: 999999;
  background: rgba(0,0,0,0.8);
  height: 100%;
  width: 100%;
  padding-top: 15vh;
}
.close_btn {
  position: absolute;
  top: 20px;
  right: 10%;
}
.search_filter_options .filterOptions .form-control {
  height: 45px;
}
</style>

