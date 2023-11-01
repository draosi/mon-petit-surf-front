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
import axios from 'axios'

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
      }

      axios.post('https://localhost:7080/api/Users/register', userInfos)
      .then(res => console.log(res))
      .catch(err => console.log(err))
    },
    // async register() {
    //   const userInfos = {
    //     username: this.username,
    //     password: this.password,
    //   };

    //   await fetch("https://localhost:7080/api/Users/register", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(userInfos),
    //   })
    //     .then((res) => {
    //       console.log(res);
    //       if (res.ok) {
    //         return res.json();
    //       } else {
    //         console.log("Erreur dans le if !");
    //       }
    //     })
    //     .then((data) => {
    //       console.log("Réponse JSON :", data);
    //     })
    //     // .catch((err) => console.log(err));
    // },
  },
};
</script>
