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
        v-model="username"
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
      usename: "",
      password: "",
    };
  },
  components: {
    Header,
    Footer,
  },
  methods: {
    async register() {
      const userInfos = {
        username: this.username,
        password: this.password,
      };

      try {
        const res = await fetch("https://localhost:7080/api/Users/register", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userInfos)
        })

        if(res.ok) {
          const data = await res.json()
          console.log("Réponse de l'API :", data);
          this.$router.push("/connexion");
        } else {
          console.log("Erreur dans le réponse");
        }

      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
