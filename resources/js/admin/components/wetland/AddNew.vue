<template>
  <div class="container">
    <div class="row">
      <div class="col-md-1"></div>
      <div class="col-md-10">
        <div class="mb-3 text-right">
            <router-link :to="{ name: 'allwetlands' }" class="btn btn-secondary">
              <span class="mr-1"><font-awesome-icon icon="angle-left" /></span>
              Back to all wetlands</router-link>
        </div>
        <form @submit.prevent="addWetland">
          
          <div class="row">

            <div class="col-md-6">
              <div class="form-group">
                <label for="nature" class="text-muted">Nature of Wetland</label>
                <select class="form-control" id="nature" v-model="wetland.nature">
                  <option value="">Select Nature of Wetland</option>
                  <option value="haor">Haor</option>
                  <option value="beel">Beel</option>
                </select>
              </div>

              <div class="form-group">
                <label for="name" class="text-muted">Name of wetland</label>
                <input type="text" class="form-control" id="name" placeholder="Enter Name of wetland"
                      v-model="wetland.name">
              </div>

              <div class="form-group">
                <label for="location" class="text-muted">Location of Upazila</label>
                <input type="text" class="form-control" id="location" placeholder="Enter Location of Upazila"
                      v-model="wetland.location">
              </div>

              <div class="form-group">
                <label for="area" class="text-muted">Area of wetland (Acres)</label>
                <input type="text" class="form-control" id="area" placeholder="Enter Area of wetland (Acres)"
                      v-model="wetland.area">
              </div>

              <div class="form-group">
                <label for="flora" class="text-muted">Flora of Wetland</label>
                <input type="text" class="form-control" id="flora" placeholder="Enter Flora of Wetland"
                      v-model="wetland.flora">
              </div>

              <div class="form-group">
                <label for="fauna" class="text-muted">Fauna of Wetland</label>
                <input type="text" class="form-control" id="fauna" placeholder="Enter Fauna of Wetland"
                      v-model="wetland.fauna">
              </div>

              <div class="form-group">
                <label for="remarks" class="text-muted">Remarks</label>
                <input type="text" class="form-control" id="remarks" placeholder="Enter Remarks"
                      v-model="wetland.remarks">
              </div>
            </div>

            <div class="col-md-6">
              <div class="image_field ml-auto mr-auto mb-3">
                <img v-if="wetland.pic_url" :src="baseUrl + wetland.pic_url" alt="" />
                <img v-if="uploadedImageUrl" :src="uploadedImageUrl" />
                <input type="file" id="upload_ppic" @change="onFileChange" accept="image/*" v-show="false"/>
                <label for="upload_ppic" class="btn btn-primary upload_btn">
                  <font-awesome-icon :icon="['far', 'edit']" />
                </label>
              </div>
              <p class="text-center text-muted">Image ratio should be width = 3 x height</p>
              <div class="text-center">
                <button type="submit" class="btn btn-success">Add New Wetland</button>
              </div>
            </div>
        
          </div>
          <div class="pre_loader" v-if="isLoading">
            <img :src="baseUrl + loaderUrl" alt="">
          </div>
        </form>
      </div>
      <div class="col-md-1"></div>
    </div>
  </div>
</template>
<script>
import {addActivity} from '../../user/addActivity';
export default {
  data() {
    return {
      pageTitle: "Add new wetland",
      uploadedImageUrl: null,
      wetland: {
        wetland_pic: '',
        pic_url: '',
        nature: '',
        name: '',
        location: '',
        area: '',
        flora: '',
        fauna: '',
        remarks: '',
      },
      userActivity: {
        'user_id': '',
        'user_name': '',
        'desc': ''
      }
    }
  },
  methods: {
    addWetland() {
      this.$store.dispatch('adminM/loading');
      let data = new FormData();

      data.append('wetland_pic', this.wetland.wetland_pic);
      data.append('nature', this.wetland.nature);
      data.append('name', this.wetland.name);
      data.append('location', this.wetland.location);
      data.append('area', this.wetland.area);
      data.append('flora', this.wetland.flora);
      data.append('fauna', this.wetland.fauna);
      data.append('remarks', this.wetland.remarks);

      axios.post(this.$store.getters['adminM/getAddWetlandApiPath'], data)
      .then(response => {
        this.$store.dispatch('adminM/allWetlands');
        this.$router.push('/admin/wetlands/all');

        let desc = "# Added new wetland - \r\n &nbsp; &nbsp; &nbsp;> " 
                    + response.data.wetland.name
                    + ", " + response.data.wetland.location;
        addActivity(this, desc);
      })
      .catch(err => {
        console.log(err)
      })
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      this.wetland.wetland_pic = files[0];
      this.uploadedImageUrl = URL.createObjectURL(this.wetland.wetland_pic);
    }
  },
  mounted() {
    this.$store.dispatch('pageHeading', this.pageTitle);
  },
}
</script>
<style scoped>
  .image_field {
    width: 100%;
    min-height: 145px;
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


