<style lang="scss" scoped>
@import "@/assets/scss/views/login.scss";
</style>

<template>
  <Header />
  <main class="login">
    <h1>Connexion</h1>
    <form
      @submit.prevent="login"
      class="login__form">
      <input
        type="text"
        placeholder="Pseudo"
        v-model="username"
        required
        class="login__input" />
      <input
        type="password"
        placeholder="Mot de passe"
        v-model="password"
        required
        class="login__input" />
      <button
        type="submit"
        class="login__button">
        Connexion
      </button>
    </form>
  </main>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"

export default {
  data() {
    return {
      username: "",
      password: ""
    }
  },
  components: {
    Header,
    Footer
  },
  methods: {
    async login() {
      const userInfos = {
        username: this.username,
        password: this.password
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}Users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userInfos)
        })

        if (res.ok) {
          const data = await res.json()
          sessionStorage.setItem("jwt", `${data.token}`)

          this.$router.push("/")
        } else {
          if (res.status === 400) {
            console.log("Pseudo ou mot de  passe incorrect")
            alert("Pseudo ou mot de  passe incorrect")
          } else if (res.status === 500) {
            console.log(
              "Erreur interne au serveur, veuillez réessayer plus tard"
            )
            alert("Erreur interne au serveur, veuillez réessayer plus tard")
          } else {
            console.log("Erreur inattendue. Code de statut : " + res.status)
            alert(
              "Une erreur inattendue s'est produite. Veuillez réessayer plus tard."
            )
          }
        }
      } catch (err) {
        console.error(
          "Une erreur s'est produite lors de la connexion : " + err.message
        )
      }
    }
  }
}
</script>
