<style lang="scss" scoped>
@import "@/assets/scss/views/login.scss";
</style>

<template>
  <Header />
  <div class="login">
    <h1>Connexion</h1>
    <form @submit.prevent="login" class="login__form">
      <input
        type="text"
        placeholder="Pseudo"
        v-model="pseudo"
        required
        class="login__input"
      />
      <input
        type="password"
        placeholder="Mot de passe"
        v-model="password"
        required
        class="login__input"
      />
      <button type="submit" class="login__button">Connexion</button>
    </form>
  </div>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  data() {
    return {
      pseudo: "",
      password: "",
    };
  },
  components: {
    Header,
    Footer,
  },
  methods: {
    login() {},
  },
};
</script>
