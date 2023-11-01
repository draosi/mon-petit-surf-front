<style lang="scss" scoped>
@import "@/assets/scss/views/spotDetails.scss";
</style>

<template>
  <Header />
  <main>
    <div v-if="spotInfos.length !== 0 && surfDatas.length !== 0" class="main">
      <section class="infos">
      <div
        v-if="surfDatas.length !== 0 && spotInfos.length !== 0"
        class="infos__title"
      >
          <h1>{{ spotInfos.spotName }} ({{ spotInfos.department }})</h1>
          <h2>{{ transformDate(surfDatas.time[0]) }}</h2>
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

export default {
  data() {
    return {
      spotInfos: [],
      surfDatas: [],
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
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=GMT`
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
        console.log(this.surfDatas);
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
  },
  async mounted() {
    const spotId = this.$route.params;
    await this.createSpotInfos(spotId.spotId);
  },
};
</script>
