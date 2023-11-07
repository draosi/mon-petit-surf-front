<style lang="scss" scoped>
@import "@/assets/scss/views/favorites.scss";
</style>

<template>
  <Header />
  <main class="favorite">
    <h1 class="favorite__title">Mes favoris</h1>
    <ul v-if="wavesInfos" class="favorite__list">
      <li
        v-for="(item, index) in wavesInfos"
        :key="index"
        class="favorite__ele"
      >
        <div class="favorite__infos">
          <div class="informations">
            <p>{{ item.spotName }}</p>
            <img src="@/assets/images/arrow.png" alt="arrow" @click="toggleVisibility(index)"/>
          </div>
          <div :class="isVisible[index] ? 'informations__visible' : 'informations__hidden'">
            <div class="informations">
              <p>Région</p>
              <p>{{ item.department }}</p>
            </div>
            <div class="informations">
              <p>Taille max des vagues</p>
              <p>{{ item.wave }}</p>
            </div>
            <div class="informations">
              <p>Temps de période max</p>
              <p>{{ item.period }}</p>
            </div>
          </div>
        </div>
        <div class="favorite__button">
          <button>Supprimer</button>
          <button>Détails</button>
        </div>
      </li>
    </ul>
  </main>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
// import FavoriteCard from "@/components/FavoriteCard.vue";

export default {
  data() {
    return {
      jwt: "",
      userId: 0,
      favorites: [],
      wavesInfos: [],
      isVisible : []
    };
  },
  components: {
    Header,
    Footer,
    // FavoriteCard,
  },
  methods: {
    async getUserFavorites(jwt, userId) {
      const res = await fetch(
        `https://localhost:7080/api/Users/${userId}/favorites`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const response = await res.json();

      for (const ele of response) {
        const data = await fetch(
          `https://localhost:7080/api/Spots/getSpot/${ele.spotId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const responseData = await data.json();
        this.favorites.push(responseData);
        // console.log(this.favorites);
      }
    },

    async getMaxConditions(latitude, longitude) {
      const res = await fetch(
        `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&daily=wave_height_max,wave_period_max&timezone=GMT`
      );
      const response = await res.json();
      // console.log(response);
      return response;
    },

    async getWavesInfos(array) {
      if (array) {
        // console.log(array);
        const wavesPromises = array.map((e) => {
          return this.getMaxConditions(e.latitude, e.longitude);
        });

        // console.log(wavesPromises);

        const waveData = await Promise.all(wavesPromises);
        // console.log(waveData);

        const favoriteCards = array.map((e, i) => {
          const maxWave = waveData[i].daily.wave_height_max
            ? waveData[i].daily.wave_height_max[0]
            : "Données des vagues non disponibles";

          const maxPeriod = waveData[i].daily.wave_period_max
            ? waveData[i].daily.wave_period_max[0]
            : "Données des périodes non disponibles";

          return {
            id: e.id,
            spotName: e.spotName,
            department: e.department,
            wave: maxWave,
            period: maxPeriod,
          };
        });
        this.wavesInfos = favoriteCards;
      }
    },

    toggleVisibility(index) {
      this.isVisible[index] = !this.isVisible[index]
    }
  },
  async mounted() {
    const userId = this.$route.params.userId;
    this.userId = userId;
    const jwt = sessionStorage.getItem("jwt");
    this.jwt = jwt;

    await this.getUserFavorites(jwt, userId);

    await this.getWavesInfos(this.favorites);
    console.log(this.wavesInfos);
    this.isVisible = new Array(this.wavesInfos.length).fill(false);
  },
};
</script>
