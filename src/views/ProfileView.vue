<style lang="scss" scoped>
@import "@/assets/scss/views/profile.scss";
</style>

<template>
  <Header />
  <main class="profile">
    <section class="profile__infos">
      <h1 class="profile__title">Mon profile</h1>
      <div
        class="profile__user"
        :class="{ visible: isVisible }">
        <div class="user">
          <div class="user__infos">
            <p class="user__txt">Pseudo :</p>
            <p class="user__txt">{{ userInfos.username }}</p>
          </div>
          <div class="user__infos">
            <p class="user__txt">Mot de passe :</p>
            <p class="user__txt">******</p>
          </div>
        </div>
        <div class="profile__button">
          <button
            class="button"
            @click="edit">
            Modifier
          </button>
        </div>
      </div>
      <div
        class="profile__user"
        :class="{ visible: !isVisible }">
        <form
          @submit.prevent="updateUser(jwt, userId)"
          class="edit"
          novalidate>
          <div class="edit__infos">
            <input
              v-model="editedUser.username"
              placeholder="Nouveau pseudo"
              class="edit__input" />
            <input
              v-model="editedUser.password"
              placeholder="Nouveau mot de passe"
              class="edit__input" />
          </div>
          <div class="edit__update">
            <button
              type="submit"
              class="edit__button">
              Envoyer
            </button>
          </div>
        </form>
        <div class="profile__button">
          <button
            class="button"
            @click="edit">
            Annuler
          </button>
        </div>
        <div class="profile__button">
          <button
            class="button"
            @click="deleteUser(jwt, userId)">
            Supprimer
          </button>
        </div>
      </div>
    </section>
    <section class="favorites">
      <h1 class="favorites__title">Mes favoris</h1>
      <ul
        class="favorites__list"
        v-if="userFavorites.length != 0">
        <li
          v-for="(item, index) in userFavorites"
          :key="index"
          class="favorites__spot">
          <p class="favorites__txt">
            {{ item.spotName }} / {{ item.department }}
          </p>
          <RouterLink
            :to="{ name: 'spotDetails', params: { spotId: item.id } }"
            class="favorites__link">
            Détails
          </RouterLink>
        </li>
      </ul>
      <p v-else>Vous n'avez enregistré aucun favoris...</p>
    </section>
  </main>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"

export default {
  data() {
    return {
      userId: 0,
      jwt: "",
      userInfos: {},
      userFavorites: [],
      editedUser: {
        username: "",
        password: ""
      },
      isVisible: false
    }
  },
  components: {
    Header,
    Footer
  },
  methods: {
    async getUserInfos(jwt, userId) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}Users/get/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`
            }
          }
        )

        if (res.ok) {
          const response = await res.json()
          this.userInfos = response
        } else {
          if (res.status === 404) {
            console.log("Utilisateur non trouvé")
          } else if (res.status === 500) {
            console.log("Erreur serveur interne")
          } else {
            const errorText = await res.text()
            console.log(`Erreur inattendue: ${errorText}`)
          }
        }
      } catch (err) {
        console.error(
          "Erreur pour récupérer les informations sur l'utilisateur:",
          err
        )
      }
    },
    async getUserFavorites(jwt, userId) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}Users/${userId}/favorites`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`
            }
          }
        )

        if (res.ok) {
          const response = await res.json()
          for (const ele of response) {
            const data = await fetch(
              `${import.meta.env.VITE_API_URL}Spots/getSpot/${ele.spotId}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json"
                }
              }
            )
            const responseData = await data.json()
            this.userFavorites.push(responseData)
          }
        } else {
          if (res.status === 404) {
            console.log("Favoris non trouvé")
          } else if (res.status === 500) {
            console.log("Erreur serveur interne")
          } else {
            const errorText = await res.text()
            console.log(`Erreur inattendue: ${errorText}`)
          }
        }
      } catch (err) {
        console.error(
          "Erreur pour récupérer les favoris de l'utilisateur:",
          err
        )
      }
    },

    async updateUser(jwt, id) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}Users/put/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify(this.editedUser)
          }
        )

        if (res.ok) {
          alert("Profile modifié avec succès")
          await this.getUserInfos(jwt, id)
          this.edit()
        } else {
          alert("Une erreur s'est produite")
          if (res.status === 400) {
            console.log("Requête invalide")
          } else if (res.status === 401) {
            console.log("Non autorisé")
          } else if (res.status === 500) {
            console.log("Erreur serveur interne")
          } else {
            const errorText = await res.text()
            console.log(`Erreur inattendue: ${errorText}`)
          }
        }
      } catch (err) {
        console.error("Erreur pour modifier les données de l'utilisateur:", err)
      }
    },
    async deleteUser(jwt, id) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}Users/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`
            }
          }
        )

        if (res.ok) {
          alert("Profile supprimé avec succès")
          this.clearSessionStorage()
        } else {
          alert("Une erreur s'est produite")
          if (res.status === 400) {
            console.log("Requête invalide")
          } else if (res.status === 401) {
            console.log("Non autorisé")
          } else if (res.status === 500) {
            console.log("Erreur serveur interne")
          } else {
            const errorText = await res.text()
            console.log(`Erreur inattendue: ${errorText}`)
          }
        }
      } catch (err) {
        console.error("Erreur pour modifier les données de l'utilisateur:", err)
      }
    },

    clearSessionStorage() {
      sessionStorage.removeItem("jwt")
      sessionStorage.removeItem("userId")
      this.$router.push("/connexion")
    },
    edit() {
      this.isVisible = !this.isVisible
    }
  },
  async mounted() {
    const userId = this.$route.params.userId
    this.userId = userId
    const jwt = sessionStorage.getItem("jwt")
    this.jwt = jwt

    await this.getUserInfos(this.jwt, this.userId)
    await this.getUserFavorites(this.jwt, this.userId)
  }
}
</script>
