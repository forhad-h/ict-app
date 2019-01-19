<template>
  <div class="banner_wrapper" :style="bannerStyle">
    <div class="banner">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8 offset-2 text-center pt-5">
            <h1 class="text-white" >Bangladesh is a land of Wetland</h1>
            <p class="text-white">Wetlands are considered as invaluable components of the ecosystems with enormous economic, ecological, and commercial importance. Haors are rich in biodiversity in terms of floral and faunal composition including migratory birds of global and regional significance.</p>
            <a href="#" class="btn btn-outline-warning btn-lg">Read More</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      bannerBackSrc: '/img/banner.jpg',
    }
  },
  computed: {
    baseUrl() {
      return this.$store.getters.getBaseUrl;
    },
    bannerStyle() {
      return {
        backgroundImage: 'url(' + this.baseUrl + this.bannerBackSrc + ')',
      };
    },
  },
}
</script>

<style scoped>
.banner_wrapper {
  height: 100vh;
}
.banner_wrapper .banner {
  background-color: rgba(0,0,0,0.6);
  width: 100%;
  height: 100%;
}
.banner .container,
.banner .container .row {
  height: 100%
}
.banner h1 {
    font-weight: 200;
    font-size: 5rem;
    text-shadow: -20px -10px 0px rgba(200,200,200,0.2);
}
.banner p {
  color: #fff !important;
  font-size: 1.5rem;  
  text-shadow: 1px 1px 2px #000;
  text-align: justify;
}
</style>
