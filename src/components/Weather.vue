<style lang="scss" scoped>
@import "@/assets/scss/components/weather.scss";
</style>

<template>
  <section class="weather">
    <div class="weather__infos">
        <img src="@/assets/images/sunrise.png" alt="sunrise" class="weather__img"/>
        <p class="weather__txt">{{ transfomDate(meteoData.sunrise) }}</p>
    </div>
    <div class="weather__infos">
        <img src="@/assets/images/sunset.png" alt="sunset" class="weather__img"/>
        <p class="weather__txt">{{ transfomDate(meteoData.sunset) }}</p>
    </div>
    <div class="weather__infos">
        <img src="@/assets/images/temperatures.png" alt="temperatures" class="weather__img"/>
        <p class="weather__txt">{{ meteoData.temperatureMin }} °C - {{ meteoData.temperatureMax }} °C</p>
    </div>
    <div class="weather__infos">
        <img src="@/assets/images/rain.png" alt="rain" class="weather__img"/>
        <p class="weather__txt">{{ meteoData.precipitationSum }} mm</p>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    meteoData: Object,
  },
  methods: {
    transfomDate(string) {
        const date = new Date(string)
        const hours = date.getHours().toString()
        const minutes = date.getMinutes().toString()
        return `${hours}h${minutes}`
    }
  },
};
</script>
