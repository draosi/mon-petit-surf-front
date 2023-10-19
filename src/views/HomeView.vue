<style lang="scss" scoped>
@import "@/assets/scss/views/home.scss";
</style>

<template>
  <Header />
  <h1 class="test">Home Page Page</h1>
  <p class="lorem">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Est facilis quis
    nisi tempore, amet magnam nam enim maxime, aspernatur ab ullam aut iusto.
    Cumque distinctio dolorum sed? Consequatur, modi at!
  </p>
  <main class="main">
    <section class="sort">
      <div></div>
      <div></div>
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
      blueBackground: true,
      spots: [],
      spotEnDur: [
        {
          id: 1,
          nom: "Lacanau-océan",
          region: "Gironde",
          vague: 1.5,
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
    };
  },
  methods: {
    cardBackground(i) {
      return i % 2 === 0;
    },
  },
};
</script>
