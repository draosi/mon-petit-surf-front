<style lang="scss" scoped>
@import "@/assets/scss/views/profile.scss";
</style>

<template>
  <Header />
  <main class="profile">
    <section class="profile__infos">
      <h1>Mon profile</h1>
      <div class="profile__user" :class="{'visible' : isVisible}">
        <div class="user">
          <div class="user__infos">
            <p>Pseudo :</p>
            <p>{{ userInfos.username }}</p>
          </div>
          <div class="user__infos">
            <p>Mot de passe</p>
            <p>******</p>
          </div>
        </div>
        <button class="profile__button" @click="edit">Modifier</button>
      </div>
      <div class="profile__user" :class="{'visible' : !isVisible}">
        <form @submit.prevent="updateUser(jwt, userId)" class="edit" novalidate>
          <div class="edit__infos">
            <input v-model="editedUser.username" placeholder="Nouveau pseudo" class="edit__input">
            <input v-model="editedUser.password" placeholder="Nouveu mot de passe" class="edit__input">
          </div>
          <div class="edit__update">
            <button type="submit" class="edit__button">Envoyer</button>
            <button class="edit__button" @click="edit">Annuler</button>
          </div>
        </form>
      </div>
    </section>
    <section>
      <div v-for="(item, index) in userInfos.usersRegisterSpots" :key="index">
        <div>{{ item }}</div>
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
      jwt: "",
      userInfos: {},
      editedUser: {
        username: '',
        password: ''
      },
      isVisible: false
    };
  },
  components: {
    Header,
    Footer,
  },
  methods: {
    async getUserInfos(jwt, userId) {
      const res = await fetch(
        `https://localhost:7080/api/Users/get/${userId}`,
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

    edit() {
      this.isVisible = !this.isVisible
    },

    async updateUser(jwt, id) {
      const res = await fetch(`https://localhost:7080/api/Users/put/${id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(this.editedUser)
      })

      if(res.ok) {
        alert("Profile modifié avec succès")
        this.$router.push("/");
      } else {
        alert("Une erreur s'est produite")
      }
    }
  },
  async mounted() {
    const userId = this.$route.params.userId;
    this.userId = userId;
    const jwt = sessionStorage.getItem('jwt')
    this.jwt = jwt

    await this.getUserInfos(this.jwt, this.userId);
  },
};
</script>
