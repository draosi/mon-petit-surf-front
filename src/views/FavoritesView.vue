<style lang="scss" scoped>
@import "@/assets/scss/views/favorites.scss";
</style>

<template>
  <Header />
  <main>
    <h1></h1>
    <ul>
      <li>
        <div></div>
        <button></button>
        <button></button>
      </li>
    </ul>
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
