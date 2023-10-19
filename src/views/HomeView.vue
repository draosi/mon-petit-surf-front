<style lang="scss" scoped>
@import "@/assets/scss/views/home.scss";
</style>

<template>
  <Header />
  <main class="main">
    <section class="sort">
      <div>
        <select v-model="selectedHeight" @change="filterHeight">
          <option disabled value="">Taille moyenne</option>
          <option v-for="option in waveHeight" :value="option">
            {{ option }}
          </option>
        </select>
        <select v-model="selectedPeriod" @change="log">
          <option disabled value="">Période moyenne</option>
          <option v-for="option in period" :value="option">
            {{ option }}
          </option>
        </select>
        <select v-model="selectedRegion" @change="log">
          <option disabled value="">Selectionnez une région</option>
          <option v-for="option in regionEnDures" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div>
        <button></button>
        <button></button>
      </div>
    </section>
    <section class="spots">
      <div
        class="spot"
        :class="{ 'spot__card--blue': cardBackground(index) }"
        v-for="(spot, index) in spotEnDur"
        :key="index"
      >
        <div class="spot__card">
          <RouterLink :to="`spot/details/${spot.id}`" class="spot__lien">
            <HomeCard
              :nom="spot.nom"
              :region="spot.region"
              :vague="spot.vague"
              :periode="spot.periode"
            />
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import HomeCard from "@/components/HomeCard.vue";

export default {
  components: {
    Header,
    Footer,
    HomeCard,
  },
  data() {
    return {
      // Permet que le premier <option> soit affiché par défaut
      selectedHeight: "",
      selectedPeriod: "",
      selectedRegion: "",
      waveHeight: [
        "vague < 0,9 m",
        "0,8 m < vague < 1,3 m",
        "1,2 m < vague < 1,7 m",
        "1,6 m < vague < 2,2 m",
        "2,1 m < vague",
      ],
      period: [
        "période < 7 s",
        "6 s < période < 9 s",
        "8 s < période < 11 s",
        "10 s < période < 13 s",
        "12 s < période < 15 s",
        "14 s < période",
      ],
      region: [],
      spots: [],
      filteredSpots: [],
      spotEnDur: [
        {
          id: 1,
          nom: "Lacanau-océan",
          region: "Gironde",
          vague: 0.8,
          periode: 11,
        },
        {
          id: 1,
          nom: "Lacanau-océan",
          region: "Gironde",
          vague: 1.5,
          période: 11,
        },
        {
          id: 1,
          nom: "Lacanau-océan",
          region: "Gironde",
          vague: 1.5,
          période: 11,
        },
        {
          id: 1,
          nom: "Lacanau-océan",
          region: "Gironde",
          vague: 1.5,
          période: 11,
        },
        {
          id: 1,
          nom: "Lacanau-océan",
          region: "Gironde",
          vague: 1.5,
          période: 11,
        },
        {
          id: 1,
          nom: "Lacanau-océan",
          region: "Gironde",
          vague: 1.5,
          période: 11,
        },
      ],
      regionEnDures: [
        "Charente-Maritime",
        "Cotes-d'Armor",
        "Finistère",
        "Gironde",
        "Landes",
        "Loire-Atlantique",
        "Morbihan",
        "Pyrénées-Atlantique",
        "Vendée",
      ],
    };
  },
  methods: {
    cardBackground(i) {
      return i % 2 === 0;
    },
    log() {
      console.log(this.selectedHeight, this.selectedPeriod, this.selectedRegion);
    },
    filterHeight() {
      if (this.selectedHeight === "vague < 0,9 m") {
        this.filteredSpots = this.spotEnDur.filter((el) => {
          el.vague < 0.9
        })
        console.log(this.filteredSpots);
      }
    },
    filterPeriod() {

    },
    filterregion() {

    }
  },
};
</script>

<!-- "vague < 0,9 m",
"0,8 m < vague < 1,3 m",
"1,2 m < vague < 1,7 m",
"1,6 m < vague < 2,2 m",
"2,1 m < vague" -->