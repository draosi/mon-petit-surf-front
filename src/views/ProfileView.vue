<style lang="scss" scoped>
@import "@/assets/scss/views/profile.scss";
</style>

<template>
  <Header />
  <div>
    <h1 class="profile">Page profile</h1>
    <p>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus sed,
      vitae est eius vero numquam at? Maxime totam, enim modi nemo numquam
      deserunt rem molestias laudantium odit necessitatibus omnis sunt!
    </p>
  </div>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  data() {
    return {
      userId: 0,
      userInfos: {}
    };
  },
  components: {
    Header,
    Footer,
  },
  methods: {
    async getProfil() {
      const jwt = sessionStorage.getItem('jwt')
      const res = await fetch(
        `https://localhost:7080/api/Users/get/${this.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`,
          },
        }
      );
      const response = await res.json();
      this.userInfos = response
      console.log(this.userInfos);
    },
  },
  async mounted() {
    const userId = this.$route.params.userId;
    this.userId = userId;
    await this.getProfil();
  },
};
</script>
