<style lang="scss" scoped>
@import "@/assets/scss/views/spotDetails.scss";
</style>

<template>
  <Header />
  <main class="main">
    <div v-if="spotInfos.length !== 0 && surfDatas.length !== 0" class="favorites">
      <section class="infos">
        <div
          v-if="surfDatas.length !== 0 && spotInfos.length !== 0"
          class="infos__title"
        >
          <h1 class="infos__txt">{{ spotInfos.spotName }} ({{ spotInfos.department }})</h1>
          <h2 class="infos__txt">{{ transformDate(surfDatas.time[0]) }}</h2>
        </div>
        <div class="infos__favorite" v-if="jwt">
          <ul class="infos__list">
            <li v-for="(item, index) in spotUtilities" :key="index">
              <img
                :src="`${item.imageUrl}`"
                :alt="`${item.title}`"
                class="infos__img"
              />
            </li>
          </ul>
          <div>
            <img
              src="@/assets/images/bin.png"
              alt="bin"
              class="infos__add"
              :class="{ infos__display: isFavorite === false }"
              @click="removeFromFavorites(jwt, userId, spotId)"
            />
            <img
              src="@/assets/images/Fav.png"
              alt="favorite"
              class="infos__add"
              :class="{ infos__display: isFavorite === true }"
              @click="addToFavorites(jwt, userId, spotId)"
            />
          </div>
        </div>
        <div
          v-if="surfDatas.length !== 0 && spotInfos.length !== 0"
          class="infos__location"
        >
          <div v-if="spotInfos.length !== 0" class="infos__map">
            <Map
              :latitude="spotInfos.latitude"
              :longitude="spotInfos.longitude"
            />
          </div>
          <div v-if="surfDatas.length !== 0" class="infos__weather">
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
          :wind="surfDatas.wind"
        />
      </section>
      <section v-if="jwt" class="utilities">
        <select v-model="selectedUtility" class="utilities__select">
          <option disabled value="">Selectionnez un equipement</option>
          <option
            v-for="(item, index) in utilities"
            :key="index"
            :value="item.id"
          >
            {{ item.title }}
          </option>
        </select>
        <div class="utilities__btn">
          <button
            class="utilities__button"
            @click="addUtilityToSpot(jwt, spotId)"
          >
            Ajouter
          </button>
          <button
            class="utilities__button"
            @click="deleteUtilityFromSpot(jwt, spotId)"
          >
            Supprimer
          </button>
        </div>
      </section>
    </div>
    <div v-else class="loader">
      <Loader />
    </div>
  </main>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Map from "@/components/Map.vue";
import Weather from "@/components/Weather.vue";
import Chart from "@/components/Chart.vue";
import Loader from "@/components/Loader.vue";
import bin from "@/assets/images/bin.png";
import network from "@/assets/images/network.png";
import parking from "@/assets/images/parking.png";
import restaurants from "@/assets/images/restaurants.png";
import showers from "@/assets/images/shower.png";
import toilet from "@/assets/images/toilet.png";

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
        Toilette: toilet,
      },
      userId: 0,
      spotId: 0,
      jwt: "",
      isFavorite: false,
      selectedUtility: "",
    };
  },
  components: {
    Header,
    Footer,
    Map,
    Weather,
    Chart,
    Loader,
  },
  methods: {
    async fetchSpot(id) {
      const res = await fetch(`https://localhost:7080/api/Spots/getSpot/${id}`);
      const response = await res.json();
      // console.log(response);
      this.spotInfos = response;
      console.log(this.spotInfos);
      return response;
    },

    async getWavesConditions(latitude, longitude) {
      const res = await fetch(
        `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&hourly=wave_height,wave_direction,wave_period&timezone=GMT`
      );
      const response = await res.json();
      // console.log(response);
      return response;
    },
    async getWindConditions(latitude, longitude) {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=windspeed_10m,winddirection_10m`
      );
      const response = await res.json();
      // console.log(response);
      return response;
    },
    async getMeteo(latitude, longitude) {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=Europe%2FBerlin`
      );
      const response = await res.json();
      // console.log(response);
      return response;
    },

    sortSurfData(array) {
      const filteredArray = [];
      array.forEach((e, i) => {
        if (i % 3 === 0) {
          filteredArray.push(e);
        }
      });
      return filteredArray;
    },

    async createSpotInfos(id) {
      const spot = await this.fetchSpot(id);

      const wavesData = await this.getWavesConditions(
        spot.latitude,
        spot.longitude
      );
      const windData = await this.getWindConditions(
        spot.latitude,
        spot.longitude
      );
      const meteoData = await this.getMeteo(spot.latitude, spot.longitude);

      if (spot && wavesData && windData && meteoData) {
        const spotInformations = {
          id: spot.id,
          name: spot.spotName,
          time: this.sortSurfData(wavesData.hourly.time),
          wavesSize: this.sortSurfData(wavesData.hourly.wave_height),
          wavesPeriod: this.sortSurfData(wavesData.hourly.wave_period),
          wind: this.sortSurfData(windData.hourly.windspeed_10m),
          meteo: {
            precipitationSum: meteoData.daily.precipitation_sum[0],
            sunrise: meteoData.daily.sunrise[0],
            sunset: meteoData.daily.sunset[0],
            temperatureMax: meteoData.daily.temperature_2m_max[0],
            temperatureMin: meteoData.daily.temperature_2m_min[0],
          },
        };

        this.surfDatas = spotInformations;
        // console.log(this.surfDatas);
      } else {
        console.error("Echec dans la récupération des données");
      }
    },

    transformDate(string) {
      const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      const date = new Date(string);
      return date.toLocaleDateString("fr-FR", options);
    },

    async getUser(jwt, userId) {
      const res = await fetch(
        `https://localhost:7080/api/Users/get/${userId}`,
        {
          method: "GET", // Vous utilisez GET ici pour récupérer des données
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const response = await res.json();
      this.userInfos = response;
      // console.log(this.userInfos);
      // console.log(this.userInfos.usersRegisterSpots);
    },
    async getUserFavorites(jwt, userId) {
      const res = await fetch(
        `https://localhost:7080/api/Users/${userId}/favorites`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const response = await res.json();
      this.userFavorites = response;
      console.log(this.userFavorites);
    },
    async favoriteExist(array, spotId) {
      const exist = array.some((e) => e.spotId === spotId);
      console.log(exist);
      if (exist) {
        this.isFavorite = true;
      }
    },
    async addToFavorites(jwt, userId, spotId) {
      // console.log(jwt, userId, spotId);
      const res = await fetch(
        `https://localhost:7080/api/Users/${userId}/favorites/${spotId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const response = await res;
      if (response.ok) {
        alert("Favoris ajouté avec succès");
        this.isFavorite = !this.isFavorite;
      } else {
        alert("un problème à eu lieu");
      }
      // console.log(response);
    },
    async removeFromFavorites(jwt, userId, spotId) {
      const res = await fetch(
        `https://localhost:7080/api/Users/${userId}/favorites/${spotId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const response = await res;
      if (response.ok) {
        alert("Favoris supprimé avec succès");
        this.isFavorite = !this.isFavorite;
      } else {
        alert("un problème à eu lieu");
      }
      // console.log(response);
    },

    async getUtilities() {
      const res = await fetch("https://localhost:7080/api/Spots/getUtilities");
      const response = await res.json();
      this.utilities = response;
      // console.log(this.utilities);
    },
    async addUtilityToSpot(jwt, spotId) {
      const utilityId = this.selectedUtility;
      const data = {
        SpotId: spotId,
        UtilityId: utilityId,
      };

      if (utilityId) {
        const res = await fetch(
          `https://localhost:7080/api/Spots/${spotId}/utility/${utilityId}`,
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        if (res.ok) {
          alert("equipement ajouté avec succès");
          await this.getSpotUtilities(jwt, spotId);
        } else {
          alert("un problème à eu lieu lors de l'ajout de l'equipement");
        }

        this.selectedUtility = "";
      }
    },
    async deleteUtilityFromSpot(jwt, spotId) {
      const utilityId = this.selectedUtility;
      if (utilityId) {
        const res = await fetch(
          `https://localhost:7080/api/Spots/${spotId}/utility/${utilityId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        console.log(res);

        if (res.ok) {
          alert("Equipement supprimé avec succès");
          await this.getSpotUtilities(jwt, spotId);
        } else if (res.status === 400) {
          const error = await res.text();
          alert("Erreur 400" + error);
        } else {
          alert("un problème à eu lieu lors de la suppression");
        }

        this.selectedUtility = "";
        // window.location.reload();
      }
    },
    async getSpotUtilities(jwt, spotId) {
      console.log(jwt, spotId);
      const res = await fetch(
        `https://localhost:7080/api/Spots/${spotId}/utilities`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (res.status === 200) {
        const response = await res.json();
        console.log(response);

        this.spotUtilities = response.map((e) => {
          return {
            ...e,
            imageUrl: this.utilitiesImages[e.title],
          };
        });
        console.log(this.spotUtilities);
      } else {
        console.error("erreyr pour récupérer les equipement");
        console.log(res);
      }
    },
  },

  async mounted() {
    const spotId = this.$route.params;
    this.spotId = parseInt(spotId.spotId, 10);
    // console.log(this.spotId);
    const jwt = sessionStorage.getItem("jwt");
    this.jwt = jwt;
    // console.log(this.jwt);
    const userId = sessionStorage.getItem("userId");
    this.userId = parseInt(userId, 10);
    // console.log(this.userId);

    await this.createSpotInfos(this.spotId);

    if (this.jwt && this.userId && this.spotId) {
      await this.getUser(this.jwt, this.userId);
      await this.getUserFavorites(this.jwt, this.userId);
      await this.favoriteExist(this.userFavorites, this.spotId);
      await this.getUtilities();
      await this.getSpotUtilities(this.jwt, this.spotId);
    }
  },
};
</script>
