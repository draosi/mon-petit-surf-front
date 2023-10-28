<style lang="scss" scoped>
@import "@/assets/scss/views/spotDetails.scss";
</style>

<template>
    <Header />
    <main class="main">
      <section class="infos">
        <h1></h1>
        <div>
          <div></div>
          <div></div>
        </div>
      </section>
      <section></section>
    </main>
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