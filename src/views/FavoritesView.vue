<style lang="scss" scoped>
@import "@/assets/scss/views/favorites.scss";
</style>

<template>
    <Header />
    <div>
      <h1 class="favorite">Page favoris</h1>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus sed,
        vitae est eius vero numquam at? Maxime totam, enim modi nemo numquam
        deserunt rem molestias laudantium odit necessitatibus omnis sunt!
      </p>
    </div>
    <Footer />
  </template>
  
  <script>
  import Header from "@/components/Header.vue";
  import Footer from "@/components/Footer.vue";
  
  export default {
    components: {
      Header,
      Footer,
    },
  };
  </script>