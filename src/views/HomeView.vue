<style lang="scss" scoped>
@import "@/assets/scss/views/home.scss";
</style>

<template>
  <Header />
  <main class="main">
    <section class="sort">
      <div class="sort__size">
        <select
          v-model="selectedHeight"
          @change="filterSpots"
          class="sort__select sort__txt">
          <option
            disabled
            value="">
            Taille maximum
          </option>
          <option
            v-for="(option, index) in waveHeight"
            :value="option.title"
            :key="index">
            {{ option.title }}
          </option>
        </select>
      </div>
      <div class="sort__size">
        <select
          v-model="selectedPeriod"
          @change="filterSpots"
          class="sort__select sort__txt">
          <option
            disabled
            value="">
            Période maximum
          </option>
          <option
            v-for="(option, index) in wavePeriod"
            :value="option.title"
            :key="index">
            {{ option.title }}
          </option>
        </select>
      </div>
      <div class="sort__size">
        <select
          v-model="selectedRegion"
          @change="filterSpots"
          class="sort__select sort__txt">
          <option
            disabled
            value="">
            Région
          </option>
          <option
            v-for="(option, index) in regions"
            :value="option.title"
            :key="index">
            {{ option.title }}
          </option>
        </select>
      </div>
      <button
        @click="reset"
        class="sort__size sort__button">
        Réinitialiser
      </button>
    </section>
    <section>
      <div
        v-if="loading"
        class="loader">
        <Loader />
      </div>
      <div v-else>
        <div v-if="filteredSpots.length">
          <ul class="spots">
            <li
              class="spot"
              :class="{ 'spot__card--blue': cardBackground(index) }"
              v-for="(spot, index) in spotsOnPage"
              :key="index">
              <div class="spot__card">
                <RouterLink
                  :to="{ name: 'spotDetails', params: { spotId: spot.id } }"
                  class="spot__lien">
                  <HomeCard
                    :nom="spot.nom"
                    :region="spot.region"
                    :vague="spot.vague"
                    :periode="spot.periode" />
                </RouterLink>
              </div>
            </li>
          </ul>
          <div
            class="pagination"
            v-if="!noResult">
            <button
              @click="pagination(currentPage - 1)"
              :disabled="currentPage === 1"
              class="pagination__btn">
              Précédent
            </button>
            <p>{{ currentPage }}</p>
            <button
              @click="pagination(currentPage + 1)"
              :disabled="currentPage === pageCount"
              class="pagination__btn">
              Suivant
            </button>
          </div>
        </div>
        <div
          v-else
          class="no-result">
          <p>
            Oups, aucun spot ne remplit les conditions que vous recherchez...
          </p>
        </div>
      </div>
    </section>
  </main>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import HomeCard from "@/components/HomeCard.vue"
import Loader from "@/components/Loader.vue"

export default {
  components: {
    Header,
    Footer,
    HomeCard,
    Loader
  },
  data() {
    return {
      regions: [],
      spots: [],
      filteredSpots: [],
      resetSpots: [],
      spotCard: [],

      // Permet que le premier <option> soit affiché par défaut
      selectedHeight: "",
      selectedPeriod: "",
      selectedRegion: "",
      waveHeight: [
        {
          title: "vague < 0,9 m",
          value: height => height < 0.9
        },
        {
          title: "0,8 m < vague < 1,3 m",
          value: height => height > 0.8 && height < 1.3
        },
        {
          title: "1,2 m < vague < 1,7 m",
          value: height => height > 1.2 && height < 1.7
        },
        {
          title: "1,6 m < vague < 2,2 m",
          value: height => height > 1.6 && height < 2.2
        },
        {
          title: "2,1 m < vague",
          value: height => height > 2.1
        }
      ],
      wavePeriod: [
        {
          title: "période < 7 s",
          value: periode => periode < 7
        },
        {
          title: "6 s < période < 9 s",
          value: periode => periode > 6 && periode < 9
        },
        {
          title: "8 s < période < 11 s",
          value: periode => periode > 8 && periode < 11
        },
        {
          title: "10 s < période < 14 s",
          value: periode => periode > 10 && periode < 14
        },
        {
          title: "13 s < période",
          value: periode => periode > 13
        }
      ],

      currentPage: 1,
      itemsPerPage: 5,

      loading: false
    }
  },

  computed: {
    // Calcule l'indice de début des éléments à afficher sur la page
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage
    },
    // Calcule l'indice de fin des éléments à afficher sur la page
    endIndex() {
      return this.currentPage * this.itemsPerPage
    },
    // Extrait les éléments du tableau filteredSpots qui doivent être affichés
    // Renvoie un tableau qui contient uniquement les éléments à afficher
    spotsOnPage() {
      return this.filteredSpots.slice(this.startIndex, this.endIndex)
    },
    // Calcule le nombre total de page en fonction du nombre d'éléments affichés par page
    pageCount() {
      return Math.ceil(this.filteredSpots.length / this.itemsPerPage)
    }
  },

  methods: {
    cardBackground(i) {
      return i % 2 === 0
    },

    // Responsable du filtrage lorsqu'un selecteur est selectionné
    // En fonction du selecteur selectionné, appelle une fonction permettant de trier les données
    filterSpots() {
      if (
        !this.selectedHeight &&
        !this.selectedPeriod &&
        !this.selectedRegion
      ) {
        // Sortir de la méthode si rien n'est sélectionné et retourner le tableau de base
        this.filteredSpots = this.spotCard
        return
      }
      let result = this.spotCard

      if (this.selectedHeight) {
        result = this.filterByCriteria(result, "vague", this.selectedHeight)
      }

      if (this.selectedPeriod) {
        result = this.filterByCriteria(result, "periode", this.selectedPeriod)
      }

      if (this.selectedRegion) {
        result = this.filterByCriteria(result, "region", this.selectedRegion)
      }

      this.filteredSpots = result
    },

    // Filtre les données d'un tableau 'data'
    // 'field' indique le champ de chaque élément du tableau que je souhaite modifier
    // 'criteria' est la valeur récupérée par le select, utilisé pour filter les éléments
    // Appelle 3 fonctions pour trier les données
    filterByCriteria(data, field, criteria) {
      return data.filter(el => {
        if (field === "vague") {
          return this.checkWaveCriteria(el.vague, criteria)
        }
        if (field === "periode") {
          return this.checkPeriodCriteria(el.periode, criteria)
        }
        if (field === "region") {
          return this.checkRegionCriteria(el.region, criteria)
        }
        return true
      })
    },

    // Crééer une constante permettant de stocker l'élément dont le titre est égale à la valeur du select dans waveHeight
    // Si cette constante existe, alors elle appelle la fonction associé au critère trouvé dans me tableau waveHeight
    // Vérifie si l'argument 'value' associé au résultat du select est vrai
    checkWaveCriteria(value, criteria) {
      const wave = this.waveHeight.find(el => el.title === criteria)
      if (wave) {
        return wave.value(value)
      } else {
        return value >= 2.2
      }
    },

    checkPeriodCriteria(value, criteria) {
      const period = this.wavePeriod.find(el => el.title === criteria)
      if (period) {
        return period.value(value)
      } else {
        return value > 13
      }
    },

    checkRegionCriteria(value, criteria) {
      const region = this.regions.find(el => el.title === criteria)
      if (region) {
        return region.value(value)
      } else {
        return false
      }
    },

    reset() {
      ;(this.selectedHeight = ""),
        (this.selectedPeriod = ""),
        (this.selectedRegion = ""),
        (this.filteredSpots = this.spotCard)
    },

    async fetchSpots() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}Spots/getSpots`)

        if (res.ok) {
          const response = await res.json()
          return response
        } else {
          if (res.status === 404) {
            console.log("Spots non trouvés")
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

    async fetchRegions() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}Regions/getRegions`
        )

        if (res.ok) {
          const response = await res.json()
          return response
        } else {
          if (res.status === 404) {
            console.log("Régions non trouvées")
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

    async getMaxConditions(latitude, longitude) {
      try {
        const res = await fetch(
          `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&daily=wave_height_max,wave_period_max&timezone=Europe%2FBerlin`
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

    async createSpotCards() {
      const spots = await this.fetchSpots()
      const wavePromises = spots.map(e =>
        this.getMaxConditions(e.latitude, e.longitude)
      )
      const waveData = await Promise.all(wavePromises)

      const spotCards = spots.map((e, i) => {
        const maxWave = waveData[i].daily.wave_height_max
          ? waveData[i].daily.wave_height_max[0]
          : "Données des vagues non disponibles"
        const maxPeriod = waveData[i].daily.wave_period_max
          ? waveData[i].daily.wave_period_max[0]
          : "Données des périodes non disponibles"
        return {
          id: e.id,
          nom: e.spotName,
          region: e.department,
          vague: maxWave,
          periode: maxPeriod
        }
      })
      this.spotCard = spotCards
    },

    async createRegionsArray() {
      const response = await this.fetchRegions()

      const regions = response.map(e => {
        return {
          title: e,
          value: region => region === e
        }
      })
      this.regions = regions
    },

    // Le paramètre "page" indique vers quelle page je souhaite naviguer
    // La condition verifie si la valeur du paramètre est supérieur à 1 et inférieur au nombre total de page
    // La valeur de "this.currentPage" est mise à jour, startIndex, endIndex et spotsOnPage sont mis à jour également
    pagination(page) {
      if (page >= 1 && page <= this.pageCount) {
        this.currentPage = page
      }
    }
  },

  async mounted() {
    this.loading = true
    await this.createSpotCards()
    this.filteredSpots = this.spotCard
    await this.createRegionsArray()
    this.loading = false
  }
}
</script>
