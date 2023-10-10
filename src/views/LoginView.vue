<style lang="scss" scoped>
@import "@/assets/scss/views/login.scss";
</style>

<template>
  <Header />
  <div>
    <h1 class="login">Login Page</h1>
    <p>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero, tempora
      architecto? Rem similique libero laborum maxime facere! Deleniti odit,
      quidem maiores, nemo similique tenetur vero voluptas consequuntur tempora
      blanditiis at.
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
