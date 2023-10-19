<style lang="scss" scoped>
@import "@/assets/scss/views/home.scss";
</style>

<template>
  <Header />
  <main class="main">
    <section class="sort">
      <div>
        <select v-model="selectedHeight" @change="filterSpots">
          <option disabled value="">Taille moyenne</option>
          <option v-for="option in waveHeight" :value="option">
            {{ option }}
          </option>
        </select>
        <select v-model="selectedPeriod" @change="filterSpots">
          <option disabled value="">Période moyenne</option>
          <option v-for="option in period" :value="option">
            {{ option }}
          </option>
        </select>
        <select v-model="selectedRegion" @change="filterSpots">
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
        v-for="(spot, index) in filteredSpots"
        :key="index"
      >
        <div class="spot__card">
          <RouterLink :to="`spot/details/${spot.id}`" class="spot__lien">
            <HomeCard
              :nom="spot.nom"
              :region="spot.region"
              :vague="spot.vague"
              :periode="spot.période"
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
        "10 s < période < 14 s",
        "13 s < période",
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
          période: 6,
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
          vague: 1.1,
          période: 9,
        },
        {
          id: 1,
          nom: "Lacanau-océan",
          region: "Gironde",
          vague: 1.9,
          période: 12,
        },
        {
          id: 1,
          nom: "Capbreton",
          region: "Landes",
          vague: 1.5,
          période: 13,
        },
        {
          id: 1,
          nom: "Lacanau-océan",
          region: "Gironde",
          vague: 3,
          période: 18,
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
      ],
    };
  },

  methods: {
    cardBackground(i) {
      return i % 2 === 0;
    },

    // responsable du filtrage lorsqu'un selecteur est selectionner
    // En fonction du selecteur selectionné, appelle une fonction permettant de trier les données
    filterSpots() {
      if (
        !this.selectedHeight &&
        !this.selectedPeriod &&
        !this.selectedRegion
      ) {
        this.filteredSpots = this.spotEnDur;
        return; // Sortir de la méthode si rien n'est sélectionné
      }
      let result = this.spotEnDur;

      if (this.selectedHeight) {
        result = this.filterByCriteria(result, "vague", this.selectedHeight);
      }

      if (this.selectedPeriod) {
        result = this.filterByCriteria(result, "période", this.selectedPeriod);
      }

      if (this.selectedRegion) {
        result = this.filterByCriteria(result, "region", this.selectedRegion);
      }

      this.filteredSpots = result;
    },

    // Filtre les données d'un tableau 'data'
    // 'field' permet quel champ de chaque élément du tableau je souhaite modifier
    // 'criteria' est la valeur utiliser pour filter les éléments
    // Appelle différente fonction pour trier les données
    filterByCriteria(data, field, criteria) {
      return data.filter((el) => {
        if (field === "vague") {
          return this.checkWaveCriteria(el.vague, criteria);
        }
        if (field === "période") {
          return this.checkPeriodCriteria(el.période, criteria);
        }
        if (field === "region") {
          return this.checkRegionCriteria(el.region, criteria);
        }
        return true;
      });
    },

    checkWaveCriteria(value, criteria) {
      switch (criteria) {
        case "vague < 0,9 m":
          return value < 0.9;
        case "0,8 m < vague < 1,3 m":
          return value >= 0.8 && value < 1.3;
        case "1,2 m < vague < 1,7 m":
          return value >= 1.2 && value < 1.7;
        case "1,6 m < vague < 2,2 m":
          return value >= 1.6 && value < 2.2;
        default:
          return value >= 2.2;
      }
    },

    checkPeriodCriteria(value, criteria) {
      switch (criteria) {
        case "période < 7 s":
          return value < 7;
        case "6 s < période < 9 s":
          return value > 6 && value < 9;
        case "8 s < période < 11 s":
          return value > 8 && value < 11;
        case "10 s < période < 14 s":
          return value > 10 && value < 14;
        default:
          return value > 13;
      }
    },

    checkRegionCriteria(value, criteria) {
      switch (criteria) {
        case "Charente-Maritime":
          return (value === "Charente-Maritime");
        case "Cotes-d'Armor":
          return (value === "Cotes-d'Armor");
        case "Finistère":
          return (value === "Finistère");
        case "Gironde":
          return (value === "Gironde");
        case "Landes":
          return (value === "Landes");
        case "Loire-Atlantique":
          return (value === "Loire-Atlantique");
        case "Morbihan":
          return (value === "Morbihan");
        default:
          return (value === "Pyrénées-Atlantique");
      }
    },
  },

  mounted() {
    this.filteredSpots = this.spotEnDur
  }
};
</script>
