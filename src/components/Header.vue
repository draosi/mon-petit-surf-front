<style lang="scss" scoped>
@import "@/assets/scss/components/header.scss";
</style>

<template>
  <div class="header">
    <RouterLink class="header__logo" to="/">Mon Petit Surf</RouterLink>
    <img class="header__menu" src="../assets/images/menu.png" alt="menu" />
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
</script>
