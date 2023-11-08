<style lang="scss" scoped>
@import "@/assets/scss/views/login.scss";
</style>

<template>
  <Header />
  <main class="login">
    <h1>Connexion</h1>
    <form @submit.prevent="login" class="login__form">
      <input
        type="text"
        placeholder="Pseudo"
        v-model="username"
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
    async login() {
      const userInfos = {
        username: this.username,
        password: this.password,
      };

      try {
        const res = await fetch("https://localhost:7080/api/Users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfos),
        });

        if (res.ok) {
          const data = await res.json();
          sessionStorage.setItem("jwt", `${data.token}`);
          sessionStorage.setItem("userId", data.userId);

          this.$router.push("/");
        } else {
          console.log("Erreur dans la réponse");
          alert("Pseudo ou mot de passe incorrect")
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
