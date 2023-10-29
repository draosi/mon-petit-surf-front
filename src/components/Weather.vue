<style lang="scss" scoped>
@import "@/assets/scss/components/weather.scss";
</style>

<template>
  <h1 class="test">test</h1>
</template>

<script>
export default {
  props: {
    meteoData: Object,
  },
  mounted() {
    console.log(this.meteoData);
  },
};
</script>
