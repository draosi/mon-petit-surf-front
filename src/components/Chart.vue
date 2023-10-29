<style lang="scss" scoped>
@import "@/assets/scss/components/chart.scss";
</style>

<template>
  <div class="size">
    <canvas id="chart"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  props: {
    time: Array,
    waves: Array,
    period: Array,
    wind: Array
  },
  mounted() {
    const ctx = document.getElementById("chart");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [1, 2, 3, 4],
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 5,
            ticks: {
              stepSize: 0.5,
            },
          },
        },
      },
    });
    console.log("time", this.time);
    console.log("waves", this.waves);
    console.log("period", this.period);
    console.log("wind", this.wind);
  },
};
</script>
