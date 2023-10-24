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
          class="sort__select sort__txt"
        >
          <option disabled value="">Taille moyenne</option>
          <option v-for="option in waveHeight" :value="option.title">
            {{ option.title }}
          </option>
        </select>
      </div>
      <div class="sort__size">
        <select
          v-model="selectedPeriod"
          @change="filterSpots"
          class="sort__select sort__txt"
        >
          <option disabled value="">Période moyenne</option>
          <option v-for="option in wavePeriod" :value="option.title">
            {{ option.title }}
          </option>
        </select>
      </div>
      <div class="sort__size">
        <select
          v-model="selectedRegion"
          @change="filterSpots"
          class="sort__select sort__txt"
        >
          <option disabled value="">Selectionnez une région</option>
          <option v-for="option in regionEnDures" :value="option.title">
            {{ option.title }}
          </option>
        </select>
      </div>
      <button @click="reset" class="sort__size sort__button">
        Réinitialiser
      </button>
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
        {
          title: "vague < 0,9 m",
          value: (height) => height < 0.9,
        },
        {
          title: "0,8 m < vague < 1,3 m",
          value: (height) => height > 0.8 && height < 1.3,
        },
        {
          title: "1,2 m < vague < 1,7 m",
          value: (height) => height > 1.2 && height < 1.7,
        },
        {
          title: "1,6 m < vague < 2,2 m",
          value: (height) => height > 1.6 && height < 2.2,
        },
        {
          title: "2,1 m < vague",
          value: (height) => height > 2.1,
        },
      ],
      wavePeriod: [
        {
          title: "période < 7 s",
          value: (period) => period < 7,
        },
        {
          title: "6 s < période < 9 s",
          value: (period) => period > 6 && period < 9,
        },
        {
          title: "8 s < période < 11 s",
          value: (period) => period > 8 && period < 11,
        },
        {
          title: "10 s < période < 14 s",
          value: (period) => period > 10 && period < 14,
        },
        {
          title: "13 s < période",
          value: (period) => period > 13,
        },
      ],
      regions: [],
      spots: [],
      filteredSpots: [],
      resetSpots: [],
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
        {
          title: "Charente-Maritime",
          value: (region) => region === "Charente-Maritime",
        },
        {
          title: "Cotes-d'Armor",
          value: (region) => region === "Cotes-d'Armor",
        },
        {
          title: "Finistère",
          value: (region) => region === "Finistère",
        },
        {
          title: "Gironde",
          value: (region) => region === "Gironde",
        },
        {
          title: "Landes",
          value: (region) => region === "Landes",
        },
        {
          title: "Loire-Atlantique",
          value: (region) => region === "Loire-Atlantique",
        },
        {
          title: "Morbihan",
          value: (region) => region === "Morbihan",
        },
        {
          title: "Pyrénées-Atlantique",
          value: (region) => region === "Pyrénées-Atlantique",
        },
      ],
    };
  },

  methods: {
    cardBackground(i) {
      return i % 2 === 0;
    },

    // responsable du filtrage lorsqu'un selecteur est selectionné
    // En fonction du selecteur selectionné, appelle une fonction permettant de trier les données
    filterSpots() {
      if (
        !this.selectedHeight &&
        !this.selectedPeriod &&
        !this.selectedRegion
      ) {
        // Sortir de la méthode si rien n'est sélectionné et retourner le tableau de base
        this.filteredSpots = this.spotEnDur;
        return;
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
    // 'field' indique le champ de chaque élément du tableau je souhaite modifier
    // 'criteria' est la valeur récupérée par le select, utilisé pour filter les éléments
    // Appelle 3 fonctions pour trier les données
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

    // Crééer une constante permettant de stocker l'élément dont le titre est égale à la valeur du select dans waveHeight
    // Si cette constante existe, alors elle appelle la fonction associé au critère trouvé dans me tableau waveHeight
    // Vérifie si l'argument 'value' associé au résultat du select est vrai
    checkWaveCriteria(value, criteria) {
      const wave = this.waveHeight.find((el) => el.title === criteria);
      if (wave) {
        return wave.value(value);
      } else {
        return value >= 2.2;
      }
    },

    checkPeriodCriteria(value, criteria) {
      const period = this.wavePeriod.find((el) => el.title === criteria);
      if (period) {
        return period.value(value);
      } else {
        return value > 13;
      }
    },

    checkRegionCriteria(value, criteria) {
      const region = this.regionEnDures.find((el) => el.title === criteria);
      if (region) {
        return region.value(value);
      } else {
        return false;
      }
    },

    reset() {
      (this.selectedHeight = ""),
        (this.selectedPeriod = ""),
        (this.selectedRegion = ""),
        (this.filteredSpots = this.spotEnDur);
    },

    async fetchSpots() {
      const res = await fetch("https://localhost:7080/api/Spots/getSpots");
      const response = await res.json();
      this.spots = response;
      console.log(this.spots);
    },

    async fetchRegions() {
      const res = await fetch("https://localhost:7080/api/Spots/getRegions");
      const response = await res.json();
      this.regions = response;
      console.log(this.regions);
    },

    async fetchWaveInfos(latitude, longitude) {
      console.log(latitude, longitude);
      const res = await fetch(
        `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&hourly=wave_height,wave_direction,wave_period`
      );
      const response = await res.json();
      console.log(response);
      return response;
    },

    async getWaves(array) {
      console.log(array);
      const promises = array.forEach(async (el) => {
        const res = await this.fetchWaveInfos(el.latitude, el.longitude);
      });

      await Promise.all(promises);
    },

    async getMaxConditionsTest(latitude, longitude) {
      const res = await fetch(
        `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&daily=wave_height_max,wave_period_max&timezone=GMT`
      );
      const response = await res.json();
      console.log(response);
      return response;
    },
  },

  async mounted() {
    this.filteredSpots = this.spotEnDur;
    await this.fetchSpots();
    await this.fetchRegions();
    // await this.getWaves(this.spots);
    await this.getMaxConditionsTest(45, -1.19)
  },
};
</script>
