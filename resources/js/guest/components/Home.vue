<template>
  <div>
      <banner/>
      <main-content/>
      <SeveralPosts/>
  </div>
</template>

<script>
import Banner from '../components/shared/Banner.vue';
import MainContent from '../components/general/MainContent.vue';
import SeveralPosts from '../components/post/SeveralPosts.vue';

export default {
  components: {
    Banner,
    MainContent,
    SeveralPosts
  }
}
</script>


