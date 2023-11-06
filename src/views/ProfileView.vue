<style lang="scss" scoped>
@import "@/assets/scss/views/profile.scss";
</style>

<template>
  <Header />
  <main class="profile">
    <section class="profile__infos">
      <h1>Mon profile</h1>
      <div class="profile__modify">
        <div class="modify">
          <h3>Pseudo : {{ userInfos.username }}</h3>
          <button>Modifier</button>
        </div>
        <div class="modify">
          <h3>Mot de passe : ****</h3>
          <button>Modifier</button>
        </div>
      </div>
    </section>
    <section>
      <div v-for="(item, index) in userInfos.usersRegisterSpots" :key="index">
        <div></div>
      </div>
    </section>
  </main>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  data() {
    return {
      userId: 0,
      userInfos: {},
    };
  },
  components: {
    Header,
    Footer,
  },
  methods: {
    async getProfil() {
      const jwt = sessionStorage.getItem("jwt");
      const res = await fetch(
        `https://localhost:7080/api/Users/get/${this.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const response = await res.json();
      this.userInfos = response;
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
