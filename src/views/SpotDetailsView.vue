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
        spotInfos: []
      }
    },
    components: {
      Header,
      Footer,
    },
    methods: {
      async fetchSpot(id) {
        const res = await fetch(`https://localhost:7080/api/Spots/getSpot/${id}`)
        const response = await res.json()
        return response
      },

      async getWavesConditions(latitude, longitude) {},
      async getWindConditions(latitude, longitude) {},
      async getPeriodConditions(latitude, longitude) {},

      async createSpotInfos(id) {}
    },
    mounted() {
      const spotId = this.$route.params
      console.log(spotId);
    }
  };
  </script>