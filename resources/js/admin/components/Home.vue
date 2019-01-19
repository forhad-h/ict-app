<template>
  <div class="container-fluid">
    <div class="row ml-2">
      <h1>Dashboard</h1>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageTitle: "Dashboard"
    }
  },
  mounted() {
    this.$store.dispatch('pageHeading', this.pageTitle);
  }
}
</script>
