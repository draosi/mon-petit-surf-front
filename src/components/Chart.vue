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
import Chart from "chart.js/auto"

export default {
  dat() {
    return {
      chartWavesData: [],
      chartPeriodData: [],
      chartWindData: []
    }
  },
  props: {
    time: Array,
    waves: Array,
    period: Array,
    wind: Array
  },

  methods: {
    transformHours(string) {
      const date = new Date(string)
      const hours = date.getHours().toString()
      const minutes = date.getMinutes().toString()
      return `${hours}h${minutes}`
    }
  },

  async mounted() {
    if (this.time && this.waves && this.period && this.wind) {
      this.chartWavesData = this.waves.slice(0, 8)
      this.chartPeriodData = this.period.slice(0, 8)
      this.chartWindData = this.wind.slice(0, 8)
    }

    const waveChart = document.getElementById("vague")
    const windChart = document.getElementById("wind")

    new Chart(windChart, {
      type: "bar",
      data: {
        labels: ["00h00", "06h00", "12h00", "18h00"],
        datasets: [
          {
            label: "Vent",
            data: this.chartWindData,
            yAxisID: "wind",
            backgroundColor: "rgba(255, 191, 0, 0.5)"
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          wind: {
            type: "linear",
            position: "right",
            display: true,
            title: {
              display: true,
              text: "Vitesse du vent en kilometre par heure"
            }
          }
        },
        plugins: {
          tooltip: {
            displayColors: false
          }
        }
      }
    })

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
          "21h00"
        ],
        datasets: [
          {
            label: "Taille",
            data: this.chartWavesData,
            tension: 0.4,
            yAxisID: "wave"
          },
          {
            label: "Période",
            data: this.chartPeriodData,
            tension: 0.4,
            yAxisID: "period"
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          wave: {
            type: "linear",
            position: "left",
            display: true,
            ticks: {
              stepSize: 0.2
            },
            title: {
              display: true,
              text: "Taille des vagues en mètre"
            }
          },
          period: {
            type: "linear",
            position: "right",
            display: true,
            // Permet qu'il n'y ai qu'une seul ligne pour les deux axes des y
            grid: {
              drawOnChartArea: false
            },
            ticks: {
              stepSize: 0.5
            },
            title: {
              display: true,
              text: "Temps de période en seconde"
            }
          }
        },
        // Permet de modifier le tooltip
        plugins: {
          tooltip: {
            displayColors: false,
            yAlign: "bottom"
          }
        }
      }
    })
  }
}
</script>
