<style lang="scss" scoped>
@import "@/assets/scss/views/register.scss";
</style>

<template>
  <Header />
  <main class="register">
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
  </main>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  data() {
    return {
      username: "",
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}Users/register`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userInfos)
        })

        if(res.ok) {
          this.$router.push("/connexion");
        } else {
          if (res.status === 500) {
            console.log("Erreur interne au serveur");
          } else {
            console.log("Erreur inattendue. Code de statut : " + res.status);
          }
        }

      } catch (err) {
        console.error("Une erreur s'est produite lors de l'inscription : " + err.message);
      }
    },
  },
};
</script>
