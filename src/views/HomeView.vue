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
    <section class="spot">
      <div class="spot__card">
        <RouterLink to="/" class="spot__lien">
          <HomeCard />
        </RouterLink>
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
};
</script>
