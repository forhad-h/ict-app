<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-2"></div>
      <div class="col-md-8">
        <div class="mb-3 text-right">
            <router-link :to="{ name: 'allwetlands' }" class="btn btn-secondary">
              <span class="mr-1"><font-awesome-icon icon="angle-left" /></span>
              Back to all wetlands</router-link>
        </div>

        <div class="card">
          <div class="wetland_pic text-center">
              <img v-if="wetland.pic_url" :src="baseUrl + wetland.pic_url" alt="" />
          </div>

          <div class="card-body">
            <h5 style="color: #555" class="text-center mb-3">Wetland Details</h5>
            <table class="table">
              <tbody>
                <tr>
                  <td>Nature of Wetland</td>
                  <td class="bg-light text-capitalize" style="min-width: 20vw"><strong>{{ wetland.nature }}</strong></td>
                </tr>
                <tr>
                  <td>Name of wetland</td>
                  <td class="bg-light"><strong>{{ wetland.name }}</strong></td>
                </tr>
                <tr>
                  <td>Location of Upazila</td>
                  <td class="bg-light text-capitalize"><strong>{{ wetland.location }}</strong></td>
                </tr>
                <tr>
                  <td>Area of wetlands (Acres)</td>
                  <td class="bg-light"><strong>{{ wetland.area }}</strong></td>
                </tr>
                <tr>
                  <td>Flora of Wetland</td>
                  <td class="bg-light"><strong>{{ wetland.flora }}</strong></td>
                </tr>
                <tr>
                  <td>Fauna of Wetland</td>
                  <td class="bg-light"><strong>{{ wetland.fauna }}</strong></td>
                </tr>
                <tr>
                  <td>Remarks</td>
                  <td class="bg-light"><strong>{{ wetland.remarks }}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="pre_loader" v-if="loading">
          <img :src="baseUrl + loaderUrl" alt="">
        </div>
      </div>
      <div class="col-md-2"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageTitle: 'Wetland details',
      loading: false,
      wetland: {},
    }
  },
  mounted() {
    this.$store.dispatch('pageHeading', this.pageTitle);
    this.loading = true;
      axios.get('/api/wetland/' + this.$route.params.id + '/view')
      .then(response => {
        this.wetland = response.data.wetland
        this.loading = false;
      })
      .catch(err => {
          console.log(err)
          this.loading = false;
        }
      )
  }
}
</script>
<style>
.wetland_pic img {
  max-width: 100%;
}

</style>

