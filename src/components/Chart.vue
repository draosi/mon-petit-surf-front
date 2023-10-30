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
    wind: Array,
  },
  async mounted() {
    const ctx = document.getElementById("chart");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [1, 2, 3, 4, 5, 6],
            borderWidth: 1,
            yAxisID: "y-axis-1",
          },
          {
            label: "# of Votes",
            data: [1, 4, 3, 8, 6, 2],
            borderWidth: 1,
            yAxisID: "y-axis-1",
          },
          {
            label: "# of Votes",
            data: [7, 8, 9, 10, 11, 12],
            borderWidth: 1,
            yAxisID: "y-axis-2",
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: [
            {
              id: "y-axis-1",
              // type: "linear",
              position: "left",
              beginAtZero: true,
              // suggestedMax: 5,
              ticks: {
                stepSize: 1,
              },
            },
            {
              id: "y-axis-2",
              // type: "linear",
              position: "right",
              beginAtZero: true,
              // suggestedMax: 15,
              ticks: {
                stepSize: 0.5,
              },
            },
          ],
        },
      },
    });

    if (this.time && this.waves && this.period && this.wind) {
      console.log("time", this.time);
      console.log("waves", this.waves);
      console.log("period", this.period);
      console.log("wind", this.wind);
    }
  },
};
</script>
