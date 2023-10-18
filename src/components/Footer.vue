<style lang="scss" scoped>
@import "@/assets/scss/components/footer.scss";
</style>

<template>
  <div class="footer">
    <a href="https://github.com/draosi" target="_blank">
      <img class="footer__img" src="../assets/images/github.png" alt="menu" />
    </a>
    <RouterLink to="/cgu" class="footer__cgu">CGU</RouterLink>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
</script>
