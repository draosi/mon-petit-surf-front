<style lang="scss" scoped>
@import "@/assets/scss/components/header.scss";
</style>

<template>
  <header class="header">
    <div class="header__menu">
      <RouterLink class="header__logo" to="/">Mon Petit Surf</RouterLink>
      <img
        class="header__img"
        :src="menuVisible ? 'src/assets/images/close.png' : 'src/assets/images/menu.png'"
        alt="menu"
        @click="toggleMenu"
      />
    </div>
    <div class="header__toggle">
      <div
        v-if="menuVisible"
        :class="menuVisible ? 'header__menu-visible' : 'header__menu-invisible'"
      >
        <RouterLink to="/" class="header__txt">Connexion</RouterLink>
        <RouterLink to="/" class="header__txt">Inscription</RouterLink>
      </div>
    </div>
  </header>
</template>

<script>
import { RouterLink } from "vue-router";

export default {
  data() {
    return {
      menuVisible: false,
    };
  },

  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
      console.log(this.menuVisible);
    },
  },
};
</script>
