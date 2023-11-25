<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>

<script>
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import {Doughnut} from "vue-chartjs";
ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  name: "doughnut",
  components: {
    Doughnut,
  },
  props: {
    per: {
      type: Number,
      required: true,
    },
  },
  data() {
    const value = this.per;
    let color = "#E5EAFC";
    changeColor(value);

    function changeColor(value) {
      if (value <= 70) {
        color = "#50CD89";
      } else if (70 < value && value <= 90) {
        color = "#F4A03E";
      } else {
        color = "#E64343";
      }
    }

    return {
      chartData: {
        datasets: [
          {
            backgroundColor: [color, "#E5EAFC"],
            data: [value, 100 - value],
            borderRadius: 5,
          },
        ],
      },
      chartOptions: {
        rotation: -90,
        circumference: 180,
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        hover: {mode: null},
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    };
  },
};
</script>

<style scoped></style>
