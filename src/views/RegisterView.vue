<style lang="scss" scoped>
@import "@/assets/scss/views/register.scss";
</style>

<template>
  <Header />
  <div class="register">
    <h1>Inscription</h1>
    <form @submit.prevent="register" class="register__form">
      <input
        type="text"
        placeholder="Pseudo"
        v-model="pseudo"
        required
        class="register__input"
      />
      <input
        type="password"
        placeholder="Mot de passe"
        v-model="password"
        required
        class="register__input"
      />
      <button type="submit" class="register__button">Valider</button>
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
    register() {},
  },
};
</script>
