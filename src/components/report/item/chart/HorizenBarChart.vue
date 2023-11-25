<script>
import { defineProps, ref, watchEffect, onUpdated } from "vue";
import { Bar } from "vue-chartjs";
import { Chart as ChartJS, Title, BarElement, CategoryScale, LinearScale } from "chart.js";
ChartJS.register(Title, BarElement, CategoryScale, LinearScale);

export default {
  name: "BarChart",
  components: { Bar },
  props: {
    sidoName: {
      type: String,
      required: true,
    },
    aptName: {
      type: String,
      required: true,
    },
    dealAmount: {
      type: Number,
      required: true,
    },
    leaseAvgPrice: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      chartData: {
        labels: [this.sidoName, this.aptName],
        datasets: [
          {
            data: [this.leaseAvgPrice, this.dealAmount],
            backgroundColor: ["#FFC8DC", "#FF71A5"],
          },
        ],
      },
      chartOptions: {
        responsive: true, // 창의 크기에 맞게 자동으로 조절하지 않음
        maintainAspectRatio: false, // 가로 세로 비율을 유지하지 않음
        indexAxis: "y",
        plugins: {
          legend: {
            display: false,
          },
        },
        elements: {
          bar: {
            borderRadius: 10, // 막대의 border-radius 설정
          },
        },
      },
    };
  },
};
</script>

<template>
  <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<style scoped></style>
