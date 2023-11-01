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
  dat() {
    return {
      chartWavesData: [],
      chartPeriodData: [],
      chartWindData: []
    };
  },
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

    oneDayWaveDataArray(array) {
      const newArray = [];
      array.forEach((e, i) => {
        if (i % 3 === 0) {
          newArray.push(e);
        }
      });
      return newArray.slice(0, 8);
    },

    oneDayWindDataArray(array) {
      const newArray = [];
      array.forEach((e, i) => {
        if (i % 6 === 0) {
          newArray.push(e);
        }
      });
      console.log(newArray);
      return newArray.slice(0, 4);
    },
  },

  async mounted() {
    if (this.time && this.waves && this.period && this.wind) {
      // console.log("time", this.time);
      // console.log("waves", this.waves);
      // console.log("period", this.period);
      // console.log("wind", this.wind);
      // console.log(this.transformHours(this.time[0]));
      this.chartWavesData = this.oneDayWaveDataArray(this.waves);
      this.chartPeriodData = this.oneDayWaveDataArray(this.period)
      this.chartWindData = this.oneDayWindDataArray(this.wind)
    }

    const waveChart = document.getElementById("vague");
    const windChart = document.getElementById("wind");

    new Chart(windChart, {
      type: "bar",
      data: {
        labels: ["00h00", "06h00", "12h00", "18h00"],
        datasets: [
          {
            label: "Vent",
            data: this.chartWindData,
            yAxisID: "wind",
            backgroundColor: "rgba(255, 191, 0, 0.5)",
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
            data: this.chartWavesData,
            tension: 0.4,
            yAxisID: "wave",
          },
          {
            label: "Période",
            data: this.chartPeriodData,
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
            yAlign: "bottom",
          },
        },
      },
    });
  },
};
</script>
