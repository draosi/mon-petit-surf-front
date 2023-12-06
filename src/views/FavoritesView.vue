<style lang="scss" scoped>
@import "@/assets/scss/views/favorites.scss";
</style>

<template>
  <Header />
  <main class="favorite">
    <h1 class="favorite__title">Mes favoris</h1>
    <ul
      v-if="wavesInfos.length != 0"
      class="favorite__list">
      <li
        v-for="(item, index) in wavesInfos"
        :key="index"
        class="favorite__ele">
        <div class="favorite__infos">
          <div class="informations">
            <p class="informations__title">{{ item.spotName }}</p>
            <img
              src="@/assets/images/arrow.png"
              alt="arrow"
              @click="toggleVisibility(index)"
              :class="{ informations__img: isVisible[index] }" />
          </div>
          <div
            :class="
              isVisible[index]
                ? 'informations__visible'
                : 'informations__hidden'
            ">
            <div class="informations">
              <p class="informations__txt">Région</p>
              <p class="informations__txt">{{ item.department }}</p>
            </div>
            <div class="informations">
              <p class="informations__txt">Taille max des vagues</p>
              <p class="informations__txt">{{ item.wave }} m</p>
            </div>
            <div class="informations">
              <p class="informations__txt">Temps de période max</p>
              <p class="informations__txt">{{ item.period }} s</p>
            </div>
          </div>
        </div>
        <div class="button">
          <button
            class="button__btn"
            @click="removeFromFavorites(jwt, userId, item.id)">
            Supprimer
          </button>
          <button class="button__btn">
            <RouterLink
              :to="{ name: 'spotDetails', params: { spotId: item.id } }"
              class="button__link"
              >Détails</RouterLink
            >
          </button>
        </div>
      </li>
    </ul>
    <div v-else>
      <p>Vous n'avez aucun favoris enregistré</p>
    </div>
  </main>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"

export default {
  data() {
    return {
      jwt: "",
      userId: 0,
      spotId: 0,
      favorites: [],
      wavesInfos: [],
      isVisible: []
    }
  },
  components: {
    Header,
    Footer
  },
  methods: {
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
            this.favorites.push(responseData)
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
        console.error("Erreur lors de la récupération des favoris : " + err)
      }
    },

    async getMaxConditions(latitude, longitude) {
      try {
        const res = await fetch(
          `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&daily=wave_height_max,wave_period_max&timezone=GMT`
        )

        if (res.ok) {
          const response = await res.json()
          return response
        } else {
          if (res.status === 404) {
            console.log("Données non trouvées")
          } else if (res.status === 400) {
            console.log("Requête invalide")
          } else {
            const errorText = await res.text()
            console.log(`Erreur inattendue: ${errorText}`)
          }
        }
      } catch (err) {
        console.error("Erreur pour récupérer les conditions max:", err)
      }
    },

    async getWavesInfos(array) {
      if (array) {
        const wavesPromises = array.map(e => {
          return this.getMaxConditions(e.latitude, e.longitude)
        })

        const waveData = await Promise.all(wavesPromises)

        const favoriteCards = array.map((e, i) => {
          const maxWave = waveData[i].daily.wave_height_max
            ? waveData[i].daily.wave_height_max[0]
            : "Données des vagues non disponibles"

          const maxPeriod = waveData[i].daily.wave_period_max
            ? waveData[i].daily.wave_period_max[0]
            : "Données des périodes non disponibles"

          return {
            id: e.id,
            spotName: e.spotName,
            department: e.department,
            wave: maxWave,
            period: maxPeriod
          }
        })
        this.wavesInfos = favoriteCards
      }
    },

    // Permet d'afficher ou non une div en fonction de son index
    toggleVisibility(index) {
      this.isVisible[index] = !this.isVisible[index]
    },

    async removeFromFavorites(jwt, userId, spotId) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}Users/${userId}/favorites/${spotId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${jwt}`
            }
          }
        )

        if (res.ok) {
          alert("Favoris supprimer avec succès")
          window.location.reload()
        } else {
          alert("Un problème est survenu")
          if (res.status === 401) {
            console.log("Non autorisé")
          } else if (res.status === 500) {
            console.log("Erreur serveur interne")
          } else {
            const errorText = await res.text()
            console.log(`Erreur inattendue: ${errorText}`)
          }
        }
      } catch (err) {
        console.error("Erreur lors de la suppression du favoris : " + err)
      }
    }
  },
  async mounted() {
    const userId = this.$route.params.userId
    this.userId = userId
    const jwt = sessionStorage.getItem("jwt")
    this.jwt = jwt

    await this.getUserFavorites(jwt, userId)

    await this.getWavesInfos(this.favorites)

    // Rempli un tableau avec le même nombre de valeur set à false qu'il y a de favoris
    this.isVisible = new Array(this.wavesInfos.length).fill(false)
  }
}
</script>
