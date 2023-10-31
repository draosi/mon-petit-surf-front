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

  methods: {
    transformHours(string) {
      const date = new Date(string);
      const hours = date.getHours().toString();
      const minutes = date.getMinutes().toString();
      return `${hours}h${minutes}`;
    },
  },

  async mounted() {
    const ctx = document.getElementById("chart");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "00h00",
          "03h00",
          "06h00",
          "09h00",
          "12h00",
          "15h00",
          "18h00",
          "21h00",
        ],
        datasets: [
          {
            label: "Ligne Gauche",
            data: [10, 25, 30, 12, 16, 28, 20, 27],
            borderColor: "blue",
            tension: 0.3,
            yAxisID: "y",
          },
          {
            label: "Ligne Droite",
            data: [9, 12, 11, 16, 13, 14, 7, 9],
            borderColor: "red",
            tension: 0.3,
            yAxisID: "period",
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            type: "linear",
            position: "left",
            display: true,
          },
          period: {
            type: "linear",
            position: "right",
            display: true,
            // Permet qu'il n'y ai qu'une seul ligne pour les deux axes des y
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    });

    if (this.time && this.waves && this.period && this.wind) {
      console.log("time", this.time);
      console.log("waves", this.waves);
      console.log("period", this.period);
      console.log("wind", this.wind);
      console.log(this.transformHours(this.time[0]));
    }
  },
};
</script>
