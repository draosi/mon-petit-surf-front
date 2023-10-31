<style lang="scss" scoped>
@import "@/assets/scss/components/chart.scss";
</style>

<template>
  <div class="chart">
    <div class="chart__line">
      <canvas id="vague"></canvas>
    </div>
    <div class="chart__bar">
      <canvas id="wind"></canvas>
    </div>
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
    const waveChart = document.getElementById("vague");
    const windChart = document.getElementById("wind");

    new Chart(windChart, {
      type: "bar",
      data: {
        labels: ["06h00", "12h00", "18h00", "21h00"],
        datasets: [
          {
            label: "Vent",
            data: [10, 25, 30, 12],
            yAxisID: "wind",
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          wind: {
            type: "linear",
            position: "right",
            display: true,
            ticks: {
              callback: (value, index, values) => {
                return `${value} km/h`;
              },
            },
            title: {
              display: true,
              text: "Vitesse du vent en kilometre par heure",
            },
          },
        },
        plugins: {
          tooltip: {
            displayColors: false,
          },
        },
      },
    });

    new Chart(waveChart, {
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
            label: "Taille",
            data: [10, 25, 30, 12, 16, 28, 20, 27],
            tension: 0.4,
            yAxisID: "wave",
          },
          {
            label: "Période",
            data: [9, 12, 11, 16, 13, 14, 7, 9],
            tension: 0.4,
            yAxisID: "period",
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          wave: {
            type: "linear",
            position: "left",
            display: true,
            ticks: {
              callback: (value, index, values) => {
                return `${value} m`;
              },
            },
            title: {
              display: true,
              text: "Taille des vagues en mètre",
            },
          },
          period: {
            type: "linear",
            position: "right",
            display: true,
            // Permet qu'il n'y ai qu'une seul ligne pour les deux axes des y
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              callback: (value, index, values) => {
                return `${value} s`;
              },
            },
            title: {
              display: true,
              text: "Temps de période en seconde",
            },
          },
        },
        // Permet de modifier le tooltip
        plugins: {
          tooltip: {
            displayColors: false,
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
