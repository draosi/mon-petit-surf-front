<style lang="scss" scoped>
@import "@/assets/scss/components/header.scss";
@import "@/assets/scss/main.scss";
</style>

<template>
  <header class="header">
    <div class="header__menu container">
      <RouterLink
        class="header__logo"
        to="/">
        Mon Petit Surf
      </RouterLink>
      <img
        class="header__img"
        :src="menuVisible ? closeMenu : openMenu"
        alt="menu"
        @click="toggleMenu" />
    </div>
    <div class="header__toggle container">
      <div
        v-if="connected"
        class="header__responsive">
        <nav
          v-if="menuVisible"
          :class="
            menuVisible ? 'header__menu-visible' : 'header__menu-invisible'
          ">
          <RouterLink
            :to="{ name: 'profile', params: { userId: userId } }"
            class="header__txt">
            Profil
          </RouterLink>
          <RouterLink
            :to="{ name: 'favoris', params: { userId: userId } }"
            class="header__txt">
            Favoris
          </RouterLink>
          <RouterLink
            :to="{ name: 'home' }"
            class="header__txt"
            @click="clearSessionStorage">
            Deconnexion
          </RouterLink>
        </nav>
      </div>
      <div
        v-else
        class="header__responsive">
        <nav
          v-if="menuVisible"
          :class="
            menuVisible ? 'header__menu-visible' : 'header__menu-invisible'
          ">
          <RouterLink
            :to="{ name: 'connexion' }"
            class="header__txt">
            Connexion
          </RouterLink>
          <RouterLink
            :to="{ name: 'inscription' }"
            class="header__txt">
            Inscription
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import { RouterLink } from "vue-router"
import closeMenu from "../assets/images/close.png"
import openMenu from "../assets/images/menu.png"

export default {
  data() {
    return {
      menuVisible: false,
      closeMenu: closeMenu,
      openMenu: openMenu,
      connected: false,
      userId: 0
    }
  },

  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible
    },

    getSessionStorage() {
      const session = sessionStorage.getItem("jwt")
      const userId = sessionStorage.getItem("userId")
      if (session) {
        this.connected = true
      }

      if (userId) {
        this.userId = userId
      }
    },

    clearSessionStorage() {
      sessionStorage.removeItem("jwt")
      sessionStorage.removeItem("userId")
      this.$router.push("/connexion")
    }
  },
  mounted() {
    this.getSessionStorage()
  }
}
</script>
