<style lang="scss" scoped>
@import "@/assets/scss/components/map.scss";
</style>

<template>
  <div id="map"></div>
</template>

<script>
export default {
    props: {
        latitude: Number,
        longitude: Number
    },
  mounted() {
    const map = L.map("map").setView([this.latitude, this.longitude], 10);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  },
};
</script>
