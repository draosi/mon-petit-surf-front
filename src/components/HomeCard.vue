<style lang="scss" scoped>
@import "@/assets/scss/components/homeCard.scss";
</style>

<template>
  <div class="card">
    <h1 class="card__title">{{ nom }}</h1>
    <div class="card__infos">
      <div class="informations">
        <div class="informations__txt">Région</div>
        <div class="informations__txt">{{ region }}</div>
      </div>
      <div class="informations">
        <div class="informations__txt">Taille maximum des vagues</div>
        <div class="informations__txt">{{ vague }} m</div>
      </div>
      <div class="informations">
        <div class="informations__txt">Temps de période maximum</div>
        <div class="informations__txt">{{ periode }} s</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nom: String,
    region: String,
    vague: Number,
    periode: Number
  }
}
</script>
