<style lang="scss" scoped>
@import "@/assets/scss/components/weather.scss";
</style>

<template>
  <section class="weather">
    <div class="weather__infos">
        <img src="@/assets/images/sunrise.png" alt="sunrise" class="weather__img"/>
        <p>{{ meteoData.sunrise }}</p>
    </div>
    <div class="weather__infos">
        <img src="@/assets/images/sunset.png" alt="sunset" class="weather__img"/>
        <p>{{ meteoData.sunset }}</p>
    </div>
    <div class="weather__infos">
        <img src="@/assets/images/temperatures.png" alt="temperatures" class="weather__img"/>
        <p>{{ meteoData.temperatureMin }} - {{ meteoData.temperatureMax }}</p>
    </div>
    <div class="weather__infos">
        <img src="@/assets/images/rain.png" alt="rain" class="weather__img"/>
        <p>{{ meteoData.precipitationSum }}</p>
    </div>
  </section>
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
