<style lang="scss" scoped>
@import "@/assets/scss/views/spotDetails.scss";
</style>

<template>
  <Header />
  <main class="main">
    <div
      v-if="spotInfos.length !== 0 && surfDatas.length !== 0"
      class="favorites">
      <section class="infos">
        <div
          v-if="surfDatas.length !== 0 && spotInfos.length !== 0"
          class="infos__title">
          <h1 class="infos__txt">
            {{ spotInfos.spotName }} ({{ spotInfos.department }})
          </h1>
          <h2 class="infos__txt">{{ transformDate(surfDatas.time[0]) }}</h2>
        </div>
        <div
          class="infos__favorite"
          v-if="jwt">
          <ul class="infos__list">
            <li
              v-for="(item, index) in spotUtilities"
              :key="index">
              <img
                :src="`${item.imageUrl}`"
                :alt="`${item.title}`"
                class="infos__img" />
            </li>
          </ul>
          <div>
            <img
              src="@/assets/images/bin.png"
              alt="bin"
              class="infos__add"
              :class="{ infos__display: isFavorite === false }"
              @click="removeFromFavorites(jwt, userId, spotId)" />
            <img
              src="@/assets/images/Fav.png"
              alt="favorite"
              class="infos__add"
              :class="{ infos__display: isFavorite === true }"
              @click="addToFavorites(jwt, userId, spotId)" />
          </div>
        </div>
        <div
          v-if="surfDatas.length !== 0 && spotInfos.length !== 0"
          class="infos__location">
          <div
            v-if="spotInfos.length !== 0"
            class="infos__map">
            <Map
              :latitude="spotInfos.latitude"
              :longitude="spotInfos.longitude" />
          </div>
          <div
            v-if="surfDatas.length !== 0"
            class="infos__weather">
            <Weather :meteoData="surfDatas.meteo" />
          </div>
        </div>
        <div v-else>
          <Loader />
        </div>
      </section>
      <section class="chart">
        <Chart
          :time="surfDatas.time"
          :waves="surfDatas.wavesSize"
          :period="surfDatas.wavesPeriod"
          :wind="surfDatas.wind" />
      </section>
      <section class="direction">
        <div class="direction__swell">
          <p>Houle</p>
          <div
            style="position: relative; width: 50px; height: 50px"
            class="direction__compass">
            <img
              src="@/assets/images/direction.png"
              alt="arrow"
              class="direction__img"
              :style="`transform: translate(-50%, -50%) rotate(${surfDatas.waveDirection}deg)`" />
          </div>
        </div>
        <div class="direction__wind">
          <p>Vent</p>
          <div
            style="position: relative; width: 50px; height: 50px"
            class="direction__compass">
            <img
              src="@/assets/images/direction.png"
              alt="arrow"
              class="direction__img"
              :style="`transform: translate(-50%, -50%) rotate(${surfDatas.windDirection}deg)`" />
          </div>
        </div>
      </section>
      <section
        v-if="jwt"
        class="utilities">
        <select
          v-model="selectedUtility"
          class="utilities__select">
          <option
            disabled
            value="">
            Selectionnez un equipement
          </option>
          <option
            v-for="(item, index) in utilities"
            :key="index"
            :value="item.id">
            {{ item.title }}
          </option>
        </select>
        <div class="utilities__btn">
          <button
            class="utilities__button"
            @click="addUtilityToSpot(jwt, spotId)">
            Ajouter
          </button>
          <button
            class="utilities__button"
            @click="deleteUtilityFromSpot(jwt, spotId)">
            Supprimer
          </button>
        </div>
      </section>
    </div>
    <div
      v-else
      class="loader">
      <Loader />
    </div>
  </main>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import Map from "@/components/Map.vue"
import Weather from "@/components/Weather.vue"
import Chart from "@/components/Chart.vue"
import Loader from "@/components/Loader.vue"
import bin from "@/assets/images/bin.png"
import network from "@/assets/images/network.png"
import parking from "@/assets/images/parking.png"
import restaurants from "@/assets/images/restaurants.png"
import showers from "@/assets/images/shower.png"
import toilet from "@/assets/images/toilet.png"
import { jwtDecode } from "jwt-decode"

export default {
  data() {
    return {
      spotInfos: [],
      surfDatas: [],
      userInfos: [],
      userFavorites: [],
      utilities: [],
      spotUtilities: [],
      utilitiesImages: {
        Poubelle: bin,
        Réseaux: network,
        "Place de parking": parking,
        Restauration: restaurants,
        Douche: showers,
        Toilette: toilet
      },
      userId: 0,
      spotId: 0,
      jwt: "",
      isFavorite: false,
      selectedUtility: ""
    }
  },
  components: {
    Header,
    Footer,
    Map,
    Weather,
    Chart,
    Loader
  },
  methods: {
    // Méthode liée au spot
    async fetchSpot(id) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}Spots/getSpot/${id}`
        )

        if (res.ok) {
          const response = await res.json()
          this.spotInfos = response
          return response
        } else {
          if (res.status === 404) {
            console.log("Spot non trouvé")
          } else if (res.status === 500) {
            console.log("Erreur serveur interne")
          } else {
            const errorText = await res.text()
            console.log(`Erreur inattendue: ${errorText}`)
          }
        }
      } catch (err) {
        console.error("Erreur pour récupérer les informations du spot:", err)
      }
    },

    // Méthodes liées aux conditions de surf
    async getWavesConditions(latitude, longitude) {
      try {
        const res = await fetch(
          `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&hourly=wave_height,wave_direction,wave_period&timezone=GMT`
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
        console.error("Erreur pour récupérer les conditions (vagues):", err)
      }
    },
    async getWindConditions(latitude, longitude) {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=windspeed_10m,winddirection_10m`
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
        console.error("Erreur pour récupérer les conditions (vent):", err)
      }
    },
    async getMeteo(latitude, longitude) {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=Europe%2FBerlin`
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
        console.error("Erreur pour récupérer les conditions (météo):", err)
      }
    },
    async getDirection(latitude, longitude) {
      try {
        const res = await fetch(
          `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&hourly=wave_direction,wind_wave_direction&timezone=Europe%2FBerlin`
        )

        if (res.ok) {
          const response = await res.json()
          console.log(response)
          return response
        }
      } catch (err) {
        console.error(
          "Erreur pour récupérer la direction de la houle et du vent",
          err
        )
      }
    },

    // Méthode permettant de trier les conditions --> Toutes les trois heures
    sortSurfData(array) {
      const filteredArray = []
      array.forEach((e, i) => {
        if (i % 3 === 0) {
          filteredArray.push(e)
        }
      })
      return filteredArray
    },

    // méthode permettant de créer l'objet spotInformations contenant les infos sur le spot ainsi que les consitions de surf associées
    async createSpotInfos(id) {
      const spot = await this.fetchSpot(id)

      const wavesData = await this.getWavesConditions(
        spot.latitude,
        spot.longitude
      )
      const windData = await this.getWindConditions(
        spot.latitude,
        spot.longitude
      )
      const meteoData = await this.getMeteo(spot.latitude, spot.longitude)

      const direction = await this.getDirection(spot.latitude, spot.longitude)

      if (spot && wavesData && windData && meteoData && direction) {
        const spotInformations = {
          id: spot.id,
          name: spot.spotName,
          time: this.sortSurfData(wavesData.hourly.time),
          wavesSize: this.sortSurfData(wavesData.hourly.wave_height),
          wavesPeriod: this.sortSurfData(wavesData.hourly.wave_period),
          waveDirection: direction.hourly.wave_direction[12],
          wind: this.sortSurfData(windData.hourly.windspeed_10m),
          windDirection: direction.hourly.wind_wave_direction[12],
          meteo: {
            precipitationSum: meteoData.daily.precipitation_sum[0],
            sunrise: meteoData.daily.sunrise[0],
            sunset: meteoData.daily.sunset[0],
            temperatureMax: meteoData.daily.temperature_2m_max[0],
            temperatureMin: meteoData.daily.temperature_2m_min[0]
          }
        }

        this.surfDatas = spotInformations
        console.log(this.surfDatas)
      } else {
        console.error("Echec dans la récupération des données")
      }
    },

    // Méthode modifiant le format de la date
    transformDate(string) {
      const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }
      const date = new Date(string)
      return date.toLocaleDateString("fr-FR", options)
    },

    // Méthodes liées à l'utilisateur et aux favoris
    async getUser(jwt, userId) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}Users/get/${userId}`,
          {
            method: "GET",
            headers: {
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
        console.error("Erreur lors de la récupération de l'utilisateur:", err)
      }
    },
    async getUserFavorites(jwt, userId) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}Users/${userId}/favorites`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwt}`
            }
          }
        )

        if (res.ok) {
          const response = await res.json()
          this.userFavorites = response
        } else {
          if (res.status === 404) {
            console.log("favoris non trouvés")
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
        console.error(
          "Erreur lors de la récupération des favoris de l'utilisateur:",
          err
        )
      }
    },
    async favoriteExist(array, spotId) {
      const exist = array.some(e => e.spotId === spotId)
      if (exist) {
        this.isFavorite = true
      }
    },
    async addToFavorites(jwt, userId, spotId) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}Users/${userId}/favorites/${spotId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${jwt}`
            }
          }
        )

        if (res.ok) {
          alert("Favoris ajouté avec succès")
          this.isFavorite = !this.isFavorite
        } else {
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
        console.error("Erreur lors de l'ajout aux favoris:", err)
      }
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
          alert("Favoris supprimé avec succès")
          this.isFavorite = !this.isFavorite
        } else {
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
        console.error("Erreur lors de la suppression du favoris:", err)
      }
    },

    // Méthode liées aux équipements du spot
    async getUtilities() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}Utilities/getUtilities`
        )

        if (res.ok) {
          const response = await res.json()
          this.utilities = response
        } else {
          if (res.status === 404) {
            console.log("Equipements non trouvés")
          } else if (res.status === 500) {
            console.log("Erreur serveur interne")
          } else {
            const errorText = await res.text()
            console.log(`Erreur inattendue: ${errorText}`)
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des équipements:", err)
      }
    },
    async addUtilityToSpot(jwt, spotId) {
      const utilityId = this.selectedUtility
      const data = {
        SpotId: spotId,
        UtilityId: utilityId
      }

      if (utilityId) {
        const utilityExist = this.spotUtilities.some(e => e.id === utilityId)
        if (utilityExist) {
          alert("Equipement déja associé à ce spot")
        } else {
          try {
            const res = await fetch(
              `${
                import.meta.env.VITE_API_URL
              }Utilities/${spotId}/utility/${utilityId}`,
              {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${jwt}`
                }
              }
            )

            if (res.ok) {
              alert("equipement ajouté avec succès")
              await this.getSpotUtilities(jwt, spotId)
            } else {
              alert("un problème à eu lieu lors de l'ajout de l'equipement")
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
            console.error("Erreur lors de l'ajout de l'equipement:", err)
          }
        }

        this.selectedUtility = ""
      }
    },
    async deleteUtilityFromSpot(jwt, spotId) {
      const utilityId = this.selectedUtility
      if (utilityId) {
        const utilityExist = this.spotUtilities.some(e => e.id === utilityId)

        if (!utilityExist) {
          alert(
            "Cet equipement n'est pas associé à ce spot, vous ne pouvez donc pas le supprimer"
          )
        } else {
          try {
            const res = await fetch(
              `${
                import.meta.env.VITE_API_URL
              }Utilities/${spotId}/utility/${utilityId}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${jwt}`
                }
              }
            )

            if (res.ok) {
              alert("Equipement supprimé avec succès")
              await this.getSpotUtilities(jwt, spotId)
            } else {
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
            console.error(
              "Erreur lors de la suppression de l'equipement : " + err
            )
          }
        }

        this.selectedUtility = ""
      }
    },
    async getSpotUtilities(jwt, spotId) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}Utilities/${spotId}/utilities`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`
            }
          }
        )

        if (res.status === 200) {
          const response = await res.json()

          this.spotUtilities = response.map(e => {
            return {
              ...e,
              imageUrl: this.utilitiesImages[e.title]
            }
          })
        } else {
          if (res.status === 404) {
            console.log("Spot non trouvés")
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
        console.error("Erreur lors de la suppression de l'equipement : " + err)
      }
    },
    getUserId(jwt) {
      const token = jwtDecode(jwt)
      console.log(token)
      const decodedUserId = token.nameid
      this.userId = parseInt(decodedUserId)
    }
  },

  async mounted() {
    const spotId = this.$route.params
    this.spotId = parseInt(spotId.spotId, 10)
    const jwt = sessionStorage.getItem("jwt")
    this.jwt = jwt

    if (this.jwt) {
      this.getUserId(this.jwt)
    }

    await this.createSpotInfos(this.spotId)

    if (this.jwt && this.userId && this.spotId) {
      await this.getUser(this.jwt, this.userId)
      await this.getUserFavorites(this.jwt, this.userId)
      await this.favoriteExist(this.userFavorites, this.spotId)
      await this.getUtilities()
      await this.getSpotUtilities(this.jwt, this.spotId)
    }
  }
}
</script>
