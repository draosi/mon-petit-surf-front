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
              stepSize: 1,
            },
          },
        },
      },
    });

    // if(ctx) {
    //   ctx.style.width = "100%"
    // }
  },
};
</script>
