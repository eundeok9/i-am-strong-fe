<script>
import {Bar} from "vue-chartjs";
import {Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  props: {
    monthlyAvgList: {
      type: Object,
      required: true,
    },
    userAptName: {
      type: String,
      required: true,
    },
    userArea: {
      type: String,
      required: true,
    },
    userDeposit: {
      type: String,
      required: true,
    },
  },
  extends: Bar,
  name: "BarChart",
  components: {Bar},
  data() {
    return {
      chartData: {
        labels: ["10월", "11월", "12월", "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월"].concat([this.userAptName]),
        datasets: [
          {
            data: this.monthlyAvgList,
            backgroundColor: ["#FFC8DC", "#FFC8DC", "#FFC8DC", "#FFC8DC", "#FFC8DC", "#FFC8DC", "#FFC8DC", "#FFC8DC", "#FFC8DC", "#FFC8DC", "#FFC8DC", "#FFC8DC", "#FF71A5"],
          },
        ],
      },
      chartOptions: {
        responsive: true, // 창의 크기에 맞게 자동으로 조절하지 않음
        maintainAspectRatio: true, // 가로 세로 비율을 유지하지 않음f -> t
        plugins: {
          legend: {
            display: false, // 이 부분을 추가하여 범례를 숨깁니다.
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
  // watch: {
  //   // Watch for changes in the prop and update the chart data
  //   monthlyAvgList(newVal)
  //     console.log(this.monthlyAvgLis
  //   },
  // },
};
</script>

<template>
  <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<style scoped></style>
