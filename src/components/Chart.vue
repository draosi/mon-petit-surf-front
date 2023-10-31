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
        labels: ["Label1", "Label2", "Label3", "Label4", "Label5"],
        datasets: [
          {
            label: "Ligne Gauche",
            data: [10, 20, 30],
            borderColor: "blue",
            yAxisID: "y-axis-1",
          },
          // {
          //   label: "Ligne Droite",
          //   data: [5, 15, 25],
          //   borderColor: "red",
          //   yAxisID: "y-axis-2",
          // },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          x: [
            {
              id: "x-axis-1", // Axe x en bas
              type: "category",
              labels: ["Label1", "Label2", "Label3"],
            },
            // {
            //   id: "x-axis-2", // Axe x en haut
            //   type: "category",
            //   labels: ["TopLabel1", "TopLabel2", "TopLabel3"],
            // },
          ],
          y: [
            {
              id: "y-axis-1",
              type: "linear",
              position: "right",
              display: true
            },
            // {
            //   id: "y-axis-2",
            //   type: "linear",
            //   position: "right",
            // },
          ],
        },
      },
    });

    // new Chart(ctx, {
    //   type: "line",
    //   data: {
    //     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    //     datasets: [
    //       {
    //         label: "# of 1",
    //         data: [1, 2, 3, 4, 5, 6],
    //         borderWidth: 1,
    //         borderColor: "green",
    //         yAxisID: "axis1",
    //       },
    //       {
    //         label: "# of 2",
    //         data: [1, 2, 3, 4, 5, 6],
    //         borderWidth: 1,
    //         borderColor: "yellow",
    //         yAxisID: "axis2",
    //       },
    //       {
    //         label: "# of 3",
    //         data: [7, 4, 9, 13, 11, 12],
    //         borderWidth: 1,
    //         borderColor: "red",
    //         yAxisID: "axis3",
    //       },
    //     ],
    //   },
    //   options: {
    //     maintainAspectRatio: false,
    //     scales: {
    //       y: [
    //         {
    //           id: "axis1",
    //           type: "linear",
    //           position: "left",
    //           // beginAtZero: true,
    //           // suggestedMax: 5,
    //           // ticks: {
    //           //   stepSize: 1,
    //           // },
    //         },
    //         {
    //           id: "axis2",
    //           type: "linear",
    //           position: "left",
    //           // beginAtZero: true,
    //           // suggestedMax: 15,
    //           // ticks: {
    //           //   stepSize: 0.5,
    //           // },
    //         },
    //         {
    //           id: "axis3",
    //           type: "linear",
    //           position: "right",
    //           // beginAtZero: true,
    //           // suggestedMax: 15,
    //           // ticks: {
    //           //   stepSize: 0.5,
    //           // },
    //           display: true,
    //         },
    //       ],
    //     },
    //   },
    // });

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
