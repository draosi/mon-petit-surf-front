<style lang="scss" scoped>
@import "@/assets/scss/views/spotDetails.scss";
</style>

<template>
  <Header />
  <main class="main">
    <section class="infos">
      <h1></h1>
      <div>
        <div></div>
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

export default {
  data() {
    return {
      spotInfos: [],
    };
  },
  components: {
    Header,
    Footer,
  },
  methods: {
    async fetchSpot(id) {
      const res = await fetch(`https://localhost:7080/api/Spots/getSpot/${id}`);
      const response = await res.json();
      return response;
    },

    async getWavesConditions(latitude, longitude) {
      const res = await fetch(
        `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&hourly=wave_height,wave_direction,wave_period&timezone=GMT`
      );
      const response = await res.json();
      return response;
    },
    async getWindConditions(latitude, longitude) {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=windspeed_10m,winddirection_10m`
      );
      const response = await res.json();
      return response;
    },
    async getMeteo(latitude, longitude) {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=windspeed_10m,winddirection_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum`
      );
      const response = await res.json();
      return response;
    },

    async createSpotInfos(id) {},
  },
  mounted() {
    const spotId = this.$route.params;
    console.log(spotId);
  },
};
</script>
