<style lang="scss" scoped>
@import "@/assets/scss/views/spotDetails.scss";
</style>

<template>
  <Header />
  <main class="main">
    <section class="infos">
      <h1>{{ spotInfos.spotName }} ({{ spotInfos.department }})</h1>
      <div class="infos__location">
        <div v-if="surfDatas.length !== 0" class="infos__weather">
          <Weather :meteoData="surfDatas.meteo" />
        </div>
        <div></div>
      </div>
    </section>
    <section></section>
  </main>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Weather from "@/components/Weather.vue"

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
    Weather
  },
  methods: {
    async fetchSpot(id) {
      const res = await fetch(`https://localhost:7080/api/Spots/getSpot/${id}`);
      const response = await res.json();
      // console.log(response);
      this.spotInfos = response
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
      const filteredArray = []
      array.forEach((e, i) => {
        if (i % 3 === 0 ) {
          filteredArray.push(e)
        }       
      });
      return filteredArray
    },

    async createSpotInfos(id) {
      const spot = await this.fetchSpot(id)

      const wavesData = await this.getWavesConditions(spot.latitude, spot.longitude)
      const windData = await this.getWindConditions(spot.latitude, spot.longitude)
      const meteoData = await this.getMeteo(spot.latitude, spot.longitude)

      if(spot && wavesData && windData && meteoData) {
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
            temperatureMin: meteoData.daily.temperature_2m_min[0]
          }
        }

        this.surfDatas = spotInformations
        console.log(this.surfDatas);
      } else {
        console.error("Echec dans la récupération des données")
      }
    },
  },
  async mounted() {
    const spotId = this.$route.params;
    await this.createSpotInfos(spotId.spotId)
  },
};
</script>
